import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb"
import { DocsFooter } from "@/components/docs/docs-footer"
import { SidebarPortal } from "@/components/docs/sidebar-portal"
import { TOCPortal } from "@/components/docs/toc-portal"
import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Code, Workflow, ArrowRight, Sparkles, Info } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Introduction to TopFlow - Security-First Visual AI Workflow Builder",
  description: "Learn what TopFlow is, why it exists, and how it helps you build secure AI workflows with privacy baked in from day one.",
}

export default function IntroductionPage() {
  const tocItems = [
    { id: "what-is-topflow", title: "What is TopFlow?", level: 2 },
    { id: "why-topflow", title: "Why TopFlow?", level: 2 },
    { id: "key-features", title: "Key Features", level: 2 },
    { id: "how-it-works", title: "How It Works", level: 2 },
    { id: "who-its-for", title: "Who It's For", level: 2 },
  ]

  return (
    <>
      <SidebarPortal currentTab="learn" />
      <TOCPortal items={tocItems} />

      <div className="space-y-8">
        <DocsBreadcrumb />

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-balance">Introduction to TopFlow</h1>
          </div>
          <p className="text-lg text-muted-foreground text-pretty">
            TopFlow is a visual workflow builder for creating AI-powered applications with security and privacy baked in
            from day one. Built by a former CISO to demonstrate how to build AI systems the right way.
          </p>
        </div>

        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4" />
          <AlertDescription>
            TopFlow is both a functional tool and a showcase project demonstrating security-first AI architecture
            patterns. Every design decision prioritizes security, privacy, and compliance.
          </AlertDescription>
        </Alert>

        {/* What is TopFlow */}
        <Card className="border-2" id="what-is-topflow">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-chart-1/10 flex items-center justify-center">
                <Workflow className="h-6 w-6 text-chart-1" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle>What is TopFlow?</CardTitle>
                  <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1">
                    Overview
                  </Badge>
                </div>
                <CardDescription>A security-focused visual workflow builder for AI applications</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              TopFlow is a <strong>security-focused visual workflow builder</strong> that lets you create AI-powered
              applications using a node-based interface. Think of it as a canvas where you drag and drop components
              (nodes) to build complex AI workflows without writing code.
            </p>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-chart-3/10 flex items-center justify-center">
                    <Workflow className="h-4 w-4 text-chart-3" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">Visual Builder</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Drag and drop nodes to create workflows. Connect AI models, API calls, data transformations, and
                  logic—all visually.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-destructive" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">Security-First</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Real-time security validation with 12 security checks. SSRF prevention, rate limiting, and
                  privacy-preserving architecture built in.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">Privacy-First</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  All data stored in your browser only. No backend database. Your API keys and workflows are sent to our
                  server only to run a workflow, and are never stored there.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-chart-1/10 flex items-center justify-center">
                    <Code className="h-4 w-4 text-chart-1" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">Code Export</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Export your workflows as production-ready TypeScript code. No vendor lock-in. You own the code.
                </p>
              </div>
            </div>

            <Alert className="bg-chart-1/5 border-chart-1/20">
              <Workflow className="h-4 w-4 text-chart-1" />
              <AlertDescription className="text-xs">
                Unlike traditional no-code tools, TopFlow is built specifically for{" "}
                <strong>secure AI orchestration</strong>. Every feature prioritizes security, compliance, and privacy.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Why TopFlow */}
        <Card className="border-2" id="why-topflow">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-destructive" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle>Why TopFlow?</CardTitle>
                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive">
                    Security-First
                  </Badge>
                </div>
                <CardDescription>Security is the foundation, not an afterthought</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Most AI workflow tools focus on ease of use but ignore security. TopFlow flips this—security is the
              foundation, not an afterthought. Here's why it exists:
            </p>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <p className="text-xs font-semibold text-foreground">The Problem with Traditional AI Tools</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>No security validation</strong>: Accidentally create SSRF vulnerabilities, expose PII, or
                    introduce prompt injection risks
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>Vendor lock-in</strong>: Workflows trapped in proprietary platforms with no export options
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>Privacy concerns</strong>: API keys, workflows, and data stored on someone else's servers
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>Compliance gaps</strong>: No built-in GDPR, SOC 2, or HIPAA considerations
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <p className="text-xs font-semibold text-foreground">The TopFlow Approach</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>Real-time security validation</strong>: 12 security checks run automatically as you build,
                    catching issues before execution
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>Client-side storage</strong>: Data is stored only in your browser. No backend database = no
                    stored data to breach
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>BYOK (Bring Your Own Key)</strong>: Use your own API keys for OpenAI, Anthropic, Google,
                    Groq. Keys stored locally only
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>Code export</strong>: Generate production TypeScript from any workflow. Own your code, no
                    platform dependency
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>Compliance-conscious</strong>: Built-in examples for GDPR, SOC 2, HIPAA workflows
                  </span>
                </li>
              </ul>
            </div>

            <Link
              href="/docs/security"
              className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              Learn about security architecture <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card className="border-2" id="key-features">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle>Key Features</CardTitle>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                    Capabilities
                  </Badge>
                </div>
                <CardDescription>Everything you need to build secure AI workflows</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-3">
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-destructive" />
                  Security Features
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li className="flex items-start gap-1.5">
                    <span className="text-destructive mt-0.5">•</span>
                    <span>SSRF Prevention</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-destructive mt-0.5">•</span>
                    <span>Rate Limiting</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-destructive mt-0.5">•</span>
                    <span>Input Sanitization</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-destructive mt-0.5">•</span>
                    <span>Cycle Detection</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-destructive mt-0.5">•</span>
                    <span>Validation Scoring</span>
                  </li>
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-chart-1" />
                  AI Integration
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li className="flex items-start gap-1.5">
                    <span className="text-chart-1 mt-0.5">•</span>
                    <span>Multi-Provider Support</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-chart-1 mt-0.5">•</span>
                    <span>Image Generation</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-chart-1 mt-0.5">•</span>
                    <span>Text Embeddings</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-chart-1 mt-0.5">•</span>
                    <span>Structured Output</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-chart-1 mt-0.5">•</span>
                    <span>Tool Calling</span>
                  </li>
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Code className="h-3.5 w-3.5 text-primary" />
                  Developer Experience
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Visual Editor</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Live Execution</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Code Export</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Template Library</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Undo/Redo & Auto-Save</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <Link
                href="/docs/security/validations"
                className="p-3 rounded-md border border-border hover:border-destructive/50 transition-colors group"
              >
                <div className="text-sm font-medium mb-1 group-hover:text-destructive transition-colors">
                  12 Security Validations
                </div>
                <div className="text-xs text-muted-foreground">
                  SSRF prevention, cycle detection, API key validation, and more
                </div>
              </Link>
              <Link
                href="/docs/build/nodes"
                className="p-3 rounded-md border border-border hover:border-primary/50 transition-colors group"
              >
                <div className="text-sm font-medium mb-1 group-hover:text-primary transition-colors">
                  12 Node Types
                </div>
                <div className="text-xs text-muted-foreground">
                  AI models, data transformations, HTTP requests, and control flow
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="border-2" id="how-it-works">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-chart-2/10 flex items-center justify-center">
                <Workflow className="h-6 w-6 text-chart-2" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle>How It Works</CardTitle>
                  <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2">
                    Quick Guide
                  </Badge>
                </div>
                <CardDescription>From visual builder to production code in 4 steps</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2 mt-0.5">
                    1
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground mb-1">Build Visually</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Drag nodes from the palette onto the canvas. Each node represents an action:
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      <li>• Entry/Exit Nodes: Start and End markers</li>
                      <li>• AI Nodes: Text generation, embeddings, image creation</li>
                      <li>• Data Nodes: HTTP requests, structured outputs</li>
                      <li>• Logic Nodes: Conditionals, JavaScript execution</li>
                      <li>• Tools: Custom function definitions</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2 mt-0.5">
                    2
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground mb-1">Connect & Configure</p>
                    <p className="text-xs text-muted-foreground">
                      Connect nodes by dragging from output handles to input handles. Data flows left-to-right through
                      your workflow. Configure each node's settings (API key provider, model, temperature, prompts,
                      etc.) in the right panel.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2 mt-0.5">
                    3
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground mb-1">Validate</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Click "Validate" to run 12 security checks. You get a score (A-F grade) and detailed error/warning
                      messages:
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      <li>• Structural checks (cycles, orphans, missing start/end)</li>
                      <li>• Security checks (SSRF, private IPs, cloud metadata endpoints)</li>
                      <li>• Configuration checks (missing API keys, invalid models, empty prompts)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2 mt-0.5">
                    4
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground mb-1">Execute or Export</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      <strong>Execute:</strong> Click "Run" to execute your workflow in real-time. Watch nodes turn
                      green as they complete. Results stream to the execution panel.
                    </p>
                    <p className="text-xs text-muted-foreground mb-1">
                      <strong>Export:</strong> Click "Export Code" to generate production-ready TypeScript:
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      <li>• Next.js API Route (server-side execution)</li>
                      <li>• React Component (client-side execution)</li>
                      <li>• Standalone Function (pure TypeScript)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/docs/learn/quick-start"
              className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              Try the Quick Start Guide <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        {/* Who It's For */}
        <Card className="border-2" id="who-its-for">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-chart-3" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle>Who It's For</CardTitle>
                  <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3">
                    Audience
                  </Badge>
                </div>
                <CardDescription>Built for security professionals, AI engineers, and privacy advocates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-semibold text-foreground">Security Professionals</p>
                <p className="text-xs text-muted-foreground">
                  <strong>CISOs, Security Engineers, Compliance Officers:</strong> TopFlow demonstrates how to build AI
                  systems with security baked in. Use it as a reference architecture for your organization's AI
                  initiatives.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-semibold text-foreground">AI Engineers</p>
                <p className="text-xs text-muted-foreground">
                  <strong>Developers Building Secure AI Apps:</strong> Prototype workflows visually, then export to
                  TypeScript. Learn security patterns and compliance requirements while building.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-semibold text-foreground">Privacy Advocates</p>
                <p className="text-xs text-muted-foreground">
                  <strong>Anyone Concerned About Data Privacy:</strong> TopFlow's client-side architecture means your
                  data is stored only in your browser, never on our servers. True privacy-first design, not marketing speak.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-semibold text-foreground">Technical Hiring Managers</p>
                <p className="text-xs text-muted-foreground">
                  <strong>Evaluating Architecture Skills:</strong> TopFlow is a showcase project demonstrating
                  security-first architecture, privacy-preserving design, and compliance-conscious engineering.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle>Ready to get started?</CardTitle>
            <CardDescription>Choose your learning path based on your experience and goals.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-3">
              <Link
                href="/docs/learn/quick-start"
                className="p-3 rounded-md border border-border hover:border-chart-3/50 transition-colors"
              >
                <div className="text-sm font-medium mb-1 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-chart-3" />
                  Quick Start Guide
                </div>
                <div className="text-xs text-muted-foreground">Build your first workflow in 5 minutes</div>
              </Link>
              <Link
                href="/docs/learn/core-concepts"
                className="p-3 rounded-md border border-border hover:border-primary/50 transition-colors"
              >
                <div className="text-sm font-medium mb-1 flex items-center gap-1.5">
                  <Workflow className="h-3.5 w-3.5 text-primary" />
                  Core Concepts
                </div>
                <div className="text-xs text-muted-foreground">
                  Understand workflows, nodes, and validation
                </div>
              </Link>
              <Link
                href="/docs/security"
                className="p-3 rounded-md border border-border hover:border-destructive/50 transition-colors"
              >
                <div className="text-sm font-medium mb-1 flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-destructive" />
                  Security & Compliance
                </div>
                <div className="text-xs text-muted-foreground">Learn about 12 security validations</div>
              </Link>
              <Link
                href="/docs/learn/tutorials"
                className="p-3 rounded-md border border-border hover:border-chart-1/50 transition-colors"
              >
                <div className="text-sm font-medium mb-1 flex items-center gap-1.5">
                  <Code className="h-3.5 w-3.5 text-chart-1" />
                  Step-by-Step Tutorials
                </div>
                <div className="text-xs text-muted-foreground">Learn through hands-on examples</div>
              </Link>
              <Link
                href="/docs/build/nodes"
                className="p-3 rounded-md border border-border hover:border-chart-2/50 transition-colors"
              >
                <div className="text-sm font-medium mb-1 flex items-center gap-1.5">
                  <Workflow className="h-3.5 w-3.5 text-chart-2" />
                  Complete Node Reference
                </div>
                <div className="text-xs text-muted-foreground">Explore all 12 node types in detail</div>
              </Link>
              <Link
                href="/docs/learn/faq"
                className="p-3 rounded-md border border-border hover:border-chart-3/50 transition-colors"
              >
                <div className="text-sm font-medium mb-1 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-chart-3" />
                  FAQ
                </div>
                <div className="text-xs text-muted-foreground">Common questions and answers</div>
              </Link>
            </div>
          </CardContent>
        </Card>

        <DocsFooter
          nextPage={{
            title: "Quick Start",
            href: "/docs/learn/quick-start",
          }}
        />
      </div>
    </>
  )
}
