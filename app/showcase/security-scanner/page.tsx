import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check, ExternalLink, Github, Minus, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScannerHero } from "./components/scanner-hero"

const TITLE = "GitHub Dependency Scanner (OSV.dev) | TopFlow"
const DESCRIPTION =
  "Check a GitHub repository's dependencies against the OSV.dev vulnerability database: CVE IDs, severity and fixed versions, built as an open-source TopFlow workflow."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "github dependency scanner",
    "OSV.dev",
    "dependency vulnerabilities",
    "CVE scanner",
    "software composition analysis",
    "topflow",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://www.topflow.dev/showcase/security-scanner",
    images: [{ url: "https://www.topflow.dev/og-site.png", width: 1200, height: 630, alt: "TopFlow: secure AI workflows" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["https://www.topflow.dev/og-site.png"],
  },
  alternates: {
    canonical: "https://www.topflow.dev/showcase/security-scanner",
  },
}

const REPO = "https://github.com/csupenn/topflow/blob/main"

const CHECKS = [
  {
    title: "Known vulnerabilities in dependencies",
    body: "Every dependency version is looked up in OSV.dev. Findings include the CVE (or advisory) ID, severity and the first fixed version.",
  },
  {
    title: "npm, PyPI, Go and Rust",
    body: "Reads package-lock.json or pnpm-lock.yaml (falling back to package.json), requirements.txt, go.mod and Cargo.lock.",
  },
  {
    title: "Two security practices",
    body: "Whether the repo has a SECURITY.md policy and a Dependabot configuration.",
  },
]

const NOT_CHECKED = [
  "Your own source code: no injection, XSS or authentication analysis (that's static analysis, a different tool)",
  "Compliance: nothing here assesses GDPR, SOC 2 or HIPAA",
  "Test coverage, CI setup or code quality",
  "Other manifest formats, such as yarn.lock or poetry.lock (not parsed yet)",
]

const STEPS = [
  { name: "Parse Repository", detail: "Turns the URL you typed into owner/repo." },
  { name: "Fetch Repo Metadata", detail: "Stars, language and default branch from the GitHub API." },
  { name: "Security Scan", detail: "Reads the manifests from GitHub, queries OSV.dev, and scores the result with the formula below." },
  { name: "Calculate Score", detail: "Prepares the score, grade and breakdown for the report. No AI involved." },
  { name: "Write the report", detail: "Built from the scan data; or, if you switch it on, an LLM with your own key explains the findings." },
]

const SCORE = [
  { weight: "35%", label: "Vulnerabilities", rule: "100, minus 30 per critical, 20 per high, 10 per medium, 2 per low" },
  { weight: "25%", label: "Affected packages", rule: "100, minus 15 per dependency with any known vulnerability" },
  { weight: "25%", label: "Practices", rule: "50 each for SECURITY.md and a Dependabot config" },
  { weight: "15%", label: "OWASP A06", rule: "Pass 100 · medium findings only 70 · any high or critical 30" },
]

function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">{eyebrow}</p>
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h2>
      {children && <p className="mt-3 text-muted-foreground leading-relaxed max-w-3xl">{children}</p>}
    </div>
  )
}

export default function SecurityScannerShowcase() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation (same as the blog) */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/home" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">TopFlow</span>
            </Link>
            <div className="flex items-center gap-1 sm:gap-4">
              <Link href="/builder" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  Builder
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="ghost" size="sm">
                  Docs
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="ghost" size="sm">
                  Blog
                </Button>
              </Link>
              <Link href="/builder">
                <Button size="sm">Try Demo</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <ScannerHero />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-20">
        {/* Scope */}
        <section>
          <SectionHeading eyebrow="Scope" title="What it checks, and what it doesn't">
            A score is only useful if you know what went into it. This scanner answers one question well: do this
            repository&apos;s dependencies have known vulnerabilities?
          </SectionHeading>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-4">Checks</h3>
              <ul className="space-y-4">
                {CHECKS.map((c) => (
                  <li key={c.title} className="flex gap-3">
                    <Check className="h-5 w-5 shrink-0 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{c.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-4">Doesn&apos;t check</h3>
              <ul className="space-y-4">
                {NOT_CHECKED.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Minus className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* How it runs */}
        <section>
          <SectionHeading eyebrow="How it works" title="Five workflow steps, all visible in the builder">
            The findings come from OSV.dev and the score from a fixed formula. The AI step only writes the explanation.
            It can&apos;t add, remove or re-grade findings.
          </SectionHeading>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <li key={s.name} className="rounded-lg border border-border bg-card p-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary mb-3">
                  {i + 1}
                </span>
                <p className="font-medium text-foreground text-sm mb-1">{s.name}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.detail}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-muted-foreground">
            Why the AI doesn&apos;t get to decide:{" "}
            <Link href="/blog/untrusted-reasoning-worker-llm-security" className="text-primary hover:underline">
              The Untrusted Reasoning Worker
            </Link>
            .
          </p>
        </section>

        {/* Score */}
        <section>
          <SectionHeading eyebrow="Scoring" title="How the score is calculated">
            A weighted average of four parts, rounded to 0–100. Grades: A+ from 95, A from 90, A− from 85, B+ from 80, B
            from 70, C+ from 60, C from 50, D below that.
          </SectionHeading>
          <ul className="overflow-hidden rounded-lg border border-border divide-y divide-border">
            {SCORE.map((row) => (
              <li key={row.label} className="bg-card px-4 py-3 sm:flex sm:items-baseline sm:gap-4 text-sm">
                <span className="font-mono font-semibold text-primary sm:w-12 shrink-0">{row.weight}</span>
                <span className="ml-2 sm:ml-0 font-medium text-foreground sm:w-40 shrink-0">{row.label}</span>
                <p className="mt-1 sm:mt-0 text-muted-foreground">{row.rule}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Source:{" "}
            <a
              href={`${REPO}/lib/osv/scanner.ts`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              lib/osv/scanner.ts
              <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </section>

        {/* Modes and data */}
        <section>
          <SectionHeading eyebrow="Before you run it" title="Sample results, real scans, and your data" />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-2">Sample results (default)</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Without any setup, runs return bundled sample data so you can see the whole workflow. A few well-known
                repos have their own samples; other repos show a generic one. Sample scores are not a real assessment.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-2">Real scan</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Turn on <span className="text-foreground">Run a real scan</span> in the run dialog. Public repos work
                without a key, but GitHub&apos;s unauthenticated rate limit is low; a GitHub token raises it and allows
                private repos.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-2">AI-written report (optional)</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Off by default, even if you&apos;ve saved AI keys. Turn on{" "}
                <span className="text-foreground">Write the report with my AI key</span> for a run to have an LLM, using
                your own key and quota, explain the findings. It can&apos;t change them. With a Google key it also draws
                an illustration, labeled as AI-generated.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-2">What goes where, and who pays</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our server receives the repo name and, if you add one, your GitHub token for that request. It calls the
                GitHub API and OSV.dev (free), and stores neither the results nor your token. Nothing calls an AI
                provider unless you switch the AI report on.
              </p>
            </div>
          </div>
        </section>

        {/* CTA
            T3-COPY: "Inspect every node, or export…" is deliberate — the hosted service refuses edited
            JavaScript/Tool code until isolation ships (H17 containment). When custom code is re-enabled,
            say users can change the scoring here. Checklist: docs/architecture/js-node-isolation-design.md §8.1 */}
        <section className="rounded-lg border border-primary/20 bg-primary/5 p-8 sm:p-10 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">Open the workflow, then make it yours</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            The scanner is an ordinary TopFlow template. Inspect every node, or export it as TypeScript and run and change it on
            your own infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/builder?template=github-security-scanner">
              <Button size="lg" className="w-full sm:w-auto">
                Open in builder
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href={`${REPO}/lib/osv/scanner.ts`} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Github className="mr-2 h-4 w-4" />
                Read the scanner code
              </Button>
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 px-4 bg-card/30">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-muted-foreground">
          <span>© 2026 TopFlow. Built by Charlie Su, Former CISO.</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <a
              href="https://github.com/csupenn/topflow"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
