/**
 * Security response headers — the single source of truth.
 *
 * Used by next.config.mjs (`headers()`) so the same headers apply in `next start`, previews and
 * production, and imported by tests. (Previously they lived in vercel.json, which local builds
 * ignore — so they could be neither tested nor verified locally.)
 *
 * CommonJS on purpose: next.config.mjs and Jest can both load it without a build step.
 *
 * CSP rollout: REPORT-ONLY first. Browsers report violations to /api/csp-report without blocking
 * anything; once reports show the policy doesn't break the app, flip CSP_REPORT_ONLY to false.
 *
 * Known trade-offs in this policy (see docs/notes wrap-up tracker, A3):
 * - script-src 'unsafe-inline': Next.js App Router injects inline bootstrap scripts and the site
 *   renders inline JSON-LD. The strict alternative is a per-request nonce via middleware, which
 *   forces dynamic rendering of every page. Deferred as a separate decision.
 * - NO 'unsafe-eval' on the site. The Conditional node's "Test" button needs eval, so it runs in
 *   public/sandbox/condition-eval.html — a sandboxed, opaque-origin iframe with its OWN policy
 *   (SANDBOX_CSP below): eval allowed there only, no network, no access to the app's storage.
 */

const CSP_REPORT_ONLY = true
const CSP_REPORT_PATH = "/api/csp-report"

const CSP_DIRECTIVES = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "font-src": ["'self'", "data:"],
  "connect-src": ["'self'"],
  "media-src": ["'self'", "data:", "blob:"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
  "report-uri": [CSP_REPORT_PATH],
  "report-to": ["csp"],
}

// Policy for the condition-tester sandbox page only. Eval runs in a Worker created from a blob.
// default-src 'none' → no fetch/XHR/images: sandboxed code can't send anything anywhere.
const SANDBOX_CSP_DIRECTIVES = {
  "default-src": ["'none'"],
  "script-src": ["'unsafe-inline'", "'unsafe-eval'", "blob:"],
  "worker-src": ["blob:"],
  "base-uri": ["'none'"],
  "form-action": ["'none'"],
  "frame-ancestors": ["'self'"],
}

function buildCsp(directives) {
  return Object.entries(directives)
    .map(([name, values]) => `${name} ${values.join(" ")}`)
    .join("; ")
}

function securityHeaderRules() {
  return [
    {
      source: "/(.*)",
      headers: [
        {
          key: CSP_REPORT_ONLY ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy",
          value: buildCsp(CSP_DIRECTIVES),
        },
        { key: "Reporting-Endpoints", value: `csp="${CSP_REPORT_PATH}"` },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    },
    {
      source: "/api/(.*)",
      headers: [{ key: "Cache-Control", value: "no-store, no-cache, must-revalidate" }],
    },
    // MUST stay last: Next.js lets later rules override earlier ones for the same header key.
    {
      source: "/sandbox/:path*",
      headers: [
        { key: "Content-Security-Policy", value: SANDBOX_CSP },
        { key: "Content-Security-Policy-Report-Only", value: SANDBOX_CSP },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Referrer-Policy", value: "no-referrer" },
      ],
    },
  ]
}

const SANDBOX_CSP = buildCsp(SANDBOX_CSP_DIRECTIVES)

module.exports = { CSP_REPORT_ONLY, CSP_REPORT_PATH, CSP_DIRECTIVES, SANDBOX_CSP, buildCsp, securityHeaderRules }
