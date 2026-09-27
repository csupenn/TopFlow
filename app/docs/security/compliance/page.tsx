import type { Metadata } from "next"
import Link from "next/link"
import { SidebarPortal } from "@/components/docs/sidebar-portal"
import { TOCPortal } from "@/components/docs/toc-portal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Shield,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Lock,
  Building2,
  ArrowRight,
  FileText,
  Code,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Security & Compliance - Compliance Framework | TopFlow Documentation",
  description:
    "Understand TopFlow's compliance-conscious design, GDPR features, SOC 2 considerations, and industry-specific security guidance for regulated environments.",
  keywords: ["security compliance", "GDPR", "SOC 2", "HIPAA", "data protection"],
}

const tocItems = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "gdpr-compliance", title: "GDPR Compliance", level: 2 },
  { id: "soc2-considerations", title: "SOC 2 Considerations", level: 2 },
  { id: "hipaa-healthcare", title: "HIPAA & Healthcare", level: 2 },
  { id: "industry-specific", title: "Industry-Specific Guidance", level: 2 },
  { id: "best-practices", title: "Compliance Best Practices", level: 2 },
]

export default function CompliancePage() {
  return (
    <>
      <SidebarPortal currentTab="security" />
      <TOCPortal items={tocItems} />

      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Badge variant="secondary" className="mb-4">
            <Shield className="mr-1 h-3 w-3" />
            Compliance Framework
          </Badge>
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight">Security & Compliance</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            TopFlow is built with compliance-conscious design principles. Learn how its privacy-first architecture
            supports GDPR, SOC 2, and industry-specific security requirements for regulated environments.
          </p>
        </div>

        {/* Overview */}
        <section id="overview" className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Overview</h2>

          <div className="prose prose-sm max-w-none">
            <p>
              TopFlow demonstrates <strong>compliance by design</strong>—security and privacy features baked into the
              architecture from day one, not bolted on as an afterthought. As a platform built by a former CISO, it
              showcases how to build AI systems that meet enterprise security standards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <Card className="border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-3">
                  <Lock className="h-6 w-6 text-chart-3" />
                </div>
                <CardTitle className="text-lg">Privacy-First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  All data stored in your browser only. No backend database means no data breach risk. True privacy by
                  design.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Security Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  12 security validations including SSRF prevention, rate limiting, cycle detection, and input
                  sanitization.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-3">
                  <FileCheck className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle className="text-lg">Audit-Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Code export generates audit trails. Open source for security review. Compliance documentation
                  built-in.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 border-2 border-blue-500/20 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileCheck className="h-5 w-5 text-blue-500" />
                Compliance Philosophy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>TopFlow's approach to compliance is based on four principles:</p>
              <ol className="space-y-2 ml-4">
                <li>
                  <strong>1. Data Minimization</strong> - Collect only what's absolutely necessary (spoiler: nothing on
                  the server)
                </li>
                <li>
                  <strong>2. User Control</strong> - Users own 100% of their data—workflows, API keys, execution history
                </li>
                <li>
                  <strong>3. Transparency</strong> - Open source for community security review and audit
                </li>
                <li>
                  <strong>4. Purpose Limitation</strong> - Data used only for workflow execution, never for analytics or
                  tracking
                </li>
              </ol>
              <p className="mt-3">
                This isn't just good practice—it's <strong>authentic privacy-first positioning</strong>. You can't
                breach data you never collected.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* GDPR Compliance */}
        <section id="gdpr-compliance" className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">GDPR Compliance</h2>

          <div className="prose prose-sm max-w-none">
            <p>
              The General Data Protection Regulation (GDPR) is the EU's comprehensive privacy law. TopFlow's client-side
              architecture makes GDPR compliance straightforward because <strong>no personal data is stored server-side</strong> — workflow data is processed only in memory, for the duration of a request.
            </p>
          </div>

          <Card className="mt-6 border-2">
            <CardHeader>
              <CardTitle className="text-lg">GDPR Article 5 Principles</CardTitle>
              <CardDescription>TopFlow aligns with all six GDPR data protection principles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Principle 1 */}
              <Card className="border-2 border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    1. Lawfulness, Fairness, Transparency
                  </CardTitle>
                  <CardDescription>Data processing must be legal, fair, and transparent</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="font-semibold mb-2">How TopFlow Complies:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• No user accounts or authentication required (no account data collected)</li>
                    <li>• Open source code allows full transparency into data handling</li>
                    <li>• Clear documentation of data flows and storage</li>
                    <li>• Privacy policy in plain language (not legalese)</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Principle 2 */}
              <Card className="border-2 border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    2. Purpose Limitation
                  </CardTitle>
                  <CardDescription>Data collected for specified purposes only</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="font-semibold mb-2">How TopFlow Complies:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Data used exclusively for workflow execution</li>
                    <li>• No secondary use (analytics, advertising, profiling)</li>
                    <li>• No data selling or sharing with third parties</li>
                    <li>• Execution results are ephemeral (not persisted server-side)</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Principle 3 */}
              <Card className="border-2 border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    3. Data Minimization
                  </CardTitle>
                  <CardDescription>Collect only necessary data</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="font-semibold mb-2">How TopFlow Complies:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Zero server-side storage of workflows and keys (localStorage only)</li>
                    <li>• No tracking cookies or analytics by default</li>
                    <li>• No user profiles, email addresses, or identifiers</li>
                    <li>• API keys stored locally; sent only to execute a workflow, never stored or logged</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Principle 4 */}
              <Card className="border-2 border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    4. Accuracy
                  </CardTitle>
                  <CardDescription>Data must be accurate and up-to-date</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="font-semibold mb-2">How TopFlow Complies:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Users have direct control over all data (localStorage)</li>
                    <li>• Workflows editable at any time</li>
                    <li>• Version history allows reverting to accurate states</li>
                    <li>• No stale server-side cached data</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Principle 5 */}
              <Card className="border-2 border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    5. Storage Limitation
                  </CardTitle>
                  <CardDescription>Data retained only as long as necessary</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="font-semibold mb-2">How TopFlow Complies:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• No server-side retention (data doesn't exist to retain)</li>
                    <li>• Users control localStorage retention via browser settings</li>
                    <li>• Auto-save keeps only last 5 versions (automatic cleanup)</li>
                    <li>• Execution results discarded after streaming to client</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Principle 6 */}
              <Card className="border-2 border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    6. Integrity & Confidentiality
                  </CardTitle>
                  <CardDescription>Appropriate security measures</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="font-semibold mb-2">How TopFlow Complies:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• HTTPS/TLS 1.3 for all communications</li>
                    <li>• localStorage encrypted at browser level</li>
                    <li>• SSRF prevention protects against unauthorized access</li>
                    <li>• Rate limiting prevents abuse and DoS attacks</li>
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <Card className="mt-6 border-2">
            <CardHeader>
              <CardTitle className="text-lg">GDPR Data Subject Rights</CardTitle>
              <CardDescription>
                Because TopFlow stores no personal data server-side, most GDPR rights are inherently satisfied
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Right to Access
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Users have full access to localStorage via browser DevTools or export feature
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Right to Rectification
                  </p>
                  <p className="text-muted-foreground text-xs">Users can edit workflows at any time</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Right to Erasure
                  </p>
                  <p className="text-muted-foreground text-xs">Clear browser storage deletes all data instantly</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Right to Data Portability
                  </p>
                  <p className="text-muted-foreground text-xs">JSON export/import functionality</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Right to Restrict Processing
                  </p>
                  <p className="text-muted-foreground text-xs">Users control when workflows execute</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Right to Object
                  </p>
                  <p className="text-muted-foreground text-xs">No automated profiling or marketing (N/A)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 border-2 border-blue-500/20 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-blue-500" />
                GDPR Workflow Example
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>
                TopFlow includes a pre-built template: <strong>GDPR Data Access Request Automation</strong>. This
                workflow demonstrates how to handle Article 15 (Right to Access) requests automatically, including data
                aggregation, PII redaction, and response generation.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* SOC 2 Considerations */}
        <section id="soc2-considerations" className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">SOC 2 Considerations</h2>

          <div className="prose prose-sm max-w-none">
            <p>
              SOC 2 is a compliance framework for service providers storing customer data in the cloud. While TopFlow
              stores no customer data server-side, understanding SOC 2 principles helps with enterprise deployment.
            </p>
          </div>

          <Card className="mt-6 border-2">
            <CardHeader>
              <CardTitle className="text-lg">SOC 2 Trust Service Criteria</CardTitle>
              <CardDescription>How TopFlow aligns with each of the five TSC</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Security */}
              <Card className="border-2 border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Security (CC1-CC9)
                  </CardTitle>
                  <CardDescription>Protection against unauthorized access</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="font-semibold">TopFlow Implementation:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• 12 security validations including SSRF prevention, cycle detection</li>
                    <li>• Rate limiting (10 req/min per IP) prevents abuse</li>
                    <li>• Input sanitization and validation on all user inputs</li>
                    <li>• HTTPS/TLS 1.3 enforced for all communications</li>
                    <li>• Open source for security review and audit</li>
                  </ul>
                  <p className="mt-3 text-green-500 font-semibold">Status: ✅ Well-implemented</p>
                </CardContent>
              </Card>

              {/* Availability */}
              <Card className="border-2 border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Availability (A1)
                  </CardTitle>
                  <CardDescription>System accessible when needed</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="font-semibold">TopFlow Implementation:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Stateless architecture enables horizontal scaling</li>
                    <li>• No database dependencies (can't have database downtime)</li>
                    <li>• Deployed on Vercel Edge Network (global CDN)</li>
                    <li>• Automatic failover and load balancing</li>
                  </ul>
                  <p className="mt-3 text-green-500 font-semibold">Status: ✅ Well-implemented</p>
                </CardContent>
              </Card>

              {/* Processing Integrity */}
              <Card className="border-2 border-yellow-500/20 bg-yellow-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    Processing Integrity (PI1)
                  </CardTitle>
                  <CardDescription>Processing is complete, valid, accurate, timely</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="font-semibold">TopFlow Implementation:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Pre-execution validation prevents invalid workflows</li>
                    <li>• Error handling returns clear, actionable messages</li>
                    <li>• Code export generates production-ready TypeScript</li>
                    <li>• Version history allows auditing workflow changes</li>
                  </ul>
                  <p className="mt-3 text-yellow-500 font-semibold">
                    Status: ⚠️ Partially implemented (audit logging recommended)
                  </p>
                </CardContent>
              </Card>

              {/* Confidentiality */}
              <Card className="border-2 border-yellow-500/20 bg-yellow-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    Confidentiality (C1)
                  </CardTitle>
                  <CardDescription>Information designated as confidential is protected</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="font-semibold">TopFlow Implementation:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• API keys stored in localStorage (browser-secured)</li>
                    <li>• Keys never logged in error messages or traces</li>
                    <li>• No server-side persistence of sensitive data</li>
                    <li>• BYOK model—users control their own credentials</li>
                  </ul>
                  <p className="mt-3 text-yellow-500 font-semibold">
                    Status: ⚠️ Good for demo, encryption recommended for enterprise
                  </p>
                </CardContent>
              </Card>

              {/* Privacy */}
              <Card className="border-2 border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Privacy (P1-P8)
                  </CardTitle>
                  <CardDescription>Personal info collected, used, retained, disclosed appropriately</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="font-semibold">TopFlow Implementation:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Zero server-side storage; transient, in-memory processing only</li>
                    <li>• No tracking, analytics, or profiling by default</li>
                    <li>• Users own 100% of their data via localStorage</li>
                    <li>• Open source allows privacy verification</li>
                  </ul>
                  <p className="mt-3 text-green-500 font-semibold">Status: ✅ Exceptional implementation</p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <Card className="mt-6 border-2 border-blue-500/20 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileCheck className="h-5 w-5 text-blue-500" />
                Enterprise Deployment Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="mb-3">For organizations pursuing SOC 2 certification with TopFlow:</p>
              <ul className="space-y-2">
                <li>• <strong>Add audit logging</strong> - Track all workflow executions, validations, and configuration changes</li>
                <li>• <strong>Implement RBAC</strong> - Define user roles and permissions</li>
                <li>• <strong>Enhanced monitoring</strong> - Set up SIEM integration for security event correlation</li>
                <li>• <strong>Incident response plan</strong> - Document procedures for security incidents</li>
                <li>• <strong>Vendor management</strong> - Ensure AI providers have SOC 2 reports</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* HIPAA & Healthcare */}
        <section id="hipaa-healthcare" className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">HIPAA & Healthcare</h2>

          <div className="prose prose-sm max-w-none">
            <p>
              The Health Insurance Portability and Accountability Act (HIPAA) governs Protected Health Information (PHI)
              in the United States. TopFlow's default architecture is <strong>not HIPAA-compliant</strong> because
              localStorage encryption doesn't meet HIPAA standards.
            </p>
          </div>

          <Card className="mt-6 border-2">
            <CardHeader>
              <CardTitle className="text-lg">HIPAA Requirements</CardTitle>
              <CardDescription>Key compliance challenges and solutions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Encryption at Rest */}
              <Card className="border-2 border-red-500/20 bg-red-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    ❌ Encryption at Rest
                  </CardTitle>
                  <CardDescription>PHI must be encrypted using FIPS 140-2 compliant algorithms</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="text-muted-foreground">
                    <strong>Issue:</strong> Browser localStorage encryption doesn't meet HIPAA standards.
                  </p>
                  <p className="text-green-500">
                    <strong>Solution:</strong> Deploy with server-side storage using AES-256 encryption or use a secrets
                    management service (AWS Secrets Manager, HashiCorp Vault).
                  </p>
                </CardContent>
              </Card>

              {/* BAA */}
              <Card className="border-2 border-yellow-500/20 bg-yellow-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    ⚠️ Business Associate Agreements
                  </CardTitle>
                  <CardDescription>Required with all vendors handling PHI</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="text-muted-foreground">
                    <strong>Issue:</strong> AI providers (OpenAI, Anthropic, Google) must sign BAAs before processing
                    PHI.
                  </p>
                  <p className="text-green-500">
                    <strong>Solution:</strong> Use HIPAA-compliant AI providers or deploy on-premise with local models.
                    OpenAI and Anthropic offer BAAs for enterprise customers.
                  </p>
                </CardContent>
              </Card>

              {/* Audit Controls */}
              <Card className="border-2 border-yellow-500/20 bg-yellow-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    ⚠️ Audit Controls
                  </CardTitle>
                  <CardDescription>Record and examine activity in systems with PHI</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="text-muted-foreground">
                    <strong>Status:</strong> TopFlow has basic execution logging but needs enhancement.
                  </p>
                  <p className="text-green-500">
                    <strong>Solution:</strong> Implement comprehensive audit logging with tamper-proof storage. Log all
                    PHI access, modifications, and disclosures.
                  </p>
                </CardContent>
              </Card>

              {/* Minimum Necessary */}
              <Card className="border-2 border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ✅ Minimum Necessary
                  </CardTitle>
                  <CardDescription>Limit PHI access to minimum necessary</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="text-muted-foreground">
                    <strong>Status:</strong> TopFlow's data minimization principle aligns with this requirement.
                  </p>
                  <p className="text-green-500">
                    No server-side storage means PHI is only accessed during workflow execution.
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <Card className="mt-6 border-2 border-blue-500/20 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Code className="h-5 w-5 text-blue-500" />
                Healthcare Deployment Path
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="mb-3">To use TopFlow for PHI workflows, follow this implementation path:</p>
              <ol className="space-y-2 ml-4">
                <li><strong>1. Sign BAAs</strong> with OpenAI, Anthropic, or use on-premise models</li>
                <li><strong>2. Deploy server-side storage</strong> with FIPS 140-2 encryption</li>
                <li><strong>3. Implement RBAC</strong> - Only authorized clinicians access PHI workflows</li>
                <li><strong>4. Add comprehensive audit logging</strong> - Track all PHI access with immutable logs</li>
                <li><strong>5. De-identification workflows</strong> - Create templates for removing identifiers</li>
                <li><strong>6. Penetration testing</strong> - Third-party security audit required for HIPAA</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="mt-6 border-2 border-red-500/20 bg-red-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Important Healthcare Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>
                Do not use TopFlow's default configuration for PHI workflows without implementing the recommendations
                above. Consult with a HIPAA compliance expert before deployment in healthcare environments.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Industry-Specific Guidance */}
        <section id="industry-specific" className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Industry-Specific Guidance</h2>

          <div className="space-y-6">
            {/* Financial Services */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-chart-1/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-chart-1" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">Financial Services</CardTitle>
                    <CardDescription>Banking, payments, investment management</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">
                  <strong>Key Regulations:</strong> PCI DSS (payments), SOC 2, GLBA, SEC cybersecurity rules
                </p>
                <p className="font-semibold">Recommendations:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Multi-factor authentication (MFA) before workflow execution</li>
                  <li>• Transaction signing with cryptographic signatures</li>
                  <li>• Enhanced audit logging with timestamps</li>
                  <li>• Do not process credit card data—use payment provider APIs instead</li>
                  <li>• Generate compliance reports for regulators</li>
                </ul>
              </CardContent>
            </Card>

            {/* Public Sector */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-chart-2/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-chart-2" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">Public Sector / Government</CardTitle>
                    <CardDescription>Federal, state, local government agencies</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">
                  <strong>Key Regulations:</strong> FedRAMP, NIST 800-53, FISMA, state-specific laws
                </p>
                <p className="font-semibold">Recommendations:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• On-premise deployment for data residency requirements</li>
                  <li>• FedRAMP controls—implement NIST 800-53 security controls</li>
                  <li>• Air-gapped operation for classified environments</li>
                  <li>• Enhanced audit trails for FOIA compliance</li>
                  <li>• Use local AI models—avoid commercial AI providers</li>
                </ul>
              </CardContent>
            </Card>

            {/* Legal Services */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-chart-3" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">Legal Services</CardTitle>
                    <CardDescription>Law firms, corporate legal departments</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">
                  <strong>Key Concerns:</strong> Attorney-client privilege, confidentiality, ethics rules
                </p>
                <p className="font-semibold">Recommendations:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Encryption at rest for client data</li>
                  <li>• Access controls with per-case permissions and Chinese Wall policies</li>
                  <li>• Audit trails for document access and privilege logs</li>
                  <li>• Redaction workflows—use PII detection nodes</li>
                  <li>• Vendor due diligence for AI providers</li>
                </ul>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">Education</CardTitle>
                    <CardDescription>Schools, universities, EdTech platforms</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">
                  <strong>Key Regulations:</strong> FERPA (student records), COPPA (children under 13)
                </p>
                <p className="font-semibold">Recommendations:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Age verification—no children under 13 without parental consent (COPPA)</li>
                  <li>• FERPA compliance for student education records</li>
                  <li>• De-identification—strip student identifiers before AI processing</li>
                  <li>• Parental controls to review and delete student data</li>
                  <li>• Transparency about AI usage in educational settings</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Best Practices */}
        <section id="best-practices" className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Compliance Best Practices</h2>

          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">1. Know Your Compliance Requirements</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="mb-2">Before deploying TopFlow in production:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Identify which regulations apply to your organization and use case</li>
                  <li>• Document specific technical requirements (encryption standards, audit logging, etc.)</li>
                  <li>• Understand data residency requirements (EU data stays in EU, etc.)</li>
                  <li>• Review AI provider compliance certifications (SOC 2, ISO 27001, etc.)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">2. Implement Defense-in-Depth</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="mb-2">Layer multiple security controls:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>Network layer</strong> - TLS 1.3, rate limiting, DDoS protection</li>
                  <li>• <strong>Application layer</strong> - Input validation, SSRF prevention, cycle detection</li>
                  <li>• <strong>Data layer</strong> - Encryption at rest, secure key management</li>
                  <li>• <strong>Monitoring layer</strong> - Audit logging, anomaly detection, alerting</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">3. Document Everything</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="mb-2">For audit readiness:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Maintain a data flow diagram showing where data goes</li>
                  <li>• Document security controls and their implementation</li>
                  <li>• Keep version history of compliance-related code changes</li>
                  <li>• Create runbooks for incident response</li>
                  <li>• Generate compliance reports (SOC 2, GDPR, etc.)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">4. Use Code Export for Audit Trails</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="mb-2">
                  TopFlow's code export feature generates <strong>production-ready TypeScript</strong> from your
                  workflows. This provides:
                </p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>Audit trail</strong> - Exact code that runs in production</li>
                  <li>• <strong>Version control</strong> - Commit exported code to git for history</li>
                  <li>• <strong>Code review</strong> - Security team can review exported TypeScript</li>
                  <li>• <strong>Compliance evidence</strong> - Show auditors the actual implementation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">5. Regular Security Reviews</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="mb-2">Maintain security posture over time:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>Quarterly</strong> - Review access controls, update dependencies, check audit logs</li>
                  <li>
                    • <strong>Annually</strong> - Penetration testing, compliance assessment, security training
                  </li>
                  <li>• <strong>On change</strong> - Security review for new workflows or integrations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">6. Vendor Management</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="mb-2">For AI providers (OpenAI, Anthropic, Google, Groq):</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Review their security certifications (SOC 2, ISO 27001, GDPR compliance)</li>
                  <li>• Sign Data Processing Agreements (DPA) or Business Associate Agreements (BAA) as needed</li>
                  <li>• Monitor for security advisories and update API versions</li>
                  <li>• Have backup providers in case of outages or policy changes</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">7. Train Your Team</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="mb-2">Compliance is not just technical:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Train developers on secure coding practices (OWASP Top 10, AI-specific threats)</li>
                  <li>• Educate users on data handling best practices (don't include PII in prompts)</li>
                  <li>• Establish clear policies for workflow creation and review</li>
                  <li>• Create incident response procedures everyone understands</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Related Nodes */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Related Documentation</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Security Validations</CardTitle>
                <CardDescription>12 security checks for workflow execution</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/docs/security/validations">
                    View Documentation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Security Architecture</CardTitle>
                <CardDescription>Defense-in-depth security layers</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/docs/security/architecture">
                    View Documentation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Workflows 101</CardTitle>
                <CardDescription>Build secure workflows from scratch</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/docs/learn/workflows-101">
                    View Documentation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">GDPR Automation Workflow</CardTitle>
                <CardDescription>Pre-built template for GDPR compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/blog/gdpr-automation-3-minutes">
                    View Blog Post
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mt-12 rounded-lg border-2 border-primary/20 bg-primary/5 p-8">
          <h2 className="mb-4 text-2xl font-semibold">Next Steps</h2>
          <p className="mb-6 text-muted-foreground">
            Continue learning about security features and implementation:
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/docs/security/validations">
                <Shield className="mr-2 h-4 w-4" />
                Security Validations
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/docs/security/architecture">Security Architecture</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/docs/learn/best-practices">
                <FileText className="mr-2 h-4 w-4" />
                Best Practices
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  )
}
