/**
 * Unit tests for the two-axis BYOK model (design doc §6):
 * per-axis mode resolution, provider-agnostic report model, and the shared
 * renderReport(analysis) templated (no-LLM) fallback.
 *
 * Pure logic only — no network. Run with: pnpm test scanner-axes
 */
import { resolveScanModes, resolveReportModel, renderReport } from "../demo-mode"

describe("resolveScanModes (two-axis BYOK)", () => {
  test("no keys, no token -> full demo (mock data + templated report)", () => {
    expect(resolveScanModes({})).toEqual({
      dataMode: "demo",
      narrativeMode: "templated",
      demoMode: true,
    })
  })

  test("AI key only -> demo data + LLM narrative (not full demo)", () => {
    const m = resolveScanModes({ apiKeys: { anthropic: "sk-ant-x" } })
    expect(m.dataMode).toBe("demo")
    expect(m.narrativeMode).toBe("llm")
    expect(m.demoMode).toBe(false)
  })

  test("GitHub token only -> real data + templated narrative", () => {
    const m = resolveScanModes({ githubToken: "ghp_x" })
    expect(m.dataMode).toBe("real")
    expect(m.narrativeMode).toBe("templated")
    expect(m.demoMode).toBe(false)
  })

  test("both keys -> fully real (real data + LLM)", () => {
    const m = resolveScanModes({ apiKeys: { openai: "sk-x" }, githubToken: "ghp_x" })
    expect(m.dataMode).toBe("real")
    expect(m.narrativeMode).toBe("llm")
  })

  test("explicit scanMode=real overrides a missing token", () => {
    expect(resolveScanModes({ scanMode: "real" }).dataMode).toBe("real")
  })

  test("explicit demo preference forces demo even with a token", () => {
    const m = resolveScanModes({ githubToken: "ghp_x", userPreference: "demo" })
    expect(m.dataMode).toBe("demo")
    expect(m.narrativeMode).toBe("templated")
    expect(m.demoMode).toBe(true)
  })
})

describe("resolveScanModes with the scanner's AI-report switch (design §15)", () => {
  test("AI key saved but switch off -> templated report, no LLM (demo and real data)", () => {
    expect(resolveScanModes({ apiKeys: { openai: "sk-x" }, aiReport: false }).narrativeMode).toBe("templated")
    expect(resolveScanModes({ apiKeys: { openai: "sk-x" }, scanMode: "real", aiReport: false }).narrativeMode).toBe("templated")
  })

  test("switch on with an AI key -> LLM report", () => {
    expect(resolveScanModes({ apiKeys: { anthropic: "sk-ant-x" }, aiReport: true }).narrativeMode).toBe("llm")
  })

  test("switch on without any AI key -> still templated", () => {
    expect(resolveScanModes({ aiReport: true }).narrativeMode).toBe("templated")
  })

  test("switch off + sample data -> full demo, even with keys saved", () => {
    expect(resolveScanModes({ apiKeys: { openai: "sk-x", google: "g" }, scanMode: "demo", aiReport: false }).demoMode).toBe(true)
  })

  test("other workflows (no aiReport given) keep the key-driven rule", () => {
    expect(resolveScanModes({ apiKeys: { openai: "sk-x" } }).narrativeMode).toBe("llm")
  })
})

describe("resolveReportModel (provider-agnostic)", () => {
  test("prefers anthropic, then openai, then google, then groq", () => {
    expect(resolveReportModel({ anthropic: "x", openai: "y" })).toBe("anthropic/claude-3-5-sonnet-20241022")
    expect(resolveReportModel({ openai: "y" })).toBe("openai/gpt-4o-mini")
    expect(resolveReportModel({ google: "z" })).toBe("google/gemini-1.5-flash")
    expect(resolveReportModel({ groq: "w" })).toBe("groq/llama-3.3-70b-versatile")
  })

  test("returns null when no AI key is present", () => {
    expect(resolveReportModel({})).toBeNull()
  })
})

describe("renderReport (templated, no-LLM fallback)", () => {
  const realScan = {
    repository: "acme/widget",
    securityScore: 42,
    grade: "C",
    vulnerabilities: {
      critical: 1, high: 2, medium: 0, low: 0,
      details: [
        { id: "CVE-2020-1", severity: "CRITICAL", component: "lib@1.0.0", description: "RCE", fix: "Upgrade to 1.0.1", effort: "30+ minutes" },
      ],
    },
    securityPractices: { has_security_policy: true, dependabot_enabled: false, code_scanning: null },
    dependencyAudit: { total: 100, vulnerable: 1 },
    // NOTE: real scan output has no codeQuality / recommendations.
  }

  test("renders real scan output (missing codeQuality/recommendations) without throwing", () => {
    const md = renderReport(realScan)
    expect(typeof md).toBe("string")
    expect(md).toContain("acme/widget")
    expect(md).toContain("42/100")
    expect(md).toContain("CVE-2020-1")
    expect(md).toContain("Security policy documented") // explicit true practice shown
    expect(md).not.toContain("undefined")
  })

  test("uses the excellence heading for high scores", () => {
    const md = renderReport({
      repository: "a/b", securityScore: 96, grade: "A+",
      vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0, details: [] },
      securityPractices: {},
    })
    expect(md).toContain("Security Excellence Report")
    expect(md).not.toContain("undefined")
  })
})
