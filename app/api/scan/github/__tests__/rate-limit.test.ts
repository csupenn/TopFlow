/**
 * @jest-environment node
 */

/**
 * Real-scan design revision 2, acceptance criterion 3: the public real-scan route is rate-limited like the
 * execution route (10 requests per minute per client), because each call costs ~15 GitHub requests,
 * one OSV query per vulnerable package and up to 30 s of function time.
 */

jest.mock("@/lib/security/upstash-rate-limit-store", () => ({ createUpstashStore: () => null }))
jest.mock("@/lib/osv/scanner", () => ({ scanRepository: jest.fn(async () => ({ repository: "facebook/react" })) }))

import { GET } from "../[...repo]/route"

const call = (ip: string) =>
  // The route only reads headers; a plain Request stands in for NextRequest in this environment.
  GET(new Request("http://localhost:3000/api/scan/github/facebook/react", { headers: { "x-forwarded-for": ip } }) as any, {
    params: Promise.resolve({ repo: ["facebook", "react"] }),
  })

describe("GET /api/scan/github rate limit", () => {
  test("the 11th request within a minute from one client gets 429; another client is unaffected", async () => {
    const statuses: number[] = []
    for (let i = 0; i < 11; i++) statuses.push((await call("192.0.2.10")).status)
    expect(statuses.slice(0, 10)).toEqual(Array(10).fill(200))
    expect(statuses[10]).toBe(429)
    expect((await call("192.0.2.11")).status).toBe(200)
  })

  test("a limited response says when to retry and runs no scan", async () => {
    const { scanRepository } = jest.requireMock("@/lib/osv/scanner")
    for (let i = 0; i < 10; i++) await call("192.0.2.20")
    scanRepository.mockClear()
    const res = await call("192.0.2.20")
    expect(res.status).toBe(429)
    expect(Number(res.headers.get("Retry-After"))).toBeGreaterThan(0)
    expect(scanRepository).not.toHaveBeenCalled()
  })
})
