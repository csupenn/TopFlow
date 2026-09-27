/**
 * Evaluate a Conditional node expression for the builder's "Test" button WITHOUT running it in
 * the app's origin.
 *
 * Why: a condition can come from an imported or shared workflow. Evaluating it with new Function()
 * in the app page would give it access to localStorage (encrypted API keys and their key) and the
 * DOM. Instead it runs in public/sandbox/condition-eval.html inside <iframe sandbox="allow-scripts">
 * — an opaque origin with its own CSP (no network) — in a Worker with a timeout.
 *
 * Messages to an opaque-origin frame must use targetOrigin "*"; we only send the expression and the
 * test inputs (no secrets), and only accept replies whose `source` is our own iframe.
 */

export type SandboxResult = { ok: true; result: boolean } | { ok: false; error: string }

export const SANDBOX_SRC = "/sandbox/condition-eval.html"

let counter = 0

export function evaluateConditionInSandbox(
  expression: string,
  inputs: Record<string, string>,
  { timeoutMs = 3000, src = SANDBOX_SRC }: { timeoutMs?: number; src?: string } = {},
): Promise<SandboxResult> {
  return new Promise((resolve) => {
    const id = `cond-${Date.now()}-${++counter}`
    const frame = document.createElement("iframe")
    frame.setAttribute("sandbox", "allow-scripts") // never add allow-same-origin
    frame.setAttribute("src", src)
    frame.setAttribute("title", "Condition test sandbox")
    frame.setAttribute("aria-hidden", "true")
    frame.style.display = "none"

    const finish = (result: SandboxResult) => {
      clearTimeout(timer)
      window.removeEventListener("message", onMessage)
      frame.remove()
      resolve(result)
    }

    const onMessage = (event: MessageEvent) => {
      if (!frame.contentWindow || event.source !== frame.contentWindow) return
      const data = event.data as { ready?: boolean; id?: string; ok?: boolean; result?: unknown; error?: unknown }
      if (data?.ready) {
        frame.contentWindow.postMessage({ id, expression, inputs }, "*")
        return
      }
      if (data?.id !== id) return
      finish(
        data.ok === true
          ? { ok: true, result: Boolean(data.result) }
          : { ok: false, error: typeof data.error === "string" ? data.error : "evaluation failed" },
      )
    }

    const timer = setTimeout(() => finish({ ok: false, error: "sandbox did not respond" }), timeoutMs)
    window.addEventListener("message", onMessage)
    document.body.appendChild(frame)
  })
}
