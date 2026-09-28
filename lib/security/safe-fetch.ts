/**
 * SSRF-safe outbound fetch for user-supplied URLs (HTTP Request nodes).
 *
 * `checkOutboundUrl` (ssrf.ts) only inspects the URL's hostname / IP literal. That leaves two gaps:
 *  1. **DNS**: a public-looking name can resolve to a private, loopback, link-local or metadata address,
 *     including "rebinding" names that answer differently on each lookup.
 *  2. **Redirects**: `fetch` follows redirects to wherever the server says, unchecked.
 *
 * This closes both:
 *  - The connection is made through an undici `Agent` whose DNS `lookup` rejects the hostname if **any**
 *    resolved address is blocked. The check runs at connection time on the addresses the socket actually
 *    uses, so a name can't pass a separate pre-check and then resolve elsewhere.
 *  - Redirects are followed manually (at most `maxRedirects` hops), and every hop's URL goes through
 *    `assertSafeOutboundUrl` again; each hop's connection goes through the guarded lookup.
 *
 * IP-literal URLs never reach DNS; they are covered by `assertSafeOutboundUrl` on every hop.
 */
import { lookup as dnsLookup, type LookupAddress } from "node:dns"
import { Agent, fetch as undiciFetch } from "undici"
import { assertSafeOutboundUrl, isBlockedHost, SsrfBlockedError } from "./ssrf"

export type Resolver = (
  hostname: string,
  callback: (err: NodeJS.ErrnoException | null, addresses: LookupAddress[]) => void,
) => void

const systemResolver: Resolver = (hostname, callback) =>
  dnsLookup(hostname, { all: true, verbatim: true }, callback)

type LookupCallback = (err: Error | null, address?: string | LookupAddress[], family?: number) => void

/** A `net.connect`-compatible lookup that refuses hostnames resolving to a blocked address. */
export function guardedLookup(resolve: Resolver = systemResolver, isBlocked: (host: string) => boolean = isBlockedHost) {
  return (hostname: string, options: any, callback?: LookupCallback) => {
    if (typeof options === "function") {
      callback = options
      options = {}
    }
    const done = callback as LookupCallback
    resolve(hostname, (err, addresses) => {
      if (err) return done(err)
      if (!addresses || addresses.length === 0) {
        return done(new SsrfBlockedError(`SSRF blocked: "${hostname}" did not resolve`))
      }
      if (addresses.some((a) => isBlocked(a.address))) {
        return done(new SsrfBlockedError(`SSRF blocked: "${hostname}" resolves to a loopback/private/link-local/metadata address`))
      }
      if (options?.all) return done(null, addresses)
      const pick = addresses.find((a) => !options?.family || a.family === options.family) ?? addresses[0]
      return done(null, pick.address, pick.family)
    })
  }
}

const defaultAgent = new Agent({ connect: { lookup: guardedLookup() as any } })

export interface SafeFetchOptions {
  /** Maximum redirects to follow (default 5). */
  maxRedirects?: number
  /** Test seams: DNS resolver and address policy for the connection-time check. */
  resolve?: Resolver
  isBlocked?: (host: string) => boolean
}

/** fetch() for user-supplied URLs: guarded DNS at connect time + checked, capped redirects. */
export async function safeFetch(rawUrl: string, init: RequestInit = {}, opts: SafeFetchOptions = {}): Promise<Response> {
  const maxRedirects = opts.maxRedirects ?? 5
  const dispatcher =
    opts.resolve || opts.isBlocked
      ? new Agent({ connect: { lookup: guardedLookup(opts.resolve, opts.isBlocked) as any } })
      : defaultAgent

  let url = rawUrl
  let method = (init.method || "GET").toUpperCase()
  let body = init.body
  for (let hop = 0; ; hop++) {
    assertSafeOutboundUrl(url)
    let res: any
    try {
      res = await undiciFetch(url, { ...(init as any), method, body, redirect: "manual", dispatcher })
    } catch (err: any) {
      // undici wraps connection errors as TypeError("fetch failed", { cause }); surface our block reason.
      if (err?.cause instanceof SsrfBlockedError) throw err.cause
      throw err
    }
    const location = res.status >= 300 && res.status < 400 ? res.headers.get("location") : null
    if (!location) return res as Response

    await res.body?.cancel().catch(() => {})
    if (hop >= maxRedirects) throw new SsrfBlockedError(`SSRF blocked: more than ${maxRedirects} redirects`)
    url = new URL(location, url).toString()
    // Fetch-standard method rewriting: 303 → GET; 301/302 after POST → GET.
    if (res.status === 303 || ((res.status === 301 || res.status === 302) && method === "POST")) {
      method = "GET"
      body = undefined
    }
  }
}
