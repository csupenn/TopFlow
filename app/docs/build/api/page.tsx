import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Code, Shield, Zap, AlertTriangle, CheckCircle2, Copy, ExternalLink } from "lucide-react"
import Link from "next/link"
import { SidebarPortal } from "@/components/docs/sidebar-portal"
import { TOCPortal } from "@/components/docs/toc-portal"

export const metadata: Metadata = {
  title: "API Reference - Build | TopFlow",
  description:
    "Complete API reference for TopFlow workflows. Learn how to execute workflows via HTTP API, handle requests/responses, implement authentication, and deploy workflows as production APIs.",
  keywords: [
    "topflow api",
    "workflow api",
    "rest api",
    "api reference",
    "http api",
    "workflow execution",
    "api integration",
    "vercel ai sdk",
  ],
  openGraph: {
    title: "API Reference - Build | TopFlow",
    description:
      "Execute workflows via HTTP API. Complete reference with request/response formats, authentication, and code examples.",
    type: "article",
    url: "https://www.topflow.dev/docs/build/api",
  },
}


const tocItems = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "authentication", title: "Authentication", level: 2 },
  { id: "execution-endpoint", title: "Workflow Execution Endpoint", level: 2 },
  { id: "request-format", title: "Request Format", level: 2 },
  { id: "response-format", title: "Response Format", level: 2 },
  { id: "error-handling", title: "Error Handling", level: 2 },
  { id: "rate-limits", title: "Rate Limits", level: 2 },
  { id: "code-examples", title: "Code Examples", level: 2 },
  { id: "deployment", title: "Deployment", level: 2 },
  { id: "best-practices", title: "Best Practices", level: 2 },
]

export default function ApiReferencePage() {
  return (
    <>
      <SidebarPortal currentTab="build" />
      <TOCPortal items={tocItems} />

      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Code className="h-3 w-3" />
              API Reference
            </Badge>
            <Badge variant="secondary">P1 - Essential</Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">API Reference</h1>
          <p className="text-xl text-muted-foreground">
            Execute TopFlow workflows via HTTP API. This reference covers request/response formats, authentication,
            error handling, and deployment patterns for production workflows.
          </p>
        </div>

        {/* Overview */}
        <section id="overview" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Overview</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              TopFlow workflows can be executed via HTTP API, making them easy to integrate into your applications. When
              you export a workflow, you can generate either a standalone async function or a Next.js API route handler
              that accepts HTTP requests.
            </p>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Key Concepts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    1
                  </div>
                  <div>
                    <strong>Workflow as API</strong> - Each workflow becomes an HTTP endpoint that accepts input and
                    returns results
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    2
                  </div>
                  <div>
                    <strong>Streaming Execution</strong> - Workflows execute with real-time streaming updates as each
                    node completes
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    3
                  </div>
                  <div>
                    <strong>No Platform API Keys</strong> - TopFlow uses BYOK (Bring Your Own Key) model. You provide
                    your own AI provider API keys via environment variables
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    4
                  </div>
                  <div>
                    <strong>Export to Code</strong> - Workflows export to TypeScript code you own and deploy yourself
                    (no vendor lock-in)
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Authentication */}
        <section id="authentication" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Authentication</h2>

          <Alert className="mb-6 border-blue-500/50 bg-blue-500/10">
            <Shield className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-sm">
              <strong>BYOK Model:</strong> TopFlow doesn't require API keys to the platform itself. Instead, you
              provide your own AI provider API keys (OpenAI, Anthropic, etc.) via environment variables in your
              deployment.
            </AlertDescription>
          </Alert>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Required Environment Variables</CardTitle>
              <CardDescription>Set these in your deployment environment (Vercel, etc.)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your exported workflow code reads AI provider API keys from environment variables:
              </p>

              <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{`# .env.local or deployment environment variables

# OpenAI (for GPT models)
OPENAI_API_KEY=sk-...

# Anthropic (for Claude models)
ANTHROPIC_API_KEY=sk-ant-...

# Google (for Gemini models)
GOOGLE_API_KEY=...

# Groq (for fast inference)
GROQ_API_KEY=gsk_...

# Optional: API keys for external services
PAGERDUTY_TOKEN=...
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
VIRUSTOTAL_API_KEY=...`}</code>
              </pre>

              <Alert className="border-amber-500/50 bg-amber-500/10">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-sm">
                  <strong>Security Note:</strong> Never commit API keys to git repositories. Use environment variables
                  or secret management services. See{" "}
                  <Link href="/docs/security/best-practices" className="underline">
                    Security Best Practices
                  </Link>
                  .
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </section>

        {/* Execution Endpoint */}
        <section id="execution-endpoint" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Workflow Execution Endpoint</h2>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">POST /api/execute-workflow</CardTitle>
              <CardDescription>Execute a workflow with streaming updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <strong className="text-sm">Endpoint</strong>
                <pre className="overflow-x-auto rounded-md bg-muted p-3 text-sm">
                  <code>POST https://your-domain.vercel.app/api/execute-workflow</code>
                </pre>
              </div>

              <div className="space-y-2">
                <strong className="text-sm">Content-Type</strong>
                <pre className="overflow-x-auto rounded-md bg-muted p-3 text-sm">
                  <code>application/json</code>
                </pre>
              </div>

              <div className="space-y-2">
                <strong className="text-sm">Description</strong>
                <p className="text-sm text-muted-foreground">
                  Executes a workflow and returns streaming updates as each node completes. The response is a stream of
                  newline-delimited JSON objects showing node execution progress.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Request Format */}
        <section id="request-format" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Request Format</h2>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Request Body</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{`{
  "nodes": [
    {
      "id": "start",
      "type": "start",
      "data": {
        "input": "Analyze security logs"
      }
    },
    {
      "id": "textModel1",
      "type": "textModel",
      "data": {
        "model": "gpt-4",
        "prompt": "Analyze: $input1",
        "temperature": 0.7,
        "maxTokens": 1000
      }
    },
    {
      "id": "end",
      "type": "end",
      "data": {}
    }
  ],
  "edges": [
    {
      "id": "edge1",
      "source": "start",
      "target": "textModel1"
    },
    {
      "id": "edge2",
      "source": "textModel1",
      "target": "end"
    }
  ],
  "apiKeys": {
    "openai": "sk-...",
    "anthropic": "sk-ant-..."
  }
}`}</code>
              </pre>

              <div className="space-y-2">
                <strong className="text-sm">Required Fields:</strong>
                <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                  <li>
                    <code>nodes</code> - Array of workflow nodes with id, type, and data
                  </li>
                  <li>
                    <code>edges</code> - Array of connections between nodes
                  </li>
                  <li>
                    <code>apiKeys</code> - Object containing API keys for AI providers used in the workflow
                  </li>
                </ul>
              </div>

              <Alert className="border-amber-500/50 bg-amber-500/10">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-sm">
                  <strong>Security:</strong> API keys in request body are only used during execution and not stored. For
                  production, use environment variables instead.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </section>

        {/* Response Format */}
        <section id="response-format" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Response Format</h2>

          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Streaming Response</CardTitle>
                <CardDescription>Newline-delimited JSON stream of execution updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The workflow execution endpoint returns a stream of JSON objects, one per line, showing progress as
                  each node executes:
                </p>

                <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">
                  <code>{`{"type":"node_start","nodeId":"start","timestamp":"2024-01-15T10:30:00.000Z"}
{"type":"node_complete","nodeId":"start","output":"Analyze security logs","timestamp":"2024-01-15T10:30:00.100Z"}
{"type":"node_start","nodeId":"textModel1","timestamp":"2024-01-15T10:30:00.150Z"}
{"type":"node_complete","nodeId":"textModel1","output":"Analysis: Found 3 critical issues...","timestamp":"2024-01-15T10:30:05.500Z"}
{"type":"node_start","nodeId":"end","timestamp":"2024-01-15T10:30:05.600Z"}
{"type":"complete","output":"Analysis: Found 3 critical issues...","timestamp":"2024-01-15T10:30:05.700Z"}`}</code>
                </pre>

                <div className="space-y-2">
                  <strong className="text-sm">Event Types:</strong>
                  <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                    <li>
                      <code>node_start</code> - Node execution began
                    </li>
                    <li>
                      <code>node_complete</code> - Node finished successfully (includes output)
                    </li>
                    <li>
                      <code>node_error</code> - Node failed (includes error message)
                    </li>
                    <li>
                      <code>complete</code> - Entire workflow completed successfully
                    </li>
                    <li>
                      <code>error</code> - Workflow failed (includes error message)
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Success Response Example</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">
                  <code>{`{
  "type": "complete",
  "output": {
    "status": "completed",
    "result": "Security analysis complete: 2 critical vulnerabilities detected",
    "timestamp": "2024-01-15T10:30:05.700Z"
  },
  "executionTime": 5542,
  "nodesExecuted": 5
}`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Error Handling */}
        <section id="error-handling" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Error Handling</h2>

          <div className="space-y-6">
            <Card className="border-2 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-lg">Error Response Format</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">
                  <code>{`{
  "type": "error",
  "error": "HTTP Request node failed: 500 Internal Server Error",
  "nodeId": "httpRequest1",
  "timestamp": "2024-01-15T10:30:03.500Z"
}`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Common Error Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 rounded-md border border-red-500/30 bg-red-500/10 p-3">
                    <Badge variant="destructive">400</Badge>
                    <div className="flex-1">
                      <strong className="text-sm">Bad Request</strong>
                      <p className="text-sm text-muted-foreground">
                        Invalid workflow structure, missing required fields, or validation errors
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-md border border-red-500/30 bg-red-500/10 p-3">
                    <Badge variant="destructive">429</Badge>
                    <div className="flex-1">
                      <strong className="text-sm">Rate Limit Exceeded</strong>
                      <p className="text-sm text-muted-foreground">
                        Too many requests (10 per minute per IP). Wait and retry after cooldown period.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-md border border-red-500/30 bg-red-500/10 p-3">
                    <Badge variant="destructive">500</Badge>
                    <div className="flex-1">
                      <strong className="text-sm">Internal Server Error</strong>
                      <p className="text-sm text-muted-foreground">
                        Workflow execution failed due to node error, timeout, or unexpected issue
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-md border border-red-500/30 bg-red-500/10 p-3">
                    <Badge variant="destructive">503</Badge>
                    <div className="flex-1">
                      <strong className="text-sm">Service Unavailable</strong>
                      <p className="text-sm text-muted-foreground">
                        Server overloaded or temporarily unavailable. Implement exponential backoff retry logic.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Rate Limits */}
        <section id="rate-limits" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Rate Limits</h2>

          <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
            <Zap className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-sm">
              <strong>Default Rate Limit:</strong> 10 requests per minute per client IP address. Exceeding this limit
              returns HTTP 429 status.
            </AlertDescription>
          </Alert>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Rate Limit Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <strong className="text-sm">Limit Scope:</strong>
                <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                  <li>
                    <strong>Per IP Address:</strong> Rate limits apply per client IP
                  </li>
                  <li>
                    <strong>Sliding Window:</strong> 1-minute rolling window (not fixed time buckets)
                  </li>
                  <li>
                    <strong>All Endpoints:</strong> Counts towards total requests across all workflow executions
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <strong className="text-sm">Rate Limit Response Headers:</strong>
                <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                  <code>{`X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1705317000`}</code>
                </pre>
              </div>

              <div className="space-y-2">
                <strong className="text-sm">Handling Rate Limits:</strong>
                <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                  <code>{`async function executeWithRetry(workflow, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch("/api/execute-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workflow)
      })

      if (response.status === 429) {
        const resetTime = response.headers.get("X-RateLimit-Reset")
        const waitMs = (parseInt(resetTime) * 1000) - Date.now()
        console.log(\`Rate limited. Waiting \${waitMs}ms\`)
        await new Promise(resolve => setTimeout(resolve, waitMs))
        continue
      }

      return response
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)))
    }
  }
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Code Examples */}
        <section id="code-examples" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Code Examples</h2>

          <div className="space-y-6">
            {/* cURL Example */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">cURL</CardTitle>
                <CardDescription>Command-line workflow execution</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">
                  <code>{`curl -X POST https://your-domain.vercel.app/api/execute-workflow \\
  -H "Content-Type: application/json" \\
  -d '{
    "nodes": [
      {
        "id": "start",
        "type": "start",
        "data": { "input": "Analyze threat intelligence" }
      },
      {
        "id": "httpRequest1",
        "type": "httpRequest",
        "data": {
          "method": "GET",
          "url": "https://api.example.com/threats"
        }
      },
      {
        "id": "textModel1",
        "type": "textModel",
        "data": {
          "model": "gpt-4",
          "prompt": "Summarize: $input1",
          "temperature": 0.3
        }
      },
      {
        "id": "end",
        "type": "end",
        "data": {}
      }
    ],
    "edges": [
      { "source": "start", "target": "httpRequest1" },
      { "source": "httpRequest1", "target": "textModel1" },
      { "source": "textModel1", "target": "end" }
    ],
    "apiKeys": {
      "openai": "sk-..."
    }
  }'`}</code>
                </pre>
              </CardContent>
            </Card>

            {/* JavaScript/TypeScript Example */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">JavaScript / TypeScript</CardTitle>
                <CardDescription>Browser or Node.js execution with streaming</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">
                  <code>{`async function executeWorkflow(workflowData) {
  const response = await fetch("/api/execute-workflow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(workflowData)
  })

  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`)
  }

  // Read streaming response
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) throw new Error("No response body")

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    // Decode chunk and parse each line as JSON
    const chunk = decoder.decode(value)
    const lines = chunk.split("\\n").filter(line => line.trim())

    for (const line of lines) {
      const event = JSON.parse(line)

      switch (event.type) {
        case "node_start":
          console.log(\`Node started: \${event.nodeId}\`)
          break
        case "node_complete":
          console.log(\`Node completed: \${event.nodeId}\`, event.output)
          break
        case "node_error":
          console.error(\`Node failed: \${event.nodeId}\`, event.error)
          break
        case "complete":
          console.log("Workflow completed!", event.output)
          return event.output
        case "error":
          throw new Error(\`Workflow failed: \${event.error}\`)
      }
    }
  }
}

// Usage
const workflow = {
  nodes: [ /* ... */ ],
  edges: [ /* ... */ ],
  apiKeys: {
    openai: process.env.OPENAI_API_KEY
  }
}

try {
  const result = await executeWorkflow(workflow)
  console.log("Final result:", result)
} catch (error) {
  console.error("Execution failed:", error)
}`}</code>
                </pre>
              </CardContent>
            </Card>

            {/* Python Example */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Python</CardTitle>
                <CardDescription>Workflow execution with requests library</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">
                  <code>{`import requests
import json
import os

def execute_workflow(workflow_data):
    """Execute a TopFlow workflow via API."""
    url = "https://your-domain.vercel.app/api/execute-workflow"
    headers = {"Content-Type": "application/json"}

    response = requests.post(
        url,
        headers=headers,
        json=workflow_data,
        stream=True  # Enable streaming
    )

    if response.status_code == 429:
        reset_time = response.headers.get("X-RateLimit-Reset")
        print(f"Rate limited. Retry after {reset_time}")
        return None

    if not response.ok:
        raise Exception(f"HTTP {response.status_code}: {response.text}")

    # Process streaming response
    for line in response.iter_lines():
        if not line:
            continue

        event = json.loads(line.decode("utf-8"))

        if event["type"] == "node_start":
            print(f"Node started: {event['nodeId']}")
        elif event["type"] == "node_complete":
            print(f"Node completed: {event['nodeId']}")
        elif event["type"] == "node_error":
            print(f"Node failed: {event['nodeId']} - {event['error']}")
        elif event["type"] == "complete":
            print("Workflow completed!")
            return event["output"]
        elif event["type"] == "error":
            raise Exception(f"Workflow failed: {event['error']}")

    return None

# Usage
workflow = {
    "nodes": [
        {
            "id": "start",
            "type": "start",
            "data": {"input": "Analyze security data"}
        },
        {
            "id": "textModel1",
            "type": "textModel",
            "data": {
                "model": "gpt-4",
                "prompt": "Analyze: $input1",
                "temperature": 0.7
            }
        },
        {
            "id": "end",
            "type": "end",
            "data": {}
        }
    ],
    "edges": [
        {"source": "start", "target": "textModel1"},
        {"source": "textModel1", "target": "end"}
    ],
    "apiKeys": {
        "openai": os.environ["OPENAI_API_KEY"]
    }
}

try:
    result = execute_workflow(workflow)
    print(f"Final result: {result}")
except Exception as error:
    print(f"Execution failed: {error}")`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Deployment */}
        <section id="deployment" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Deployment</h2>

          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Deploying to Vercel</CardTitle>
                <CardDescription>Recommended platform for TopFlow workflows</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="ml-6 list-decimal space-y-3 text-sm text-muted-foreground">
                  <li>
                    <strong>Export your workflow</strong> to TypeScript code using the "Export Code" feature in TopFlow
                  </li>
                  <li>
                    <strong>Create a Next.js project</strong> (if you don't have one):
                    <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3 text-xs">
                      <code>npx create-next-app@latest my-workflow-api</code>
                    </pre>
                  </li>
                  <li>
                    <strong>Add the exported code</strong> to <code>app/api/workflow/route.ts</code>
                  </li>
                  <li>
                    <strong>Install dependencies</strong>:
                    <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3 text-xs">
                      <code>npm install ai @ai-sdk/openai @ai-sdk/anthropic</code>
                    </pre>
                  </li>
                  <li>
                    <strong>Deploy to Vercel</strong>:
                    <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3 text-xs">
                      <code>vercel deploy</code>
                    </pre>
                  </li>
                  <li>
                    <strong>Set environment variables</strong> in Vercel dashboard (Settings → Environment Variables):
                    <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3 text-xs">
                      <code>{`OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...`}</code>
                    </pre>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Alternative Deployment Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <div>
                    <strong className="text-sm">AWS Lambda</strong>
                    <p className="text-sm text-muted-foreground">
                      Export as standalone function, package dependencies, deploy via AWS Console or SAM
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <div>
                    <strong className="text-sm">Cloudflare Workers</strong>
                    <p className="text-sm text-muted-foreground">
                      Adapt code for edge runtime, use Wrangler CLI for deployment
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <div>
                    <strong className="text-sm">Docker Container</strong>
                    <p className="text-sm text-muted-foreground">
                      Package as Next.js app in Docker, deploy to any container platform (ECS, GKE, Azure Container
                      Instances)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <div>
                    <strong className="text-sm">Self-Hosted</strong>
                    <p className="text-sm text-muted-foreground">
                      Run Next.js production server on your own infrastructure with <code>npm run build && npm start</code>
                    </p>
                  </div>
                </div>
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
                    <strong>Use environment variables</strong> for API keys in production, never hardcode them
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Implement retry logic</strong> with exponential backoff for transient errors and rate limits
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Monitor execution time</strong> and set appropriate timeouts (workflows timeout after 30s by
                    default)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Log execution events</strong> for debugging and audit trails
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Validate inputs</strong> before sending to workflow execution endpoint
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Use HTTPS</strong> in production for all API calls
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
                    <strong>Don't commit API keys</strong> to git repositories or expose them in client-side code
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't ignore rate limits</strong> - Implement proper backoff and queuing
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't skip error handling</strong> - Always handle failures gracefully
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't use HTTP</strong> in production (use HTTPS for security)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't send large payloads</strong> - Keep workflow definitions reasonable in size
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't ignore streaming updates</strong> - Process events to track execution progress
                  </span>
                </div>
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
                <Link href="/docs/build/integrations" className="font-medium text-primary hover:underline">
                  Integration Guide
                </Link>
                <p className="text-sm text-muted-foreground">
                  Learn how to integrate workflows with external services (Slack, PagerDuty, Splunk, etc.)
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
                  Explore common workflow patterns for error handling, retry logic, and parallel execution
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
              <div>
                <Link href="/docs/security/best-practices" className="font-medium text-primary hover:underline">
                  Security Best Practices
                </Link>
                <p className="text-sm text-muted-foreground">
                  Learn how to secure your workflows, protect API keys, and prevent common vulnerabilities
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
