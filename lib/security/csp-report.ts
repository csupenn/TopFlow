/**
 * Parsing for CSP violation reports (legacy `report-uri` JSON and Reporting API batches).
 *
 * Privacy: reports can carry full document URLs, blocked URLs with query strings, and script
 * samples — i.e. user data. Summaries keep ONLY the violated directive and the blocked ORIGIN (or a
 * CSP keyword such as 'inline'/'eval', or a bare scheme such as `data:`).
 */

const CSP_KEYWORDS = new Set(["inline", "eval", "wasm-eval", "trusted-types-policy", "trusted-types-sink", "self"])

/** Reduce a blocked value to something safe to log: an origin, a CSP keyword, or a bare scheme. */
export function summarizeBlocked(value: unknown): string {
  if (typeof value !== "string" || !value) return "unknown"
  if (CSP_KEYWORDS.has(value)) return value
  try {
    const u = new URL(value)
    if (u.protocol === "http:" || u.protocol === "https:") return u.origin
    return u.protocol // e.g. "data:", "blob:"
  } catch {
    return "other"
  }
}

export function summarizeDirective(value: unknown): string {
  return typeof value === "string" && /^[a-z-]{1,40}$/.test(value) ? value : "unknown"
}

export type CspReportSummary = { directive: string; blocked: string }

export function extractSummaries(payload: unknown): CspReportSummary[] {
  // Reporting API: [{ type: "csp-violation", body: { effectiveDirective, blockedURL, … } }, …]
  if (Array.isArray(payload)) {
    return payload
      .filter((r) => r && typeof r === "object" && (r as { type?: unknown }).type === "csp-violation")
      .slice(0, 20)
      .map((r) => {
        const body = ((r as { body?: Record<string, unknown> }).body ?? {}) as Record<string, unknown>
        return { directive: summarizeDirective(body.effectiveDirective), blocked: summarizeBlocked(body.blockedURL) }
      })
  }
  // Legacy report-uri: { "csp-report": { "effective-directive", "blocked-uri", … } }
  const report = (payload as { "csp-report"?: Record<string, unknown> } | null)?.["csp-report"]
  if (report && typeof report === "object") {
    return [
      {
        directive: summarizeDirective(report["effective-directive"] ?? report["violated-directive"]),
        blocked: summarizeBlocked(report["blocked-uri"]),
      },
    ]
  }
  return []
}

