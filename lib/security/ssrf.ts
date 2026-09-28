/**
 * SSRF egress guard for outbound HTTP made by workflow nodes.
 *
 * Blocks loopback / private / link-local / CGNAT / reserved / cloud-metadata
 * targets and non-http(s) schemes. This is a hostname/literal-IP check on the URL.
 * DNS answers (incl. rebinding) and redirect hops are checked by safe-fetch.ts,
 * which HTTP Request nodes use: the resolved address is validated at connection
 * time and every redirect URL goes through this guard again.
 *
 * The execution engine only applies this to **user-supplied absolute URLs**;
 * engine-generated relative app routes (e.g. the scanner's /api/scan/github) are
 * trusted internal calls and are not checked.
 */

export class SsrfBlockedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "SsrfBlockedError"
  }
}

const BLOCKED_HOSTNAMES = new Set<string>([
  "localhost",
  "ip6-localhost",
  "ip6-loopback",
  "metadata.google.internal",
])

function isIpv4(host: string): boolean {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(host)
}

function isBlockedIpv4(ip: string): boolean {
  const parts = ip.split(".").map((p) => Number(p))
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p) || p < 0 || p > 255)) return false
  const [a, b] = parts
  if (a === 0) return true // 0.0.0.0/8 "this host"
  if (a === 10) return true // 10.0.0.0/8 private
  if (a === 127) return true // 127.0.0.0/8 loopback
  if (a === 169 && b === 254) return true // 169.254.0.0/16 link-local (incl. cloud metadata)
  if (a === 172 && b >= 16 && b <= 31) return true // 172.16.0.0/12 private
  if (a === 192 && b === 168) return true // 192.168.0.0/16 private
  if (a === 100 && b >= 64 && b <= 127) return true // 100.64.0.0/10 CGNAT
  if (a >= 224) return true // 224.0.0.0/4 multicast + 240/4 reserved
  return false
}

function isBlockedIpv6(host: string): boolean {
  const h = host.toLowerCase().replace(/^\[/, "").replace(/\]$/, "")
  if (h === "::1" || h === "::") return true // loopback / unspecified
  if (h.startsWith("fe80")) return true // link-local
  if (h.startsWith("fc") || h.startsWith("fd")) return true // unique-local fc00::/7
  const mapped = h.match(/::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/) // IPv4-mapped ::ffff:a.b.c.d
  if (mapped) return isBlockedIpv4(mapped[1])
  // The WHATWG URL parser normalizes embedded IPv4 to hex: `[::ffff:127.0.0.1]` →
  // `[::ffff:7f00:1]`, `[::127.0.0.1]` → `[::7f00:1]`. Decode and re-check, so
  // IPv4-mapped (::ffff:0:0/96) and deprecated IPv4-compatible (::/96) addresses
  // can't smuggle a blocked IPv4 target past the guard.
  const hexEmbedded = h.match(/^::(?:ffff:)?([0-9a-f]{1,4}):([0-9a-f]{1,4})$/)
  if (hexEmbedded) {
    const hi = parseInt(hexEmbedded[1], 16)
    const lo = parseInt(hexEmbedded[2], 16)
    return isBlockedIpv4(`${hi >> 8}.${hi & 0xff}.${lo >> 8}.${lo & 0xff}`)
  }
  return false
}

/** True if the hostname/IP literal should be blocked for outbound requests. */
export function isBlockedHost(hostname: string): boolean {
  const host = (hostname || "").toLowerCase().trim().replace(/\.$/, "")
  if (!host) return true
  if (BLOCKED_HOSTNAMES.has(host)) return true
  if (host.endsWith(".internal") || host.endsWith(".local")) return true
  if (isIpv4(host)) return isBlockedIpv4(host)
  if (host.includes(":")) return isBlockedIpv6(host)
  return false
}

export interface SsrfCheck {
  safe: boolean
  reason?: string
}

/** Non-throwing variant: returns { safe, reason }. */
export function checkOutboundUrl(rawUrl: string): SsrfCheck {
  let u: URL
  try {
    u = new URL(rawUrl)
  } catch {
    return { safe: false, reason: `invalid URL "${rawUrl}"` }
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    return { safe: false, reason: `blocked scheme "${u.protocol}" (only http/https allowed)` }
  }
  if (isBlockedHost(u.hostname)) {
    return { safe: false, reason: `blocked host "${u.hostname}" (loopback/private/link-local/metadata)` }
  }
  return { safe: true }
}

/** Throws SsrfBlockedError when the URL targets a disallowed destination. */
export function assertSafeOutboundUrl(rawUrl: string): void {
  const result = checkOutboundUrl(rawUrl)
  if (!result.safe) {
    throw new SsrfBlockedError(`SSRF blocked: ${result.reason}`)
  }
}
