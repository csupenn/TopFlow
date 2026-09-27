import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Shield, Zap, Lock, Code, AlertCircle, CheckCircle2, HelpCircle, ArrowRight } from "lucide-react"
import { SidebarPortal } from "@/components/docs/sidebar-portal"
import { TOCPortal } from "@/components/docs/toc-portal"

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | TopFlow Learn",
  description:
    "Common questions about TopFlow's secure AI workflow builder. Get answers about security, privacy, pricing, deployment, and more.",
  keywords: ["topflow faq", "ai workflow questions", "secure ai help", "workflow builder support"],
  openGraph: {
    title: "FAQ - TopFlow Learn",
    description: "Common questions about TopFlow's secure AI workflow builder",
    type: "article",
  },
}


const tocItems = [
  { id: "general", title: "General Questions", level: 2 },
  { id: "security-privacy", title: "Security & Privacy", level: 2 },
  { id: "features", title: "Features & Capabilities", level: 2 },
  { id: "pricing", title: "Pricing & Deployment", level: 2 },
  { id: "technical", title: "Technical Questions", level: 2 },
  { id: "troubleshooting", title: "Troubleshooting", level: 2 },
]

export default function FAQPage() {
  return (
    <>
      <SidebarPortal currentTab="learn" />
      <TOCPortal items={tocItems} />

      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Badge variant="secondary" className="mb-4">
            <HelpCircle className="mr-1 h-3 w-3" />
            Frequently Asked Questions
          </Badge>
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight">FAQ</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Common questions about TopFlow, security, privacy, and getting started. Can't find what you're looking for?{" "}
            <Link href="https://github.com/yourusername/topflow/discussions" className="text-primary hover:underline">
              Ask in Discussions
            </Link>
            .
          </p>
        </div>

        {/* General Questions */}
        <section id="general" className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            General Questions
          </h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="what-is-topflow">
              <AccordionTrigger className="text-left">What is TopFlow?</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                <p>
                  TopFlow is a <strong>security-first visual workflow builder</strong> for creating AI-powered applications using the Vercel
                  AI SDK. It's designed for compliance and privacy teams who need to build AI workflows with enterprise-grade security
                  built-in from day one.
                </p>
                <p>Key differentiators:</p>
                <ul>
                  <li>
                    <strong>Privacy-first architecture</strong> - Your data stays in your browser (localStorage only)
                  </li>
                  <li>
                    <strong>12 built-in security validations</strong> - SSRF prevention, PII detection, prompt injection protection
                  </li>
                  <li>
                    <strong>Compliance templates</strong> - Pre-configured for GDPR, SOC 2, HIPAA, NERC CIP
                  </li>
                  <li>
                    <strong>BYOK model</strong> - Bring your own API keys (we never see them)
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="who-is-it-for">
              <AccordionTrigger className="text-left">Who is TopFlow for?</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                <p>TopFlow is built for:</p>
                <ul>
                  <li>
                    <strong>CISOs & Security Leaders</strong> - Evaluating AI adoption with security controls
                  </li>
                  <li>
                    <strong>Compliance Officers</strong> - Building GDPR/SOC 2/HIPAA-compliant AI workflows
                  </li>
                  <li>
                    <strong>Privacy Teams</strong> - Implementing PII detection and data minimization
                  </li>
                  <li>
                    <strong>Security Engineers</strong> - Deploying AI systems with defense-in-depth architecture
                  </li>
                  <li>
                    <strong>OT Security Teams</strong> - Monitoring critical infrastructure with AI-powered threat detection
                  </li>
                </ul>
                <p>
                  <strong>Technical requirement</strong>: Basic understanding of AI concepts helpful but not required. No coding experience
                  needed for the visual builder (but you can export TypeScript code).
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="how-different">
              <AccordionTrigger className="text-left">How is TopFlow different from Zapier or n8n?</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                <p>
                  <strong>TopFlow is security-first, AI-native, and code-exportable</strong>. Here's the comparison:
                </p>
                <div className="not-prose my-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="p-2 text-left">Feature</th>
                          <th className="p-2 text-left">TopFlow</th>
                          <th className="p-2 text-left">Zapier/n8n</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2">Primary Focus</td>
                          <td className="p-2">AI workflows + Security</td>
                          <td className="p-2">General automation</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">Security Validations</td>
                          <td className="p-2">12 built-in checks</td>
                          <td className="p-2">Limited/manual</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">Data Storage</td>
                          <td className="p-2">Client-side only (localStorage)</td>
                          <td className="p-2">Server-side database</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">Code Export</td>
                          <td className="p-2">Yes (TypeScript + Vercel AI SDK)</td>
                          <td className="p-2">No (vendor lock-in)</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">Compliance Templates</td>
                          <td className="p-2">GDPR, SOC 2, HIPAA, NERC CIP</td>
                          <td className="p-2">Not provided</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">Pricing Model</td>
                          <td className="p-2">BYOK (use your own API keys)</td>
                          <td className="p-2">Subscription tiers</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <p>
                  <strong>Use TopFlow if</strong>: You need AI-powered workflows with enterprise security, compliance requirements, or want to
                  export production-ready code.
                </p>
                <p>
                  <strong>Use Zapier/n8n if</strong>: You need simple SaaS integrations (Slack → Google Sheets) without AI or security focus.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="do-i-need-coding">
              <AccordionTrigger className="text-left">Do I need to know how to code?</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                <p>
                  <strong>No, you don't need coding skills to use the visual builder</strong>. The drag-and-drop interface lets you create
                  workflows without writing code.
                </p>
                <p>
                  <strong>However, coding knowledge is helpful for</strong>:
                </p>
                <ul>
                  <li>
                    <strong>JavaScript nodes</strong> - Writing custom transformation logic
                  </li>
                  <li>
                    <strong>Conditional logic</strong> - Creating complex branching rules
                  </li>
                  <li>
                    <strong>Code export</strong> - Understanding and customizing generated TypeScript
                  </li>
                  <li>
                    <strong>Structured output</strong> - Defining Zod schemas for data validation
                  </li>
                </ul>
                <p>
                  <strong>Learning path</strong>: Start with pre-built templates (no coding), then gradually explore JavaScript nodes as you
                  become comfortable.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Security & Privacy */}
        <section id="security-privacy" className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
            <Shield className="h-6 w-6 text-green-500" />
            Security & Privacy
          </h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="where-stored">
              <AccordionTrigger className="text-left">Where is my data stored?</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                <p>
                  <strong>Your data is stored only in your browser.</strong> It&apos;s sent to our server only when you run a workflow — processed in memory and never stored. TopFlow uses a privacy-first architecture:
                </p>
                <ul>
                  <li>
                    <strong>Workflows</strong> → Stored in browser localStorage
                  </li>
                  <li>
                    <strong>API keys</strong> → Stored in browser localStorage (HTTPS-only)
                  </li>
                  <li>
                    <strong>Execution results</strong> → Stored in browser memory (not persisted)
                  </li>
                  <li>
                    <strong>Version history</strong> → Stored in browser localStorage
                  </li>
                </ul>
                <p>
                  <strong>No backend database</strong>. We literally cannot access your data because we don't store it server-side. This is
                  authentic privacy-by-design, not marketing.
                </p>
                <p>
                  <strong>What about execution?</strong> When you run a workflow, your API keys are sent directly from your browser to the AI
                  provider (OpenAI, Anthropic, etc.) via HTTPS. We never see your keys or prompts.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="api-keys-safe">
              <AccordionTrigger className="text-left">Are my API keys safe?</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                <p>
                  <strong>Yes, with important caveats</strong>:
                </p>
                <p>
                  <strong>How we protect your keys</strong>:
                </p>
                <ul>
                  <li>
                    <strong>Stored client-side</strong> - Keys stored in localStorage (encrypted); sent only with a workflow run, never stored or logged by TopFlow
                  </li>
                  <li>
                    <strong>HTTPS-only</strong> - localStorage marked as secure (requires HTTPS)
                  </li>
                  <li>
                    <strong>Direct API calls</strong> - Keys sent directly to AI providers, not through our servers
                  </li>
                  <li>
                    <strong>No analytics</strong> - We don't track which providers you use
                  </li>
                </ul>
                <p>
                  <strong>Security best practices</strong>:
                </p>
                <ul>
                  <li>✅ Use TopFlow on a private computer (not public/shared devices)</li>
                  <li>✅ Clear browser data if using a shared computer</li>
                  <li>✅ Use API keys with minimal permissions (read-only when possible)</li>
                  <li>✅ Rotate keys regularly (monthly recommended)</li>
                  <li>❌ Don't use TopFlow on public Wi-Fi without VPN</li>
                  <li>❌ Don't share screenshots containing API keys</li>
                </ul>
                <p>
                  <strong>localStorage limitations</strong>: Any browser extension could theoretically access localStorage. For maximum
                  security, use incognito mode or export code and run self-hosted.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="gdpr-compliant">
              <AccordionTrigger className="text-left">Is TopFlow GDPR compliant?</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                <p>
                  <strong>TopFlow is GDPR-compliant by design</strong>:
                </p>
                <ul>
                  <li>
                    <strong>No data collection</strong> - We don't store your personal data (Article 5: Data minimization)
                  </li>
                  <li>
                    <strong>No profiling</strong> - We don't track users across sites (Article 22: Automated decision-making)
                  </li>
                  <li>
                    <strong>No data processing agreement needed</strong> - We're not a data processor (we don't process your data)
                  </li>
                  <li>
                    <strong>Client-side processing</strong> - Data stays in your jurisdiction
                  </li>
                  <li>
                    <strong>No cookies</strong> - Beyond essential session cookies
                  </li>
                </ul>
                <p>
                  <strong>What about AI provider GDPR compliance?</strong>
                </p>
                <p>
                  When you use OpenAI, Anthropic, Google, etc., <strong>you</strong> are responsible for their GDPR compliance (you're the
                  data controller, they're the processor). Check each provider's DPA:
                </p>
                <ul>
                  <li>OpenAI DPA: https://openai.com/policies/data-processing-addendum</li>
                  <li>Anthropic DPA: https://www.anthropic.com/legal/data-processing-addendum</li>
                  <li>Google Cloud DPA: https://cloud.google.com/terms/data-processing-addendum</li>
                </ul>
                <p>
                  <strong>GDPR workflow template</strong>: Use our pre-configured GDPR compliance workflow to implement Article 15 (data
                  subject access requests) and Article 17 (right to erasure).
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="security-validations">
              <AccordionTrigger className="text-left">What are the 12 security validations?</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                <p>
                  TopFlow validates your workflows before execution to prevent security issues:
                </p>
                <div className="not-prose my-4">
                  <div className="grid gap-3">
                    <div className="flex items-start gap-3 rounded-md border p-3">
                      <Shield className="mt-0.5 h-4 w-4 text-green-500" />
                      <div>
                        <strong>1. SSRF Prevention</strong> - Blocks requests to internal IPs, cloud metadata endpoints
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-md border p-3">
                      <Lock className="mt-0.5 h-4 w-4 text-blue-500" />
                      <div>
                        <strong>2. PII Detection</strong> - Warns when prompts contain emails, SSNs, credit cards
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-md border p-3">
                      <AlertCircle className="mt-0.5 h-4 w-4 text-yellow-500" />
                      <div>
                        <strong>3. Prompt Injection</strong> - Detects common injection patterns in user inputs
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-md border p-3">
                      <Zap className="mt-0.5 h-4 w-4 text-orange-500" />
                      <div>
                        <strong>4. Rate Limiting</strong> - Enforces 10 requests/minute per IP to prevent abuse
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-md border p-3">
                      <Code className="mt-0.5 h-4 w-4 text-purple-500" />
                      <div>
                        <strong>5. Input Validation</strong> - Sanitizes inputs to prevent XSS (removes &lt;&gt; characters)
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-md border p-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
                      <div>
                        <strong>6. Cycle Detection</strong> - Prevents infinite loops in workflow graphs
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    + 6 more validations covering API key security, timeout enforcement, configuration checks, structural validation,
                    orphan node detection, and missing start/end nodes.
                  </p>
                </div>
                <p>
                  <strong>Learn more</strong>: See{" "}
                  <Link href="/docs/security/validations" className="text-primary hover:underline">
                    Security Validations
                  </Link>{" "}
                  for technical details.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Features & Capabilities */}
        <section id="features" className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
            <Zap className="h-6 w-6 text-yellow-500" />
            Features & Capabilities
          </h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="ai-providers">
              <AccordionTrigger className="text-left">Which AI providers are supported?</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                <p>TopFlow supports all major AI providers via the Vercel AI SDK:</p>
                <div className="not-prose my-4 grid gap-3 sm:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">OpenAI</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        <li>• GPT-4, GPT-4 Turbo</li>
                        <li>• GPT-3.5 Turbo</li>
                        <li>• DALL-E 3 (image generation)</li>
                        <li>• Whisper (audio transcription)</li>
                        <li>• Text Embeddings (ada-002)</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Anthropic</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        <li>• Claude 3 Opus</li>
                        <li>• Claude 3 Sonnet</li>
                        <li>• Claude 3 Haiku</li>
                        <li>• Claude 2.1</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Google</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        <li>• Gemini Pro</li>
                        <li>• Gemini Pro Vision</li>
                        <li>• PaLM 2</li>
                        <li>• Imagen (image generation)</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Others</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        <li>• Groq (fast inference)</li>
                        <li>• Together AI</li>
                        <li>• Mistral AI</li>
                        <li>• Cohere</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                <p>
                  <strong>Adding new providers</strong>: If a provider has a Vercel AI SDK integration, you can use it. See{" "}
                  <Link href="/docs/build/integrations" className="text-primary hover:underline">
                    Integration Guide
                  </Link>
                  .
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="node-types">
              <AccordionTrigger className="text-left">What node types are available?</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                <p>TopFlow provides 12 node types across 4 categories:</p>
                <div className="not-prose my-4 space-y-3">
                  <div>
                    <h4 className="mb-2 font-semibold">Entry/Exit Nodes</h4>
                    <ul className="ml-4 space-y-1 text-sm">
                      <li>• <strong>Start</strong> - Workflow entry point with initial input</li>
                      <li>• <strong>End</strong> - Workflow exit point, collects final output</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold">AI Nodes</h4>
                    <ul className="ml-4 space-y-1 text-sm">
                      <li>• <strong>Text Model</strong> - Generate text with GPT-4, Claude, Gemini</li>
                      <li>• <strong>Embedding Model</strong> - Create vector embeddings for semantic search</li>
                      <li>• <strong>Image Generation</strong> - Generate images with DALL-E, Imagen</li>
                      <li>• <strong>Audio</strong> - Transcribe audio with Whisper</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold">Data Processing Nodes</h4>
                    <ul className="ml-4 space-y-1 text-sm">
                      <li>• <strong>Prompt</strong> - Template prompts with variable interpolation</li>
                      <li>• <strong>JavaScript</strong> - Custom transformation logic (hosted service: built-in template code only, until isolation ships)</li>
                      <li>• <strong>Structured Output</strong> - Parse AI responses into validated JSON schemas</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold">Flow Control Nodes</h4>
                    <ul className="ml-4 space-y-1 text-sm">
                      <li>• <strong>Conditional</strong> - Branch workflows based on JavaScript conditions</li>
                      <li>• <strong>HTTP Request</strong> - Call external APIs (with SSRF protection)</li>
                      <li>• <strong>Tool</strong> - Define custom function tools for AI models</li>
                    </ul>
                  </div>
                </div>
                <p>
                  <strong>Learn more</strong>: See{" "}
                  <Link href="/docs/build/nodes" className="text-primary hover:underline">
                    Node Reference
                  </Link>{" "}
                  for detailed documentation.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="export-code">
              <AccordionTrigger className="text-left">Can I export my workflows as code?</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                <p>
                  <strong>Yes! TopFlow generates production-ready TypeScript code</strong>. Two export formats:
                </p>
                <div className="not-prose my-4 space-y-4">
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 flex items-center gap-2 font-semibold">
                      <Code className="h-4 w-4" />
                      Workflow Function
                    </h4>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Standalone async function you can import into any project
                    </p>
                    <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
{`import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function runAgentWorkflow(initialInput?: string) {
  const result = await generateText({
    model: openai("gpt-4"),
    prompt: initialInput || "Default prompt",
  })
  return result.text
}`}
                    </pre>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 flex items-center gap-2 font-semibold">
                      <Code className="h-4 w-4" />
                      Next.js API Route
                    </h4>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Ready-to-deploy API endpoint with request/response handling
                    </p>
                    <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
{`export async function POST(req: Request) {
  const { input } = await req.json()
  const result = await generateText({
    model: openai(process.env.OPENAI_API_KEY),
    prompt: input,
  })
  return Response.json({ output: result.text })
}`}
                    </pre>
                  </div>
                </div>
                <p>
                  <strong>Benefits</strong>:
                </p>
                <ul>
                  <li>✅ <strong>No vendor lock-in</strong> - Own your code, run anywhere</li>
                  <li>✅ <strong>Production-ready</strong> - Includes error handling, type safety</li>
                  <li>✅ <strong>Customizable</strong> - Edit generated code to add features</li>
                  <li>✅ <strong>Version control</strong> - Commit to Git, track changes</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="limitations">
              <AccordionTrigger className="text-left">What are the current limitations?</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                <p>
                  <strong>Known limitations</strong> (as of January 2026):
                </p>
                <ul>
                  <li>
                    <strong>localStorage size limit</strong> - Browsers typically limit to 5-10MB. Large workflows with many versions may
                    hit this limit.
                  </li>
                  <li>
                    <strong>No real-time collaboration</strong> - Workflows are single-user (stored in your browser only).
                  </li>
                  <li>
                    <strong>No workflow scheduling</strong> - Cannot run workflows on a cron schedule (must trigger manually or export
                    code).
                  </li>
                  <li>
                    <strong>Limited SSRF protection</strong> - Validates initial URL hostname only. Redirects to private IPs after initial
                    request are not prevented.
                  </li>
                  <li>
                    <strong>JavaScript is not sandboxed</strong> - <code>new Function()</code> can reach the host&apos;s globals, so the
                    hosted service runs only built-in template code until a real isolate ships.
                  </li>
                  <li>
                    <strong>No built-in database</strong> - Cannot persist data across workflow runs (use external APIs or export code for
                    this).
                  </li>
                  <li>
                    <strong>Rate limiting</strong> - 10 workflows/minute per IP (for demo purposes, removed in exported code).
                  </li>
                </ul>
                <p>
                  <strong>Roadmap</strong>: See{" "}
                  <Link href="https://github.com/yourusername/topflow/issues" className="text-primary hover:underline">
                    GitHub Issues
                  </Link>{" "}
                  for planned features.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Pricing & Deployment */}
        <section id="pricing" className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Pricing & Deployment
          </h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="pricing">
              <AccordionTrigger className="text-left">How much does TopFlow cost?</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                <p>
                  <strong>TopFlow itself is free (demonstration project)</strong>. You only pay for:
                </p>
                <ul>
                  <li>
                    <strong>AI provider API costs</strong> - OpenAI, Anthropic, Google (you bring your own keys)
                  </li>
                  <li>
                    <strong>Deployment costs</strong> - If you export code and deploy (Vercel free tier is sufficient)
                  </li>
                </ul>
                <p>
                  <strong>Typical AI costs</strong>:
                </p>
                <div className="not-prose my-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left">Provider</th>
                        <th className="p-2 text-left">Model</th>
                        <th className="p-2 text-left">Cost per 1M tokens</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">OpenAI</td>
                        <td className="p-2">GPT-4 Turbo</td>
                        <td className="p-2">$10 input, $30 output</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Anthropic</td>
                        <td className="p-2">Claude 3 Sonnet</td>
                        <td className="p-2">$3 input, $15 output</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Google</td>
                        <td className="p-2">Gemini Pro</td>
                        <td className="p-2">$0.50 input, $1.50 output</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Groq</td>
                        <td className="p-2">Llama 3 70B</td>
                        <td className="p-2">$0.70 input, $0.80 output</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  <strong>BYOK benefits</strong>: You control costs, no monthly subscriptions, no usage limits from TopFlow.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="self-host">
              <AccordionTrigger className="text-left">Can I self-host TopFlow?</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                <p>
                  <strong>Yes! TopFlow is designed for easy self-hosting</strong>:
                </p>
                <ol>
                  <li>
                    <strong>Clone the repository</strong>:
                    <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
git clone https://github.com/yourusername/topflow.git
cd topflow
pnpm install
                    </pre>
                  </li>
                  <li>
                    <strong>Run locally</strong>:
                    <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
pnpm dev
# Open http://localhost:3000
                    </pre>
                  </li>
                  <li>
                    <strong>Deploy to Vercel</strong> (recommended):
                    <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
vercel deploy
# One-click deployment, automatic HTTPS
                    </pre>
                  </li>
                </ol>
                <p>
                  <strong>Alternative deployment options</strong>:
                </p>
                <ul>
                  <li>AWS (via Amplify or EC2)</li>
                  <li>Google Cloud Run</li>
                  <li>Azure App Service</li>
                  <li>Docker container (self-managed)</li>
                </ul>
                <p>
                  <strong>Note</strong>: Self-hosting is not required. The hosted version at topflow.dev is free and privacy-first
                  (client-side storage only).
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="enterprise">
              <AccordionTrigger className="text-left">Is there an enterprise version?</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                <p>
                  <strong>TopFlow is currently a demonstration project</strong>, not a commercial product. However, if you're an enterprise
                  interested in:
                </p>
                <ul>
                  <li>Custom compliance templates (beyond GDPR/SOC 2/HIPAA/NERC CIP)</li>
                  <li>On-premise deployment with support</li>
                  <li>Custom integrations (SIEM, ticketing, OT systems)</li>
                  <li>Professional services (workflow design, security audits)</li>
                  <li>Training and onboarding</li>
                </ul>
                <p>
                  <strong>Contact</strong>:{" "}
                  <a href="mailto:charlie@charliesu.com" className="text-primary hover:underline">
                    charlie@charliesu.com
                  </a>
                </p>
                <p>
                  <strong>Open source option</strong>: For most enterprises, self-hosting the open-source version with your own
                  customizations is the recommended approach.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Technical Questions */}
        <section id="technical" className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
            <Code className="h-6 w-6 text-purple-500" />
            Technical Questions
          </h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="tech-stack">
              <AccordionTrigger className="text-left">What technology stack does TopFlow use?</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                <div className="not-prose my-4 space-y-3">
                  <div>
                    <h4 className="mb-1 font-semibold">Frontend</h4>
                    <ul className="ml-4 space-y-1 text-sm">
                      <li>• Next.js 15 (App Router, React Server Components)</li>
                      <li>• React 19.1.0</li>
                      <li>• TailwindCSS v4 (styling)</li>
                      <li>• shadcn/ui (component library)</li>
                      <li>• ReactFlow (@xyflow/react 12.8.6) - visual workflow canvas</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">State Management</h4>
                    <ul className="ml-4 space-y-1 text-sm">
                      <li>• React useState (primary state)</li>
                      <li>• Zustand 5.0.2 (undo/redo history only)</li>
                      <li>• localStorage (persistence)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">AI SDKs</h4>
                    <ul className="ml-4 space-y-1 text-sm">
                      <li>• Vercel AI SDK v5</li>
                      <li>• @ai-sdk/openai (GPT models)</li>
                      <li>• @ai-sdk/anthropic (Claude models)</li>
                      <li>• @ai-sdk/google (Gemini models)</li>
                      <li>• @ai-sdk/groq (fast inference)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">Validation & Forms</h4>
                    <ul className="ml-4 space-y-1 text-sm">
                      <li>• Zod (schema validation)</li>
                      <li>• react-hook-form (form state)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">Deployment</h4>
                    <ul className="ml-4 space-y-1 text-sm">
                      <li>• Vercel (platform)</li>
                      <li>• Vercel Edge Functions (serverless execution)</li>
                      <li>• No database (client-side only)</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="data-flow">
              <AccordionTrigger className="text-left">How does workflow execution work?</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                <p>
                  <strong>Execution flow</strong>:
                </p>
                <ol>
                  <li>
                    <strong>Client validates workflow</strong> - 12 security checks, structural validation (cycles, orphans, config)
                  </li>
                  <li>
                    <strong>Client sends workflow to /api/execute-workflow</strong> - Over HTTPS, includes API keys
                  </li>
                  <li>
                    <strong>Server re-validates</strong> - Never trust client-side validation
                  </li>
                  <li>
                    <strong>Server topologically sorts nodes</strong> - Execution order based on dependencies
                  </li>
                  <li>
                    <strong>Server executes nodes sequentially</strong> - Streams progress updates back to client
                  </li>
                  <li>
                    <strong>Client displays results</strong> - Real-time updates in ExecutionPanel
                  </li>
                </ol>
                <p>
                  <strong>Streaming updates</strong>: The API returns newline-delimited JSON for real-time progress:
                </p>
                <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
{`{"type":"node_start","nodeId":"node-1"}
{"type":"node_complete","nodeId":"node-1","output":"result"}
{"type":"complete","results":{"node-1":"result"}}`}
                </pre>
                <p>
                  <strong>Security during execution</strong>:
                </p>
                <ul>
                  <li>• Rate limiting (10 req/min per IP)</li>
                  <li>• Input sanitization (remove &lt;&gt; characters)</li>
                  <li>• Timeout enforcement (30 seconds max per node)</li>
                  <li>• SSRF prevention (URL validation)</li>
                  <li>• JavaScript execution restricted to built-in template code (isolate planned)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="browser-support">
              <AccordionTrigger className="text-left">Which browsers are supported?</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                <p>
                  <strong>Supported browsers</strong>:
                </p>
                <ul>
                  <li>✅ <strong>Chrome/Edge</strong> - Chromium 90+ (recommended)</li>
                  <li>✅ <strong>Firefox</strong> - Firefox 88+</li>
                  <li>✅ <strong>Safari</strong> - Safari 14+ (macOS/iOS)</li>
                  <li>⚠️ <strong>Brave</strong> - Works but may need to allow localStorage</li>
                  <li>❌ <strong>IE11</strong> - Not supported (use Edge instead)</li>
                </ul>
                <p>
                  <strong>Mobile support</strong>:
                </p>
                <ul>
                  <li>✅ Responsive UI works on tablets (iPad, Android tablets)</li>
                  <li>⚠️ Limited functionality on phones (small screen, canvas interactions difficult)</li>
                  <li>📱 Recommended: Use desktop for building, mobile for viewing docs</li>
                </ul>
                <p>
                  <strong>Requirements</strong>:
                </p>
                <ul>
                  <li>• JavaScript enabled</li>
                  <li>• localStorage enabled (for saving workflows)</li>
                  <li>• Cookies enabled (for session management)</li>
                  <li>• Screen resolution: 1280x720 minimum (1920x1080 recommended)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Troubleshooting */}
        <section id="troubleshooting" className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
            <AlertCircle className="h-6 w-6 text-orange-500" />
            Troubleshooting
          </h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="workflow-not-executing">
              <AccordionTrigger className="text-left">My workflow won't execute. What should I check?</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                <p>
                  <strong>Checklist</strong>:
                </p>
                <ol>
                  <li>
                    <strong>Check validation panel</strong> - Errors (red) block execution. Fix all errors first.
                  </li>
                  <li>
                    <strong>Verify API keys</strong> - Go to Settings → API Keys, ensure correct provider key is set
                  </li>
                  <li>
                    <strong>Check for cycles</strong> - Circular dependencies prevent execution
                  </li>
                  <li>
                    <strong>Verify start/end nodes</strong> - Every workflow needs exactly one Start and one End node
                  </li>
                  <li>
                    <strong>Check for orphan nodes</strong> - All nodes must be connected to the main flow
                  </li>
                  <li>
                    <strong>Review SSRF warnings</strong> - Blocked URLs in HTTP Request nodes prevent execution
                  </li>
                </ol>
                <p>
                  <strong>Common mistakes</strong>:
                </p>
                <ul>
                  <li>• Empty prompt in Text Model node</li>
                  <li>• Invalid model name (check provider documentation)</li>
                  <li>• HTTP Request to localhost or internal IP (blocked by SSRF prevention)</li>
                  <li>• Missing required node configuration</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="api-key-error">
              <AccordionTrigger className="text-left">I'm getting "API key not found" errors</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                <p>
                  <strong>Solution steps</strong>:
                </p>
                <ol>
                  <li>
                    <strong>Open API Settings</strong> - Click gear icon → API Settings
                  </li>
                  <li>
                    <strong>Enter your API key</strong> - Paste key for the provider you're using (OpenAI, Anthropic, etc.)
                  </li>
                  <li>
                    <strong>Verify key format</strong>:
                    <ul>
                      <li>OpenAI: Starts with <code>sk-...</code></li>
                      <li>Anthropic: Starts with <code>sk-ant-...</code></li>
                      <li>Google: Starts with <code>AI...</code></li>
                    </ul>
                  </li>
                  <li>
                    <strong>Save settings</strong> - Click "Save" (keys stored in localStorage)
                  </li>
                  <li>
                    <strong>Retry workflow</strong> - Execute again
                  </li>
                </ol>
                <p>
                  <strong>Getting API keys</strong>:
                </p>
                <ul>
                  <li>• OpenAI: https://platform.openai.com/api-keys</li>
                  <li>• Anthropic: https://console.anthropic.com/</li>
                  <li>• Google: https://makersuite.google.com/app/apikey</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="workflows-disappeared">
              <AccordionTrigger className="text-left">My saved workflows disappeared</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                <p>
                  <strong>Possible causes</strong>:
                </p>
                <ul>
                  <li>
                    <strong>Cleared browser data</strong> - localStorage is deleted when you clear site data
                  </li>
                  <li>
                    <strong>Incognito mode</strong> - localStorage is not persisted after closing incognito window
                  </li>
                  <li>
                    <strong>Different browser/device</strong> - Workflows are browser-specific (not synced across devices)
                  </li>
                  <li>
                    <strong>Browser update/crash</strong> - Rare, but can corrupt localStorage
                  </li>
                </ul>
                <p>
                  <strong>Recovery options</strong>:
                </p>
                <ol>
                  <li>
                    <strong>Check auto-saves</strong> - TopFlow keeps last 5 auto-saves in localStorage
                    <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
{`// Open browser console (F12)
localStorage.getItem('ai-agent-builder-autosave-*')
// Look for recent timestamps`}
                    </pre>
                  </li>
                  <li>
                    <strong>Check exported code</strong> - If you previously exported workflows, you can rebuild from TypeScript
                  </li>
                </ol>
                <p>
                  <strong>Prevention</strong>:
                </p>
                <ul>
                  <li>✅ Export workflows regularly (Download → TypeScript)</li>
                  <li>✅ Use normal browser mode (not incognito) for persistent work</li>
                  <li>✅ Back up localStorage manually (browser DevTools → Application → localStorage)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="slow-execution">
              <AccordionTrigger className="text-left">Workflow execution is very slow</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                <p>
                  <strong>Common causes</strong>:
                </p>
                <ul>
                  <li>
                    <strong>Model selection</strong> - GPT-4 is slower than GPT-3.5 Turbo (but higher quality)
                  </li>
                  <li>
                    <strong>Token limits</strong> - Higher maxTokens = longer generation time
                  </li>
                  <li>
                    <strong>HTTP Request latency</strong> - External API calls add delay
                  </li>
                  <li>
                    <strong>Sequential execution</strong> - Nodes execute one at a time (topological order)
                  </li>
                  <li>
                    <strong>Provider API limits</strong> - Some providers throttle requests
                  </li>
                </ul>
                <p>
                  <strong>Optimization tips</strong>:
                </p>
                <ul>
                  <li>✅ Use faster models (GPT-3.5 Turbo, Claude Haiku, Gemini Pro)</li>
                  <li>✅ Reduce maxTokens to minimum needed (500 instead of 2000)</li>
                  <li>✅ Use Groq for fastest inference (70B model at GPT-4 quality, 10x faster)</li>
                  <li>✅ Minimize HTTP Request nodes (each adds network latency)</li>
                  <li>✅ Simplify conditional logic (reduce branching)</li>
                </ul>
                <p>
                  <strong>Typical execution times</strong>:
                </p>
                <ul>
                  <li>• GPT-3.5 Turbo: 1-3 seconds</li>
                  <li>• GPT-4 Turbo: 3-10 seconds</li>
                  <li>• Claude 3 Sonnet: 2-5 seconds</li>
                  <li>• Groq (Llama 3 70B): 0.5-2 seconds</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Still have questions? */}
        <section className="mt-12 rounded-lg border-2 border-primary/20 bg-primary/5 p-8">
          <h2 className="mb-4 text-2xl font-semibold">Still Have Questions?</h2>
          <p className="mb-6 text-muted-foreground">
            Can't find the answer you're looking for? We're here to help.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="https://github.com/yourusername/topflow/discussions">
                <HelpCircle className="mr-2 h-5 w-5" />
                Ask in Discussions
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="https://github.com/yourusername/topflow/issues">
                <AlertCircle className="mr-2 h-5 w-5" />
                Report an Issue
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="mailto:charlie@charliesu.com">
                Contact Support
              </Link>
            </Button>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mt-12 space-y-4">
          <h2 className="text-2xl font-semibold">Next Steps</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Quick Start
                </CardTitle>
                <CardDescription>Build your first workflow in 5 minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/docs/learn/quick-start">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  Security Validations
                </CardTitle>
                <CardDescription>Learn about 12 security checks</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/docs/security/validations">
                    Explore Security
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-purple-500" />
                  Node Reference
                </CardTitle>
                <CardDescription>Technical documentation for all 12 node types</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/docs/build/nodes">
                    Browse Nodes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  )
}
