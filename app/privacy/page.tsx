import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Database, Eye, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | TopFlow",
  description:
    "TopFlow Privacy Policy - Learn how we protect your data with our privacy-first architecture. No user accounts, no tracking, client-side storage only.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">TopFlow</span>
          </Link>
          <Button asChild variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Hero */}
          <div className="text-center space-y-4">
            <Badge variant="outline" className="mb-2">
              Last Updated: September 27, 2026
            </Badge>
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We built TopFlow with privacy as a core principle. Here's exactly what we do (and don't do) with your data.
            </p>
          </div>

          {/* TL;DR */}
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                TL;DR - The Short Version
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-lg font-medium">
                We collect minimal data. Your workflows and API keys are stored in your browser and sent to our server
                only when you run a workflow — used in memory, never stored or logged. We set no cookies and use only
                anonymous page analytics; we don't track individuals or sell data.
              </p>
            </CardContent>
          </Card>

          {/* What We Collect vs Don't Collect */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  What Stays Private
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>✅ Your API keys (stored in your browser; used only in memory to run a workflow)</p>
                <p>✅ Your workflows (stored locally only)</p>
                <p>✅ Execution results (ephemeral processing)</p>
                <p>✅ Personal information (we don't store it)</p>
              </CardContent>
            </Card>

            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-600">
                  <XCircle className="h-5 w-5" />
                  What We Track
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>📊 Page views (anonymous analytics)</p>
                <p>📊 Referrer sources (where visitors come from)</p>
                <p>📊 Basic device info (browser, OS)</p>
                <p>❌ NO personal identification</p>
              </CardContent>
            </Card>
          </div>

          {/* Data Collection Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Collection Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Client-Side Storage */}
              <div>
                <h3 className="font-semibold mb-2">Client-Side Storage (Your Browser)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  The following data is stored locally in your browser using localStorage:
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li><strong>API Keys:</strong> Your AI provider credentials (OpenAI, Anthropic, Google, Groq)</li>
                  <li><strong>Workflows:</strong> Your created workflow definitions and configurations</li>
                  <li><strong>Version History:</strong> Previous versions of your workflows</li>
                  <li><strong>UI Preferences:</strong> Settings like sidebar state</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  This data <strong>never leaves your device</strong> unless you explicitly execute a workflow.
                </p>
              </div>

              {/* Cookies & browser storage */}
              <div>
                <h3 className="font-semibold mb-2">Cookies &amp; Browser Storage</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>TopFlow sets no cookies.</strong> It uses your browser&apos;s localStorage, which never leaves your
                  device on its own:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="pb-2">localStorage key(s)</th>
                        <th className="pb-2">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b">
                        <td className="py-2"><code>ai-agent-api-keys</code>, <code>ai-agent-github-token</code></td>
                        <td>Your provider keys and GitHub token (AES-256-GCM encrypted)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2"><code>ai-agent-workflows</code>, <code>ai-agent-versions</code>, <code>ai-agent-builder-workflow</code></td>
                        <td>Your saved workflows, version history and current work</td>
                      </tr>
                      <tr>
                        <td className="py-2"><code>palette-collapsed</code>, <code>topflow-blog-*</code>, <code>cookie-notice-dismissed</code></td>
                        <td>Interface preferences</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Analytics */}
              <div>
                <h3 className="font-semibold mb-2">Analytics (Vercel Analytics)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  We use Vercel Analytics to understand how people use our demo. This helps us improve the product.
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>What Vercel Analytics collects:</strong>
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Page URLs visited</li>
                  <li>Referrer (where you came from)</li>
                  <li>Browser and OS information</li>
                  <li>Device type (desktop, mobile, tablet)</li>
                  <li>Anonymous session data</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  Vercel Web Analytics sets no cookies (the site sets none at all). For how Vercel processes request
                  data, see its privacy documentation below.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Learn more: <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline">Vercel Analytics Privacy Policy</a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* What We Don't Do */}
          <Card className="border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Lock className="h-5 w-5" />
                What We Don't Do
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <span>No email collection (no sign-up required)</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <span>No user accounts or profiles</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <span>No marketing cookies or tracking pixels</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <span>No selling of data to third parties</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <span>No cross-site tracking or retargeting</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <span>No device fingerprinting</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <span>No server-side storage of your workflows or API keys</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Workflow Execution */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow Execution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                When you execute a workflow on TopFlow:
              </p>
              <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                <li>Your workflow graph and API keys are temporarily sent to our server</li>
                <li>Our server validates and executes your workflow</li>
                <li>Results are streamed back to your browser in real-time</li>
                <li><strong>Your workflow content, inputs and API keys are never stored or written to our logs</strong> — our logs record only counts, IDs and error types</li>
                <li>Our host (Vercel) keeps standard request logs (such as IP address and URL) to operate the service; our rate limiter keeps only an HMAC-hashed form of your IP, for about a minute</li>
              </ol>
              <p className="text-sm text-muted-foreground">
                The execution is <strong>ephemeral</strong>—once complete, all data is immediately discarded from server memory.
              </p>
            </CardContent>
          </Card>

          {/* Third-Party Services */}
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-1">Vercel (Hosting & Analytics)</h4>
                <p className="text-sm text-muted-foreground">
                  Our website is hosted on Vercel. They provide infrastructure and anonymous analytics.
                  <br />
                  <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline">
                    Vercel Privacy Policy
                  </a>
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Google Fonts</h4>
                <p className="text-sm text-muted-foreground">
                  We use Google Fonts for typography. Google may receive font file requests and basic HTTP request data (IP address, user agent).
                  Google Fonts does not set cookies.
                  <br />
                  <a href="https://developers.google.com/fonts/faq/privacy" target="_blank" rel="noopener noreferrer" className="underline">
                    Google Fonts Privacy FAQ
                  </a>
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">AI Providers (User-Provided Credentials)</h4>
                <p className="text-sm text-muted-foreground">
                  When you execute workflows, requests are sent to AI providers using <strong>your own API keys</strong>.
                  We never see or store your API keys on our servers. Your keys remain in your browser's localStorage.
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• OpenAI: <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</a></li>
                  <li>• Anthropic: <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</a></li>
                  <li>• Google: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</a></li>
                  <li>• Groq: <a href="https://groq.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</a></li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Rights (GDPR & CCPA)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-1">Right to Access</h4>
                <p className="text-sm text-muted-foreground">
                  All your data is stored in your browser's localStorage. You can view it anytime using browser developer tools (F12 → Application → Local Storage).
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Right to Deletion</h4>
                <p className="text-sm text-muted-foreground">
                  Clear your browser data to delete all workflows, API keys, and preferences. This is instant and permanent.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Right to Data Portability</h4>
                <p className="text-sm text-muted-foreground">
                  Export your workflows as JSON files directly from the app. You own your data.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Right to Opt-Out (CCPA)</h4>
                <p className="text-sm text-muted-foreground">
                  We do not sell personal information. There is nothing to opt out of.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Since all sensitive data is stored client-side in your browser:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Your data is protected by your device's security (password, encryption)</li>
                <li>Your API keys are stored in encrypted browser storage when using HTTPS</li>
                <li>We recommend using strong browser passwords and device encryption</li>
                <li>Never access TopFlow from shared or public computers</li>
              </ul>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our service is not directed to children under 13. We do not knowingly collect data from children.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date.
                Material changes will be communicated via our homepage.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                For privacy questions or concerns:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">Email:</span>
                  <a href="mailto:privacy@topflow.dev" className="underline">privacy@topflow.dev</a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">Website:</span>
                  <Link href="/about" className="underline">topflow.dev/about</Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Summary */}
          <div className="text-center pt-8 border-t space-y-4">
            <p className="text-sm text-muted-foreground italic">
              "We built TopFlow with privacy as a core principle. Your data is yours—we never see it, store it (server-side), or share it."
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/builder">Try TopFlow</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground md:px-6">
          <p>© 2026 TopFlow. Built by Charlie Su, Former CISO.</p>
          <p className="mt-2">Security-first AI automation for compliance and privacy teams.</p>
        </div>
      </footer>
    </div>
  )
}
