import { ExternalLink } from "lucide-react"

export function DatabaseFreeBlogContent() {
  return (
    <div className="space-y-6 text-muted-foreground leading-relaxed">
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Updated June 17, 2026 — corrections</h3>
        <p className="text-sm">
          An audit of our own claims against the code found this post overstated a few things. Corrected below:
          workflows and API keys <em>are</em> sent to our server when you run a workflow (used in memory, never
          stored); rate-limit keys hold an HMAC-hashed IP for about a minute, not a hashed IP for 24 hours; our logs
          used to include user input until we fixed it; and the code sample is now the real code. The architecture
          argument stands — the details are now accurate.
        </p>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">The Default Path</h2>
      <p>
        Most SaaS applications follow a predictable pattern: collect user data, store it in PostgreSQL, analyze usage
        patterns, and monetize through subscriptions. It's the established playbook, and for good reason—it works.
      </p>
      <p>
        But this default path comes with significant baggage: GDPR compliance requirements, data breach risks,
        encryption complexity, backup strategies, and the ongoing responsibility of protecting user information.
      </p>
      <p className="bg-card border-l-4 border-primary p-4 italic">
        "Every major SaaS breach started with 'we store user data securely.' The question isn't if you'll be breached,
        but when."
      </p>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">The Privacy-First Alternative</h2>
      <p>
        TopFlow takes a radically different approach: zero server-side data storage. User workflows live entirely in the
        browser's localStorage, and execution happens in a stateless, request-scoped context.
      </p>

      <h3 className="text-2xl font-semibold text-foreground mt-8 mb-3">How It Works</h3>
      <ul className="space-y-2 list-disc list-inside">
        <li>
          <strong className="text-foreground">Client-side storage:</strong> Workflows and API keys are saved only in
          your browser&apos;s localStorage (keys AES-256-GCM encrypted)
        </li>
        <li>
          <strong className="text-foreground">Stateless execution:</strong> When you run a workflow, it and the keys it
          needs are sent over HTTPS to our server, used in memory for that one request, and never stored or logged
        </li>
        <li>
          <strong className="text-foreground">Ephemeral rate limiting:</strong> Redis holds an HMAC-hashed form of
          your IP for about a minute (one rate-limit window), then it expires
        </li>
        <li>
          <strong className="text-foreground">Nothing stored = nothing to breach:</strong> With no user database,
          there&apos;s no stored personal data to steal
        </li>
      </ul>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Real-World Implementation</h2>
      <p>
        This isn't just theory. Here's how TopFlow implements privacy-first architecture in production with Next.js and
        TypeScript:
      </p>

      <p>
        Saving a workflow writes to localStorage (
        <a
          href="https://github.com/csupenn/topflow/blob/main/lib/storage.ts"
          className="text-primary hover:underline inline-flex items-center gap-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          lib/storage.ts
          <ExternalLink className="w-3 h-3" />
        </a>
        ):
      </p>
      <pre className="bg-panel border border-border rounded-lg p-4 overflow-x-auto text-sm">
        <code>{`localStorage.setItem("ai-agent-workflows", JSON.stringify(workflows))`}</code>
      </pre>
      <p>
        Running one sends the graph — and your keys — to the execution route for that request only (
        <a
          href="https://github.com/csupenn/topflow/blob/main/components/execution-panel.tsx"
          className="text-primary hover:underline inline-flex items-center gap-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          components/execution-panel.tsx
          <ExternalLink className="w-3 h-3" />
        </a>
        ):
      </p>
      <pre className="bg-panel border border-border rounded-lg p-4 overflow-x-auto text-sm">
        <code>{`const response = await fetch("/api/execute-workflow", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ nodes, edges, apiKeys: keys, workflowId, userInputs /* … */ }),
})`}</code>
      </pre>
      <p>
        The server executes the workflow in memory and streams results back. Nothing is written to a database — there
        isn&apos;t one — and a test plants a unique marker in every user-controlled field and fails the build if it
        ever appears in server logs (
        <a
          href="https://github.com/csupenn/topflow/blob/main/app/api/execute-workflow/__tests__/log-privacy.test.ts"
          className="text-primary hover:underline inline-flex items-center gap-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          log-privacy.test.ts
          <ExternalLink className="w-3 h-3" />
        </a>
        ). That test exists because, until this update, our logs <em>did</em> contain user input.
      </p>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">GDPR Compliance: Much Simpler</h2>
      <p>Here&apos;s the beautiful part: when you don&apos;t store data, GDPR compliance becomes dramatically simpler:</p>
      <ul className="space-y-2 list-disc list-inside">
        <li>
          <strong className="text-foreground">Article 5 (Data Minimization):</strong> ✅ We don&apos;t store personal
          data; workflow content is processed only in memory, for the length of a request
        </li>
        <li>
          <strong className="text-foreground">Article 15 (Right to Access):</strong> ✅ Users already have their data
          (it's in their browser)
        </li>
        <li>
          <strong className="text-foreground">Article 17 (Right to Erasure):</strong> ✅ Users can delete their data
          anytime (clear localStorage)
        </li>
      </ul>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Trade-offs & When This Works</h2>
      <p>This architecture isn't for everyone. Here's when it makes sense:</p>

      <div className="bg-card border border-border rounded-lg p-6 my-6">
        <h3 className="text-xl font-semibold text-foreground mb-3">✅ Perfect For:</h3>
        <ul className="space-y-2 list-disc list-inside text-muted-foreground">
          <li>Developer tools and calculators</li>
          <li>Privacy-focused products</li>
          <li>Demo applications and prototypes</li>
          <li>Security showcases (like TopFlow)</li>
        </ul>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 my-6">
        <h3 className="text-xl font-semibold text-foreground mb-3">❌ Not Ideal For:</h3>
        <ul className="space-y-2 list-disc list-inside text-muted-foreground">
          <li>Social networks (need persistent relationships)</li>
          <li>Collaboration tools (require shared state)</li>
          <li>Cross-device sync applications</li>
          <li>Multi-user platforms</li>
        </ul>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">The Results</h2>
      <p>TopFlow's privacy-first architecture delivers tangible benefits:</p>
      <ul className="space-y-2 list-disc list-inside">
        <li>
          <strong className="text-foreground">Zero stored-data breaches:</strong> Can&apos;t lose data you never stored
        </li>
        <li>
          <strong className="text-foreground">Privacy by design:</strong> Far fewer obligations — no user database to
          secure, no export or deletion workflows to build
        </li>
        <li>
          <strong className="text-foreground">$0 database costs:</strong> Saves ~$50-100/month in infrastructure
        </li>
        <li>
          <strong className="text-foreground">User trust:</strong> Users control their own data, always
        </li>
      </ul>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Try It Yourself</h2>
      <p>
        Experience privacy-first architecture in action. Visit{" "}
        <a href="https://www.topflow.dev" className="text-primary hover:underline">
          topflow.dev
        </a>{" "}
        and build an AI workflow — no signup, no cookies. The full source (including the
        localStorage abstraction and AES-256-GCM key encryption) is on{" "}
        <a
          href="https://github.com/csupenn/topflow"
          className="text-primary hover:underline inline-flex items-center gap-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/csupenn/topflow
          <ExternalLink className="w-3 h-3" />
        </a>
        .
      </p>
    </div>
  )
}
