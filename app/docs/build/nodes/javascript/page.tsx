import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Code2, Shield, AlertTriangle, CheckCircle2, ArrowRight, Lightbulb } from "lucide-react"
import Link from "next/link"
import { SidebarPortal } from "@/components/docs/sidebar-portal"
import { TOCPortal } from "@/components/docs/toc-portal"

export const metadata: Metadata = {
  title: "JavaScript Node - Node Reference | TopFlow Build",
  description:
    "Complete reference for the JavaScript Node in TopFlow. Transform data, parse JSON, extract fields, and implement custom logic with sandboxed JavaScript execution. Perfect for data manipulation between nodes.",
  keywords: [
    "javascript node",
    "data transformation",
    "json parsing",
    "custom logic",
    "data manipulation",
    "field extraction",
    "code execution",
    "topflow nodes",
    "workflow automation",
    "sandboxed execution",
  ],
  openGraph: {
    title: "JavaScript Node - Node Reference | TopFlow Build",
    description:
      "Transform data, parse JSON, and implement custom logic with sandboxed JavaScript execution. Essential for data manipulation in workflows.",
    type: "article",
    url: "https://www.topflow.dev/docs/build/nodes/javascript",
  },
}


const tocItems = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "configuration", title: "Configuration", level: 2 },
  { id: "input-output", title: "Input & Output", level: 2 },
  { id: "interface", title: "Node Data Interface", level: 2 },
  { id: "examples", title: "Usage Examples", level: 2 },
  { id: "security", title: "Security Considerations", level: 2 },
  { id: "validation", title: "Validation Rules", level: 2 },
  { id: "code-generation", title: "Code Generation", level: 2 },
  { id: "best-practices", title: "Best Practices", level: 2 },
  { id: "related", title: "Related Nodes", level: 2 },
]

export default function JavaScriptNodePage() {
  return (
    <>
      <SidebarPortal currentTab="build" />
      <TOCPortal items={tocItems} />

      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Code2 className="h-3 w-3" />
              Data Transformation
            </Badge>
            <Badge variant="secondary">P0 - Critical</Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">JavaScript Node</h1>
          <p className="text-xl text-muted-foreground">
            Execute custom JavaScript code to transform data, parse JSON, extract fields, and implement business logic
            between workflow nodes. Sandboxed execution ensures security.
          </p>
        </div>

        {/* Security Alert */}
        <Alert className="mb-8 border-blue-500/50 bg-blue-500/10">
          <Shield className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-sm">
            <strong>Sandboxed Execution:</strong> JavaScript code runs in a limited scope with no access to global
            objects, file system, or network. Only input variables and the return value are accessible.
          </AlertDescription>
        </Alert>

        {/* Overview */}
        <section id="overview" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Overview</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              The JavaScript node is one of the most versatile nodes in TopFlow. It enables you to write custom
              JavaScript code that runs during workflow execution, allowing you to transform data, implement business
              logic, parse complex responses, and manipulate data structures between nodes.
            </p>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Common Use Cases</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    1
                  </div>
                  <div>
                    <strong>JSON Parsing & Field Extraction</strong> - Extract specific fields from complex API
                    responses, nested objects, or arrays
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    2
                  </div>
                  <div>
                    <strong>Data Transformation</strong> - Convert data formats, restructure objects, merge data from
                    multiple sources
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    3
                  </div>
                  <div>
                    <strong>Calculations & Aggregations</strong> - Perform math operations, calculate statistics, sum
                    values, compute averages
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    4
                  </div>
                  <div>
                    <strong>String Manipulation</strong> - Format text, concatenate strings, extract substrings, apply
                    templates
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    5
                  </div>
                  <div>
                    <strong>Business Logic</strong> - Implement custom validation rules, scoring algorithms, risk
                    calculations
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    6
                  </div>
                  <div>
                    <strong>Array Operations</strong> - Filter arrays, map values, reduce data, sort elements
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Configuration */}
        <section id="configuration" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Configuration</h2>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Required Parameters</CardTitle>
              <CardDescription>These fields must be configured for the node to execute</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <code className="rounded bg-muted px-2 py-1 text-sm font-mono">code</code>
                  <Badge variant="outline" className="text-xs">
                    string
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  JavaScript code to execute. Code must return a value using the <code>return</code> keyword. Inputs
                  from upstream nodes are available as variables: <code>input1</code>, <code>input2</code>,{" "}
                  <code>input3</code>, etc.
                </p>

                <Alert className="mt-3 border-amber-500/50 bg-amber-500/10">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <AlertDescription className="text-sm">
                    <strong>Tip:</strong> The code editor in TopFlow provides syntax highlighting and basic error
                    detection. Use <code>console.log()</code> statements for debugging (output appears in execution
                    logs).
                  </AlertDescription>
                </Alert>

                <div className="mt-4 space-y-2">
                  <strong className="text-sm">Example Code:</strong>
                  <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                    <code>{`// Parse JSON and extract specific field
const data = JSON.parse(input1)
return data.user.email

// Calculate severity score
const score = (input1.critical * 10) + (input1.high * 5)
return score >= 50 ? "HIGH" : "MEDIUM"

// Transform array
const threats = JSON.parse(input1)
return threats
  .filter(t => t.severity === "CRITICAL")
  .map(t => t.title)
  .join(", ")`}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Input & Output */}
        <section id="input-output" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Input & Output Specification</h2>

          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Input Variables</CardTitle>
                <CardDescription>How upstream node outputs become available in your code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  When nodes connect to the JavaScript node, their outputs become available as numbered input variables:
                </p>

                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <code className="rounded bg-muted px-2 py-1 text-sm font-mono">input1</code>
                    <span className="text-sm text-muted-foreground">
                      Output from the first upstream node (leftmost connection)
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <code className="rounded bg-muted px-2 py-1 text-sm font-mono">input2</code>
                    <span className="text-sm text-muted-foreground">Output from the second upstream node</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <code className="rounded bg-muted px-2 py-1 text-sm font-mono">input3</code>
                    <span className="text-sm text-muted-foreground">Output from the third upstream node</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <code className="rounded bg-muted px-2 py-1 text-sm font-mono">...</code>
                    <span className="text-sm text-muted-foreground">And so on for additional connections</span>
                  </div>
                </div>

                <Alert className="border-blue-500/50 bg-blue-500/10">
                  <Lightbulb className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-sm">
                    <strong>Input Ordering:</strong> Inputs are numbered based on the X position (left-to-right) of the
                    source nodes on the canvas. The leftmost connected node becomes <code>input1</code>.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Output Value</CardTitle>
                <CardDescription>What downstream nodes receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your JavaScript code must return a value using the <code>return</code> keyword. This value becomes
                  the output that downstream nodes can access.
                </p>

                <div className="space-y-2">
                  <strong className="text-sm">Supported Return Types:</strong>
                  <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                    <li>
                      <strong>String</strong> - Text data, JSON strings, formatted output
                    </li>
                    <li>
                      <strong>Number</strong> - Integers, floats, calculated values
                    </li>
                    <li>
                      <strong>Boolean</strong> - true/false for conditional logic
                    </li>
                    <li>
                      <strong>Object</strong> - Structured data with multiple fields
                    </li>
                    <li>
                      <strong>Array</strong> - Lists of values or objects
                    </li>
                    <li>
                      <strong>null/undefined</strong> - Empty or missing values
                    </li>
                  </ul>
                </div>

                <div className="mt-4 space-y-2">
                  <strong className="text-sm">Example Return Values:</strong>
                  <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                    <code>{`// Return string
return "HIGH"

// Return number
return 42

// Return object
return {
  severity: "CRITICAL",
  count: 5,
  timestamp: new Date().toISOString()
}

// Return array
return ["threat1", "threat2", "threat3"]

// Return boolean
return score >= 50`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Node Data Interface */}
        <section id="interface" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Node Data Interface</h2>
          <p className="mb-4 text-muted-foreground">
            TypeScript interface defining the JavaScript node's configuration and execution state:
          </p>

          <Card className="border-2">
            <CardContent className="pt-6">
              <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{`export type JavaScriptNodeData = {
  // Configuration
  code: string  // JavaScript code to execute

  // Execution state (managed by system)
  status?: "idle" | "running" | "completed" | "error"
  output?: any  // Return value from executed code
  error?: string
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* Usage Examples */}
        <section id="examples" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Usage Examples</h2>

          <div className="space-y-6">
            {/* Example 1: JSON Parsing */}
            <Card className="border-2 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Example 1: Parse JSON and Extract Fields</CardTitle>
                <CardDescription>Extract specific fields from API response</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">Scenario:</strong>
                    <p className="text-sm text-muted-foreground">
                      HTTP Request node returns complex JSON. You need to extract just the email addresses.
                    </p>
                  </div>

                  <div>
                    <strong className="text-sm">Input (from HTTP Request node):</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`{
  "status": 200,
  "data": {
    "users": [
      { "id": 1, "name": "Alice", "email": "alice@example.com" },
      { "id": 2, "name": "Bob", "email": "bob@example.com" }
    ]
  }
}`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">JavaScript Code:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`// Parse the HTTP response and extract emails
const response = input1
const users = response.data.users

// Map to just email addresses
const emails = users.map(user => user.email)

// Return as comma-separated string
return emails.join(", ")`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Output:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>"alice@example.com, bob@example.com"</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Example 2: Severity Calculation */}
            <Card className="border-2 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Example 2: Calculate Threat Severity Score</CardTitle>
                <CardDescription>Compute risk score from multiple factors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">Scenario:</strong>
                    <p className="text-sm text-muted-foreground">
                      Text Model node analyzes security events and returns threat counts. Calculate a severity score to
                      determine alerting priority.
                    </p>
                  </div>

                  <div>
                    <strong className="text-sm">Input (from Text Model node):</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`{
  "critical": 2,
  "high": 5,
  "medium": 10,
  "low": 20
}`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">JavaScript Code:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`// Parse threat counts
const threats = JSON.parse(input1)

// Calculate weighted severity score
// Critical: 10 points, High: 5 points, Medium: 2 points, Low: 1 point
const score =
  (threats.critical * 10) +
  (threats.high * 5) +
  (threats.medium * 2) +
  (threats.low * 1)

// Determine severity level
let severity
if (score >= 50) severity = "CRITICAL"
else if (score >= 25) severity = "HIGH"
else if (score >= 10) severity = "MEDIUM"
else severity = "LOW"

// Return structured result
return {
  score: score,
  severity: severity,
  requires_immediate_action: score >= 50,
  threat_summary: \`\${threats.critical} critical, \${threats.high} high, \${threats.medium} medium, \${threats.low} low\`
}`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Output:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`{
  "score": 65,
  "severity": "CRITICAL",
  "requires_immediate_action": true,
  "threat_summary": "2 critical, 5 high, 10 medium, 20 low"
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Example 3: Data Merging */}
            <Card className="border-2 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Example 3: Merge Data from Multiple Sources</CardTitle>
                <CardDescription>Combine outputs from multiple upstream nodes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">Scenario:</strong>
                    <p className="text-sm text-muted-foreground">
                      Two parallel HTTP Request nodes fetch user data and threat data. Merge them into a single report.
                    </p>
                  </div>

                  <div>
                    <strong className="text-sm">Inputs:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`// input1 - User data from API
{
  "user_id": "123",
  "username": "john.doe",
  "department": "Engineering"
}

// input2 - Threat data from security system
{
  "threats_detected": 3,
  "last_incident": "2024-01-15",
  "risk_level": "HIGH"
}`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">JavaScript Code:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`// Parse both inputs
const userData = JSON.parse(input1)
const threatData = JSON.parse(input2)

// Merge into comprehensive report
return {
  report_timestamp: new Date().toISOString(),
  user: {
    id: userData.user_id,
    name: userData.username,
    department: userData.department
  },
  security: {
    threat_count: threatData.threats_detected,
    last_incident: threatData.last_incident,
    risk_level: threatData.risk_level,
    requires_review: threatData.threats_detected > 0
  },
  summary: \`User \${userData.username} has \${threatData.threats_detected} threats detected. Risk level: \${threatData.risk_level}\`
}`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Output:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`{
  "report_timestamp": "2024-01-15T10:30:00.000Z",
  "user": {
    "id": "123",
    "name": "john.doe",
    "department": "Engineering"
  },
  "security": {
    "threat_count": 3,
    "last_incident": "2024-01-15",
    "risk_level": "HIGH",
    "requires_review": true
  },
  "summary": "User john.doe has 3 threats detected. Risk level: HIGH"
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Example 4: Array Filtering */}
            <Card className="border-2 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Example 4: Filter and Transform Arrays</CardTitle>
                <CardDescription>Process lists of items from upstream nodes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">Scenario:</strong>
                    <p className="text-sm text-muted-foreground">
                      HTTP Request node returns list of CVEs. Filter to only critical vulnerabilities affecting your
                      systems.
                    </p>
                  </div>

                  <div>
                    <strong className="text-sm">Input (from HTTP Request node):</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`{
  "threats": [
    {
      "id": "CVE-2024-1234",
      "severity": "CRITICAL",
      "cvss": 9.8,
      "affected_systems": ["web-server-01", "api-gateway"]
    },
    {
      "id": "CVE-2024-5678",
      "severity": "MEDIUM",
      "cvss": 6.5,
      "affected_systems": ["marketing-site"]
    },
    {
      "id": "CVE-2024-9012",
      "severity": "CRITICAL",
      "cvss": 9.1,
      "affected_systems": ["gitlab-enterprise"]
    }
  ]
}`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">JavaScript Code:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`// Parse threat data
const data = JSON.parse(input1)

// Filter to critical threats only
const criticalThreats = data.threats.filter(threat =>
  threat.severity === "CRITICAL"
)

// Transform to simplified format
const summary = criticalThreats.map(threat => ({
  cve: threat.id,
  score: threat.cvss,
  systems: threat.affected_systems.join(", "),
  priority: threat.cvss >= 9.5 ? "URGENT" : "HIGH"
}))

// Return count and details
return {
  critical_count: criticalThreats.length,
  threats: summary,
  alert_message: \`⚠️ \${criticalThreats.length} critical vulnerabilities detected requiring immediate attention\`
}`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Output:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`{
  "critical_count": 2,
  "threats": [
    {
      "cve": "CVE-2024-1234",
      "score": 9.8,
      "systems": "web-server-01, api-gateway",
      "priority": "URGENT"
    },
    {
      "cve": "CVE-2024-9012",
      "score": 9.1,
      "systems": "gitlab-enterprise",
      "priority": "HIGH"
    }
  ],
  "alert_message": "⚠️ 2 critical vulnerabilities detected requiring immediate attention"
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Example 5: String Formatting */}
            <Card className="border-2 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Example 5: Format Data for Downstream Services</CardTitle>
                <CardDescription>Transform data into specific format required by external APIs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">Scenario:</strong>
                    <p className="text-sm text-muted-foreground">
                      Text Model generates security analysis. Format it for Slack notification with proper markdown and
                      emoji.
                    </p>
                  </div>

                  <div>
                    <strong className="text-sm">Input (from Text Model node):</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`{
  "event_type": "Suspicious Login",
  "severity": "HIGH",
  "user": "john.doe",
  "ip_address": "203.0.113.42",
  "country": "Unknown",
  "timestamp": "2024-01-15T10:30:00Z",
  "recommendation": "Force password reset and review account activity"
}`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">JavaScript Code:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`// Parse security event
const event = JSON.parse(input1)

// Map severity to emoji
const severityEmoji = {
  "CRITICAL": "🔴",
  "HIGH": "🟠",
  "MEDIUM": "🟡",
  "LOW": "🟢"
}

// Format timestamp
const date = new Date(event.timestamp)
const formattedTime = date.toLocaleString("en-US", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZoneName: "short"
})

// Build Slack-formatted message
return {
  text: \`\${severityEmoji[event.severity]} Security Alert: \${event.event_type}\`,
  blocks: [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: \`\${severityEmoji[event.severity]} Security Alert: \${event.event_type}\`
      }
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: \`*Severity:*\\n\${event.severity}\` },
        { type: "mrkdwn", text: \`*User:*\\n\${event.user}\` },
        { type: "mrkdwn", text: \`*IP Address:*\\n\${event.ip_address}\` },
        { type: "mrkdwn", text: \`*Time:*\\n\${formattedTime}\` }
      ]
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: \`*Recommendation:*\\n\${event.recommendation}\`
      }
    }
  ]
}`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Output (ready for Slack webhook):</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">
                    <code>{`{
  "text": "🟠 Security Alert: Suspicious Login",
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🟠 Security Alert: Suspicious Login"
      }
    },
    {
      "type": "section",
      "fields": [
        { "type": "mrkdwn", "text": "*Severity:*\\nHIGH" },
        { "type": "mrkdwn", "text": "*User:*\\njohn.doe" },
        { "type": "mrkdwn", "text": "*IP Address:*\\n203.0.113.42" },
        { "type": "mrkdwn", "text": "*Time:*\\nJan 15, 10:30 AM UTC" }
      ]
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Recommendation:*\\nForce password reset and review account activity"
      }
    }
  ]
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Security Considerations */}
        <section id="security" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Security Considerations</h2>

          <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
            <Shield className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-sm">
              <strong>Sandboxed Execution:</strong> JavaScript code runs in a limited scope using <code>new Function()</code>.
              While this provides basic isolation, it's not a full security sandbox. Avoid executing untrusted code.
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Execution Limitations</CardTitle>
                <CardDescription>What's available and what's not in your JavaScript code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <strong className="text-sm text-green-600 dark:text-green-400">✓ Available:</strong>
                  <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                    <li>
                      <strong>Input variables</strong> - <code>input1</code>, <code>input2</code>, etc.
                    </li>
                    <li>
                      <strong>Standard JavaScript features</strong> - Array methods, String methods, Object methods,
                      Math functions
                    </li>
                    <li>
                      <strong>JSON operations</strong> - <code>JSON.parse()</code>, <code>JSON.stringify()</code>
                    </li>
                    <li>
                      <strong>Date/Time</strong> - <code>new Date()</code>, date formatting
                    </li>
                    <li>
                      <strong>console.log()</strong> - For debugging (appears in execution logs)
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <strong className="text-sm text-red-600 dark:text-red-400">✗ Not Available:</strong>
                  <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                    <li>
                      <strong>File system access</strong> - No <code>fs</code> module, can't read/write files
                    </li>
                    <li>
                      <strong>Network access</strong> - No <code>fetch()</code>, <code>XMLHttpRequest</code>, or HTTP
                      clients
                    </li>
                    <li>
                      <strong>Global objects</strong> - No <code>window</code>, <code>document</code>,{" "}
                      <code>process</code>, <code>require()</code>
                    </li>
                    <li>
                      <strong>Async operations</strong> - No <code>setTimeout()</code>, <code>setInterval()</code>,{" "}
                      <code>Promise</code> (code runs synchronously)
                    </li>
                    <li>
                      <strong>External modules</strong> - No <code>import</code> or <code>require()</code>
                    </li>
                  </ul>
                </div>

                <Alert className="border-red-500/50 bg-red-500/10">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-sm">
                    <strong>Known Limitation:</strong> The JavaScript node uses <code>new Function()</code> which still
                    has access to closures and the outer scope. This is NOT a fully secure sandbox. Do not execute
                    untrusted or user-provided code.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Best Practices for Secure Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <div>
                    <strong className="text-sm">Validate inputs</strong>
                    <p className="text-sm text-muted-foreground">
                      Always validate input data before processing. Check for null/undefined, expected data types, and
                      required fields.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <div>
                    <strong className="text-sm">Handle errors gracefully</strong>
                    <p className="text-sm text-muted-foreground">
                      Use try-catch blocks for operations that might fail (JSON parsing, property access on undefined
                      objects).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <div>
                    <strong className="text-sm">Avoid infinite loops</strong>
                    <p className="text-sm text-muted-foreground">
                      JavaScript execution has a timeout (30 seconds). Infinite loops will cause workflow failure.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <div>
                    <strong className="text-sm">Keep code focused</strong>
                    <p className="text-sm text-muted-foreground">
                      Each JavaScript node should do one thing well. Break complex logic into multiple nodes for better
                      debugging and reusability.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Validation Rules */}
        <section id="validation" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Validation Rules</h2>
          <p className="mb-4 text-muted-foreground">
            The JavaScript node is validated before execution. Validation errors will block workflow execution.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Errors */}
            <Card className="border-2 border-red-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-4 w-4" />
                  Errors (Block Execution)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-mono text-red-600 dark:text-red-400">✕</span>
                  <span>Missing required field: <code>code</code></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-red-600 dark:text-red-400">✕</span>
                  <span>Empty code field (no JavaScript provided)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-red-600 dark:text-red-400">✕</span>
                  <span>
                    Syntax error in JavaScript code (detected by parser)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-red-600 dark:text-red-400">✕</span>
                  <span>Code references undefined input variables (e.g., <code>input3</code> with only 2 connections)</span>
                </div>
              </CardContent>
            </Card>

            {/* Warnings */}
            <Card className="border-2 border-amber-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  Warnings (Don't Block)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-mono text-amber-600 dark:text-amber-400">⚠</span>
                  <span>
                    No <code>return</code> statement found (code will return <code>undefined</code>)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-amber-600 dark:text-amber-400">⚠</span>
                  <span>Code is very long (&gt;500 lines) - Consider breaking into multiple nodes</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-amber-600 dark:text-amber-400">⚠</span>
                  <span>Code contains potentially expensive operations (nested loops with large arrays)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-amber-600 dark:text-amber-400">⚠</span>
                  <span>No upstream connections (no input variables available)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Code Generation */}
        <section id="code-generation" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Code Generation</h2>
          <p className="mb-4 text-muted-foreground">
            When you export your workflow to TypeScript code, the JavaScript node's code is embedded directly into the
            generated function:
          </p>

          <div className="space-y-4">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-base">Generated Code (Workflow Function Export)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">
                  <code>{`// JavaScript Node: Calculate severity score
const node_javascript1 = (() => {
  // Your JavaScript code is inserted here
  const threats = JSON.parse(input1)

  const score =
    (threats.critical * 10) +
    (threats.high * 5) +
    (threats.medium * 2) +
    (threats.low * 1)

  let severity
  if (score >= 50) severity = "CRITICAL"
  else if (score >= 25) severity = "HIGH"
  else if (score >= 10) severity = "MEDIUM"
  else severity = "LOW"

  return {
    score: score,
    severity: severity,
    requires_immediate_action: score >= 50
  }
})()

// Result is available for downstream nodes
const javascript1_result = node_javascript1`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-base">Generated Code (Route Handler Export)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">
                  <code>{`export async function POST(req: Request) {
  // ... previous nodes ...

  // JavaScript Node: Calculate severity score
  try {
    const node_javascript1 = (() => {
      // Input variables from upstream nodes
      const input1 = node_textModel1

      // Your JavaScript code
      const threats = JSON.parse(input1)

      const score =
        (threats.critical * 10) +
        (threats.high * 5) +
        (threats.medium * 2) +
        (threats.low * 1)

      let severity
      if (score >= 50) severity = "CRITICAL"
      else if (score >= 25) severity = "HIGH"
      else if (score >= 10) severity = "MEDIUM"
      else severity = "LOW"

      return {
        score: score,
        severity: severity,
        requires_immediate_action: score >= 50
      }
    })()

    const javascript1_result = node_javascript1
  } catch (error) {
    return Response.json(
      { error: \`JavaScript execution failed: \${error.message}\` },
      { status: 500 }
    )
  }

  // ... downstream nodes ...

  return Response.json({
    success: true,
    outputs: { javascript1: javascript1_result }
  })
}`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Best Practices */}
        <section id="best-practices" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Best Practices</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Do's */}
            <Card className="border-2 border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Do
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Always return a value</strong> using the <code>return</code> keyword so downstream nodes
                    have data to work with
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Validate inputs before processing</strong> - Check for null/undefined and expected data
                    types
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Use try-catch for error handling</strong> when parsing JSON or accessing nested properties
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Keep code focused and simple</strong> - One JavaScript node should do one thing well
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Use console.log() for debugging</strong> - Output appears in execution logs during testing
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Add comments explaining complex logic</strong> - Future you (and team members) will thank
                    you
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Return structured objects</strong> for complex data rather than concatenated strings
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Don'ts */}
            <Card className="border-2 border-red-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-4 w-4" />
                  Don't
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't use async/await or Promises</strong> - Code runs synchronously only
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't create infinite loops</strong> - Workflow execution will timeout after 30 seconds
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't access global objects</strong> - <code>window</code>, <code>document</code>,{" "}
                    <code>process</code> are not available
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't execute untrusted code</strong> - The sandbox is not fully secure
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't put all logic in one massive node</strong> - Break complex workflows into multiple
                    JavaScript nodes
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't forget to test with real data</strong> - Validation passes but runtime errors are
                    common
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't reference undefined inputs</strong> - Check how many nodes are connected before using{" "}
                    <code>input3</code>
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Common Patterns */}
          <Card className="mt-6 border-2">
            <CardHeader>
              <CardTitle className="text-lg">Common Code Patterns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <strong className="text-sm">Safe JSON Parsing:</strong>
                <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                  <code>{`try {
  const data = JSON.parse(input1)
  return data.someField
} catch (error) {
  console.log("JSON parse error:", error.message)
  return null
}`}</code>
                </pre>
              </div>

              <div className="space-y-2">
                <strong className="text-sm">Safe Property Access:</strong>
                <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                  <code>{`// Use optional chaining and nullish coalescing
const email = data?.user?.email ?? "unknown@example.com"
const count = data?.threats?.length ?? 0`}</code>
                </pre>
              </div>

              <div className="space-y-2">
                <strong className="text-sm">Input Validation:</strong>
                <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                  <code>{`if (!input1 || typeof input1 !== "string") {
  return { error: "Invalid input: expected string" }
}

const data = JSON.parse(input1)
if (!data.threats || !Array.isArray(data.threats)) {
  return { error: "Invalid data structure" }
}

// Proceed with processing...`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Related Nodes */}
        <section id="related" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Related Nodes</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-2 transition-all hover:border-primary/50">
              <CardHeader>
                <CardTitle className="text-base">Conditional Node</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Branch workflow based on conditions. Use JavaScript node to calculate values, then Conditional node
                  to decide the path.
                </p>
                <Link
                  href="/docs/build/nodes/conditional"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  View docs <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-primary/50">
              <CardHeader>
                <CardTitle className="text-base">HTTP Request Node</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Fetch external data via APIs. Use JavaScript node to parse and transform the API responses.
                </p>
                <Link
                  href="/docs/build/nodes/http-request"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  View docs <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-primary/50">
              <CardHeader>
                <CardTitle className="text-base">Structured Output Node</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Extract structured data from AI model outputs. JavaScript node provides more flexibility for custom schemas.</p>
                <Link
                  href="/docs/build/nodes/structured-output"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  View docs <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Next Steps */}
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
              <div>
                <Link href="/docs/build/workflows" className="font-medium text-primary hover:underline">
                  Workflow Patterns
                </Link>
                <p className="text-sm text-muted-foreground">
                  Learn common patterns for data transformation and processing in multi-node workflows
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
              <div>
                <Link href="/docs/learn/workflows-101" className="font-medium text-primary hover:underline">
                  Workflows 101
                </Link>
                <p className="text-sm text-muted-foreground">
                  Understand how data flows between nodes and how to use variable interpolation effectively
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
              <div>
                <Link href="/docs/build/nodes/conditional" className="font-medium text-primary hover:underline">
                  Conditional Node
                </Link>
                <p className="text-sm text-muted-foreground">
                  Combine JavaScript calculations with conditional branching for dynamic workflows
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
