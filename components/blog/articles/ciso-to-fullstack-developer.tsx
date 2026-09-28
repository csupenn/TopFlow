import { Shield, Code, CheckCircle2, ExternalLink, AlertTriangle, Brain } from "lucide-react"

export function CISOToFullStackContent() {
  return (
    <div className="space-y-6 text-muted-foreground leading-relaxed">
      <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">The Stereotype</h2>
      <p>
        There's a common assumption in tech: once you reach the C-suite in security, you stop coding. CISOs are strategic
        thinkers, boardroom translators, risk managers — not engineers. The idea that a CISO could sit down and build a
        production application from scratch is, to most people, implausible.
      </p>
      <p>
        I built TopFlow to prove that wrong. Four weeks, zero shortcuts, production-grade code. Here's what happened —
        and why it matters for where security is heading.
      </p>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Why Build at All?</h2>
      <p>
        After 15 years in security leadership, I noticed something uncomfortable: security leaders increasingly make
        decisions about systems they don't deeply understand. We review architecture diagrams. We approve threat models
        written by engineers. We sign off on controls we couldn't implement ourselves.
      </p>
      <p>
        That gap is fine — until it isn't. The moment you can't read the code, you can't really assess the risk. You're
        trusting someone else's summary of a summary.
      </p>
      <p>
        I wanted to close that gap. And I wanted to do it with AI systems specifically, because that's where the next
        decade of security challenges will live.
      </p>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">The 4-Week Build</h2>
      <p>
        TopFlow is a visual AI workflow builder — a drag-and-drop canvas where you connect nodes (LLMs, HTTP calls,
        JavaScript transforms, conditionals) into pipelines and execute them. It runs on Next.js 15, React 19, ReactFlow,
        and the Vercel AI SDK. No backend database. No stored user data. BYOK (Bring Your Own Key) for all AI providers.
      </p>
      <p>Here's how the four weeks actually went:</p>

      <div className="space-y-4 my-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary flex-shrink-0" />
            Week 1: Architecture & Threat Model First
          </h3>
          <p className="text-sm mb-3">
            I didn't open a code editor until I'd done a threat model. This sounds like security-leader behavior — and it
            is — but it also turned out to be good engineering. The decisions made in Week 1 shaped every line of code
            that followed.
          </p>
          <ul className="space-y-2 list-disc list-inside ml-4 text-sm">
            <li>
              <strong className="text-foreground">No database:</strong> If we don't store user data, we can't breach it.
              Workflows live in localStorage. GDPR compliance becomes almost automatic.
            </li>
            <li>
              <strong className="text-foreground">BYOK model:</strong> Users provide their own API keys. We never hold
              credentials — zero ongoing API cost and zero credential exposure risk.
            </li>
            <li>
              <strong className="text-foreground">5-layer defense model:</strong> Client sanitization → TLS → rate
              limiting → execution-layer guards → HTTPS-only external calls. Designed before a single component existed.
            </li>
            <li>
              <strong className="text-foreground">OWASP Top 10 mapping:</strong> Each of the top 10 mapped to a specific
              architectural decision. Not as a checklist — as a design constraint.
            </li>
          </ul>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <Code className="w-5 h-5 text-primary flex-shrink-0" />
            Week 2: Core Workflow Engine
          </h3>
          <p className="text-sm mb-3">
            ReactFlow handled the canvas. The hard part was the execution engine — turning a user-drawn graph into a
            reliable, streaming, server-side pipeline.
          </p>
          <ul className="space-y-2 list-disc list-inside ml-4 text-sm">
            <li>
              <strong className="text-foreground">12 node types:</strong> AI nodes (text, image, embedding, audio), data
              nodes (prompt, JavaScript, structured output), flow control (conditional, HTTP request), bookends
              (start, end), and tools.
            </li>
            <li>
              <strong className="text-foreground">Topological sort:</strong> Before executing, the engine resolves
              dependency order — nodes run only after all their upstream inputs are ready.
            </li>
            <li>
              <strong className="text-foreground">Streaming:</strong> Results stream back via{" "}
              <code className="text-primary bg-muted px-1 rounded">ReadableStream</code> as newline-delimited JSON
              — node_start, node_complete, node_error events in real time.
            </li>
            <li>
              <strong className="text-foreground">Cycle detection:</strong> A DFS pre-execution pass rejects any graph
              with a cycle before a single API call is made. Designed in Week 1, implemented here.
            </li>
          </ul>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary flex-shrink-0" />
            Week 3: Security Hardening
          </h3>
          <p className="text-sm mb-3">
            This is where security leadership and engineering merged in ways I didn't expect.
          </p>
          <ul className="space-y-2 list-disc list-inside ml-4 text-sm">
            <li>
              <strong className="text-foreground">SSRF egress guard:</strong> HTTP-request nodes let users call any URL
              — a classic SSRF vector. Built a hostname/IP blocklist covering RFC 1918 ranges, loopback, CGNAT, and cloud
              metadata endpoints (169.254.169.254, metadata.google.internal). Added a provenance-aware exemption so
              engine-generated internal routes bypass the check; user-supplied URLs never do.
            </li>
            <li>
              <strong className="text-foreground">Durable rate limiter:</strong> A sliding-window limiter with an
              injectable clock — swappable between an in-memory store (dev/test) and Upstash Redis (production), with no
              code changes in the hot path. The injectable clock made deterministic unit tests possible without sleeping.
            </li>
            <li>
              <strong className="text-foreground">AES-256-GCM key encryption:</strong> API keys encrypted before
              touching localStorage via Web Crypto. Found a critical bug here — more on that below.
            </li>
            <li>
              <strong className="text-foreground">TypeScript strict mode as a security gate:</strong> Removed{" "}
              <code className="text-primary bg-muted px-1 rounded">ignoreBuildErrors</code> from Next.js config and
              enforced <code className="text-primary bg-muted px-1 rounded">tsc --noEmit</code> in CI. The compiler
              caught a real type bug in the crypto code before it shipped.
            </li>
          </ul>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">What Security Thinking Gave Me</h2>

      <div className="space-y-4 my-6">
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-lg font-semibold text-foreground mb-2">I designed for failure, not for the happy path</h3>
          <p className="text-sm">
            Security leaders spend most of their time thinking about what goes wrong. That instinct translates directly
            into better software: timeout enforcement on every external call, graceful error paths that don't leak stack
            traces, streaming updates that keep the user informed even when a node fails mid-pipeline.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-lg font-semibold text-foreground mb-2">I validated everywhere, not at the edge</h3>
          <p className="text-sm">
            The SSRF check runs both client-side (in the validation panel) and server-side (in the execution engine).
            The rate limiter lives at the API route, not in a middleware that can be bypassed. Security instinct meant I
            never trusted a single point of validation. Defense in depth isn't just an architecture diagram — it's a
            habit.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-lg font-semibold text-foreground mb-2">I documented limitations honestly</h3>
          <p className="text-sm">
            The SSRF guard didn&apos;t resolve DNS, so a DNS-rebinding attack could route to a private IP after passing
            the check (closed on September 27, 2026: DNS answers are now checked at connection time). The AES-256-GCM encryption doesn't protect against XSS — a script in the page can read both the
            ciphertext and the key from localStorage. These limitations are documented in the code and in the tutorials.
            Security leaders know that undocumented residual risk is more dangerous than acknowledged residual risk.
          </p>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">What Coding Revealed</h2>

      <p>
        The hardest part wasn't the security work. It was the frontend frameworks. React 19, Next.js App Router,
        TailwindCSS v4 — all relatively new, all with breaking changes from the versions I'd last touched. The
        security architecture came naturally. The client-side state management did not.
      </p>
      <p>
        The most instructive moment was a bug I found during implementation of the encryption module. I wrote:
      </p>

      <pre className="bg-panel border border-border rounded-lg p-4 overflow-x-auto text-sm my-4">
        <code>{`// What I wrote first — silently wrong
async function getEncryptionKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
  )
}`}</code>
      </pre>

      <p>
        It compiled. Tests that only tested encryption passed. But every ciphertext was immediately unrecoverable —
        because <code className="text-primary bg-muted px-1 rounded">generateKey()</code> produces a fresh random key on
        every call. AES-GCM decryption requires the exact key used to encrypt. The fix was a three-tier lookup: memory
        cache → persisted key bytes in localStorage → generate once and persist.
      </p>
      <p>
        What this revealed: security reviews of crypto code are not the same as testing crypto code. As a CISO, I'd
        reviewed dozens of encryption implementations. But I'd never written one under test — which means I'd been
        reviewing static patterns without verifying the one thing that matters: does encrypt → decrypt → original
        actually hold? The round-trip test is the only honest check.
      </p>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">AI Is Rewriting the Rules</h2>

      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          The Threat Landscape Has Shifted
        </h3>
        <p className="text-sm">
          A May 2026 New York Times investigation documented what security teams have been feeling for months: AI is
          compressing the skill floor for attackers dramatically. Phishing campaigns that once required a team now run
          autonomously. Vulnerability research that took weeks takes hours. Agentic systems can chain exploits across
          systems without human direction.
        </p>
      </div>

      <p>
        The security industry is used to asymmetry — attackers have always had the easier job. But AI is widening that
        gap in ways that human-scaled security teams cannot absorb. You cannot hire your way out of a threat that
        operates at machine speed and machine scale.
      </p>

      <p>
        At the same time, AI introduces an entirely new attack surface that most security teams aren't equipped to
        assess. Prompt injection. Tool abuse in agentic pipelines. LLMs reasoning their way into decisions they
        shouldn't make. Model extraction. Data exfiltration through outputs. These aren't theoretical — they're
        appearing in production systems right now, often in applications built by teams who've never read an OWASP
        document.
      </p>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">My Vision: The Security Leader of 2030</h2>

      <div className="grid gap-4 my-6">
        {[
          {
            icon: Brain,
            title: "AI literacy is the new network literacy",
            body: "Ten years ago, CISOs who didn't understand TCP/IP were flying blind on network security. Today, CISOs who don't understand how LLMs work — how they're prompted, how they can be manipulated, what trust boundaries exist in an agentic pipeline — are flying blind on AI security. This isn't optional.",
          },
          {
            icon: Shield,
            title: "The CISO becomes an AI system architect",
            body: "The next generation of security leadership will design AI systems, not just evaluate them. Knowing how to constrain an LLM to a narrow decision space (what I've called the Untrusted Reasoning Worker pattern), how to build human-gated sinks for high-consequence actions, how to audit AI reasoning chains — these are the skills that will separate effective security leaders from the rest.",
          },
          {
            icon: Code,
            title: "Security-by-design for AI requires hands-on engineers",
            body: "You cannot bolt security onto an AI system after the fact. The decisions that matter — what the model can see, what tools it can call, how outputs are validated before they trigger actions — are made during system design. Security leaders who can't read and write the code will be relegated to approving designs they don't truly understand. That's where I was. That's why I built TopFlow.",
          },
          {
            icon: CheckCircle2,
            title: "AI will augment security teams, not replace them — but only if teams adapt",
            body: "The security engineers who thrive will be the ones who learn to direct AI agents the way a senior engineer directs a team: clear constraints, verifiable outputs, human review at the right boundaries. The ones who treat AI as a black box will find themselves outpaced by both attackers using AI offensively and by teammates who've learned to use it defensively.",
          },
        ].map((item, idx) => (
          <div key={idx} className="bg-card border border-border rounded-lg p-5 flex items-start gap-4">
            <item.icon className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm">{item.body}</p>
            </div>
          </div>
        ))}
      </div>

      <p>
        TopFlow is my proof-of-concept for this vision. The Untrusted Reasoning Worker pattern — demoting the LLM from
        decision-maker to constrained ranker/selector on security-sensitive paths — is one answer to "how do you put AI
        in a security workflow without giving it authority it shouldn't have?" The BYOK model, the provenance-aware SSRF
        guard, the durable rate limiter with a pluggable store: these are patterns that belong in every AI system
        handling sensitive data or triggering consequential actions.
      </p>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Conclusion</h2>
      <p>
        Building TopFlow proved two things I suspected but hadn't tested: security expertise genuinely makes you a better
        developer, and hands-on development makes you a materially better security leader. The threat model you draw on a
        whiteboard looks very different once you've tried to implement every control on it.
      </p>
      <p>
        The more important lesson is forward-looking. AI is not a feature to be secured — it's an architectural paradigm
        shift that changes what security leadership means. The CISOs of 2030 will be engineers first. The ones who wait
        for that to become obvious will be catching up.
      </p>

      <div className="bg-card border border-border rounded-lg p-6 my-6 space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Explore the Work</h3>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a
            href="https://github.com/csupenn/topflow"
            className="text-primary hover:underline inline-flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Full source — github.com/csupenn/topflow
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://www.topflow.dev/blog"
            className="text-primary hover:underline inline-flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            AI Security Tutorial series — topflow.dev/blog
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://www.topflow.dev"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Try TopFlow — topflow.dev
          </a>
        </div>
      </div>
    </div>
  )
}
