import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Target, CheckCircle2, AlertTriangle, ArrowRight, Lightbulb } from "lucide-react"
import Link from "next/link"
import { SidebarPortal } from "@/components/docs/sidebar-portal"
import { TOCPortal } from "@/components/docs/toc-portal"

export const metadata: Metadata = {
  title: "End Node - Node Reference | TopFlow Build",
  description:
    "Complete reference for the End Node in TopFlow. Mark workflow completion and optionally specify final output values. Every workflow needs at least one End node to signal successful execution.",
  keywords: [
    "end node",
    "workflow completion",
    "final output",
    "workflow termination",
    "topflow nodes",
    "workflow endpoint",
  ],
  openGraph: {
    title: "End Node - Node Reference | TopFlow Build",
    description:
      "Mark workflow completion and specify final output values. Essential for every TopFlow workflow.",
    type: "article",
    url: "https://www.topflow.dev/docs/build/nodes/end",
  },
}


const tocItems = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "configuration", title: "Configuration", level: 2 },
  { id: "interface", title: "Node Data Interface", level: 2 },
  { id: "examples", title: "Usage Examples", level: 2 },
  { id: "validation", title: "Validation Rules", level: 2 },
  { id: "code-generation", title: "Code Generation", level: 2 },
  { id: "best-practices", title: "Best Practices", level: 2 },
  { id: "related", title: "Related Nodes", level: 2 },
]

export default function EndNodePage() {
  return (
    <>
      <SidebarPortal currentTab="build" />
      <TOCPortal items={tocItems} />

      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Target className="h-3 w-3" />
              Workflow Endpoint
            </Badge>
            <Badge variant="secondary">P0 - Critical</Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">End Node</h1>
          <p className="text-xl text-muted-foreground">
            Mark the successful completion of your workflow and optionally specify final output values. Every workflow
            requires at least one End node to signal that execution finished successfully.
          </p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-8 border-green-500/50 bg-green-500/10">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-sm">
            <strong>Required Node:</strong> Every workflow must have at least one End node. When workflow execution
            reaches an End node, it completes successfully and returns the specified output (or the last computed
            value).
          </AlertDescription>
        </Alert>

        {/* Overview */}
        <section id="overview" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Overview</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              The End node marks the successful completion of a workflow. When execution reaches an End node, the
              workflow stops and returns the final output. End nodes are the counterpart to Start nodes - every
              workflow path that begins with a Start node should eventually reach an End node.
            </p>

            <p>
              Unlike most nodes that transform or process data, the End node's primary purpose is to signal completion
              and optionally specify what data should be returned as the workflow's final result.
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
                    <strong>Simple Completion</strong> - Mark workflow completion without specifying output (returns
                    last computed value)
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    2
                  </div>
                  <div>
                    <strong>Explicit Output</strong> - Specify exactly what data should be returned (e.g., a success
                    message or structured result)
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    3
                  </div>
                  <div>
                    <strong>Multi-Path Workflows</strong> - Each conditional branch ends with its own End node,
                    returning different results
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    4
                  </div>
                  <div>
                    <strong>Status Reporting</strong> - Return workflow execution status and summary information to
                    calling systems
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
              <CardTitle className="text-lg">Optional Parameters</CardTitle>
              <CardDescription>
                The End node has no required configuration - it works by default
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <code className="rounded bg-muted px-2 py-1 text-sm font-mono">output</code>
                  <Badge variant="outline" className="text-xs">
                    string
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Optional
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Explicit output value to return when workflow completes. If not specified, the End node returns the
                  output from the last executed upstream node. Supports variable interpolation (<code>$input1</code>,{" "}
                  <code>$input2</code>).
                </p>

                <Alert className="mt-3 border-blue-500/50 bg-blue-500/10">
                  <Lightbulb className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-sm">
                    <strong>Tip:</strong> Leave output empty for simple workflows. Use explicit output when you need to
                    return a specific message (e.g., "Workflow completed successfully" or structured JSON).
                  </AlertDescription>
                </Alert>

                <div className="mt-4 space-y-2">
                  <strong className="text-sm">Example Output Values:</strong>
                  <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                    <code>{`// Simple success message
"Workflow completed successfully"

// Include data from upstream node
"Security analysis complete: $input1"

// Structured JSON output
{
  "status": "completed",
  "result": "$input1",
  "timestamp": "${new Date().toISOString()}"
}`}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Node Data Interface */}
        <section id="interface" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Node Data Interface</h2>
          <p className="mb-4 text-muted-foreground">
            TypeScript interface defining the End node's configuration and execution state:
          </p>

          <Card className="border-2">
            <CardContent className="pt-6">
              <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{`export type EndNodeData = {
  // Configuration
  output?: string  // Optional explicit output value (supports variable interpolation)

  // Execution state (managed by system)
  status?: "idle" | "running" | "completed" | "error"
  finalOutput?: any  // The actual value returned by the workflow
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
            {/* Example 1: No Output Specified */}
            <Card className="border-2 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Example 1: Simple Completion (No Output Specified)</CardTitle>
                <CardDescription>Return the last computed value automatically</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">Workflow Structure:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm font-mono">
                    <code>{`[Start Node]
       ↓
[HTTP Request] ← Fetch threat data
       ↓
[Text Model] ← Analyze threats
       ↓
[End Node] ← No output specified`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">End Node Configuration:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`output: (empty)`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Returned Value:</strong>
                    <p className="text-sm text-muted-foreground">
                      The workflow returns the output from the Text Model node (the last executed node before End).
                    </p>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`"Analysis complete: 2 critical vulnerabilities detected requiring immediate patching.
Systems affected: web-server-01, api-gateway."`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Example 2: Explicit Success Message */}
            <Card className="border-2 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Example 2: Explicit Success Message</CardTitle>
                <CardDescription>Return a custom completion message</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">Workflow Structure:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm font-mono">
                    <code>{`[Start Node]
       ↓
[HTTP Request] ← Create ticket
       ↓
[End Node] ← Custom success message`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">End Node Configuration:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`output: "Incident ticket created successfully. Ticket ID: $input1.data.result.number"`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Returned Value:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`"Incident ticket created successfully. Ticket ID: INC0012345"`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Example 3: Structured JSON Output */}
            <Card className="border-2 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Example 3: Structured JSON Output</CardTitle>
                <CardDescription>Return comprehensive workflow results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">Workflow Structure:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm font-mono">
                    <code>{`[Start Node]
       ↓
[HTTP Request] ← Fetch threats
       ↓
[JavaScript] ← Calculate severity
       ↓
[Text Model] ← Generate summary
       ↓
[End Node] ← Structured output`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">End Node Configuration:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`output: {
  "status": "completed",
  "severity_score": "$input2.score",
  "severity_level": "$input2.severity",
  "summary": "$input3",
  "timestamp": "${new Date().toISOString()}",
  "requires_action": "$input2.requires_immediate_action"
}`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Returned Value:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`{
  "status": "completed",
  "severity_score": 75,
  "severity_level": "CRITICAL",
  "summary": "2 critical vulnerabilities detected requiring immediate attention",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requires_action": true
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Example 4: Multiple End Nodes */}
            <Card className="border-2 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Example 4: Multi-Path Workflow (Multiple End Nodes)</CardTitle>
                <CardDescription>Different end nodes for different conditional paths</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">Workflow Structure:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm font-mono">
                    <code>{`[Start Node]
       ↓
[HTTP Request] ← Check API
       ↓
[Conditional] ← status === 200?
       ↓            ↓
    TRUE          FALSE
       ↓            ↓
[Process Data]  [Slack Alert]
       ↓            ↓
[End: Success]  [End: Failure]`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">End Node Configurations:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`// Success path End node
output: {
  "status": "success",
  "message": "Data processed successfully",
  "result": "$input1"
}

// Failure path End node
output: {
  "status": "error",
  "message": "API request failed",
  "http_status": "$input1.status",
  "error_details": "$input1.statusText"
}`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Returned Values:</strong>
                    <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                      <li>
                        <strong>Success path:</strong> Returns success status with processed data
                      </li>
                      <li>
                        <strong>Failure path:</strong> Returns error status with failure details
                      </li>
                    </ul>
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
            The End node is validated before execution. Validation errors will block workflow execution.
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
                  <span>No End node in workflow (workflow must have at least one End node)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-red-600 dark:text-red-400">✕</span>
                  <span>End node has outgoing connections (End nodes cannot connect to other nodes)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-red-600 dark:text-red-400">✕</span>
                  <span>
                    Output references undefined input variables (e.g., <code>$input3</code> with only 2 upstream nodes)
                  </span>
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
                  <span>End node has no incoming connections (unreachable end node - will never execute)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-amber-600 dark:text-amber-400">⚠</span>
                  <span>
                    Multiple End nodes with same output value (might be intentional, but could indicate duplicate logic)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-amber-600 dark:text-amber-400">⚠</span>
                  <span>Very long output string (consider using upstream JavaScript node to format data)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Code Generation */}
        <section id="code-generation" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Code Generation</h2>
          <p className="mb-4 text-muted-foreground">
            When you export your workflow to TypeScript code, the End node generates a return statement with the final
            output:
          </p>

          <div className="space-y-4">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-base">Generated Code (Workflow Function Export)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">
                  <code>{`export async function runAgentWorkflow(initialInput?: string) {
  // Start Node
  const start_input = initialInput || ""

  // HTTP Request Node
  const node_httpRequest1 = await fetch("https://api.example.com/threats", {
    method: "GET",
    headers: { "Authorization": \`Bearer \${process.env.API_KEY}\` }
  })
  const httpRequest1_result = await node_httpRequest1.json()

  // Text Model Node
  const node_textModel1 = await generateText({
    model: openai("gpt-4"),
    prompt: \`Analyze these threats: \${JSON.stringify(httpRequest1_result)}\`
  })

  // End Node - Return final output
  return {
    status: "completed",
    result: node_textModel1.text,
    timestamp: new Date().toISOString()
  }
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
  try {
    // Parse request body
    const { input } = await req.json()

    // Start Node
    const start_input = input || ""

    // HTTP Request Node
    const node_httpRequest1 = await fetch("https://api.example.com/threats", {
      method: "GET",
      headers: { "Authorization": \`Bearer \${process.env.API_KEY}\` }
    })

    if (!node_httpRequest1.ok) {
      return Response.json(
        { error: "HTTP request failed" },
        { status: 500 }
      )
    }

    const httpRequest1_result = await node_httpRequest1.json()

    // Text Model Node
    const node_textModel1 = await generateText({
      model: openai("gpt-4"),
      prompt: \`Analyze these threats: \${JSON.stringify(httpRequest1_result)}\`
    })

    // End Node - Return successful response
    return Response.json({
      status: "completed",
      result: node_textModel1.text,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return Response.json(
      { error: \`Workflow failed: \${error.message}\` },
      { status: 500 }
    )
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
                    <strong>Always include at least one End node</strong> - Every workflow must have a completion point
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Use explicit output for API routes</strong> - Return structured JSON with status, result,
                    and metadata
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Use multiple End nodes for conditional workflows</strong> - Different branches can return
                    different results
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Keep output simple when possible</strong> - Let the last node's output flow through
                    naturally
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Include timestamps in output</strong> - Helps with debugging and audit trails
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
                    <strong>Don't connect End nodes to other nodes</strong> - End nodes mark completion; they cannot
                    have outgoing connections
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't create unreachable End nodes</strong> - Every End node should be reachable from Start
                    node
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't use complex logic in output</strong> - Use a JavaScript node before End for complex
                    formatting
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't forget to test all End nodes</strong> - In conditional workflows, ensure every path
                    reaches an End
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Related Nodes */}
        <section id="related" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Related Nodes</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-2 transition-all hover:border-primary/50">
              <CardHeader>
                <CardTitle className="text-base">Start Node</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>The counterpart to End nodes. Every workflow begins with a Start node and ends with an End node.</p>
                <Link
                  href="/docs/build/nodes/start"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  View docs <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-primary/50">
              <CardHeader>
                <CardTitle className="text-base">Conditional Node</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Branch workflows into multiple paths, each ending with its own End node returning different results.</p>
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
                <CardTitle className="text-base">JavaScript Node</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Format complex output data before the End node. Use JavaScript to structure the final response.
                </p>
                <Link
                  href="/docs/build/nodes/javascript"
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
                <Link href="/docs/build/nodes/start" className="font-medium text-primary hover:underline">
                  Start Node Documentation
                </Link>
                <p className="text-sm text-muted-foreground">
                  Learn about the Start node, which pairs with End nodes to define workflow boundaries
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
                  Understand workflow execution flow and how End nodes complete execution
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
              <div>
                <Link href="/docs/build/workflows" className="font-medium text-primary hover:underline">
                  Workflow Patterns
                </Link>
                <p className="text-sm text-muted-foreground">
                  See common patterns for structuring workflows with multiple End nodes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
