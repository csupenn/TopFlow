import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle, Globe, Lock, CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { SidebarPortal } from "@/components/docs/sidebar-portal"
import { TOCPortal } from "@/components/docs/toc-portal"

export const metadata: Metadata = {
  title: "HTTP Request Node - Node Reference | TopFlow Build",
  description:
    "Complete reference for the HTTP Request Node in TopFlow. Make external API calls with built-in SSRF prevention, authentication support, and request/response handling for integrations with SIEM systems, ticketing platforms, and alerting services.",
  keywords: [
    "http request node",
    "api integration",
    "rest api",
    "webhook",
    "ssrf prevention",
    "api authentication",
    "external apis",
    "http client",
    "api calls",
    "topflow nodes",
    "splunk integration",
    "servicenow",
    "slack webhook",
    "pagerduty",
  ],
  openGraph: {
    title: "HTTP Request Node - Node Reference | TopFlow Build",
    description:
      "Make secure external API calls with built-in SSRF prevention and authentication support. Integrate with SIEM, ticketing, and alerting systems.",
    type: "article",
    url: "https://www.topflow.dev/docs/build/nodes/http-request",
  },
}


const tocItems = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "configuration", title: "Configuration", level: 2 },
  { id: "authentication", title: "Authentication Methods", level: 2 },
  { id: "interface", title: "Node Data Interface", level: 2 },
  { id: "examples", title: "Usage Examples", level: 2 },
  { id: "security", title: "Security Considerations", level: 2 },
  { id: "validation", title: "Validation Rules", level: 2 },
  { id: "code-generation", title: "Code Generation", level: 2 },
  { id: "best-practices", title: "Best Practices", level: 2 },
  { id: "related", title: "Related Nodes", level: 2 },
]

export default function HttpRequestNodePage() {
  return (
    <>
      <SidebarPortal currentTab="build" />
      <TOCPortal items={tocItems} />

      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Globe className="h-3 w-3" />
              External Integration
            </Badge>
            <Badge variant="secondary">P0 - Critical</Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">HTTP Request Node</h1>
          <p className="text-xl text-muted-foreground">
            Make external API calls to integrate with SIEM systems, ticketing platforms, alerting services, and any
            REST API. Built-in SSRF prevention ensures secure external communication.
          </p>
        </div>

        {/* Security Alert */}
        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <Shield className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-sm">
            <strong>Security-First Design:</strong> This node includes enterprise-grade SSRF prevention that blocks
            requests to private IPs, localhost, and cloud metadata endpoints. All URLs are validated before execution.
          </AlertDescription>
        </Alert>

        {/* Overview */}
        <section id="overview" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Overview</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              The HTTP Request node enables your workflows to communicate with external APIs and services. It supports
              all standard HTTP methods (GET, POST, PUT, PATCH, DELETE), custom headers, request bodies, and multiple
              authentication patterns.
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
                    <strong>SIEM Integration</strong> - Send security events to Splunk, Elastic, or other security
                    platforms for centralized logging and analysis
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    2
                  </div>
                  <div>
                    <strong>Ticketing Automation</strong> - Create tickets in ServiceNow, Jira, or other ITSM platforms
                    when security incidents are detected
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    3
                  </div>
                  <div>
                    <strong>Alerting Services</strong> - Send notifications to Slack, PagerDuty, or Microsoft Teams for
                    critical security events
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    4
                  </div>
                  <div>
                    <strong>Threat Intelligence</strong> - Query threat intel feeds (VirusTotal, AlienVault OTX,
                    AbuseIPDB) to enrich security analysis
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    5
                  </div>
                  <div>
                    <strong>Webhook Triggers</strong> - Trigger downstream systems when workflows complete (build
                    deployments, approval workflows)
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    6
                  </div>
                  <div>
                    <strong>Data Enrichment</strong> - Fetch additional context from external APIs (user data, asset
                    information, geolocation)
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Configuration */}
        <section id="configuration" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Configuration</h2>

          <div className="space-y-6">
            {/* Required Parameters */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Required Parameters</CardTitle>
                <CardDescription>These fields must be configured for the node to execute</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <code className="rounded bg-muted px-2 py-1 text-sm font-mono">method</code>
                    <Badge variant="outline" className="text-xs">
                      string
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    HTTP method for the request. Options: <code>GET</code>, <code>POST</code>, <code>PUT</code>,{" "}
                    <code>PATCH</code>, <code>DELETE</code>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Default:</strong> <code>GET</code>
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <code className="rounded bg-muted px-2 py-1 text-sm font-mono">url</code>
                    <Badge variant="outline" className="text-xs">
                      string
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Target URL for the HTTP request. Supports variable interpolation (<code>$input1</code>,{" "}
                    <code>$input2</code>).
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Security:</strong> Only <code>http://</code> and <code>https://</code> protocols allowed.
                    Requests to private IPs, localhost, and cloud metadata endpoints are blocked (SSRF prevention).
                  </p>
                  <Alert className="mt-3 border-amber-500/50 bg-amber-500/10">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <AlertDescription className="text-sm">
                      <strong>SSRF Protection:</strong> Blocked hosts include <code>localhost</code>,{" "}
                      <code>127.0.0.1</code>, <code>169.254.169.254</code> (AWS metadata),{" "}
                      <code>metadata.google.internal</code> (GCP), and all private IP ranges (10.x, 172.16.x, 192.168.x).
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            {/* Optional Parameters */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Optional Parameters</CardTitle>
                <CardDescription>Additional configuration for advanced use cases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <code className="rounded bg-muted px-2 py-1 text-sm font-mono">headers</code>
                    <Badge variant="outline" className="text-xs">
                      Record&lt;string, string&gt;
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Custom HTTP headers as key-value pairs. Common uses: authentication tokens, content types, custom
                    API headers.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Example:</strong> <code>{`{"Authorization": "Bearer $token", "Content-Type": "application/json"}`}</code>
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <code className="rounded bg-muted px-2 py-1 text-sm font-mono">body</code>
                    <Badge variant="outline" className="text-xs">
                      string
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Request body for POST/PUT/PATCH requests. Supports variable interpolation. For JSON payloads,
                    ensure <code>Content-Type: application/json</code> header is set.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <code className="rounded bg-muted px-2 py-1 text-sm font-mono">timeout</code>
                    <Badge variant="outline" className="text-xs">
                      number
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Request timeout in milliseconds. Default: <code>30000</code> (30 seconds). Maximum: <code>60000</code> (60 seconds).
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Authentication Methods */}
        <section id="authentication" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Authentication Methods</h2>
          <p className="mb-6 text-muted-foreground">
            The HTTP Request node supports multiple authentication patterns through custom headers:
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lock className="h-4 w-4 text-primary" />
                  Bearer Token
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Most common for REST APIs. Add Authorization header with Bearer token.
                </p>
                <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                  <code>{`{
  "Authorization": "Bearer sk-abc123..."
}`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lock className="h-4 w-4 text-primary" />
                  API Key (Header)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Used by many APIs. Add custom header with API key.
                </p>
                <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                  <code>{`{
  "X-API-Key": "your-api-key-here",
  "X-Auth-Token": "token-value"
}`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lock className="h-4 w-4 text-primary" />
                  Basic Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Legacy but still common. Encode username:password in Base64.
                </p>
                <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                  <code>{`{
  "Authorization": "Basic dXNlcjpwYXNz"
}`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lock className="h-4 w-4 text-primary" />
                  Custom Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Some APIs use custom schemes. Add any headers required by the API.
                </p>
                <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                  <code>{`{
  "X-Custom-Auth": "value",
  "X-Signature": "hmac-sig"
}`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Node Data Interface */}
        <section id="interface" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Node Data Interface</h2>
          <p className="mb-4 text-muted-foreground">
            TypeScript interface defining the HTTP Request node's configuration and execution state:
          </p>

          <Card className="border-2">
            <CardContent className="pt-6">
              <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{`export type HttpRequestNodeData = {
  // Configuration
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  url: string
  headers?: Record<string, string>
  body?: string
  timeout?: number // milliseconds, default: 30000, max: 60000

  // Execution state (managed by system)
  status?: "idle" | "running" | "completed" | "error"
  output?: {
    status: number           // HTTP status code (200, 404, 500, etc.)
    statusText: string       // Status message
    data: any               // Response body (parsed JSON or raw text)
    headers: Record<string, string>  // Response headers
  }
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
            {/* Example 1: Slack Notification */}
            <Card className="border-2 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Example 1: Slack Webhook Notification</CardTitle>
                <CardDescription>Send security alerts to Slack channel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">Node Configuration:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`method: POST
url: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
headers: {
  "Content-Type": "application/json"
}
body: {
  "text": "🚨 Security Alert: $input1",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Security Event Detected*\\n$input1"
      }
    }
  ]
}`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Expected Output:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`{
  "status": 200,
  "statusText": "OK",
  "data": "ok",
  "headers": {
    "content-type": "text/plain"
  }
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Example 2: ServiceNow Ticket */}
            <Card className="border-2 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Example 2: ServiceNow Incident Creation</CardTitle>
                <CardDescription>Create security incident ticket automatically</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">Node Configuration:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`method: POST
url: https://your-instance.service-now.com/api/now/table/incident
headers: {
  "Authorization": "Basic YOUR_BASE64_CREDENTIALS",
  "Content-Type": "application/json",
  "Accept": "application/json"
}
body: {
  "short_description": "Security Incident: $input1",
  "description": "$input2",
  "urgency": "1",
  "impact": "1",
  "category": "Security",
  "subcategory": "Security Incident"
}`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Expected Output:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`{
  "status": 201,
  "statusText": "Created",
  "data": {
    "result": {
      "sys_id": "abc123...",
      "number": "INC0012345",
      "state": "1",
      "short_description": "Security Incident: ..."
    }
  },
  "headers": { ... }
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Example 3: Threat Intel Query */}
            <Card className="border-2 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Example 3: VirusTotal IP Reputation Check</CardTitle>
                <CardDescription>Query threat intelligence for IP address reputation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">Node Configuration:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`method: GET
url: https://www.virustotal.com/api/v3/ip_addresses/$input1
headers: {
  "x-apikey": "your-virustotal-api-key"
}`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Expected Output:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`{
  "status": 200,
  "statusText": "OK",
  "data": {
    "data": {
      "attributes": {
        "last_analysis_stats": {
          "malicious": 5,
          "suspicious": 2,
          "harmless": 80,
          "undetected": 13
        },
        "reputation": -15,
        "country": "CN"
      }
    }
  },
  "headers": { ... }
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Example 4: Splunk Event */}
            <Card className="border-2 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Example 4: Splunk HEC Event Ingestion</CardTitle>
                <CardDescription>Send security events to Splunk via HTTP Event Collector</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">Node Configuration:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`method: POST
url: https://splunk.example.com:8088/services/collector/event
headers: {
  "Authorization": "Splunk YOUR-HEC-TOKEN",
  "Content-Type": "application/json"
}
body: {
  "event": {
    "severity": "high",
    "source_ip": "$input1",
    "event_type": "security_alert",
    "description": "$input2",
    "timestamp": "${new Date().toISOString()}"
  },
  "sourcetype": "_json",
  "index": "security"
}`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Expected Output:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`{
  "status": 200,
  "statusText": "OK",
  "data": {
    "text": "Success",
    "code": 0
  },
  "headers": { ... }
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Example 5: PagerDuty Alert */}
            <Card className="border-2 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Example 5: PagerDuty Incident Trigger</CardTitle>
                <CardDescription>Create high-priority incident for critical security events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">Node Configuration:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`method: POST
url: https://api.pagerduty.com/incidents
headers: {
  "Authorization": "Token token=YOUR_API_TOKEN",
  "Content-Type": "application/json",
  "Accept": "application/vnd.pagerduty+json;version=2",
  "From": "security@example.com"
}
body: {
  "incident": {
    "type": "incident",
    "title": "Security Alert: $input1",
    "service": {
      "id": "YOUR_SERVICE_ID",
      "type": "service_reference"
    },
    "urgency": "high",
    "body": {
      "type": "incident_body",
      "details": "$input2"
    }
  }
}`}</code>
                  </pre>

                  <div>
                    <strong className="text-sm">Expected Output:</strong>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code>{`{
  "status": 201,
  "statusText": "Created",
  "data": {
    "incident": {
      "id": "PXXXXXX",
      "status": "triggered",
      "html_url": "https://your-subdomain.pagerduty.com/incidents/PXXXXXX",
      "incident_number": 1234
    }
  },
  "headers": { ... }
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

          <Alert className="mb-6 border-red-500/50 bg-red-500/10">
            <Shield className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-sm">
              <strong>SSRF (Server-Side Request Forgery) Prevention:</strong> The HTTP Request node includes built-in
              protections against SSRF attacks, which could allow attackers to make requests to internal systems.
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Blocked Protocols & Hosts</CardTitle>
                <CardDescription>Requests to these targets will be rejected during validation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <strong className="text-sm">Blocked Protocols:</strong>
                  <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                    <li>
                      <code>file://</code> - Local file system access
                    </li>
                    <li>
                      <code>ftp://</code> - File transfer protocol
                    </li>
                    <li>
                      <code>gopher://</code> - Legacy protocol (SSRF vector)
                    </li>
                    <li>
                      <code>dict://</code> - Dictionary protocol (SSRF vector)
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <strong className="text-sm">Blocked Hosts:</strong>
                  <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                    <li>
                      <code>localhost</code>, <code>127.0.0.1</code>, <code>0.0.0.0</code> - Local system
                    </li>
                    <li>
                      <code>169.254.169.254</code> - AWS EC2 metadata endpoint
                    </li>
                    <li>
                      <code>metadata.google.internal</code> - GCP metadata endpoint
                    </li>
                    <li>
                      <code>10.x.x.x</code> - Private IP range (Class A)
                    </li>
                    <li>
                      <code>172.16.x.x - 172.31.x.x</code> - Private IP range (Class B)
                    </li>
                    <li>
                      <code>192.168.x.x</code> - Private IP range (Class C)
                    </li>
                  </ul>
                </div>

                <Alert className="border-amber-500/50 bg-amber-500/10">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <AlertDescription className="text-sm">
                    <strong>Known Limitation:</strong> SSRF protection validates the initial URL only. If the target
                    URL redirects to a blocked host (e.g., <code>http://safe.com</code> → <code>http://169.254.169.254</code>),
                    the redirect will not be blocked. Avoid requesting URLs from untrusted sources.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Best Practices for Secure API Calls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <div>
                    <strong className="text-sm">Use HTTPS for sensitive data</strong>
                    <p className="text-sm text-muted-foreground">
                      Always use <code>https://</code> URLs when transmitting API keys, tokens, or sensitive information
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <div>
                    <strong className="text-sm">Store API keys securely</strong>
                    <p className="text-sm text-muted-foreground">
                      Store API keys in environment variables or secure key stores. Never hardcode keys in workflow
                      configurations exported to code repositories.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <div>
                    <strong className="text-sm">Validate SSL certificates</strong>
                    <p className="text-sm text-muted-foreground">
                      The HTTP Request node validates SSL certificates by default. Do not disable certificate
                      validation in production environments.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <div>
                    <strong className="text-sm">Use rate limiting</strong>
                    <p className="text-sm text-muted-foreground">
                      Respect API rate limits. Add delays between requests or implement exponential backoff for
                      high-volume workflows.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <div>
                    <strong className="text-sm">Validate response data</strong>
                    <p className="text-sm text-muted-foreground">
                      Always validate response data before using it in downstream nodes. Use conditional nodes to check
                      HTTP status codes and handle errors gracefully.
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
            The HTTP Request node is validated before execution. Validation errors will block workflow execution.
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
                  <span>Missing required field: <code>url</code></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-red-600 dark:text-red-400">✕</span>
                  <span>Empty URL value</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-red-600 dark:text-red-400">✕</span>
                  <span>
                    Invalid URL protocol (only <code>http://</code> and <code>https://</code> allowed)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-red-600 dark:text-red-400">✕</span>
                  <span>SSRF detected: URL targets blocked host (localhost, private IP, cloud metadata endpoint)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-red-600 dark:text-red-400">✕</span>
                  <span>Invalid JSON in request body (for POST/PUT/PATCH with Content-Type: application/json)</span>
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
                    Using <code>http://</code> instead of <code>https://</code> (insecure connection)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-amber-600 dark:text-amber-400">⚠</span>
                  <span>Missing Authorization header (API may reject request)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-amber-600 dark:text-amber-400">⚠</span>
                  <span>
                    POST/PUT/PATCH request with body but no <code>Content-Type</code> header
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-amber-600 dark:text-amber-400">⚠</span>
                  <span>Timeout value exceeds maximum (60000ms)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-amber-600 dark:text-amber-400">⚠</span>
                  <span>Unreferenced variable in URL or body (e.g., $input3 with only 2 upstream nodes)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Code Generation */}
        <section id="code-generation" className="mb-12 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-semibold">Code Generation</h2>
          <p className="mb-4 text-muted-foreground">
            When you export your workflow to TypeScript code, the HTTP Request node generates standard fetch() calls
            with proper error handling:
          </p>

          <div className="space-y-4">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-base">Generated Code (Workflow Function Export)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">
                  <code>{`// HTTP Request Node: Send alert to Slack
const node_httpRequest1 = await fetch("https://hooks.slack.com/services/YOUR/WEBHOOK/URL", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    text: \`🚨 Security Alert: \${node_textModel1}\`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: \`*Security Event Detected*\\n\${node_textModel1}\`
        }
      }
    ]
  }),
  signal: AbortSignal.timeout(30000) // 30s timeout
})

if (!node_httpRequest1.ok) {
  throw new Error(\`HTTP Request failed: \${node_httpRequest1.status} \${node_httpRequest1.statusText}\`)
}

const httpRequest1_data = await node_httpRequest1.json()
const httpRequest1_result = {
  status: node_httpRequest1.status,
  statusText: node_httpRequest1.statusText,
  data: httpRequest1_data,
  headers: Object.fromEntries(node_httpRequest1.headers.entries())
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

  // HTTP Request Node: Send alert to Slack
  const node_httpRequest1 = await fetch(
    "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: \`🚨 Security Alert: \${node_textModel1}\`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: \`*Security Event Detected*\\n\${node_textModel1}\`
            }
          }
        ]
      }),
      signal: AbortSignal.timeout(30000)
    }
  )

  if (!node_httpRequest1.ok) {
    return Response.json(
      { error: \`HTTP Request failed: \${node_httpRequest1.status}\` },
      { status: 500 }
    )
  }

  const httpRequest1_result = {
    status: node_httpRequest1.status,
    statusText: node_httpRequest1.statusText,
    data: await node_httpRequest1.json(),
    headers: Object.fromEntries(node_httpRequest1.headers.entries())
  }

  // ... downstream nodes ...

  return Response.json({
    success: true,
    outputs: { httpRequest1: httpRequest1_result }
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
                    <strong>Use HTTPS</strong> for all API calls involving sensitive data or authentication tokens
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Set appropriate timeouts</strong> based on expected API response times (default 30s is
                    reasonable for most APIs)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Use Conditional nodes</strong> after HTTP Request nodes to check status codes and handle
                    errors (e.g., retry on 429, alert on 500)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Validate API responses</strong> before using data in downstream nodes (check for expected
                    fields, data types)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Use variable interpolation</strong> to pass dynamic data from upstream nodes ($input1,
                    $input2)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Set Content-Type header</strong> when sending JSON bodies (Content-Type: application/json)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>Test with demo mode first</strong> to verify request format before using real API keys
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
                    <strong>Don't hardcode API keys</strong> in URL or headers. Use environment variables or secure
                    storage in production.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't make requests to untrusted URLs</strong> from user input without validation (SSRF
                    risk)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't ignore HTTP status codes</strong> - Always check if request succeeded (2xx) before
                    proceeding
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't use GET requests</strong> for operations that modify data (use POST, PUT, DELETE
                    instead)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't set extremely long timeouts</strong> (max 60s) - This can block workflow execution
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't expose sensitive data</strong> in URLs (query parameters are logged) - Use request
                    body or headers instead
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    <strong>Don't retry indefinitely</strong> on failures - Implement maximum retry limits to avoid
                    infinite loops
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Tips */}
          <Card className="mt-6 border-2">
            <CardHeader>
              <CardTitle className="text-lg">Performance Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  1
                </div>
                <div>
                  <strong className="text-sm">Parallel Execution</strong>
                  <p className="text-sm text-muted-foreground">
                    When making multiple independent API calls, connect them in parallel (not sequential) to reduce
                    total execution time. TopFlow's topological execution will run them concurrently.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  2
                </div>
                <div>
                  <strong className="text-sm">Optimize Timeout Values</strong>
                  <p className="text-sm text-muted-foreground">
                    Set shorter timeouts for fast APIs (5-10s) and longer timeouts for slow APIs (30-60s). This
                    prevents workflows from waiting unnecessarily on slow or failing APIs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  3
                </div>
                <div>
                  <strong className="text-sm">Cache Responses</strong>
                  <p className="text-sm text-muted-foreground">
                    For data that doesn't change frequently (threat intel scores, asset info), consider implementing
                    caching in your exported code to reduce API calls and improve performance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  4
                </div>
                <div>
                  <strong className="text-sm">Minimize Payload Size</strong>
                  <p className="text-sm text-muted-foreground">
                    Only include necessary fields in request bodies. Smaller payloads = faster transmission and
                    processing. Use API query parameters to filter data server-side when possible.
                  </p>
                </div>
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
                <p>Check HTTP status codes and branch workflow based on success/failure conditions.</p>
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
                <p>Transform API responses, parse JSON, extract fields, or format data for downstream nodes.</p>
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
                <CardTitle className="text-base">Text Model Node</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Analyze API responses with AI (sentiment analysis, threat classification, data extraction).</p>
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
                  Learn common workflow patterns for API integration (retry logic, error handling, parallel execution)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
              <div>
                <Link href="/docs/build/integrations" className="font-medium text-primary hover:underline">
                  Integration Guide
                </Link>
                <p className="text-sm text-muted-foreground">
                  Step-by-step guides for integrating with Splunk, ServiceNow, Slack, PagerDuty, and more
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
              <div>
                <Link href="/docs/security/validations/ssrf" className="font-medium text-primary hover:underline">
                  SSRF Prevention Guide
                </Link>
                <p className="text-sm text-muted-foreground">
                  Deep dive into SSRF attack vectors and how TopFlow's validation prevents them
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
