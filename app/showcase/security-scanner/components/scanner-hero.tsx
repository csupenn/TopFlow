"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Github, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/** Repos with bundled sample results, so the zero-setup demo shows their own data. */
const EXAMPLE_REPOS = ["facebook/react", "vercel/next.js", "django/django"]

function toRepoPath(value: string): string {
  let repo = value.trim()
  if (repo.includes("github.com/")) repo = repo.split("github.com/")[1]
  return repo.replace(/\.git$/, "").replace(/\/$/, "")
}

export function ScannerHero() {
  const router = useRouter()
  const [repoUrl, setRepoUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const openInBuilder = (value: string) => {
    const repo = toRepoPath(value)
    if (!repo) return
    setIsLoading(true)
    router.push(`/builder?template=github-security-scanner&repo=${encodeURIComponent(repo)}`)
  }

  return (
    <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground mb-6">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Open source · built as a TopFlow workflow
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-5">
          GitHub Dependency Scanner
        </h1>
        {/* T3-COPY: "open and inspect" (not "change") until custom code is re-enabled — see design doc §8.1 */}
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Checks a repository&apos;s dependencies against the{" "}
          <a
            href="https://osv.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            OSV.dev
          </a>{" "}
          vulnerability database and tells you what to upgrade. Every step is a workflow node you can open and
          inspect.
        </p>

        <form
          className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
          onSubmit={(e) => {
            e.preventDefault()
            openInBuilder(repoUrl)
          }}
        >
          <div className="relative flex-1">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              aria-label="GitHub repository"
              placeholder="owner/repo or https://github.com/owner/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="h-11 pl-9"
            />
          </div>
          <Button type="submit" size="lg" className="h-11" disabled={!repoUrl.trim() || isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Open in builder"}
            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="text-muted-foreground">Try:</span>
          {EXAMPLE_REPOS.map((repo) => (
            <button
              key={repo}
              type="button"
              onClick={() => openInBuilder(repo)}
              className="rounded-md border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground hover:border-primary transition-colors"
            >
              {repo}
            </button>
          ))}
        </div>

        <p className="mt-6 text-xs text-muted-foreground max-w-xl mx-auto">
          This opens the scanner workflow in the builder. Runs show sample results unless you turn on{" "}
          <span className="text-foreground">Run a real scan</span> in the run dialog. No account needed.
        </p>
      </div>
    </section>
  )
}
