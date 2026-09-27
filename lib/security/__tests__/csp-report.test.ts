import { summarizeBlocked, summarizeDirective, extractSummaries } from "../csp-report"

describe("summarizeBlocked — never more than an origin, keyword or scheme", () => {
  test.each([
    ["https://cdn.example.org/a/b.js?token=secret", "https://cdn.example.org"],
    ["http://localhost:3000/x", "http://localhost:3000"],
    ["inline", "inline"],
    ["eval", "eval"],
    ["data:text/html,<b>secret</b>", "data:"],
    ["blob:https://www.topflow.dev/1234", "blob:"],
    ["not a url", "other"],
    ["", "unknown"],
    [undefined, "unknown"],
    [42, "unknown"],
  ])("%p → %p", (input, expected) => {
    expect(summarizeBlocked(input)).toBe(expected)
  })
})

describe("summarizeDirective — only plain directive names pass through", () => {
  test.each([
    ["script-src-elem", "script-src-elem"],
    ["img-src", "img-src"],
    ["script-src 'self' https://evil.example/?q=secret", "unknown"],
    [undefined, "unknown"],
  ])("%p → %p", (input, expected) => {
    expect(summarizeDirective(input)).toBe(expected)
  })
})

describe("extractSummaries", () => {
  test("legacy report falls back to violated-directive", () => {
    const out = extractSummaries({ "csp-report": { "violated-directive": "img-src", "blocked-uri": "https://a.example/x.png" } })
    expect(out).toEqual([{ directive: "img-src", blocked: "https://a.example" }])
  })

  test("Reporting API: keeps csp-violation entries only, and caps the batch at 20", () => {
    const entry = { type: "csp-violation", body: { effectiveDirective: "script-src", blockedURL: "eval" } }
    const batch = [{ type: "deprecation", body: {} }, ...Array.from({ length: 30 }, () => entry)]
    const out = extractSummaries(batch)
    expect(out).toHaveLength(20)
    expect(out[0]).toEqual({ directive: "script-src", blocked: "eval" })
  })

  test("unknown shapes produce nothing", () => {
    expect(extractSummaries(null)).toEqual([])
    expect(extractSummaries("text")).toEqual([])
    expect(extractSummaries({ something: "else" })).toEqual([])
    expect(extractSummaries([{ type: "csp-violation" }])).toEqual([{ directive: "unknown", blocked: "unknown" }])
  })
})
