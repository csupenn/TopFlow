"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Star,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Twitter,
  Linkedin,
  Share2,
  TrendingUp,
  Clock,
  Code
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { AnimatedScore } from "@/components/animated-score"
import { BadgeDisplay } from "@/components/badge-display"

interface GitHubScannerResultsProps {
  outputs: Record<string, any>
  repository: string
}

export function GitHubScannerResults({ outputs, repository }: GitHubScannerResultsProps) {
  const [copied, setCopied] = useState(false)

  // Debug logging
  console.log('[GitHubScannerResults] Rendering with:', {
    outputKeys: Object.keys(outputs),
    repository,
    hasCalculateScore: !!outputs["calculate-score"],
    calculateScoreData: outputs["calculate-score"],
    hasFetchMetadata: !!outputs["fetch-metadata"],
    metadataKeys: outputs["fetch-metadata"] ? Object.keys(outputs["fetch-metadata"]) : []
  })

  // Extract data from workflow outputs
  const scoreData = outputs["calculate-score"] || outputs["score"] || {}
  const metadata = outputs["fetch-metadata"] || {}
  const actionData = outputs["extract-actions"] || {}
  const aiAnalysis = outputs["ai-analysis"] || ""
  const dashboardImage = outputs["generate-visual"]?.url || "/demo-assets/images/github-security-dashboard.webp"
  const securityData = outputs["fetch-security"] || {}

  const score = scoreData.score || 85
  const grade = scoreData.grade || "B+"
  const stars = metadata.stargazers_count || 0
  const language = metadata.language || "Unknown"

  // Check if using demo mode fallback
  const isDemoMode = securityData._demoMode || false
  const isUsingDefault = securityData._isUsingDefault || false
  const requestedRepo = securityData._requestedRepo

  // Use actual repo from metadata if using fallback, otherwise use requested repo
  const rawRepo = (isUsingDefault && metadata.full_name) ? metadata.full_name : (repository || metadata.full_name || "Unknown Repository")

  // Normalize to "owner/repo" from any input format (full URL, github.com/owner/repo, or owner/repo)
  const repoParts = rawRepo
    .replace(/^https?:\/\//i, "")
    .replace(/^github\.com\//i, "")
    .replace(/\.git$/i, "")
    .split("/")
    .filter(Boolean)
  const owner = repoParts[0] || "unknown"
  const repo = repoParts[1] || "unknown"
  const repoName = repoParts.length >= 2 ? `${owner}/${repo}` : rawRepo

  // Get grade color
  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-500 border-green-500 bg-green-500/10"
    if (grade.startsWith("B")) return "text-blue-500 border-blue-500 bg-blue-500/10"
    if (grade.startsWith("C")) return "text-yellow-500 border-yellow-500 bg-yellow-500/10"
    return "text-red-500 border-red-500 bg-red-500/10"
  }

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 80) return "text-blue-500"
    if (score >= 70) return "text-yellow-500"
    return "text-red-500"
  }

  // Share functionality
  const shareToTwitter = () => {
    const text = `🔒 ${repoName} scored ${score}/100 (Grade: ${grade}) on @TopFlowDev security scanner! Try it: https://www.topflow.dev/builder?template=github-security-scanner`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  }

  const shareToLinkedIn = () => {
    // LinkedIn's share endpoint only accepts URL (no title/text parameters)
    // Copy rich text to clipboard for user to paste
    const fallbackNote = isUsingDefault && requestedRepo
      ? `\n(Showing demo results for ${repoName} as requested repo ${requestedRepo} is not in demo data)\n`
      : ''

    const shareText = `🔒 Security Analysis: ${repoName}${fallbackNote}
Score: ${score}/100 (Grade: ${grade})
Language: ${language}
Stars: ${stars.toLocaleString()}

I just scanned this repository with TopFlow's GitHub Security Scanner and got actionable security recommendations.

Try it yourself: https://www.topflow.dev/builder?template=github-security-scanner

#CyberSecurity #DevSecOps #GitHubSecurity #OpenSource`

    // Copy to clipboard
    navigator.clipboard.writeText(shareText)
    toast.success("LinkedIn post copied! Paste it when the share dialog opens.", { duration: 4000 })

    // Open LinkedIn share dialog (user will paste the text)
    setTimeout(() => {
      const url = `https://www.topflow.dev/builder?template=github-security-scanner`
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
    }, 500)
  }

  const copyBadge = () => {
    const badgeMarkdown = `[![Security Score](https://img.shields.io/badge/Security-${grade}-${score >= 80 ? 'green' : 'yellow'})](https://www.topflow.dev/builder?template=github-security-scanner)`
    navigator.clipboard.writeText(badgeMarkdown)
    setCopied(true)
    toast.success("Badge markdown copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const copyLink = () => {
    const url = `${window.location.origin}/builder?template=github-security-scanner&repo=${encodeURIComponent(repoName)}`
    navigator.clipboard.writeText(url)
    toast.success("Link copied! Others can scan this repo with their own API keys.")
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Demo Mode Banner */}
      {isDemoMode && isUsingDefault && requestedRepo && (
        <Card className="border-2 border-yellow-500/50 bg-yellow-500/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-1">Demo Mode Active</h4>
                <p className="text-sm text-muted-foreground">
                  You requested <span className="font-mono font-semibold">{requestedRepo}</span>, but it's not in our demo dataset.
                  Showing example results for <span className="font-mono font-semibold">facebook/react</span> instead.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  💡 <strong>Want to scan your repository?</strong> Add your API keys (GitHub, OpenAI, and Gemini) in Settings to enable real security analysis.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hero Section */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-3xl font-bold flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                Security Report
              </CardTitle>
              <CardDescription className="text-base">
                {repoName}
              </CardDescription>
            </div>
            <AnimatedScore score={score} grade={grade} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Badges */}
          <div className="flex items-center gap-4">
            {score >= 90 && (
              <Badge variant="outline" className="text-green-500 border-green-500">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Security Excellence
              </Badge>
            )}
            {score < 70 && (
              <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Improvements Needed
              </Badge>
            )}
          </div>

          {/* Repository Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">{stars.toLocaleString()} stars</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">{language}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Scanned now</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      {scoreData.components && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Score Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(scoreData.components).map(([key, value]: [string, any]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="font-bold">{value}/100</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Badge Display */}
      <BadgeDisplay owner={owner} repo={repo} grade={grade} score={score} />

      {/* AI Analysis */}
      {aiAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>AI Security Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm">{aiAnalysis}</pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {actionData.recommendations && actionData.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Priority Recommendations</CardTitle>
            <CardDescription>Actionable steps to improve your security score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {actionData.recommendations.map((rec: any, idx: number) => (
                <div key={idx} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={rec.priority === "HIGH" ? "destructive" : "secondary"}>
                      {rec.priority}
                    </Badge>
                    <span className="font-semibold">{rec.action}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.impact}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Effort: {rec.effort}</span>
                    {rec.timeline && <span>Timeline: {rec.timeline}</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Security Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <img
            src={dashboardImage}
            alt="Security Dashboard"
            className="w-full rounded-lg border"
          />
        </CardContent>
      </Card>

      {/* Share Section */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Your Results
          </CardTitle>
          <CardDescription>
            Show off your security score or challenge other repositories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={shareToTwitter} variant="outline">
              <Twitter className="h-4 w-4 mr-2" />
              Share on Twitter
            </Button>
            <Button onClick={shareToLinkedIn} variant="outline">
              <Linkedin className="h-4 w-4 mr-2" />
              Share on LinkedIn
            </Button>
            <Button onClick={copyLink} variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>

          {/* README Badge */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Add this badge to your README:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-muted px-3 py-2 rounded">
                {`[![Security Score](https://img.shields.io/badge/Security-${grade}-${score >= 80 ? 'green' : 'yellow'})](https://www.topflow.dev)`}
              </code>
              <Button onClick={copyBadge} size="sm" variant="outline">
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground pt-4 border-t">
            Analyzed with TopFlow • Want to scan your own repos with live data? Add your API keys in Settings
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
