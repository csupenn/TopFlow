import { Shield, Lock, AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react"

export function SecurityLayersBlogContent() {
  return (
    <div className="space-y-6 text-muted-foreground leading-relaxed">
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Updated June 17, 2026 — corrections</h3>
        <p className="text-sm">
          We audited this post against the code. Changes: categories now use the <strong>OWASP Top 10 (2021)</strong>{" "}
          numbering (the original mixed 2017 and 2021 names); we removed claims of Zod validation at the API boundary
          and a Content Security Policy — neither existed then — and corrected a claim that every connection uses TLS
          1.3 (the site accepts TLS 1.2 and 1.3). A CSP now runs in <em>report-only</em> mode, a new A09 section covers
          logging, and A03 describes a serious issue we found and contained during this audit: workflow code could
          reach server secrets. Gaps that remain are named in the text.
        </p>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">Security as a Showcase Priority</h2>
      <p>
        As a former CISO, I built TopFlow not just as a functional AI workflow builder, but as a demonstration of
        production-grade security architecture. Every line of code reflects 15 years of security leadership experience.
      </p>
      <p>
        This post covers TopFlow's 5-layer defense-in-depth model and how it maps to the OWASP Top 10. All referenced
        source files are in the{" "}
        <a
          href="https://github.com/csupenn/topflow"
          className="text-primary hover:underline inline-flex items-center gap-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          public GitHub repo
          <ExternalLink className="w-3 h-3" />
        </a>
        .
      </p>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">The 5-Layer Security Model</h2>
      <p>
        TopFlow uses a defense-in-depth approach with five distinct security layers. Each layer addresses specific
        threats, and together they provide comprehensive protection:
      </p>

      <div className="grid gap-4 my-8">
        {[
          {
            layer: "Layer 1: Client-Side",
            icon: Shield,
            controls: "React output escaping, Content Security Policy (report-only; enforcement next), AES-256-GCM encryption of API keys at rest, condition tests in an isolated sandbox",
          },
          { layer: "Layer 2: Transport", icon: Lock, controls: "HTTPS only (TLS 1.2 and 1.3), HSTS" },
          {
            layer: "Layer 3: API Gateway",
            icon: AlertTriangle,
            controls: "Sliding-window rate limiting (in-memory ↔ Upstash Redis), DDoS protection",
          },
          {
            layer: "Layer 4: Execution",
            icon: CheckCircle2,
            controls: "SSRF prevention (provenance-aware), cycle detection, timeout enforcement, custom JavaScript disabled on the hosted service (built-in template code only) until a real isolate ships",
          },
          {
            layer: "Layer 5: External APIs",
            icon: Lock,
            controls: "HTTPS-only, user-held credentials (BYOK), no platform-managed secrets",
          },
        ].map((item, idx) => (
          <div key={idx} className="bg-card border border-border rounded-lg p-4 flex items-start gap-4">
            <item.icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">{item.layer}</h3>
              <p className="text-sm text-muted-foreground">{item.controls}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">OWASP Top 10 Coverage</h2>
      <p>Here&apos;s how TopFlow addresses key categories of the OWASP Top 10 (2021), with implementation details and the gaps that remain:</p>

      <div className="space-y-6 my-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-chart-3" />
            A02:2021 — Cryptographic Failures (formerly Sensitive Data Exposure)
          </h3>
          <p className="mb-4">
            <strong className="text-foreground">Risk:</strong> PII leakage, API key exposure, data breaches
          </p>
          <p className="mb-4">
            <strong className="text-foreground">Mitigation:</strong>
          </p>
          <ul className="space-y-2 list-disc list-inside ml-4">
            <li>No server-side storage — workflow data and keys are sent only to run a workflow, used in memory, and never stored or logged</li>
            <li>
              API keys encrypted at rest with AES-256-GCM (Web Crypto API) before being written to
              localStorage — see{" "}
              <a
                href="https://github.com/csupenn/topflow/blob/main/lib/security/encryption.ts"
                className="text-primary hover:underline inline-flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                lib/security/encryption.ts
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>HTTPS for all connections (TLS 1.2 and 1.3); HSTS enforces HTTPS</li>
            <li>
              <strong className="text-foreground">Honest limitation:</strong> a client-held key is not
              XSS-proof — a script running in the page can read both the ciphertext and the key from
              localStorage. The encryption protects against plaintext-at-rest inspection and casual
              exfiltration, not against a script-injection attacker.
            </li>
          </ul>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-chart-3" />
            A03:2021 — Injection
          </h3>
          <p className="mb-4">
            <strong className="text-foreground">Risk:</strong> SQL injection, command injection, XSS attacks
          </p>
          <p className="mb-4">
            <strong className="text-foreground">Mitigation:</strong>
          </p>
          <ul className="space-y-2 list-disc list-inside ml-4">
            <li>No database, so no database queries — SQL injection has nothing to target</li>
            <li>React auto-escapes JSX output by default</li>
            <li>The execution route strips <code className="text-primary text-sm bg-muted px-1 rounded">&lt;</code> and <code className="text-primary text-sm bg-muted px-1 rounded">&gt;</code> from string inputs and validates
              workflow structure (required nodes, configuration, cycles) before anything runs</li>
            <li>The visual condition builder emits user values as JSON string literals, so a value can&apos;t break out
              into code (fixed in this update)</li>
            <li>
              <strong className="text-foreground">Honest limitations:</strong> there is no schema validation (e.g. Zod) of
              the request at the API boundary yet. And until this update, JavaScript, Tool and condition code ran on
              the server via <code className="text-primary text-sm bg-muted px-1 rounded">new Function()</code> —
              which could reach server secrets. We found and contained that: the hosted service now runs only
              built-in template code, and conditions are interpreted by a safe parser instead of being evaluated.
              A real isolate is next.
            </li>
          </ul>
          <pre className="bg-panel border border-border rounded-lg p-4 overflow-x-auto text-sm mt-4">
            <code>{`// app/api/execute-workflow/route.ts — string inputs are stripped of < and >
function sanitizeInput(input: any, skipKeys: string[] = []): any {
  if (typeof input === "string") return input.replace(/[<>]/g, "")
  if (Array.isArray(input)) return input.map((item) => sanitizeInput(item, skipKeys))
  // …objects are sanitized key by key (code/schema/output fields skipped)
}`}</code>
          </pre>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-chart-3" />
            A05:2021 — Security Misconfiguration
          </h3>
          <p className="mb-4">
            <strong className="text-foreground">Risk:</strong> Exposed endpoints, verbose errors, default credentials
          </p>
          <p className="mb-4">
            <strong className="text-foreground">Mitigation:</strong>
          </p>
          <ul className="space-y-2 list-disc list-inside ml-4">
            <li>
              Security headers from one source (<code className="text-primary text-sm bg-muted px-1 rounded">lib/security/security-headers.cjs</code>): X-Frame-Options,
              X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and a Content Security Policy in{" "}
              <strong className="text-foreground">report-only</strong> mode while violation reports are reviewed
            </li>
            <li>Error messages don't leak stack traces in production</li>
            <li>No default credentials — BYOK model means no platform-managed secrets exist</li>
            <li>
              <code className="text-primary text-sm bg-muted px-1 rounded">typescript.ignoreBuildErrors</code> removed from{" "}
              <code className="text-primary text-sm bg-muted px-1 rounded">next.config.mjs</code>; CI enforces
              type-check on every PR, plus tests with blocking coverage thresholds on the security modules
            </li>
          </ul>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-chart-3" />
            A09:2021 — Security Logging and Monitoring Failures
          </h3>
          <p className="mb-4">
            <strong className="text-foreground">Risk:</strong> too little logging to notice attacks — or logs that
            themselves leak sensitive data
          </p>
          <p className="mb-4">
            <strong className="text-foreground">Mitigation:</strong>
          </p>
          <ul className="space-y-2 list-disc list-inside ml-4">
            <li>Execution logs record counts, IDs and error types — never workflow content, inputs or keys. A test
              plants a canary in every user-controlled field and fails if it reaches the logs. (Until this update
              the logs did contain user input.)</li>
            <li>CSP violation reports are logged as directive + blocked origin only, size-capped and rate limited</li>
            <li>
              <strong className="text-foreground">Honest limitation:</strong> there is no alerting or security
              dashboard yet — logs are reviewed manually.
            </li>
          </ul>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-chart-3" />
            A10:2021 — Server-Side Request Forgery (SSRF)
          </h3>
          <p className="mb-4">
            <strong className="text-foreground">Risk:</strong> Internal network access, cloud metadata credential theft
          </p>
          <p className="mb-4">
            <strong className="text-foreground">Mitigation:</strong>
          </p>
          <ul className="space-y-2 list-disc list-inside ml-4">
            <li>HTTPS/HTTP-only scheme allowlist — file://, ftp://, and all other schemes are rejected</li>
            <li>Private IP blocklist: 10.x, 172.16–31.x, 192.168.x, 127.x, 169.254.x, CGNAT, multicast/reserved</li>
            <li>Cloud metadata blocking: 169.254.169.254, metadata.google.internal, *.internal, *.local</li>
            <li>IPv4-mapped IPv6 blocked in any spelling — tests call the guard through the URL parser, the way production does (a hex-form bypass was found and fixed during this audit)</li>
            <li>The builder&apos;s validation panel calls the same guard, so what it shows matches what the server enforces</li>
            <li>
              Provenance-aware exemption: engine-generated routes (e.g.{" "}
              <code className="text-primary text-sm bg-muted px-1 rounded">/api/scan/github</code>) bypass
              the check; only user-supplied URLs are validated — see{" "}
              <a
                href="https://github.com/csupenn/topflow/blob/main/lib/security/ssrf.ts"
                className="text-primary hover:underline inline-flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                lib/security/ssrf.ts
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Production-Grade Controls</h2>
      <p>Beyond OWASP, TopFlow implements additional security controls:</p>

      <ul className="space-y-3 my-6">
        <li className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-chart-3 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-foreground">Durable Rate Limiting:</strong> Sliding-window limiter
            (10 req/min per IP) backed by{" "}
            <a
              href="https://github.com/csupenn/topflow/blob/main/lib/security/rate-limit.ts"
              className="text-primary hover:underline inline-flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              a pluggable store interface
              <ExternalLink className="w-3 h-3" />
            </a>
            : <code className="text-primary text-sm bg-muted px-1 rounded">MemoryRateLimitStore</code> in
            dev/test (injectable clock for deterministic unit tests),{" "}
            <code className="text-primary text-sm bg-muted px-1 rounded">UpstashRateLimitStore</code> in
            production when Upstash is configured (Redis-backed, durable across serverless instances; client IPs are
            HMAC-hashed before they reach Redis)
          </div>
        </li>
        <li className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-chart-3 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-foreground">Timeout Enforcement:</strong> 30-second maximum execution
            time prevents resource exhaustion
          </div>
        </li>
        <li className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-chart-3 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-foreground">Cycle Detection:</strong> DFS pre-execution check rejects
            cyclic graphs before any node runs — prevents infinite-loop resource exhaustion
          </div>
        </li>
        <li className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-chart-3 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-foreground">Structural Validation:</strong> every workflow is checked for
            required nodes, valid configuration and SSRF-safe URLs before execution (schema validation of the raw
            request is a planned addition)
          </div>
        </li>
      </ul>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Conclusion</h2>
      <p>
        Building secure applications isn't about adding security as an afterthought — it's about designing security into
        every layer from the start. TopFlow demonstrates that former CISOs can still code, and that security expertise
        translates directly into better architecture decisions.
      </p>

      <div className="bg-card border border-border rounded-lg p-6 my-6 space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Go Deeper</h3>
        <p className="text-sm">
          The AI Security Tutorial series covers each of these controls in full — threat models,
          attack trees, design trade-offs, and hands-on labs. Tutorials live in the GitHub repo
          alongside the code they document.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a
            href="https://github.com/csupenn/topflow/blob/main/docs/AI-Security/osv-scanner/01-ssrf-cycle-detection-rate-limiting-2026-06-14-draft.md"
            className="text-primary hover:underline inline-flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tutorial 01 — SSRF, Cycle Detection & Rate Limiting
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://github.com/csupenn/topflow/blob/main/docs/AI-Security/osv-scanner/02-secrets-at-rest-byok-key-encryption-2026-06-14-draft.md"
            className="text-primary hover:underline inline-flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tutorial 02 — Secrets at Rest (AES-256-GCM)
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://github.com/csupenn/topflow/blob/main/docs/AI-Security/osv-scanner/04-durable-rate-limiting-2026-06-14-draft.md"
            className="text-primary hover:underline inline-flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tutorial 04 — Durable Rate Limiting
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://github.com/csupenn/topflow"
            className="text-primary hover:underline inline-flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub — csupenn/topflow
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <p className="text-sm">
        <strong className="text-foreground">Leadership perspective:</strong>{" "}
        <a
          href="https://www.charliesu.com/blog/ciso-framework-ai-defense-in-depth"
          className="text-primary hover:underline inline-flex items-center gap-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          turn these controls into an evidence-led AI security review
          <ExternalLink className="w-3 h-3" />
        </a>{" "}
        (charliesu.com)
      </p>
    </div>
  )
}
