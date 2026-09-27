import { evaluateConditionInSandbox } from "../sandbox-evaluate"

// jsdom can't execute the real sandbox page; these tests pin down the parent-side protocol.
// The real iframe + worker behavior is verified in a browser (see the PR / Playwright check).

const lastIframe = () => document.querySelector("iframe") as HTMLIFrameElement | null

function fromIframe(data: unknown) {
  const f = lastIframe()!
  window.dispatchEvent(new MessageEvent("message", { data, source: f.contentWindow as Window }))
}

describe("evaluateConditionInSandbox", () => {
  afterEach(() => document.querySelectorAll("iframe").forEach((f) => f.remove()))

  test("creates a sandboxed iframe WITHOUT allow-same-origin (opaque origin → no app storage)", async () => {
    const p = evaluateConditionInSandbox("true", { input1: "" }, { timeoutMs: 50 })
    const f = lastIframe()!
    expect(f.getAttribute("sandbox")).toBe("allow-scripts")
    expect(f.getAttribute("src")).toBe("/sandbox/condition-eval.html")
    await p
  })

  test("sends the request after 'ready' and resolves with the sandbox's answer", async () => {
    const p = evaluateConditionInSandbox("input1.length > 3", { input1: "hello" })
    const f = lastIframe()!
    const post = jest.spyOn(f.contentWindow as Window, "postMessage")
    fromIframe({ ready: true })
    expect(post).toHaveBeenCalledTimes(1)
    const [request] = post.mock.calls[0] as [{ id: string; expression: string; inputs: Record<string, string> }]
    expect(request.expression).toBe("input1.length > 3")
    expect(request.inputs).toEqual({ input1: "hello" })

    fromIframe({ id: request.id, ok: true, result: true })
    await expect(p).resolves.toEqual({ ok: true, result: true })
    expect(lastIframe()).toBeNull() // cleaned up
  })

  test("ignores messages that don't come from its own iframe", async () => {
    const p = evaluateConditionInSandbox("false", { input1: "" }, { timeoutMs: 100 })
    const f = lastIframe()!
    const post = jest.spyOn(f.contentWindow as Window, "postMessage")
    fromIframe({ ready: true })
    const [request] = post.mock.calls[0] as [{ id: string }]
    // Spoofed answer from another window (e.g. the page itself) must not be accepted.
    window.dispatchEvent(new MessageEvent("message", { data: { id: request.id, ok: true, result: true }, source: window }))
    await expect(p).resolves.toEqual({ ok: false, error: "sandbox did not respond" })
  })

  test("times out if the sandbox never answers, and removes the iframe", async () => {
    await expect(evaluateConditionInSandbox("true", { input1: "" }, { timeoutMs: 30 })).resolves.toEqual({
      ok: false,
      error: "sandbox did not respond",
    })
    expect(lastIframe()).toBeNull()
  })

  test("passes the sandbox's error through", async () => {
    const p = evaluateConditionInSandbox("syntax error (", { input1: "" })
    const f = lastIframe()!
    const post = jest.spyOn(f.contentWindow as Window, "postMessage")
    fromIframe({ ready: true })
    const [request] = post.mock.calls[0] as [{ id: string }]
    fromIframe({ id: request.id, ok: false, error: "Unexpected identifier 'error'" })
    await expect(p).resolves.toEqual({ ok: false, error: "Unexpected identifier 'error'" })
  })
})

describe("evaluateConditionInSandbox — defensive handling", () => {
  afterEach(() => document.querySelectorAll("iframe").forEach((f) => f.remove()))

  test("ignores answers for a different request id, and normalizes a malformed error", async () => {
    const p = evaluateConditionInSandbox("true", { input1: "" })
    const f = document.querySelector("iframe") as HTMLIFrameElement
    const post = jest.spyOn(f.contentWindow as Window, "postMessage")
    const send = (data: unknown) => window.dispatchEvent(new MessageEvent("message", { data, source: f.contentWindow as Window }))
    send({ ready: true })
    const [request] = post.mock.calls[0] as [{ id: string }]
    send({ id: "someone-else", ok: true, result: true }) // not ours → ignored
    send({ id: request.id, ok: false, error: { not: "a string" } })
    await expect(p).resolves.toEqual({ ok: false, error: "evaluation failed" })
  })
})
