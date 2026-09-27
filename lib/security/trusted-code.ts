/**
 * H17 containment: which JavaScript/Tool node code the server is allowed to run.
 *
 * The engine runs node code with `new Function`, which is NOT a sandbox — code can reach Node
 * globals (`process.env` secrets, `fetch`). Until a real isolate ships (tracker T3), the hosted
 * service runs only code that is byte-identical to code shipped in our own templates. Users' inputs
 * still flow in, but only as function arguments; custom code is refused with a clear message.
 */

import { getSecurityTemplates } from "@/lib/security-templates"
import { getDefaultTemplates } from "@/lib/storage"
import { GITHUB_SCANNER_NODES } from "@/lib/templates/github-scanner"

export const UNTRUSTED_CODE_MESSAGE =
  "Custom JavaScript/Tool code is disabled on the hosted TopFlow service while server-side isolation is " +
  "being built. Built-in template code still runs. To run custom code, export the workflow as code and run " +
  "it on your own infrastructure."

type CodeNode = { type?: string; data?: unknown }

function collect(): Set<string> {
  const nodes: CodeNode[] = [
    ...getSecurityTemplates().flatMap((t) => t.nodes as CodeNode[]),
    ...getDefaultTemplates().flatMap((t) => t.nodes as CodeNode[]),
    ...(GITHUB_SCANNER_NODES as CodeNode[]),
  ]
  const codes = new Set<string>()
  for (const n of nodes) {
    if (n.type !== "javascript" && n.type !== "tool") continue
    const code = (n.data as { code?: unknown } | undefined)?.code
    if (typeof code === "string") codes.add(code)
  }
  return codes
}

let trusted: Set<string> | undefined
const trustedSet = () => (trusted ??= collect())

/** True for code shipped in a built-in template (exact match), or no code (engine default). */
export function isTrustedCode(code: unknown): boolean {
  if (code === undefined || code === null || code === "") return true
  return typeof code === "string" && trustedSet().has(code)
}

export function trustedCodeCount(): number {
  return trustedSet().size
}
