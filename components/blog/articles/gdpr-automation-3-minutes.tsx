import { CheckCircle2 } from "lucide-react"

export function GDPRAutomationContent() {
  return (
    <div className="space-y-6 text-muted-foreground leading-relaxed">
      <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">The GDPR Article 15 Challenge</h2>
      <p>
        Under GDPR Article 15, data subjects have the right to request access to all personal data an organization holds
        about them. Companies must respond within 30 days with a comprehensive report including data categories,
        processing purposes, recipients, retention periods, and the data itself.
      </p>
      <p>
        For most organizations, fulfilling these Data Subject Access Requests (DSARs) is manual, time-consuming, and
        expensive.
      </p>

      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Typical Manual Process:</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="bg-destructive/20 rounded px-2 py-0.5 text-sm font-mono mt-0.5">30-60 min</div>
            <span>Query 5-10 different databases for user data</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="bg-destructive/20 rounded px-2 py-0.5 text-sm font-mono mt-0.5">60-90 min</div>
            <span>Compile data from logs, backups, and third-party integrations</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="bg-destructive/20 rounded px-2 py-0.5 text-sm font-mono mt-0.5">30-60 min</div>
            <span>Format data into human-readable report</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="bg-destructive/20 rounded px-2 py-0.5 text-sm font-mono mt-0.5">30-45 min</div>
            <span>Legal review and compliance check</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="bg-destructive/20 rounded px-2 py-0.5 text-sm font-mono mt-0.5">15-30 min</div>
            <span>Send secure report to data subject</span>
          </li>
        </ul>
        <div className="mt-4 pt-4 border-t border-destructive/30">
          <div className="text-lg font-semibold text-foreground">Total: 3-5 hours per request</div>
          <div className="text-sm text-muted-foreground">Cost: $150-300 in staff time (@ $50/hr)</div>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">TopFlow's Automated Approach</h2>
      <p>
        TopFlow reduces this 4+ hour manual process to 3 minutes and $0.044 through workflow automation. Here's the
        complete architecture and how you can customize it for your production environment.
      </p>

      <div className="bg-chart-3/10 border border-chart-3/20 rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Automated GDPR Workflow Results:</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-chart-3 mb-2">3 min</div>
            <div className="text-sm">Execution Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-chart-3 mb-2">$0.044</div>
            <div className="text-sm">Cost per Request</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-chart-3 mb-2">98.8%</div>
            <div className="text-sm">Cost Reduction</div>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">The Workflow Architecture</h2>
      <p>
        The automated GDPR workflow follows a multi-stage process with comprehensive data aggregation and security
        validation. You can explore the complete workflow interactively in the{" "}
        <a href="/docs/learn/quick-start" className="text-primary hover:underline">
          Quick Start guide
        </a>
        .
      </p>

      <h3 className="text-2xl font-semibold text-foreground mt-8 mb-3">Stage 1: Request Validation</h3>
      <p>Every DSAR must be validated to prevent fraud and ensure legitimate requests:</p>

      <pre className="bg-panel border border-border rounded-lg p-4 overflow-x-auto text-sm my-6">
        <code>{`// Validation Node Configuration
{
  "nodeType": "validation",
  "checks": [
    "emailFormat",        // RFC 5322 email validation
    "domainVerification", // MX record check
    "rateLimit",          // Max 3 requests/day per email
    "suspiciousPattern"   // Detect automated abuse
  ],
  "onFailure": "reject_with_reason"
}`}</code>
      </pre>

      <p className="mt-4">
        Learn more about TopFlow's comprehensive security validation system in the{" "}
        <a href="/docs/security/validations" className="text-primary hover:underline">
          Security Validations documentation
        </a>
        .
      </p>

      <h3 className="text-2xl font-semibold text-foreground mt-8 mb-3">Stage 2: Database Query Orchestration</h3>
      <p>The workflow queries multiple databases in parallel for maximum efficiency:</p>

      <div className="space-y-4 my-8">
        {[
          {
            db: "PostgreSQL (Primary DB)",
            query: "User profiles, preferences, activity logs",
            time: "~500ms",
          },
          {
            db: "MongoDB (Analytics)",
            query: "Behavioral data, session history",
            time: "~600ms",
          },
          {
            db: "Redis (Cache)",
            query: "Recent interactions, temporary data",
            time: "~50ms",
          },
          {
            db: "S3 (Object Storage)",
            query: "Uploaded files, documents, images",
            time: "~800ms",
          },
        ].map((item, idx) => (
          <div key={idx} className="bg-card border border-border rounded-lg p-4 flex justify-between items-start">
            <div>
              <div className="font-semibold text-foreground">{item.db}</div>
              <div className="text-sm text-muted-foreground mt-1">{item.query}</div>
            </div>
            <div className="font-mono text-sm text-chart-3 bg-chart-3/10 px-2 py-1 rounded">{item.time}</div>
          </div>
        ))}
      </div>

      <p>
        TopFlow's HTTP and Transform nodes enable complex data aggregation from multiple sources. See the{" "}
        <a href="/docs/build/nodes" className="text-primary hover:underline">
          Node Reference guide
        </a>{" "}
        for implementation details.
      </p>

      <h3 className="text-2xl font-semibold text-foreground mt-8 mb-3">Stage 3: Data Transformation & Aggregation</h3>
      <p>Raw database records are transformed into a human-readable, GDPR-compliant format:</p>

      <pre className="bg-panel border border-border rounded-lg p-4 overflow-x-auto text-sm my-6">
        <code>{`// Transform Node: Format GDPR Report
{
  "personal_data": {
    "basic_info": extractBasicInfo(userData),
    "preferences": formatPreferences(userPrefs),
    "activity_log": aggregateActivity(logs),
    "uploaded_files": listFiles(s3Data)
  },
  "processing_purposes": [
    "Account management",
    "Service delivery",
    "Analytics (anonymized)",
    "Security monitoring"
  ],
  "data_recipients": [
    "Internal systems only",
    "Cloud provider (AWS US-East-1)",
    "No third-party sharing"
  ],
  "retention_periods": {
    "active_account": "Duration of account + 90 days",
    "inactive_account": "2 years then deleted",
    "legal_hold": "7 years (if applicable)"
  },
  "your_rights": {
    "access": "Automated via this workflow",
    "rectification": "Account settings page",
    "erasure": "Account deletion in settings",
    "portability": "JSON export available",
    "objection": "Opt-out in preferences"
  }
}`}</code>
      </pre>

      <h3 className="text-2xl font-semibold text-foreground mt-8 mb-3">Stage 4: LLM Enhancement (Optional)</h3>
      <p>An LLM node can generate a natural language summary of the technical report:</p>

      <pre className="bg-panel border border-border rounded-lg p-4 overflow-x-auto text-sm my-6">
        <code>{`Prompt: "Summarize this GDPR data in clear, non-technical language
for the data subject. Include what data we have, why we have it,
and what rights they can exercise."

Input: {raw_gdpr_report}

Output: "Hello [Name], we've compiled all the personal information
we store about you. This includes your account details (email, name),
your usage history from the past 2 years, and 3 files you uploaded.
We use this data to provide our service and improve your experience.
You can update this information anytime in your settings, or delete
your account entirely if you wish..."`}</code>
      </pre>

      <p className="text-sm italic text-muted-foreground mt-4">Cost: ~2,000 tokens @ GPT-4 Turbo = $0.02 per request</p>

      <h3 className="text-2xl font-semibold text-foreground mt-8 mb-3">Stage 5: Secure Delivery</h3>
      <p>The final report is delivered through a secure, time-limited link:</p>

      <ul className="space-y-2 list-disc list-inside my-6">
        <li>
          <strong className="text-foreground">Generate secure token:</strong> SHA-256 hash with 72-hour expiration
        </li>
        <li>
          <strong className="text-foreground">Store encrypted report:</strong> AES-256 encryption, S3 with versioning
        </li>
        <li>
          <strong className="text-foreground">Send email notification:</strong> Secure link via SendGrid
        </li>
        <li>
          <strong className="text-foreground">Audit logging:</strong> Record access attempts and downloads
        </li>
      </ul>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Production Deployment</h2>
      <p>To deploy this workflow in a production environment, you'll need to customize several components:</p>

      <div className="bg-card border border-border rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Required Customizations:</h3>
        <ol className="space-y-3 list-decimal list-inside">
          <li>
            <strong className="text-foreground">Database Connections:</strong> Update HTTP nodes with your actual
            database API endpoints
          </li>
          <li>
            <strong className="text-foreground">Authentication:</strong> Add proper API keys and OAuth tokens for your
            systems
          </li>
          <li>
            <strong className="text-foreground">Data Mapping:</strong> Customize transform nodes to match your database
            schema
          </li>
          <li>
            <strong className="text-foreground">Legal Review:</strong> Have your DPO review the report format for
            compliance
          </li>
          <li>
            <strong className="text-foreground">Delivery Method:</strong> Configure secure email or portal integration
          </li>
          <li>
            <strong className="text-foreground">Monitoring:</strong> Add alerting for failed requests or anomalies
          </li>
        </ol>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Cost Breakdown</h2>
      <p>Here's the complete cost analysis for 100 GDPR requests per month:</p>

      <div className="bg-card border border-border rounded-lg p-6 my-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>LLM API (GPT-4 Turbo)</span>
            <span className="font-mono text-foreground">$2.00</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Database queries (serverless)</span>
            <span className="font-mono text-foreground">$1.00</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Email delivery (SendGrid)</span>
            <span className="font-mono text-foreground">$0.50</span>
          </div>
          <div className="flex justify-between items-center">
            <span>S3 storage (temporary)</span>
            <span className="font-mono text-foreground">$0.10</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Compute (serverless functions)</span>
            <span className="font-mono text-foreground">$0.80</span>
          </div>
          <div className="border-t border-border mt-4 pt-4 flex justify-between items-center font-semibold">
            <span className="text-foreground">Total (100 requests):</span>
            <span className="text-chart-3 font-mono text-xl">$4.40</span>
          </div>
          <div className="text-right text-sm text-muted-foreground">$0.044 per request</div>
        </div>
      </div>

      <p className="bg-chart-3/10 border-l-4 border-chart-3 p-4 italic my-6">
        <strong className="text-foreground">ROI:</strong> If you receive just 10 GDPR requests per year, automation
        saves $1,456 annually compared to manual processing ($150 × 10 vs $0.44).
      </p>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Security Considerations</h2>
      <p>Automating GDPR workflows requires careful attention to security:</p>

      <ul className="space-y-3 my-6">
        <li className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-chart-3 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-foreground">Identity Verification:</strong> Implement multi-factor authentication
            for requests
          </div>
        </li>
        <li className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-chart-3 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-foreground">Encryption at Rest:</strong> All reports stored with AES-256 encryption
          </div>
        </li>
        <li className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-chart-3 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-foreground">Encryption in Transit:</strong> TLS 1.3 for all API communications
          </div>
        </li>
        <li className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-chart-3 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-foreground">Audit Logging:</strong> Record every access attempt and data query
          </div>
        </li>
        <li className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-chart-3 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-foreground">Rate Limiting:</strong> Prevent automated abuse with request throttling
          </div>
        </li>
        <li className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-chart-3 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-foreground">Time-Limited Access:</strong> Reports expire after 72 hours
          </div>
        </li>
      </ul>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Try It Yourself</h2>
      <p>
        The complete GDPR automation workflow is available as a template in TopFlow. You can test it with sample data,
        customize the nodes for your infrastructure, and deploy it in your production environment.
      </p>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold text-foreground mb-3">Get Started:</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            Visit{" "}
            <a href="/docs/learn/quick-start" className="text-primary hover:underline">
              Quick Start guide
            </a>{" "}
            to learn TopFlow basics
          </li>
          <li>Import the GDPR automation template from the library</li>
          <li>Customize database connections and API endpoints</li>
          <li>Test with sample data to validate the workflow</li>
          <li>Deploy to production with your monitoring and alerting</li>
        </ol>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Conclusion</h2>
      <p>
        GDPR compliance doesn't have to be expensive or time-consuming. With workflow automation, you can reduce manual
        Data Subject Access Requests from hours to minutes, while improving accuracy and reducing costs by 98.8%.
      </p>
      <p>
        TopFlow demonstrates that security, compliance, and automation can work together to create efficient, scalable
        processes that protect both your organization and your data subjects' rights.
      </p>
      <p className="mt-6">
        Ready to automate your GDPR compliance? Explore the workflow at{" "}
        <a href="https://www.topflow.dev" className="text-primary hover:underline">
          topflow.dev
        </a>
        .
      </p>
    </div>
  )
}