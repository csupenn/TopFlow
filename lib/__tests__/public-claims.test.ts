/**
 * @jest-environment node
 */
import { readFileSync, readdirSync, statSync } from "fs"
import { join } from "path"

/**
 * Guard against privacy/security claims drifting ahead of the code again.
 *
 * Verified reality (Sept 2026): workflows and API keys are STORED only in the browser, but are SENT to
 * the server for each execution (used in memory, never stored or logged); the site sets NO cookies.
 * These phrasings contradicted that and were removed; they must not come back.
 *
 */
const FALSE_CLAIMS: Array<[string, RegExp]> = [
  ["keys/workflows 'never touch/sent to our servers'", /never (touch|sent to)( (our|topflow))? servers/i],
  ["data 'never leaves' the browser (without the execution caveat)", /never leaves? your (browser|machine|device)(?! unless| on its own)/i],
  ["'zero data storage/collection' (the browser stores data; say 'zero server-side storage')", /zero data (storage|collection)/i],
  ["'no personal data is collected/processed/logged'", /no (personal )?data is (collected|processed|logged)/i],
  ["'we use cookies' (the site sets none)", /we use (analytics )?cookies/i],
  ["JavaScript described as sandboxed (new Function is not a sandbox — H17)", /sandboxed (javascript|execution|environment)|sandboxed execution ensures/i],
  ["'TLS 1.3 for all / minimum / enforced' (production also accepts TLS 1.2 — measured)", /TLS 1\.3 (for all|minimum|enforced)|HTTPS\/TLS 1\.3|TLS 1\.3 for all/i],
  // The GitHub scanner checks dependencies against OSV.dev (+ SECURITY.md / Dependabot). It does not analyze
  // source code, assess compliance, or measure code quality (lib/osv/scanner.ts).
  ["scanner 'OWASP Top 10 detection' (it only covers A06, vulnerable components)", /OWASP Top 10 (vulnerability )?detection/i],
  ["scanner 'compliance checks' / 'GDPR ready' (nothing assesses compliance)", /compliance checks|GDPR[ -]ready/i],
  ["scanner 'code quality metrics' (not measured)", /code quality metrics/i],
]

/** Strip JSX/HTML tags and collapse whitespace so wrapped sentences are matched as written. */
const normalize = (text: string) => text.replace(/<[^>]+>/g, "").replace(/\s+/g, " ")

export function findFalseClaims(text: string): string[] {
  const t = normalize(text)
  return FALSE_CLAIMS.filter(([, re]) => re.test(t)).map(([label]) => label)
}

describe("claim matcher", () => {
  test.each([
    "All analysis is client-side. Your workflows and API keys never touch our servers.",
    "✅ Your API keys (never sent to our servers)",
    "<strong>Your data NEVER leaves your browser</strong>.",
    "Privacy-first platform with GDPR compliance, zero data storage, BYOK model.",
    "<strong>We use cookies</strong> for analytics to improve our demo. No personal data is collected.",
    "because <strong>no personal data is processed server-side</strong>.",
    "OWASP Top 10 vulnerability detection",
    "Compliance checks (GDPR, SOC 2)",
    "<span>GDPR Ready</span>",
    "Code Quality Metrics",
  ])("flags the old wording: %s", (text) => {
    expect(findFalseClaims(text)).not.toEqual([])
  })

  test.each([
    "Workflows and API keys are stored only in your browser. When you run a workflow, it's sent over HTTPS to our server, used in memory for that request, and never stored or logged.",
    "This data <strong>never leaves your device</strong> unless you explicitly execute a workflow.",
    "It uses your browser's localStorage, which never leaves your\n device on its own:",
    "zero server-side storage",
    "<strong>No cookies here.</strong> We use cookieless, anonymous page analytics",
    "Compliance: nothing here assesses GDPR, SOC 2 or HIPAA",
    "OWASP A06: vulnerable and outdated components",
  ])("accepts accurate wording: %s", (text) => {
    expect(findFalseClaims(text)).toEqual([])
  })
})

describe("public surfaces contain no known false claims", () => {
  const files: string[] = [join(process.cwd(), "README.md")]
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name)
      if (name === "node_modules" || name === "__tests__") continue
      if (statSync(p).isDirectory()) walk(p)
      else if (/\.(tsx?|md)$/.test(name)) files.push(p)
    }
  }
  ;["app", "components", "lib/docs", "lib/blog"].forEach((d) => walk(join(process.cwd(), d)))

  test("app/, components/, lib/docs, lib/blog and README.md", () => {
    const offenders = files
      .map((f) => [f.replace(process.cwd() + "/", ""), findFalseClaims(readFileSync(f, "utf8"))] as const)
      .filter(([, hits]) => hits.length > 0)
    expect(offenders).toEqual([])
  })
})
