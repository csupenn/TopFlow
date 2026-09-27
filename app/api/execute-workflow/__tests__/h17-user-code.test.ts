/**
 * @jest-environment node
 */

/**
 * H17 regression: code submitted in a workflow must not be able to read server secrets.
 *
 * Before the fix, JavaScript, Tool and Conditional nodes ran user strings with `new Function` on the
 * server, with full access to `process.env` and `fetch`. This runs the REAL route + engine with a
 * secret planted in process.env and tries to read it three ways.
 */

import { GITHUB_SCANNER_NODES } from "@/lib/templates/github-scanner"
import { UNTRUSTED_CODE_MESSAGE } from "@/lib/security/trusted-code"

jest.mock("@/lib/security/upstash-rate-limit-store", () => ({ createUpstashStore: () => null }))

import { POST } from "../route"

const SECRET = "h17-canary-secret-value-5c2e"
let ip = 0

async function run(nodes: unknown[], edges: unknown[]) {
  const req = new Request("http://localhost:3000/api/execute-workflow", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": `203.0.113.${++ip}` },
    body: JSON.stringify({ workflowId: "custom", apiKeys: { openai: "sk-dummy" }, nodes, edges }),
  })
  const res = await POST(req)
  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let text = ""
  for (;;) {
    const { done, value } = await reader.read()
    if (done) return text
    text += decoder.decode(value, { stream: true })
  }
}

const start = { id: "s", type: "start", position: { x: 0, y: 0 }, data: { defaultValue: "https://github.com/facebook/react" } }
const end = { id: "e", type: "end", position: { x: 2, y: 0 }, data: {} }
const chain = (...ids: string[]) => ids.slice(1).map((id, i) => ({ id: `e${i}`, source: ids[i], target: id }))

describe("H17: user code can't reach server secrets", () => {
  let warn: jest.SpyInstance
  let error: jest.SpyInstance
  beforeAll(() => {
    process.env.H17_CANARY = SECRET
  })
  afterAll(() => {
    delete process.env.H17_CANARY
  })
  beforeEach(() => {
    warn = jest.spyOn(console, "warn").mockImplementation(() => {})
    error = jest.spyOn(console, "error").mockImplementation(() => {})
    jest.spyOn(console, "log").mockImplementation(() => {})
  })
  afterEach(() => jest.restoreAllMocks())

  test("custom JavaScript node is refused", async () => {
    const js = { id: "j", type: "javascript", position: { x: 1, y: 0 }, data: { code: "return process.env.H17_CANARY" } }
    const out = await run([start, js, end], chain("s", "j", "e"))
    expect(out).not.toContain(SECRET)
    expect(out).toContain(UNTRUSTED_CODE_MESSAGE)
  })

  test("custom Tool node is refused", async () => {
    const tool = { id: "t", type: "tool", position: { x: 1, y: 0 }, data: { code: "return { k: process.env.H17_CANARY }" } }
    const out = await run([start, tool, end], chain("s", "t", "e"))
    expect(out).not.toContain(SECRET)
    expect(out).toContain(UNTRUSTED_CODE_MESSAGE)
  })

  test("a condition can't reach process (safe evaluator, no eval)", async () => {
    const cond = { id: "c", type: "conditional", position: { x: 1, y: 0 }, data: { condition: "process.env.H17_CANARY === 'x'" } }
    const out = await run([start, cond, end], chain("s", "c", "e"))
    expect(out).not.toContain(SECRET)
    expect(out).toContain('Unknown variable \\"process\\"')
  })

  test("built-in template code still runs (scanner's extract-repo)", async () => {
    const extract = GITHUB_SCANNER_NODES.find((n) => n.id === "extract-repo")!
    const out = await run([start, { ...extract, id: "x" }, end], chain("s", "x", "e"))
    expect(out).toContain('"type":"complete"')
    expect(out).not.toContain(UNTRUSTED_CODE_MESSAGE)
  })

  test("ordinary conditions still work", async () => {
    const cond = { id: "c", type: "conditional", position: { x: 1, y: 0 }, data: { condition: "input1.includes('github.com')" } }
    const out = await run([start, cond, end], chain("s", "c", "e"))
    expect(out).toContain('"type":"complete"')
  })

  test("nothing secret reaches the logs either", async () => {
    const js = { id: "j", type: "javascript", position: { x: 1, y: 0 }, data: { code: "return process.env.H17_CANARY" } }
    await run([start, js, end], chain("s", "j", "e"))
    const logged = [...warn.mock.calls, ...error.mock.calls].flat().map(String).join("\n")
    expect(logged).not.toContain(SECRET)
  })
})
