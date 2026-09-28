/**
 * @jest-environment node
 */

/**
 * safeFetch: SSRF guard for DNS answers (checked at connection time) and redirects.
 *
 * A real HTTP server listens on 127.0.0.1. Hostnames like "ok.test" exist only in the test resolver, so a
 * successful request proves the connection used the guarded lookup (the system resolver can't resolve them).
 * "allowLoopback" permits 127.0.0.1 at the DNS layer only, to reach the test server; URL-level checks still
 * block literal loopback/metadata addresses on every hop.
 */
import http from "node:http"
import type { AddressInfo } from "node:net"
import { safeFetch, guardedLookup, type Resolver } from "../safe-fetch"
import { isBlockedHost, SsrfBlockedError } from "../ssrf"

let server: http.Server
let port = 0
const hits: string[] = []

beforeAll(async () => {
  server = http.createServer((req, res) => {
    hits.push(`${req.method} ${req.url}`)
    const go = (status: number, location: string) => {
      res.writeHead(status, { Location: location })
      res.end()
    }
    switch (req.url) {
      case "/ok":
        res.writeHead(200, { "Content-Type": "application/json" })
        return res.end(JSON.stringify({ ok: true, method: req.method }))
      case "/redir-metadata":
        return go(302, "http://169.254.169.254/latest/meta-data/")
      case "/redir-loopback":
        return go(302, `http://127.0.0.1:${port}/ok`)
      case "/redir-rebind":
        return go(302, `http://rebind.test:${port}/ok`)
      case "/redir-ok":
        return go(302, `http://ok.test:${port}/ok`)
      case "/see-other":
        return go(303, "/ok")
      case "/loop":
        return go(302, "/loop")
      default:
        res.writeHead(404)
        return res.end()
    }
  })
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", () => r()))
  port = (server.address() as AddressInfo).port
})
afterAll(() => new Promise<void>((r) => server.close(() => r())))
beforeEach(() => (hits.length = 0))

const table: Record<string, string[]> = {
  "ok.test": ["127.0.0.1"],
  "rebind.test": ["10.0.0.5"],
  "mixed.test": ["93.184.216.34", "10.0.0.1"],
  "public.test": ["93.184.216.34"],
}
const resolve: Resolver = (hostname, cb) => {
  const ips = table[hostname]
  if (!ips) return cb(Object.assign(new Error(`ENOTFOUND ${hostname}`), { code: "ENOTFOUND" }), [])
  cb(null, ips.map((address) => ({ address, family: address.includes(":") ? 6 : 4 })))
}
const allowLoopback = (h: string) => h !== "127.0.0.1" && isBlockedHost(h)

describe("guardedLookup (connection-time DNS check)", () => {
  const run = (host: string, isBlocked = isBlockedHost) =>
    new Promise<{ err: Error | null; address?: unknown }>((r) =>
      guardedLookup(resolve, isBlocked)(host, { all: true }, (err, address) => r({ err, address })),
    )

  test("a public answer passes", async () => {
    expect((await run("public.test")).err).toBeNull()
  })

  test("a name resolving to a private address is blocked", async () => {
    expect((await run("rebind.test")).err).toBeInstanceOf(SsrfBlockedError)
  })

  test("any private address in a multi-answer response blocks the name", async () => {
    expect((await run("mixed.test")).err).toBeInstanceOf(SsrfBlockedError)
  })
})

describe("safeFetch", () => {
  test("connects through the guarded lookup (a test-only hostname reaches the server)", async () => {
    const res = await safeFetch(`http://ok.test:${port}/ok`, {}, { resolve, isBlocked: allowLoopback })
    expect(await res.json()).toEqual({ ok: true, method: "GET" })
  })

  test("a hostname that resolves to a private address is refused before any request is sent", async () => {
    await expect(safeFetch(`http://rebind.test:${port}/ok`, {}, { resolve })).rejects.toBeInstanceOf(SsrfBlockedError)
    expect(hits).toEqual([])
  })

  test("a redirect to the cloud-metadata address is refused", async () => {
    await expect(
      safeFetch(`http://ok.test:${port}/redir-metadata`, {}, { resolve, isBlocked: allowLoopback }),
    ).rejects.toThrow(/169\.254\.169\.254/)
  })

  test("a redirect to a loopback literal is refused", async () => {
    await expect(
      safeFetch(`http://ok.test:${port}/redir-loopback`, {}, { resolve, isBlocked: allowLoopback }),
    ).rejects.toBeInstanceOf(SsrfBlockedError)
    expect(hits).toEqual(["GET /redir-loopback"])
  })

  test("a redirect to a name resolving to a private address is refused at connection time", async () => {
    await expect(
      safeFetch(`http://ok.test:${port}/redir-rebind`, {}, { resolve, isBlocked: allowLoopback }),
    ).rejects.toBeInstanceOf(SsrfBlockedError)
    expect(hits).toEqual(["GET /redir-rebind"]) // first hop reached the server; the redirect target was refused
  })

  test("an allowed redirect is followed", async () => {
    const res = await safeFetch(`http://ok.test:${port}/redir-ok`, {}, { resolve, isBlocked: allowLoopback })
    expect(res.status).toBe(200)
    expect(hits).toEqual(["GET /redir-ok", "GET /ok"])
  })

  test("303 after POST continues as GET without a body", async () => {
    const res = await safeFetch(
      `http://ok.test:${port}/see-other`,
      { method: "POST", body: "x=1" },
      { resolve, isBlocked: allowLoopback },
    )
    expect(await res.json()).toEqual({ ok: true, method: "GET" })
  })

  test("redirect loops stop after the limit", async () => {
    await expect(
      safeFetch(`http://ok.test:${port}/loop`, {}, { resolve, isBlocked: allowLoopback, maxRedirects: 3 }),
    ).rejects.toThrow(/more than 3 redirects/)
    expect(hits).toHaveLength(4)
  })

  test("literal private URLs are still refused up front", async () => {
    await expect(safeFetch("http://169.254.169.254/latest/meta-data/")).rejects.toBeInstanceOf(SsrfBlockedError)
  })
})
