/**
 * @jest-environment node
 */

// In-memory limiter only (no Upstash in tests).
jest.mock("@/lib/security/upstash-rate-limit-store", () => ({ createUpstashStore: () => null }))

import { POST } from "../route"

const CANARY = "canary-5d1e-user-path-or-query"
let ipCounter = 0
const freshIp = () => `198.51.100.${++ipCounter}`

function post(body: string, contentType: string, ip = freshIp()) {
  return new Request("http://localhost:3000/api/csp-report", {
    method: "POST",
    headers: { "Content-Type": contentType, "x-forwarded-for": ip, "Content-Length": String(body.length) },
    body,
  })
}

// Legacy `report-uri` format (Firefox, Safari, older Chrome)
const legacy = (over: Record<string, unknown> = {}) =>
  JSON.stringify({
    "csp-report": {
      "document-uri": `https://www.topflow.dev/builder?q=${CANARY}`,
      "violated-directive": "script-src-elem",
      "effective-directive": "script-src-elem",
      "blocked-uri": `https://evil.example/x.js?token=${CANARY}`,
      "script-sample": `alert("${CANARY}")`,
      ...over,
    },
  })

// Reporting API format (`report-to`, current Chrome)
const reportingApi = JSON.stringify([
  {
    type: "csp-violation",
    url: `https://www.topflow.dev/blog/${CANARY}`,
    body: {
      documentURL: `https://www.topflow.dev/blog/${CANARY}`,
      effectiveDirective: "img-src",
      blockedURL: `https://cdn.example.org/${CANARY}.png`,
      sample: CANARY,
    },
  },
])

describe("POST /api/csp-report", () => {
  let warn: jest.SpyInstance
  const logged = () => warn.mock.calls.map((c) => c.map((a: unknown) => JSON.stringify(a)).join(" ")).join("\n")

  beforeEach(() => {
    warn = jest.spyOn(console, "warn").mockImplementation(() => {})
  })
  afterEach(() => warn.mockRestore())

  test("accepts a legacy report and logs only the directive and the blocked ORIGIN", async () => {
    const res = await POST(post(legacy(), "application/csp-report"))
    expect(res.status).toBe(204)
    expect(logged()).toContain("script-src-elem")
    expect(logged()).toContain("https://evil.example")
    expect(logged()).not.toContain(CANARY) // no paths, queries, document URLs or samples
  })

  test("accepts Reporting API batches", async () => {
    const res = await POST(post(reportingApi, "application/reports+json"))
    expect(res.status).toBe(204)
    expect(logged()).toContain("img-src")
    expect(logged()).toContain("https://cdn.example.org")
    expect(logged()).not.toContain(CANARY)
  })

  test("keeps CSP keywords like 'inline' and 'eval' (they aren't URLs)", async () => {
    await POST(post(legacy({ "blocked-uri": "eval", "effective-directive": "script-src" }), "application/csp-report"))
    expect(logged()).toContain("eval")
  })

  test("never logs non-http blocked values beyond their scheme", async () => {
    await POST(post(legacy({ "blocked-uri": `data:text/html,${CANARY}` }), "application/csp-report"))
    expect(logged()).toContain("data:")
    expect(logged()).not.toContain(CANARY)
  })

  test("rejects oversized bodies with 413", async () => {
    const big = legacy({ "script-sample": "x".repeat(20_000) })
    const res = await POST(post(big, "application/csp-report"))
    expect(res.status).toBe(413)
  })

  test("rejects invalid JSON with 400 and logs nothing", async () => {
    const res = await POST(post("{not json", "application/csp-report"))
    expect(res.status).toBe(400)
    expect(warn).not.toHaveBeenCalled()
  })

  test("is rate limited per client", async () => {
    const ip = freshIp()
    let last = 0
    for (let i = 0; i < 31; i++) last = (await POST(post(legacy(), "application/csp-report", ip))).status
    expect(last).toBe(429)
  })
})
