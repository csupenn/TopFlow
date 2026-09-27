/**
 * @jest-environment node
 */
const { securityHeaderRules, buildCsp, CSP_DIRECTIVES, CSP_REPORT_ONLY } = require("../security-headers.cjs")

type Header = { key: string; value: string }
type Rule = { source: string; headers: Header[] }

const rules: Rule[] = securityHeaderRules()
const siteWide = rules.find((r) => r.source === "/(.*)")!
const header = (name: string) => siteWide.headers.find((h) => h.key.toLowerCase() === name.toLowerCase())
const directives = (csp: string) =>
  Object.fromEntries(csp.split(";").map((d) => d.trim()).filter(Boolean).map((d) => {
    const [name, ...values] = d.split(/\s+/)
    return [name, values]
  }))

describe("security headers (single source for next.config.mjs)", () => {
  test("apply to every route", () => {
    expect(siteWide).toBeDefined()
  })

  test("ship the CSP in report-only mode first (observe before enforcing)", () => {
    expect(CSP_REPORT_ONLY).toBe(true)
    expect(header("Content-Security-Policy-Report-Only")).toBeDefined()
    expect(header("Content-Security-Policy")).toBeUndefined()
  })

  test("CSP locks down the dangerous defaults", () => {
    const d = directives(header("Content-Security-Policy-Report-Only")!.value)
    expect(d["default-src"]).toEqual(["'self'"])
    expect(d["object-src"]).toEqual(["'none'"])
    expect(d["base-uri"]).toEqual(["'self'"])
    expect(d["form-action"]).toEqual(["'self'"])
    expect(d["frame-ancestors"]).toEqual(["'none'"])
  })

  test("does not allow eval — client-side new Function() must show up in reports, not be silently permitted", () => {
    const d = directives(buildCsp(CSP_DIRECTIVES))
    expect(d["script-src"]).not.toContain("'unsafe-eval'")
  })

  test("reports violations to our endpoint (legacy report-uri and Reporting API)", () => {
    const d = directives(header("Content-Security-Policy-Report-Only")!.value)
    expect(d["report-uri"]).toEqual(["/api/csp-report"])
    expect(d["report-to"]).toEqual(["csp"])
    expect(header("Reporting-Endpoints")?.value).toBe('csp="/api/csp-report"')
  })

  test("keeps the existing hardening headers and drops deprecated X-XSS-Protection", () => {
    expect(header("X-Frame-Options")?.value).toBe("DENY")
    expect(header("X-Content-Type-Options")?.value).toBe("nosniff")
    expect(header("Referrer-Policy")?.value).toBe("strict-origin-when-cross-origin")
    expect(header("Permissions-Policy")?.value).toBe("camera=(), microphone=(), geolocation=()")
    expect(header("X-XSS-Protection")).toBeUndefined()
  })

  test("API responses are never cached", () => {
    const api = rules.find((r) => r.source === "/api/(.*)")
    expect(api?.headers).toContainEqual({ key: "Cache-Control", value: "no-store, no-cache, must-revalidate" })
  })
})
