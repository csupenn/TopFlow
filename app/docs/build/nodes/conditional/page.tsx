import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GitBranch, Shield, AlertTriangle, CheckCircle2, ArrowRight, Lightbulb } from "lucide-react"
import Link from "next/link"
import { SidebarPortal } from "@/components/docs/sidebar-portal"
import { TOCPortal } from "@/components/docs/toc-portal"

export const metadata: Metadata = {
  title: "Conditional Node - Node Reference | TopFlow Build",
  description:
    "Complete reference for the Conditional Node in TopFlow. Branch workflows based on conditions like HTTP status codes, severity levels, or custom logic. Two output paths (true/false) enable dynamic workflow routing.",
  keywords: [
    "conditional node",
    "workflow branching",
    "if then else",
    "conditional logic",
    "dynamic routing",
    "flow control",
    "topflow nodes",
    "decision node",
    "branch logic",
  ],
  openGraph: {
    title: "Conditional Node - Node Reference | TopFlow Build",
    description:
      "Branch workflows dynamically based on conditions. Check HTTP status codes, severity levels, or implement custom logic with two output paths.",
    type: "article",
    url: "https://www.topflow.dev/docs/build/nodes/conditional",
  },
}


const tocItems = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "configuration", title: "Configuration", level: 2 },
  { id: "branching", title: "How Branching Works", level: 2 },
  { id: "interface", title: "Node Data Interface", level: 2 },
  { id: "examples", title: "Usage Examples", level: 2 },
  { id: "validation", title: "Validation Rules", level: 2 },
  { id: "code-generation", title: "Code Generation", level: 2 },
  { id: "best-practices", title: "Best Practices", level: 2 },
  { id: "related", title: "Related Nodes", level: 2 },
]

export default function ConditionalNodePage() {
  return (
    <>
      <SidebarPortal currentTab="build" />
      <TOCPortal items={tocItems} />

      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <GitBranch className="h-3 w-3" />
              Flow Control
            </Badge>
            <Badge variant="secondary">P0 - Critical</Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Conditional Node</h1>
          <p className="text-xl text-muted-foreground">
            Branch your workflow based on conditions. Evaluate JavaScript expressions to route execution down one of
            two paths (true or false), enabling dynamic workflows that adapt to data.
          </p>
        </div>

        {/* Visual Guide */}
        <Alert className="mb-8 border-blue-500/50 bg-blue-500/10">
          <GitBranch className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-sm">
            <strong>Two Output Paths:</strong> The Conditional node has two output handles - one for when the condition
            is <code>true</code>, and one for when it's <code>false</code>. Only the matching path executes.
          </AlertDescription>
        </Alert>

        {/* Overview */}
        <section id="overview" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Overview</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              The Conditional node enables dynamic workflow routing based on data from upstream nodes. It evaluates a
              JavaScript expression and directs execution down either the "true" path or the "false" path, similar to an
              if/else statement in programming.
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
                    <strong>HTTP Status Code Routing</strong> - Check if API request succeeded (status 200) or failed,
                    then route to success or error handling paths
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    2
                  </div>
                  <div>
                    <strong>Severity-Based Alerting</strong> - Route high-severity incidents to PagerDuty (immediate
                    alert) and low-severity to Slack (notification only)
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    3
                  </div>
                  <div>
                    <strong>Threshold Checking</strong> - Execute different actions based on numeric thresholds (e.g.,
                    threat score &gt; 50)
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    4
                  </div>
                  <div>
                    <strong>Data Validation</strong> - Check if required fields exist or data meets criteria before
                    proceeding with processing
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    5
                  </div>
                  <div>
                    <strong>A/B Testing</strong> - Route workflow execution based on feature flags or experiment
                    conditions
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    6
                  </div>
                  <div>
                    <strong>Rate Limit Handling</strong> - Detect API rate limit errors (429 status) and route to retry
                    logic vs. normal processing
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
                  <code className="rounded bg-muted px-2 py-1 text-sm font-mono">condition</code>
                  <Badge variant="outline" className="text-xs">
                    string
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  JavaScript expression that evaluates to a boolean value (<code>true</code> or <code>false</code>).
                  Inputs from upstream nodes are available as variables: <code>input1</code>, <code>input2</code>,{" "}
                  <code>input3</code>, etc.
                </p>

                <Alert className="mt-3 border-amber-500/50 bg-amber-500/10">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <AlertDescription className="text-sm">
                    <strong>Tip:</strong> The condition must return a boolean. If it returns a non-boolean value,
                    JavaScript's truthy/falsy rules apply (empty strings, 0, null, undefined are falsy; everything else
                    is truthy).
                  </AlertDescription>
                </Alert>

                <div className="mt-4 space-y-2">
                  <strong className="text-sm">Example Conditions:</strong>
                  <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                    <code>{`// Check HTTP status code
input1.status === 200

// Check severity level
input1.severity === "CRITICAL" || input1.severity === "HIGH"

// Check threshold
JSON.parse(input1).score > 50

// Check if data exists
input1 && input1.length > 0

// Complex condition
input1.status === 200 && input1.data.threats.length > 0`}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* How Branching Works */}
        <section id="branching" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">How Branching Works</h2>

          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Two Output Handles</CardTitle>
                <CardDescription>Understanding true and false paths</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Unlike other nodes that have a single output handle, the Conditional node has two:
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 rounded-md border border-green-500/30 bg-green-500/10 p-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-xs font-semibold text-white">
                      ✓
                    </div>
                    <div>
                      <strong className="text-sm text-green-600 dark:text-green-400">True Output Handle</strong>
                      <p className="text-sm text-muted-foreground">
                        Downstream nodes connected to this handle execute when the condition evaluates to{" "}
                        <code>true</code>. In the generated code, this path is inside the <code>if</code> block.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-md border border-red-500/30 bg-red-500/10 p-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                      ✕
                    </div>
                    <div>
                      <strong className="text-sm text-red-600 dark:text-red-400">False Output Handle</strong>
                      <p className="text-sm text-muted-foreground">
                        Downstream nodes connected to this handle execute when the condition evaluates to{" "}
                        <code>false</code>. In the generated code, this path is inside the <code>else</code> block.
                      </p>
                    </div>
                  </div>
                </div>

                <Alert className="border-blue-500/50 bg-blue-500/10">
                  <Lightbulb className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-sm">
                    <strong>Important:</strong> Only one path executes per workflow run. If the condition is{" "}
                    <code>true</code>, the false path is completely skipped (and vice versa). This is different from
                    parallel execution where both paths would run.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="border-2 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Visual Example: Severity Routing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">Workflow Structure:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm font-mono">
                    <code>{`[Text Model Node]
       ↓
[JavaScript Node]  ← Calculate severity score
       ↓
[Conditional Node] ← Check if score >= 50
       ↓    ↓
    TRUE   FALSE
       ↓    ↓
[PagerDuty] [Slack]
 (Alert)   (Notify)`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Condition:</strong>
                    <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3 text-xs">
                      <code>input1.score &gt;= 50</code>
                    </pre>
                  </div>

                  <div>
                    <strong className="text-sm">Execution Flow:</strong>
                    <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                      <li>
                        If <code>input1.score = 75</code> → Condition is <code>true</code> → PagerDuty node executes →
                        Slack node is skipped
                      </li>
                      <li>
                        If <code>input1.score = 30</code> → Condition is <code>false</code> → Slack node executes →
                        PagerDuty node is skipped
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Node Data Interface */}
        <section id="interface" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Node Data Interface</h2>
          <p className="mb-4 text-muted-foreground">
            TypeScript interface defining the Conditional node's configuration and execution state:
          </p>

          <Card className="border-2">
            <CardContent className="pt-6">
              <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{`export type ConditionalNodeData = {
  // Configuration
  condition: string  // JavaScript expression that evaluates to boolean

  // Execution state (managed by system)
  status?: "idle" | "running" | "completed" | "error"
  output?: boolean  // Result of condition evaluation (true or false)
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
            {/* Example 1: HTTP Status Check */}
            <Card className="border-2 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Example 1: HTTP Status Code Routing</CardTitle>
                <CardDescription>Route based on API request success/failure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">Scenario:</strong>
                    <p className="text-sm text-muted-foreground">
                      HTTP Request node calls external API. Route to success handler if status is 200, otherwise route
                      to error notification.
                    </p>
                  </div>

                  <div>
                    <strong className="text-sm">Input (from HTTP Request node):</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`{
  "status": 200,
  "statusText": "OK",
  "data": { "threats": [...] }
}`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Condition:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>input1.status === 200</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Workflow Structure:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm font-mono">
                    <code>{`[HTTP Request]
       ↓
[Conditional: status === 200]
       ↓            ↓
    TRUE          FALSE
       ↓            ↓
[Process Data]  [Slack Alert]
                  "API Failed"`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Result:</strong>
                    <p className="text-sm text-muted-foreground">
                      Status 200 → TRUE path → Process data normally
                      <br />
                      Status 500/404/etc. → FALSE path → Send Slack alert about API failure
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Example 2: Severity Routing */}
            <Card className="border-2 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Example 2: Severity-Based Alert Routing</CardTitle>
                <CardDescription>Send critical alerts to PagerDuty, others to Slack</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">Scenario:</strong>
                    <p className="text-sm text-muted-foreground">
                      Security analysis produces severity rating. Critical and high-severity incidents go to PagerDuty
                      (immediate response), medium and low go to Slack (monitoring only).
                    </p>
                  </div>

                  <div>
                    <strong className="text-sm">Input (from JavaScript node):</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`{
  "severity": "CRITICAL",
  "score": 85,
  "requires_immediate_action": true,
  "threat_summary": "2 critical vulnerabilities detected"
}`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Condition:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>input1.severity === "CRITICAL" || input1.severity === "HIGH"</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Workflow Structure:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm font-mono">
                    <code>{`[Text Model: Analyze]
       ↓
[JavaScript: Calculate Score]
       ↓
[Conditional: CRITICAL or HIGH?]
       ↓            ↓
    TRUE          FALSE
       ↓            ↓
[PagerDuty]     [Slack]
 (Page SOC)   (Notify Team)`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Result:</strong>
                    <p className="text-sm text-muted-foreground">
                      CRITICAL or HIGH → TRUE path → Create PagerDuty incident (wakes up on-call engineer)
                      <br />
                      MEDIUM or LOW → FALSE path → Post to Slack channel (team reviews during business hours)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Example 3: Threshold Check */}
            <Card className="border-2 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Example 3: Threshold-Based Processing</CardTitle>
                <CardDescription>Different actions based on numeric thresholds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">Scenario:</strong>
                    <p className="text-sm text-muted-foreground">
                      Calculate threat count from security logs. If count exceeds threshold (10 threats), trigger full
                      investigation workflow. Otherwise, just log for review.
                    </p>
                  </div>

                  <div>
                    <strong className="text-sm">Input (from JavaScript node):</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`{
  "threat_count": 15,
  "critical": 3,
  "high": 12
}`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Condition:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>input1.threat_count &gt; 10</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Workflow Structure:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm font-mono">
                    <code>{`[HTTP: Fetch Threats]
       ↓
[JavaScript: Count Threats]
       ↓
[Conditional: count > 10?]
       ↓              ↓
    TRUE            FALSE
       ↓              ↓
[Investigation]  [Log to Splunk]
  ↓
[Create Ticket]
  ↓
[Notify SOC]`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Result:</strong>
                    <p className="text-sm text-muted-foreground">
                      Count &gt; 10 → TRUE path → Full investigation (ticket + SOC notification + detailed analysis)
                      <br />
                      Count ≤ 10 → FALSE path → Simple logging to Splunk for later review
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Example 4: Data Validation */}
            <Card className="border-2 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Example 4: Data Validation Before Processing</CardTitle>
                <CardDescription>Check if required data exists before continuing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">Scenario:</strong>
                    <p className="text-sm text-muted-foreground">
                      API might return empty data. Validate that threat data exists before processing, otherwise skip
                      processing and send "no threats detected" message.
                    </p>
                  </div>

                  <div>
                    <strong className="text-sm">Input (from HTTP Request node):</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`{
  "status": 200,
  "data": {
    "threats": []  // Empty array - no threats
  }
}`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Condition:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>input1.data.threats && input1.data.threats.length &gt; 0</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Workflow Structure:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm font-mono">
                    <code>{`[HTTP: Fetch Threats]
       ↓
[Conditional: threats exist?]
       ↓              ↓
    TRUE            FALSE
       ↓              ↓
[Analyze Threats] [Slack]
  ↓             "All clear - no threats"
[Generate Report]`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Result:</strong>
                    <p className="text-sm text-muted-foreground">
                      Threats exist → TRUE path → Process threats, analyze, generate report
                      <br />
                      No threats → FALSE path → Send "all clear" message to Slack
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Example 5: Rate Limit Detection */}
            <Card className="border-2 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Example 5: API Rate Limit Handling</CardTitle>
                <CardDescription>Detect 429 status and route to retry logic</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">Scenario:</strong>
                    <p className="text-sm text-muted-foreground">
                      External API returns 429 (rate limit exceeded). Route to retry logic with exponential backoff
                      instead of failing immediately.
                    </p>
                  </div>

                  <div>
                    <strong className="text-sm">Input (from HTTP Request node):</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`{
  "status": 429,
  "statusText": "Too Many Requests",
  "data": {
    "error": "Rate limit exceeded. Retry after 60 seconds."
  }
}`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Condition:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>input1.status === 429</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Workflow Structure:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm font-mono">
                    <code>{`[HTTP Request]
       ↓
[Conditional: status === 429?]
       ↓              ↓
    TRUE            FALSE
       ↓              ↓
[JavaScript]   [Conditional]
 "Wait 60s"   [status === 200?]
       ↓              ↓
[HTTP Retry]   [Process]`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Result:</strong>
                    <p className="text-sm text-muted-foreground">
                      Status 429 → TRUE path → Implement retry logic with delay
                      <br />
                      Status 200/other → FALSE path → Continue normal processing or error handling
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
            The Conditional node is validated before execution. Validation errors will block workflow execution.
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
                  <span>
                    Missing required field: <code>condition</code>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-red-600 dark:text-red-400">✕</span>
                  <span>Empty condition field (no JavaScript expression provided)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-red-600 dark:text-red-400">✕</span>
                  <span>Syntax error in condition expression (detected by parser)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-red-600 dark:text-red-400">✕</span>
                  <span>
                    Condition references undefined input variables (e.g., <code>input3</code> with only 2 connections)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-red-600 dark:text-red-400">✕</span>
                  <span>No downstream connections (both true and false paths are empty - node does nothing)</span>
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
                  <span>Only true path has downstream connections (false path is empty - might be intentional)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-amber-600 dark:text-amber-400">⚠</span>
                  <span>Only false path has downstream connections (true path is empty - might be intentional)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-amber-600 dark:text-amber-400">⚠</span>
                  <span>
                    Condition always evaluates to same value (e.g., <code>true</code> or <code>1 === 1</code>)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-amber-600 dark:text-amber-400">⚠</span>
                  <span>Complex condition (very long expression - consider using JavaScript node first)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Code Generation */}
        <section id="code-generation" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Code Generation</h2>
          <p className="mb-4 text-muted-foreground">
            When you export your workflow to TypeScript code, the Conditional node generates standard if/else blocks:
          </p>

          <div className="space-y-4">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-base">Generated Code (Workflow Function Export)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">
                  <code>{`// Conditional Node: Check severity level
const condition_conditional1 = input1.severity === "CRITICAL" || input1.severity === "HIGH"

if (condition_conditional1) {
  // TRUE path - nodes connected to true output handle

  // PagerDuty alert
  const node_httpRequest1 = await fetch("https://api.pagerduty.com/incidents", {
    method: "POST",
    headers: {
      "Authorization": "Token token=YOUR_TOKEN",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      incident: {
        title: \`Critical Security Alert: \${input1.threat_summary}\`,
        urgency: "high"
      }
    })
  })

  const httpRequest1_result = await node_httpRequest1.json()
} else {
  // FALSE path - nodes connected to false output handle

  // Slack notification
  const node_httpRequest2 = await fetch("https://hooks.slack.com/services/YOUR/WEBHOOK", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: \`Security notification: \${input1.threat_summary}\`
    })
  })

  const httpRequest2_result = await node_httpRequest2.json()
}`}</code>
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

  // Conditional Node: Check severity level
  const condition_conditional1 = node_javascript1.severity === "CRITICAL" || node_javascript1.severity === "HIGH"

  if (condition_conditional1) {
    // TRUE path execution
    try {
      const node_httpRequest1 = await fetch("https://api.pagerduty.com/incidents", {
        method: "POST",
        headers: {
          "Authorization": \`Token token=\${process.env.PAGERDUTY_TOKEN}\`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          incident: {
            title: \`Critical Security Alert: \${node_javascript1.threat_summary}\`,
            urgency: "high"
          }
        })
      })

      if (!node_httpRequest1.ok) {
        return Response.json(
          { error: "PagerDuty alert failed" },
          { status: 500 }
        )
      }

      const httpRequest1_result = await node_httpRequest1.json()

      return Response.json({
        success: true,
        outputs: {
          conditional1: true,
          httpRequest1: httpRequest1_result
        }
      })
    } catch (error) {
      return Response.json(
        { error: \`True path failed: \${error.message}\` },
        { status: 500 }
      )
    }
  } else {
    // FALSE path execution
    try {
      const node_httpRequest2 = await fetch("https://hooks.slack.com/services/YOUR/WEBHOOK", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: \`Security notification: \${node_javascript1.threat_summary}\`
        })
      })

      const httpRequest2_result = await node_httpRequest2.json()

      return Response.json({
        success: true,
        outputs: {
          conditional1: false,
          httpRequest2: httpRequest2_result
        }
      })
    } catch (error) {
      return Response.json(
        { error: \`False path failed: \${error.message}\` },
        { status: 500 }
      )
    }
  }
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
                    <strong>Use simple, readable conditions</strong> - Prefer{" "}
                    <code>input1.status === 200</code> over complex nested logic
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Handle both paths</strong> - Connect nodes to both true and false outputs unless you
                    intentionally want to skip one path
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Use JavaScript node for complex logic</strong> - Calculate scores/values first, then use
                    simple comparison in Conditional
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Check for null/undefined</strong> - Use <code>&&</code> to verify data exists before
                    accessing properties
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Label your paths clearly</strong> - Use descriptive node names on each branch so the
                    workflow is self-documenting
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Test both paths</strong> - Execute workflow with data that triggers both true and false
                    conditions during testing
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
                    <strong>Don't use overly complex conditions</strong> - Break into JavaScript node + Conditional for
                    readability
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't nest multiple Conditionals unnecessarily</strong> - Consider using JavaScript node to
                    return categorical result
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't forget to handle null values</strong> - <code>input1.data.field</code> will error if{" "}
                    <code>data</code> is undefined
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't rely on truthy/falsy behavior for important logic</strong> - Use explicit comparisons
                    (<code>=== true</code>)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't leave both paths empty</strong> - A Conditional with no downstream nodes is useless
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't use async operations in conditions</strong> - Conditions evaluate synchronously only
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Common Patterns */}
          <Card className="mt-6 border-2">
            <CardHeader>
              <CardTitle className="text-lg">Common Condition Patterns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <strong className="text-sm">Status Code Checks:</strong>
                <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                  <code>{`// Success check
input1.status === 200

// Any 2xx status
input1.status >= 200 && input1.status < 300

// Specific error
input1.status === 429  // Rate limit`}</code>
                </pre>
              </div>

              <div className="space-y-2">
                <strong className="text-sm">Null/Undefined Checks:</strong>
                <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                  <code>{`// Safe property access
input1 && input1.data && input1.data.threats.length > 0

// Using optional chaining (modern JS)
input1?.data?.threats?.length > 0`}</code>
                </pre>
              </div>

              <div className="space-y-2">
                <strong className="text-sm">Multiple Conditions:</strong>
                <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                  <code>{`// OR conditions (any match)
input1.severity === "CRITICAL" || input1.severity === "HIGH"

// AND conditions (all match)
input1.status === 200 && input1.data.threats.length > 0

// Combined
(input1.severity === "CRITICAL" || input1.severity === "HIGH") && input1.requires_immediate_action`}</code>
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
                <CardTitle className="text-base">JavaScript Node</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Calculate complex values before branching. Use JavaScript node to compute scores, then Conditional to
                  decide the path.
                </p>
                <Link
                  href="/docs/build/nodes/javascript"
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
                  Call external APIs, then use Conditional to route based on HTTP status codes or response data.
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
                <CardTitle className="text-base">Text Model Node</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Analyze data with AI, then use Conditional to route based on the analysis results (severity,
                  categories, etc.).
                </p>
                <Link
                  href="/docs/build/nodes/text-model"
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
                  Learn common patterns for conditional branching, error handling, and multi-path workflows
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
                  Understand how TopFlow's topological execution handles conditional branching
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
              <div>
                <Link href="/docs/build/nodes/javascript" className="font-medium text-primary hover:underline">
                  JavaScript Node
                </Link>
                <p className="text-sm text-muted-foreground">
                  Use JavaScript to calculate values before branching with Conditional nodes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
