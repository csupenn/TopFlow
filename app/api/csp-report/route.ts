/**
 * CSP violation report sink — receives reports from `report-uri` (legacy JSON) and `report-to`
 * (Reporting API batches) while the policy runs in report-only mode.
 *
 * Privacy: reports can carry full document URLs, blocked URLs with query strings, and script
 * samples — i.e. user data. We log ONLY the violated directive and the blocked ORIGIN (or a CSP
 * keyword such as 'inline'/'eval', or a bare scheme such as `data:`). No paths, queries, document
 * URLs or samples. See app/api/execute-workflow/__tests__/log-privacy.test.ts for the same rule.
 *
 * Abuse: unauthenticated by nature (browsers send it), so it is size-capped and rate limited.
 */

import { RateLimiter, rateLimitKey } from "@/lib/security/rate-limit"
import { createUpstashStore } from "@/lib/security/upstash-rate-limit-store"
import { extractSummaries } from "@/lib/security/csp-report"

const MAX_BODY_BYTES = 8 * 1024

const limiter = new RateLimiter({
  limit: 30,
  windowMs: 60_000,
  store: createUpstashStore() ?? undefined,
})

export async function POST(req: Request) {
  const clientIp = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim()
  const rl = await limiter.check(`csp:${rateLimitKey(clientIp)}`)
  if (!rl.allowed) return new Response(null, { status: 429 })

  const declared = Number(req.headers.get("content-length") || "0")
  if (declared > MAX_BODY_BYTES) return new Response(null, { status: 413 })
  const text = await req.text()
  if (text.length > MAX_BODY_BYTES) return new Response(null, { status: 413 })

  let payload: unknown
  try {
    payload = JSON.parse(text)
  } catch {
    return new Response(null, { status: 400 })
  }

  for (const s of extractSummaries(payload)) {
    console.warn("[csp-report]", s)
  }
  return new Response(null, { status: 204 })
}
