import { validateWorkflow, validateApiKeys } from "../validation-engine"

// Minimal node/edge builders
const node = (id: string, type: string, data: Record<string, unknown> = {}) => ({ id, type, data })
const edge = (source: string, target: string) => ({ id: `${source}-${target}`, source, target })

/** start → http → end, with the given URL on the HTTP node. */
const httpFlow = (url: string) => ({
  nodes: [node("s", "start"), node("h", "httpRequest", { url }), node("e", "end")],
  edges: [edge("s", "h"), edge("h", "e")],
})

const ssrfErrors = (url: string) => {
  const { nodes, edges } = httpFlow(url)
  return validateWorkflow(nodes, edges).errors.filter((i) => i.category === "ssrf")
}
const ssrfWarnings = (url: string) => {
  const { nodes, edges } = httpFlow(url)
  return validateWorkflow(nodes, edges).warnings.filter((i) => i.category === "ssrf")
}
const check = (result: ReturnType<typeof validateWorkflow>, id: string) =>
  result.securityChecks.find((c) => c.id === id)!

describe("validateWorkflow — structure", () => {
  test("a clean start → end workflow is valid with a perfect score", () => {
    const r = validateWorkflow([node("s", "start"), node("e", "end")], [edge("s", "e")])
    expect(r.isValid).toBe(true)
    expect(r.errors).toEqual([])
    expect(r.warnings).toEqual([])
    expect(r.overallScore).toBe(100)
    expect(r.securityChecks.every((c) => c.passed)).toBe(true)
  })

  test("missing start node is an error", () => {
    const r = validateWorkflow([node("e", "end")], [])
    expect(r.isValid).toBe(false)
    expect(r.errors.map((e) => e.id)).toContain("validation-no-start")
    expect(check(r, "structure-validation").passed).toBe(false)
  })

  test("multiple start nodes is a warning, not an error", () => {
    const r = validateWorkflow(
      [node("s1", "start"), node("s2", "start"), node("e", "end")],
      [edge("s1", "e"), edge("s2", "e")],
    )
    expect(r.isValid).toBe(true)
    expect(r.warnings.map((w) => w.id)).toContain("validation-multiple-start")
  })

  test("missing end node is a warning", () => {
    const r = validateWorkflow([node("s", "start")], [])
    expect(r.warnings.map((w) => w.id)).toContain("validation-no-end")
  })

  test("a disconnected node is flagged with its id and label", () => {
    const r = validateWorkflow(
      [node("s", "start"), node("e", "end"), node("x", "prompt", { label: "Orphan" })],
      [edge("s", "e")],
    )
    const w = r.warnings.find((i) => i.id === "validation-disconnected-x")
    expect(w).toBeDefined()
    expect(w!.nodeId).toBe("x")
    expect(w!.description).toContain("Orphan")
  })

  test("a single node is not reported as disconnected", () => {
    const r = validateWorkflow([node("s", "start")], [])
    expect(r.warnings.some((w) => w.id.startsWith("validation-disconnected"))).toBe(false)
  })

  test("a cycle is an error and fails the cycle check", () => {
    const r = validateWorkflow(
      [node("s", "start"), node("a", "prompt"), node("b", "prompt"), node("e", "end")],
      [edge("s", "a"), edge("a", "b"), edge("b", "a"), edge("b", "e")],
    )
    expect(r.errors.map((e) => e.id)).toContain("validation-cycle")
    expect(check(r, "cycle-detection").passed).toBe(false)
  })

  test("a self-loop is a cycle", () => {
    const r = validateWorkflow([node("s", "start"), node("e", "end")], [edge("s", "e"), edge("e", "e")])
    expect(r.errors.map((e) => e.id)).toContain("validation-cycle")
  })

  test("an empty conditional expression is an error", () => {
    const r = validateWorkflow(
      [node("s", "start"), node("c", "conditional", { condition: "   " }), node("e", "end")],
      [edge("s", "c"), edge("c", "e")],
    )
    expect(r.errors.map((e) => e.id)).toContain("validation-empty-condition-c")
  })
})

describe("validateWorkflow — SSRF (must match the server's lib/security/ssrf.ts)", () => {
  test.each([
    "http://localhost/admin",
    "http://127.0.0.1:8080/",
    "http://10.0.0.5/",
    "http://172.16.0.1/",
    "http://192.168.1.1/",
    "http://169.254.169.254/latest/meta-data/", // cloud metadata
    "http://metadata.google.internal/",
    "https://service.internal/",
    "https://printer.local/",
    "http://[::1]/", // IPv6 loopback — URL.hostname keeps the brackets
    "http://[::ffff:127.0.0.1]/", // IPv4-mapped IPv6
    "http://100.64.0.1/", // CGNAT
    "http://0.1.2.3/", // 0.0.0.0/8
    "file:///etc/passwd",
    "gopher://example.com/",
  ])("blocks %s as an error", (url) => {
    const errors = ssrfErrors(url)
    expect(errors).toHaveLength(1)
    expect(errors[0].severity).toBe("error")
    expect(errors[0].nodeId).toBe("h")
  })

  test("a blocked URL fails the SSRF check and makes the workflow invalid", () => {
    const { nodes, edges } = httpFlow("http://169.254.169.254/")
    const r = validateWorkflow(nodes, edges)
    expect(r.isValid).toBe(false)
    expect(check(r, "ssrf-prevention").passed).toBe(false)
  })

  test.each(["https://api.example.com/v1", "https://notlocalhost.com/", "https://my-localhost-docs.dev/"])(
    "allows public host %s (no substring false positives)",
    (url) => {
      expect(ssrfErrors(url)).toEqual([])
      expect(ssrfWarnings(url)).toEqual([])
    },
  )

  test("plain http to a public host is a warning, not an error", () => {
    expect(ssrfErrors("http://api.example.com/")).toEqual([])
    const w = ssrfWarnings("http://api.example.com/")
    expect(w).toHaveLength(1)
    expect(w[0].title).toMatch(/HTTP/)
  })

  test("an unparseable URL is a warning", () => {
    expect(ssrfErrors("not a url")).toEqual([])
    expect(ssrfWarnings("not a url")[0].title).toMatch(/Invalid URL/)
  })
})

describe("validateWorkflow — PII in prompts", () => {
  test.each([
    ["email", "Contact jane.doe@example.com"],
    ["SSN", "SSN 123-45-6789"],
    ["credit card", "Card 4111 1111 1111 1111"],
    ["IP address", "Server 203.0.113.7"],
  ])("warns about %s in a prompt node", (_label, content) => {
    const r = validateWorkflow(
      [node("s", "start"), node("p", "prompt", { content }), node("e", "end")],
      [edge("s", "p"), edge("p", "e")],
    )
    expect(r.warnings.some((w) => w.category === "pii" && w.nodeId === "p")).toBe(true)
    expect(check(r, "pii-detection").passed).toBe(false)
  })

  test("checks a textModel system prompt too", () => {
    const r = validateWorkflow(
      [node("s", "start"), node("t", "textModel", { systemPrompt: "email ops@example.com" }), node("e", "end")],
      [edge("s", "t"), edge("t", "e")],
    )
    expect(r.warnings.some((w) => w.category === "pii" && w.nodeId === "t")).toBe(true)
  })

  test("reports the count but never echoes the PII value itself", () => {
    const r = validateWorkflow(
      [node("s", "start"), node("p", "prompt", { content: "a@x.io and b@y.io" }), node("e", "end")],
      [edge("s", "p"), edge("p", "e")],
    )
    const w = r.warnings.find((i) => i.category === "pii")!
    expect(w.description).toContain("2")
    expect(JSON.stringify(r)).not.toContain("a@x.io")
  })

  test("a prompt without PII passes", () => {
    const r = validateWorkflow(
      [node("s", "start"), node("p", "prompt", { content: "Summarize $input1" }), node("e", "end")],
      [edge("s", "p"), edge("p", "e")],
    )
    expect(check(r, "pii-detection").passed).toBe(true)
  })
})

describe("validateWorkflow — score", () => {
  test("stays within 0–100 even with many issues", () => {
    const nodes = [node("e", "end"), ...Array.from({ length: 12 }, (_, i) => node(`h${i}`, "httpRequest", { url: "http://10.0.0.1/" }))]
    const r = validateWorkflow(nodes, [])
    expect(r.overallScore).toBeGreaterThanOrEqual(0)
    expect(r.overallScore).toBeLessThanOrEqual(100)
  })

  test("more problems never raise the score", () => {
    const clean = validateWorkflow([node("s", "start"), node("e", "end")], [edge("s", "e")])
    const { nodes, edges } = httpFlow("http://10.0.0.1/")
    const bad = validateWorkflow(nodes, edges)
    expect(bad.overallScore).toBeLessThan(clean.overallScore)
  })
})

describe("validateApiKeys", () => {
  test.each([
    ["openai", node("t", "textModel", { model: "openai/gpt-4o" })],
    ["openai", node("i", "imageGeneration", { model: "openai/dall-e-3" })],
    ["openai", node("a", "audio", { model: "openai/tts-1" })],
    ["anthropic", node("t", "textModel", { model: "anthropic/claude" })],
    ["google", node("t", "textModel", { model: "google/gemini-2.0-flash" })],
    ["google", node("i", "imageGeneration", { model: "google/gemini-image" })],
  ])("requires a %s key when a node uses it", (provider, n) => {
    const issues = validateApiKeys({}, [n])
    expect(issues.map((i) => i.id)).toContain(`api-key-${provider}`)
    expect(validateApiKeys({ [provider]: "k" }, [n])).toEqual([])
  })

  test("no model nodes → no key requirements", () => {
    expect(validateApiKeys({}, [node("s", "start"), node("p", "prompt")])).toEqual([])
  })
})
