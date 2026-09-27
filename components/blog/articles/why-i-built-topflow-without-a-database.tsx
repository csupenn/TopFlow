import { ExternalLink } from "lucide-react"

export function DatabaseFreeBlogContent() {
  return (
    <div className="space-y-6 text-muted-foreground leading-relaxed">
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
          <strong className="text-foreground">Client-side storage:</strong> Workflows are saved in localStorage, never
          sent to our servers
        </li>
        <li>
          <strong className="text-foreground">Stateless execution:</strong> When you run a workflow, we process it and
          return results—no data is retained
        </li>
        <li>
          <strong className="text-foreground">Ephemeral rate limiting:</strong> Redis stores hashed IPs for 24 hours
          (for DDoS protection), then auto-deletes
        </li>
        <li>
          <strong className="text-foreground">No PII = No breach:</strong> Without personal data, there's nothing to
          steal
        </li>
      </ul>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Real-World Implementation</h2>
      <p>
        This isn't just theory. Here's how TopFlow implements privacy-first architecture in production with Next.js and
        TypeScript:
      </p>

      <pre className="bg-panel border border-border rounded-lg p-4 overflow-x-auto text-sm">
        <code>{`// Client-side workflow storage
export function saveWorkflow(workflow: Workflow) {
  localStorage.setItem('topflow-workflow', JSON.stringify(workflow))
}

// Stateless execution (no data retention)
export async function executeWorkflow(workflow: Workflow) {
  const response = await fetch('/api/execute', {
    method: 'POST',
    body: JSON.stringify(workflow),
  })
  // Server processes and returns results immediately
  // No data is stored on our end
  return response.json()
}`}</code>
      </pre>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">GDPR Compliance: Automatic</h2>
      <p>Here's the beautiful part: when you don't collect data, GDPR compliance becomes dramatically simpler:</p>
      <ul className="space-y-2 list-disc list-inside">
        <li>
          <strong className="text-foreground">Article 5 (Data Minimization):</strong> ✅ We don't collect any personal
          data
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
          <strong className="text-foreground">Zero data breaches:</strong> Can't lose data you never collected
        </li>
        <li>
          <strong className="text-foreground">GDPR compliant by design:</strong> No consent forms, no data processing
          agreements
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
        and build an AI workflow — no signup required, no data collected. The full source (including the
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
