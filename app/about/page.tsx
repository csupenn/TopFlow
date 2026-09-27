import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shield, Github, Linkedin, Twitter, Mail, Briefcase, Award, Target } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About Charlie Su - Former CISO & Creator | TopFlow",
  description:
    "Learn about Charlie Su, Former CISO and creator of TopFlow. Building secure AI agent orchestration for compliance and privacy teams.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">TopFlow</span>
          </Link>
          <Button asChild variant="outline">
            <Link href="/">Back to Builder</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Hero Section */}
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <Avatar className="h-32 w-32 border-4 border-primary">
              <AvatarFallback className="bg-primary text-3xl font-bold text-primary-foreground">CS</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">Charlie Su</h1>
              <p className="mb-4 text-xl text-muted-foreground">Former CISO & Creator of TopFlow</p>
              <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.linkedin.com/in/charliesu-ai" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://github.com/csupenn/topflow" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://twitter.com/charliesu_ai" target="_blank" rel="noopener noreferrer">
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="mailto:charlie@charliesu.com">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Why I Built TopFlow */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Why I Built TopFlow</h2>
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                As a former CISO, I've seen firsthand how organizations struggle to implement AI workflows securely.
                Teams rush to adopt cutting-edge AI capabilities, but security becomes an afterthought—leading to data
                breaches, compliance violations, and costly incidents.
              </p>
              <p>
                The problem isn't that developers don't care about security. It's that existing AI tools force them to
                choose between innovation and safety. Visual workflow builders make AI accessible but lack basic
                security controls. Secure enterprise platforms are so complex they slow development to a crawl.
              </p>
              <p>
                <strong>TopFlow demonstrates how to build AI systems with security baked in, not bolted on.</strong> It's a
                visual AI workflow builder designed specifically for compliance and privacy teams, with built-in SSRF prevention,
                PII detection, and GDPR/SOC2/HIPAA templates. Teams can build confidently—knowing their workflows are
                secure by design, not by accident.
              </p>
            </div>
          </section>

          {/* Professional Background */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Professional Background</h2>
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Experience Highlights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Chief Information Security Officer (CISO)</h3>
                    <p className="text-sm text-muted-foreground">
                      Led security strategy and operations for enterprise organizations, protecting sensitive data
                      across cloud infrastructure and AI systems.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                    <Award className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Security Certifications</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline">CISSP</Badge>
                      <Badge variant="outline">CISM</Badge>
                      <Badge variant="outline">CEH</Badge>
                      <Badge variant="outline">OSCP</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                    <Target className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Impact</h3>
                    <p className="text-sm text-muted-foreground">
                      Helped 50+ enterprises achieve SOC2, GDPR, and HIPAA compliance. Prevented multiple security
                      incidents through proactive threat modeling and secure architecture design.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Project Goals */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Project Goals</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-2">
                <CardHeader>
                  <Shield className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle className="text-lg">Security-First AI</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    Make enterprise-grade security accessible to all developers. No team should have to choose between
                    innovation and safety.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <Award className="mb-2 h-8 w-8 text-green-500" />
                  <CardTitle className="text-lg">Compliance by Default</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    Provide pre-configured templates for GDPR, SOC2, and HIPAA. Compliance shouldn't require months of
                    consulting.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <Target className="mb-2 h-8 w-8 text-blue-500" />
                  <CardTitle className="text-lg">Privacy-Preserving</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    Respect user privacy with client-side key encryption and minimal data: no accounts, no database, no
                    cookies. Your keys, your data, your control.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Privacy & Data Protection */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Privacy & Data Protection</h2>
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="space-y-4 leading-relaxed text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Privacy isn't just a feature—it's our architecture.</strong> TopFlow is
                    built on a client-side-first model where your sensitive data never leaves your browser unless you
                    explicitly execute a workflow.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 my-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground text-sm">What Stays in Your Browser</h4>
                      <ul className="text-sm space-y-1">
                        <li>✅ Your API keys (sent only to run a workflow; never stored or logged)</li>
                        <li>✅ Your workflows and configurations</li>
                        <li>✅ All execution results</li>
                        <li>✅ Version history</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground text-sm">What We Track</h4>
                      <ul className="text-sm space-y-1">
                        <li>📊 Page views (anonymous analytics)</li>
                        <li>📊 Basic usage metrics</li>
                        <li>❌ No personal identification</li>
                        <li>❌ No cross-site tracking</li>
                      </ul>
                    </div>
                  </div>
                  <p>
                    We use minimal analytics (Vercel Analytics) to improve our demo, but we don't track individuals or
                    collect personal information. Read our full{" "}
                    <Link href="/privacy" className="underline text-primary hover:text-primary/80">
                      Privacy Policy
                    </Link>{" "}
                    to learn more.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Connect Section */}
          <section className="rounded-lg border-2 border-primary/20 bg-primary/5 p-8 text-center">
            <h2 className="mb-4 text-2xl font-semibold text-foreground">Let's Connect</h2>
            <p className="mb-6 text-muted-foreground">
              Have questions about TopFlow or want to discuss security-first AI development? I'd love to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <a href="mailto:charlie@charliesu.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Send Email
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="https://www.linkedin.com/in/charliesu-ai" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="mr-2 h-5 w-5" />
                  Connect on LinkedIn
                </a>
              </Button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center space-y-2">
            <div className="text-sm font-medium text-foreground">
              TopFlow: Secure AI Agent Orchestration
            </div>
            <div className="text-sm text-muted-foreground">
              © 2026 TopFlow. Built by Charlie Su, Former CISO.
            </div>
            <div className="text-xs text-muted-foreground">
              Security-first AI automation for compliance and privacy teams.
            </div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-2 mt-2">
              <Shield className="h-3 w-3" />
              <span>Privacy-First: Minimal tracking, client-side storage.</span>
              <Link href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
