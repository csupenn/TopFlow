import { CheckCircle2, XCircle, ExternalLink } from "lucide-react"

export function GDPRComplianceBlogContent() {
  return (
    <div className="space-y-6 text-muted-foreground leading-relaxed">
      <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">The GDPR Compliance Challenge</h2>
      <p>
        For most companies, GDPR compliance is complex, expensive, and risky. The regulation spans 99 articles covering
        everything from consent management to data breach notifications. Non-compliance can result in fines of €20
        million or 4% of global revenue—whichever is higher.
      </p>

      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold text-foreground mb-3">Typical GDPR Compliance Costs:</h3>
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
      <p>TopFlow achieves GDPR compliance through a radical approach: don't collect data in the first place.</p>

      <div className="bg-chart-3/10 border border-chart-3/20 rounded-lg p-6 my-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">No Data Collection = No Consent Needed</h3>
        <p>
          When you don't collect personal data, most GDPR requirements become irrelevant. No consent forms, no data
          processing agreements, no retention policies, no breach notifications.
        </p>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Conclusion</h2>
      <p>
        GDPR compliance doesn't have to be complex or expensive. By designing privacy into your architecture from day
        one, you can build products that are compliant by default rather than compliant by effort.
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
