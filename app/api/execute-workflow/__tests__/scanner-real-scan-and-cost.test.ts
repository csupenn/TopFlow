/**
 * @jest-environment node
 */

/**
 * Real-scan design revision 2 (docs/architecture/osv-real-scan-design.md §15), acceptance criteria 1, 2, 5.
 *
 * Runs the REAL route + engine with the GitHub Scanner template and mocks only the edges:
 *  - `ai` (every AI-provider call goes through generateText / generateObject / embed) → counted,
 *  - `lib/osv/scanner` (no network) → observable in-process calls,
 *  - global fetch → serves api.github.com metadata, and the app's own routes the way local development
 *    would (so the old HTTP-to-self path can run far enough to reach the LLM and fail for the right reason).
 */

import { GITHUB_SCANNER_NODES, GITHUB_SCANNER_EDGES } from "@/lib/templates/github-scanner"
import { getRepoAnalysis } from "@/lib/demo-data/github-repos"

jest.mock("@/lib/security/upstash-rate-limit-store", () => ({ createUpstashStore: () => null }))
// Full scanner runs include the template's simulated step delays (~5 s each).
jest.setTimeout(30_000)

jest.mock("ai", () => {
  const actual = jest.requireActual("ai")
  return {
    ...actual,
    generateText: jest.fn(async () => ({ text: "generated", files: [] })),
    generateObject: jest.fn(async () => ({
      object: { prioritizedFindingIds: [], recommendations: [], summaryLabel: "MINOR_ISSUES" },
    })),
    embed: jest.fn(async () => ({ embedding: [0] })),
  }
})

const FAKE_SCAN = {
  repository: "facebook/react",
  stars: 1,
  forks: 1,
  language: "JavaScript",
  lastAnalyzed: "2026-09-27T00:00:00.000Z",
  scanMode: "real-osv",
  securityScore: 72,
  grade: "B",
  vulnerabilities: {
    critical: 0,
    high: 1,
    medium: 0,
    low: 0,
    details: [
      {
        id: "CVE-2026-0001",
        osvId: "GHSA-test-0001",
        severity: "HIGH",
        component: "lodash@4.17.21",
        description: "test advisory",
        fix: "Upgrade to 4.18.0",
        effort: "30+ minutes",
      },
    ],
  },
  dependencyAudit: {
    total: 10,
    vulnerable: 1,
    outdated: null,
    licenses: [],
    riskBreakdown: { high: 1, medium: 0, low: 0 },
    ecosystemsScanned: ["npm"],
  },
  securityPractices: {
    has_security_policy: true,
    dependabot_enabled: false,
    code_scanning: null,
    secret_scanning: null,
    branch_protection: null,
    signed_commits: null,
    two_factor_required: null,
  },
  owaspCompliance: { A06_vulnerable_components: "FAIL" },
  _meta: { manifestSources: ["package-lock.json (10)"], dataSources: ["GitHub REST API", "OSV.dev"], byok: false },
}

jest.mock("@/lib/osv/scanner", () => ({ scanRepository: jest.fn() }))

import { generateText, generateObject, embed } from "ai"
import { scanRepository } from "@/lib/osv/scanner"
import { POST } from "../route"

const ownOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/|^\/api\//
let fetchCalls: string[] = []
let ip = 0

function mockFetch() {
  fetchCalls = []
  jest.spyOn(global, "fetch").mockImplementation(async (input: any) => {
    const url = typeof input === "string" ? input : input.url
    fetchCalls.push(url)
    const json = (v: unknown) => new Response(JSON.stringify(v), { headers: { "Content-Type": "application/json" } })
    if (url.startsWith("https://api.github.com/repos/")) {
      return json({ full_name: "facebook/react", stargazers_count: 1, forks_count: 1, language: "JavaScript" })
    }
    // What the app's own routes would answer if the engine could reach them (local development).
    if (/\/api\/demo\/github-scan\//.test(url)) return json(getRepoAnalysis("facebook/react"))
    if (/\/api\/scan\/github\//.test(url)) return json(FAKE_SCAN)
    throw new Error(`unexpected fetch in test: ${url}`)
  })
}

async function runScanner(body: Record<string, unknown>) {
  const req = new Request("http://localhost:3000/api/execute-workflow", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": `198.51.100.${++ip}` },
    body: JSON.stringify({
      workflowId: "github-security-scanner",
      nodes: GITHUB_SCANNER_NODES,
      edges: GITHUB_SCANNER_EDGES,
      userInputs: { start: "https://github.com/facebook/react" },
      apiKeys: {},
      ...body,
    }),
  })
  const res = await POST(req)
  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let text = ""
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    text += decoder.decode(value, { stream: true })
  }
  return text
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l))
}

const aiCalls = () =>
  (generateText as jest.Mock).mock.calls.length +
  (generateObject as jest.Mock).mock.calls.length +
  (embed as jest.Mock).mock.calls.length

describe("Scanner revision 2: real scans in process, AI spending only on request", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {})
    jest.spyOn(console, "warn").mockImplementation(() => {})
    jest.spyOn(console, "error").mockImplementation(() => {})
    ;(generateText as jest.Mock).mockClear()
    ;(generateObject as jest.Mock).mockClear()
    ;(embed as jest.Mock).mockClear()
    ;(scanRepository as jest.Mock).mockReset().mockResolvedValue(FAKE_SCAN)
    mockFetch()
  })
  afterEach(() => jest.restoreAllMocks())

  // Acceptance criterion 2
  test("a real scan calls the scanner in process and never fetches the app's own origin", async () => {
    const updates = await runScanner({ scanMode: "real" })
    expect(fetchCalls.filter((u) => ownOrigin.test(u))).toEqual([])
    expect(scanRepository).toHaveBeenCalledWith("facebook", "react", { githubToken: undefined })
    expect(updates.filter((u) => u.type === "node_error" || u.type === "error")).toEqual([])
    // Score 72: the grade check's "input1.score >= 80" survives input sanitizing and evaluates to false.
    // (Branch skipping itself is tracked separately: the base engine runs both branches, S14.)
    const gradeCheck = updates.find((u) => u.type === "node_complete" && u.nodeId === "grade-check")
    expect(gradeCheck?.output).toBe(false)
  })

  test("the visitor's GitHub token goes to the in-process scan, not over HTTP", async () => {
    await runScanner({ scanMode: "real", githubToken: "ghp_visitor_token" })
    expect(scanRepository).toHaveBeenCalledWith("facebook", "react", { githubToken: "ghp_visitor_token" })
    expect(fetchCalls.filter((u) => ownOrigin.test(u))).toEqual([])
  })

  // Acceptance criterion 1
  test("sample data + saved AI keys, AI report off → zero AI-provider calls", async () => {
    await runScanner({ scanMode: "demo", apiKeys: { openai: "sk-test", google: "g-test" } })
    expect(aiCalls()).toBe(0)
  })

  test("real scan + saved AI keys, AI report off → zero AI-provider calls", async () => {
    await runScanner({ scanMode: "real", apiKeys: { openai: "sk-test", google: "g-test" } })
    expect(aiCalls()).toBe(0)
  })

  test("AI report switched on → the URW-constrained model call runs", async () => {
    await runScanner({ scanMode: "real", apiKeys: { openai: "sk-test" }, aiReport: true })
    expect((generateObject as jest.Mock).mock.calls.length).toBeGreaterThan(0)
  })

  // Acceptance criterion 5
  test("AI report on + Google key → the image step runs; without the switch it doesn't", async () => {
    await runScanner({ scanMode: "real", apiKeys: { openai: "sk-test", google: "g-test" }, aiReport: true })
    expect((generateText as jest.Mock).mock.calls.length).toBeGreaterThan(0)
    ;(generateText as jest.Mock).mockClear()
    await runScanner({ scanMode: "real", apiKeys: { openai: "sk-test", google: "g-test" } })
    expect((generateText as jest.Mock).mock.calls.length).toBe(0)
  })

  test("AI report on without a Google key → no image-model call", async () => {
    await runScanner({ scanMode: "real", apiKeys: { openai: "sk-test" }, aiReport: true })
    expect((generateText as jest.Mock).mock.calls.length).toBe(0)
  })
})
