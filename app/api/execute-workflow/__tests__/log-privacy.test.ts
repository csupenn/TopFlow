/**
 * @jest-environment node
 */

/**
 * Privacy regression: the execution path must never write user-supplied content
 * to server logs. TopFlow's claim is "no server-side data storage" — on Vercel,
 * console output is retained log data, so payloads in logs would break that claim.
 *
 * Runs the REAL route + engine + demo path (no engine/demo mocks) with a canary
 * string planted in every user-controlled field, then asserts no console call
 * contains it.
 */

import { GITHUB_SCANNER_NODES, GITHUB_SCANNER_EDGES } from "@/lib/templates/github-scanner"

// @upstash/redis is ESM and needs env vars; the in-memory limiter is fine here.
jest.mock("@/lib/security/upstash-rate-limit-store", () => ({
  createUpstashStore: () => null,
}))

// Keep demo-mode real; only skip its cosmetic per-node delays so the run is fast.
jest.mock("@/lib/demo-mode", () => ({
  ...jest.requireActual("@/lib/demo-mode"),
  simulateDelay: () => Promise.resolve(),
}))

import { POST } from "../route"

const CANARY = "canary-7f3a9c-private-user-data"

type ConsoleMethod = "log" | "info" | "warn" | "error" | "debug"
const METHODS: ConsoleMethod[] = ["log", "info", "warn", "error", "debug"]

function captureConsole() {
  const calls: unknown[][] = []
  const spies = METHODS.map((m) =>
    jest.spyOn(console, m).mockImplementation((...args: unknown[]) => {
      calls.push(args)
    }),
  )
  return {
    text: () =>
      calls
        .map((args) =>
          args
            .map((a) => {
              if (typeof a === "string") return a
              if (a instanceof Error) return `${a.name}: ${a.message}\n${a.stack ?? ""}`
              try {
                return JSON.stringify(a)
              } catch {
                return String(a)
              }
            })
            .join(" "),
        )
        .join("\n"),
    restore: () => spies.forEach((s) => s.mockRestore()),
  }
}

// jest.setup.js polyfills Response without text(); read the stream directly.
// Draining to the end also guarantees every log line was emitted before asserting.
async function drain(res: Response): Promise<string> {
  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let text = ""
  for (;;) {
    const { done, value } = await reader.read()
    if (done) return text
    text += decoder.decode(value, { stream: true })
  }
}

function request(body: unknown, ip: string) {
  return new Request("http://localhost:3000/api/execute-workflow", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  })
}

describe("execute-workflow: no user content in server logs", () => {
  let consoleCapture: ReturnType<typeof captureConsole>

  beforeEach(() => {
    consoleCapture = captureConsole()
  })
  afterEach(() => consoleCapture.restore())

  test("GitHub scanner demo run does not log the user's input", async () => {
    const res = await POST(
      request(
        {
          nodes: GITHUB_SCANNER_NODES,
          edges: GITHUB_SCANNER_EDGES,
          workflowId: "github-security-scanner",
          userInputs: { start: `https://github.com/${CANARY}/${CANARY}` },
        },
        "10.0.0.1",
      ),
    )
    const body = await drain(res)

    expect(body).toContain('"type":"complete"') // the run actually executed
    expect(consoleCapture.text()).not.toContain(CANARY)
  })

  test("a failing run does not log the user's input via error paths", async () => {
    // Malformed graph (edge to a missing node) with a canary in node data.
    const res = await POST(
      request(
        {
          nodes: [
            { id: "start", type: "start", position: { x: 0, y: 0 }, data: { defaultValue: CANARY } },
            { id: "p", type: "prompt", position: { x: 1, y: 0 }, data: { content: CANARY } },
          ],
          edges: [{ id: "e", source: "start", target: "missing" }],
          workflowId: "custom",
          apiKeys: { openai: `sk-${CANARY}` },
          userInputs: { start: CANARY },
        },
        "10.0.0.2",
      ),
    )
    await drain(res)

    expect(consoleCapture.text()).not.toContain(CANARY)
  })
})
