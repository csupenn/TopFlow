import { CheckCircle2, XCircle, ExternalLink } from "lucide-react"

export function GDPRComplianceBlogContent() {
  return (
    <div className="space-y-6 text-muted-foreground leading-relaxed">
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Updated June 17, 2026 — corrections</h3>
        <p className="text-sm">
          The original version said that not collecting data makes most GDPR requirements &quot;irrelevant&quot;. That
          confused <em>storing</em> with <em>processing</em>. TopFlow stores no personal data, but it does process
          some briefly — and until this update its server logs held user input. The section below now says what
          is actually true, and what we changed.
        </p>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">The GDPR Compliance Challenge</h2>
      <p>
        For most companies, GDPR compliance is complex, expensive, and risky. The regulation spans 99 articles covering
        everything from consent management to data breach notifications. Non-compliance can result in fines of €20
        million or 4% of global revenue—whichever is higher.
      </p>

      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold text-foreground mb-3">Typical GDPR Compliance Costs (rough industry estimates):</h3>
        <ul className="space-y-2 list-disc list-inside">
          <li>Legal consultation: $10,000-50,000</li>
          <li>Compliance tools: $500-2,000/month</li>
          <li>Data protection officer: $80,000-150,000/year</li>
          <li>Ongoing monitoring and audits: $20,000-100,000/year</li>
        </ul>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">GDPR Article 5: Core Principles</h2>
      <p>GDPR's Article 5 establishes seven foundational principles for data processing:</p>

      <div className="space-y-4 my-8">
        {[
          {
            principle: "Lawfulness, fairness, transparency",
            description: "Process data legally with clear communication",
          },
          { principle: "Purpose limitation", description: "Collect data only for specified purposes" },
          { principle: "Data minimization", description: "Collect only what's necessary" },
          { principle: "Accuracy", description: "Keep personal data accurate and up to date" },
          { principle: "Storage limitation", description: "Retain data only as long as necessary" },
          { principle: "Integrity and confidentiality", description: "Protect data from unauthorized access" },
          { principle: "Accountability", description: "Demonstrate compliance" },
        ].map((item, idx) => (
          <div key={idx} className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-1">{item.principle}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">TopFlow's Compliance Approach</h2>
      <p>
        TopFlow&apos;s approach is simple: don&apos;t <em>store</em> personal data at all. Workflows and API keys live in
        your browser; there is no user database, no accounts, and no cookies.
      </p>

      <div className="bg-card border border-border rounded-lg p-6 my-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Storing Nothing Shrinks the Problem — It Doesn&apos;t Erase It</h3>
        <p>
          With no stored personal data, the heaviest GDPR machinery has little to act on: there&apos;s no user
          database to secure, and no records to export or erase on request. But GDPR covers <em>processing</em>, not
          just storage. When you run a workflow, its content passes through our server for that request, and our host
          processes request data such as IP addresses to operate the service. That processing still needs a lawful
          basis, transparency, and a processor agreement with the host.
        </p>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Logs Are Personal Data Too</h2>
      <p>
        The easiest way to store personal data by accident is a log line. Until this update, TopFlow&apos;s
        execution route printed user inputs and prompt text to server logs — which our platform retains. For a
        &quot;no stored data&quot; product, that broke data minimization (Article 5(1)(c)) without anyone deciding to.
      </p>
      <p>
        We removed the content from the logs (they now record counts, IDs and error types) and added a test that plants
        a unique marker in every user-controlled field and fails the build if it ever reaches a log. If your privacy
        story is &quot;we don&apos;t store data,&quot; make a test prove it — logs, error trackers and analytics included.
      </p>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Conclusion</h2>
      <p>
        GDPR compliance doesn't have to be complex or expensive. By designing privacy into your architecture from day
        one, you shrink the problem dramatically — as long as you check every place data can land, including your logs.
      </p>
      <p>
        TopFlow proves that privacy-first doesn't mean feature-poor. Experience it yourself at{" "}
        <a href="https://www.topflow.dev" className="text-primary hover:underline">
          topflow.dev
        </a>{" "}
        or review the architecture on{" "}
        <a
          href="https://github.com/csupenn/topflow"
          className="text-primary hover:underline inline-flex items-center gap-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
          <ExternalLink className="w-3 h-3" />
        </a>
        .
      </p>
    </div>
  )
}
