"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Twitter, Linkedin, Share2, Copy, Check, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareResultsCardProps {
  owner: string
  repo: string
  grade: string
  score: number
  vulnerabilities: number
  vulnerableDeps: number
}

export function ShareResultsCard({ owner, repo, grade, score, vulnerabilities, vulnerableDeps }: ShareResultsCardProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const repoPath = `${owner}/${repo}`
  const scanUrl = `https://www.topflow.dev/builder?template=github-security-scanner&repo=${encodeURIComponent(repoPath)}`
  const ogImageUrl = `https://www.topflow.dev/api/og/security-scanner?repo=${encodeURIComponent(repoPath)}&grade=${encodeURIComponent(grade)}&score=${score}&vulnerabilities=${vulnerabilities}&deps=${vulnerableDeps}`

  // Social share texts
  const twitterText = `🔒 ${repoPath} scored ${score}/100 (${grade}) on @TopFlowDev security scanner! Check the full report: ${scanUrl}`
  const linkedinText = `I just ran a security scan on ${repoPath} and got a ${grade} (${score}/100)! ${vulnerabilities === 0 ? 'No critical issues found 🎉' : `Found ${vulnerabilities} critical issues that need attention.`}\n\nFull report: ${scanUrl}\n\n#CyberSecurity #DevSecOps #OpenSource`

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`
    window.open(url, "_blank", "width=550,height=420")
  }

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(scanUrl)}`
    window.open(url, "_blank", "width=550,height=420")
  }

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(scanUrl)
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "Share link copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy manually",
        variant: "destructive",
      })
    }
  }

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${repoPath} Security Report`,
          text: `Security scan results: ${grade} (${score}/100)`,
          url: scanUrl,
        })
      } catch (error) {
        // User cancelled or error occurred
        console.log("Share cancelled or failed", error)
      }
    } else {
      copyShareUrl()
    }
  }

  const downloadImage = () => {
    const link = document.createElement("a")
    link.href = ogImageUrl
    link.download = `security-report-${owner}-${repo}.png`
    link.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share Results
        </CardTitle>
        <CardDescription>Share your security score on social media</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Share URL */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Share Link</label>
          <div className="flex gap-2">
            <Input value={scanUrl} readOnly className="font-mono text-xs" />
            <Button size="icon" variant="outline" onClick={copyShareUrl}>
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={shareToTwitter} className="w-full">
            <Twitter className="h-4 w-4 mr-2" />
            Share on X
          </Button>
          <Button variant="outline" onClick={shareToLinkedIn} className="w-full">
            <Linkedin className="h-4 w-4 mr-2" />
            Share on LinkedIn
          </Button>
        </div>

        {/* Native Share or Copy */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={nativeShare} className="w-full">
            <Share2 className="h-4 w-4 mr-2" />
            {typeof navigator.share === 'function' ? "Share..." : "Copy Link"}
          </Button>
          <Button variant="outline" onClick={downloadImage} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download Image
          </Button>
        </div>

        {/* OG Image Preview */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Preview Image</label>
          <div className="rounded-lg overflow-hidden border">
            <img
              src={ogImageUrl}
              alt="Security Report Preview"
              className="w-full"
              style={{ aspectRatio: "1200/630" }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            This image will be shown when you share on social media
          </p>
        </div>

        {/* Viral CTA */}
        <div className="p-3 bg-primary/10 rounded-md text-sm">
          <p className="font-semibold mb-1">Spread the word!</p>
          <p className="text-xs text-muted-foreground">
            Help other developers discover security issues in their repositories by sharing TopFlow.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
