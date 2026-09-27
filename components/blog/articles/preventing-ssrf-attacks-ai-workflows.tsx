import { Lock, AlertTriangle, CheckCircle2, XCircle, ExternalLink } from "lucide-react"

export function SSRFPreventionContent() {
  return (
    <div className="space-y-6 text-muted-foreground leading-relaxed">
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Updated June 17, 2026 — a bypass we found</h3>
        <p className="text-sm">
          The guard described here had a gap: IPv4-mapped IPv6 addresses in the hex form the URL parser produces
          slipped past it. It&apos;s fixed, and the story is below in &quot;The Bypass Our Tests Couldn&apos;t See&quot;.
          The builder&apos;s validation panel also had its own, weaker copy of these rules; it now calls this
          guard directly.
        </p>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">What is SSRF?</h2>
      <p>
        Server-Side Request Forgery (SSRF) is a vulnerability that lets an attacker make the server
        issue HTTP requests to destinations they choose — not the application developer. In AI agent
        workflows that expose an HTTP-request node, every user-configured URL is a potential SSRF
        vector.
      </p>

      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Real-World Impact
        </h3>
        <ul className="space-y-2 list-disc list-inside">
          <li>Steal AWS/GCP credentials from the cloud metadata endpoint (169.254.169.254)</li>
          <li>Enumerate internal services not exposed to the internet</li>
          <li>Access databases via private IP ranges (10.x, 172.16.x, 192.168.x)</li>
          <li>Read SSH keys and service tokens from cloud provider metadata</li>
        </ul>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">TopFlow's SSRF Prevention Strategy</h2>
      <p>
        TopFlow's HTTP-request node lets users make arbitrary outbound calls. The guard lives in{" "}
        <code className="text-primary text-sm bg-muted px-1 rounded">lib/security/ssrf.ts</code>{" "}
        (
        <a
          href="https://github.com/csupenn/topflow/blob/main/lib/security/ssrf.ts"
          className="text-primary hover:underline inline-flex items-center gap-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          view on GitHub
          <ExternalLink className="w-3 h-3" />
        </a>
        ) and is applied by the execution engine before any network call is made.
      </p>

      <div className="space-y-4 my-8">
        {[
          {
            layer: "1. Scheme Allowlist",
            description: "Only http:// and https:// are accepted. file://, ftp://, gopher://, and any other scheme are rejected immediately.",
            icon: Lock,
          },
          {
            layer: "2. Loopback Blocking",
            description: "localhost, 127.0.0.0/8, ::1, ip6-localhost, and ip6-loopback are all blocked — including loopback written as IPv4-mapped IPv6 in any form (e.g. [::ffff:127.0.0.1], which the URL parser rewrites to [::ffff:7f00:1]).",
            icon: XCircle,
          },
          {
            layer: "3. Private IP Blocking",
            description: "RFC 1918 ranges (10.x, 172.16–31.x, 192.168.x), CGNAT (100.64–127.x), and multicast/reserved ranges are blocked — also when embedded in an IPv6 address, and in decimal, octal or hex spellings.",
            icon: AlertTriangle,
          },
          {
            layer: "4. Cloud Metadata Blocking",
            description: "169.254.169.254 (AWS/Azure metadata), metadata.google.internal, and any *.internal / *.local hostname are blocked.",
            icon: AlertTriangle,
          },
          {
            layer: "5. Provenance-Aware Exemption",
            description: "Engine-generated routes (e.g. the scanner's /api/scan/github) bypass the SSRF check because they are set by the engine, not user input. User-supplied URLs are never trusted.",
            icon: CheckCircle2,
          },
        ].map((item, idx) => (
          <div key={idx} className="bg-card border border-border rounded-lg p-4 flex items-start gap-4">
            <item.icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">{item.layer}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">The Code</h2>
      <p>
        The guard is a pure function with no side effects — easy to test and trivial to call from
        the execution engine. There are two entry points: a throwing variant for the hot path, and a
        non-throwing variant for validation UI.
      </p>

      <pre className="bg-panel border border-border rounded-lg p-4 overflow-x-auto text-sm my-6">
        <code>{`// lib/security/ssrf.ts

export class SsrfBlockedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "SsrfBlockedError"
  }
}

/** Non-throwing variant — used by validation UI */
export function checkOutboundUrl(rawUrl: string): { safe: boolean; reason?: string } {
  let u: URL
  try { u = new URL(rawUrl) } catch {
    return { safe: false, reason: \`invalid URL "\${rawUrl}"\` }
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    return { safe: false, reason: \`blocked scheme "\${u.protocol}"\` }
  }
  if (isBlockedHost(u.hostname)) {
    return { safe: false, reason: \`blocked host "\${u.hostname}"\` }
  }
  return { safe: true }
}

/** Throwing variant — used by the execution engine */
export function assertSafeOutboundUrl(rawUrl: string): void {
  const result = checkOutboundUrl(rawUrl)
  if (!result.safe) throw new SsrfBlockedError(\`SSRF blocked: \${result.reason}\`)
}

// Private IP ranges covered by isBlockedIpv4():
//   0.0.0.0/8  loopback "this host"
//   10.0.0.0/8  RFC 1918 private
//   127.0.0.0/8  loopback
//   169.254.0.0/16  link-local (AWS/Azure metadata lives here)
//   172.16.0.0/12  RFC 1918 private
//   192.168.0.0/16  RFC 1918 private
//   100.64.0.0/10  CGNAT
//   224.0.0.0/4+  multicast / reserved`}</code>
      </pre>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">The Provenance Distinction</h2>
      <p>
        TopFlow's GitHub Security Scanner calls an internal route — <code className="text-primary text-sm bg-muted px-1 rounded">/api/scan/github</code> — from
        within the workflow engine. If the SSRF guard checked this URL, it would block the feature
        (it's a relative path, not a public hostname).
      </p>
      <p className="mt-4">
        The fix is provenance: the engine knows it generated this URL, so it never passes it through{" "}
        <code className="text-primary text-sm bg-muted px-1 rounded">assertSafeOutboundUrl</code>.
        Only URLs that originated from user-configured node data are checked. This is documented in
        the source file comment and is the correct architectural answer — never add a special-case
        bypass inside the guard itself.
      </p>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">The Bypass Our Tests Couldn&apos;t See</h2>
      <p>
        During an audit we pointed a second piece of code — the builder&apos;s validation panel — at this guard and
        tested it with real URLs. One case failed: <code className="text-primary text-sm bg-muted px-1 rounded">http://[::ffff:169.254.169.254]/</code>, the cloud metadata
        address written as an IPv4-mapped IPv6 address. Our guard recognized that form. Our unit test even proved it.
      </p>
      <p>
        The catch: the engine never hands the guard the string the user typed. It parses the URL first, and Node&apos;s
        URL parser rewrites the host to <code className="text-primary text-sm bg-muted px-1 rounded">[::ffff:a9fe:a9fe]</code> — hex, not dotted decimal. The guard only
        matched the dotted form, so the rewritten address was allowed. The unit test passed because it fed the guard
        the dotted string directly, skipping the parser that production input always goes through.
      </p>
      <p>
        The fix decodes the hex groups back to an IPv4 address and applies the same rules; the regression tests now call{" "}
        <code className="text-primary text-sm bg-muted px-1 rounded">checkOutboundUrl</code> with whole URLs, exactly as the engine does. We verified the fix in
        production: the same payload now returns <code className="text-primary text-sm bg-muted px-1 rounded">SSRF blocked</code>. Tutorial 01&apos;s Lab 6 lets you
        reproduce the parser behavior yourself.
      </p>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Honest Limitation: DNS Rebinding</h3>
        <p className="text-sm">
          This guard validates hostnames and IP literals only — it does not resolve DNS. An attacker
          who controls a public domain can configure it to resolve to a private IP (DNS rebinding).
          The first request clears the check; a second request (after a TTL flip) hits the internal
          target. Mitigation requires DNS resolution at validation time or a network-level egress
          filter. This is a documented residual risk; see Tutorial 01 for the full attack tree.
        </p>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Key Takeaways</h2>

      <div className="bg-card border border-border rounded-lg p-6 my-6">
        <ul className="space-y-2 list-disc list-inside">
          <li>Use a blocklist for known-bad ranges (private IPs, cloud metadata), not an allowlist for every legitimate API</li>
          <li>Separate user-controlled URLs from engine-generated routes — don't bypass the guard, use provenance</li>
          <li>Provide both a throwing and non-throwing variant so validation UI and the hot path share one implementation — and make sure they actually do</li>
          <li>Test the guard with production-shaped input: whole URLs through the same parser the engine uses, not hand-typed host strings</li>
          <li>Document DNS-rebinding as a residual risk — honesty in security docs builds more trust than false completeness</li>
          <li>Layer the guard with rate limiting and cycle detection; SSRF protection is one layer, not a complete defense</li>
        </ul>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 my-6 space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Go Deeper</h3>
        <p className="text-sm">
          Tutorial 01 covers this guard in full — threat model, attack trees (including the ones not fully
          closed), design trade-offs, and a hands-on lab where you attempt an SSRF against a local
          TopFlow instance.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
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
            href="https://github.com/csupenn/topflow/blob/main/lib/security/ssrf.ts"
            className="text-primary hover:underline inline-flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            lib/security/ssrf.ts on GitHub
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
