"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Copy, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BadgeDisplayProps {
  owner: string
  repo: string
  grade: string
  score: number
}

export function BadgeDisplay({ owner, repo, grade, score }: BadgeDisplayProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null)
  const { toast } = useToast()

  const repoPath = `${owner}/${repo}`
  // Absolute URL for copy-paste embed snippets (go into external READMEs)
  const badgeUrl = `https://www.topflow.dev/api/badge/${owner}/${repo}`
  // Relative URL for in-app preview/download/view (resolves to current origin: works locally and in prod)
  const badgeSrc = `/api/badge/${owner}/${repo}`
  const scanUrl = `https://www.topflow.dev/builder?template=github-security-scanner&repo=${encodeURIComponent(repoPath)}`

  const markdownCode = `[![Security Score](${badgeUrl})](${scanUrl})`
  const htmlCode = `<a href="${scanUrl}"><img src="${badgeUrl}" alt="Security Score"></a>`
  const rstCode = `.. image:: ${badgeUrl}\n   :target: ${scanUrl}\n   :alt: Security Score`

  const copyToClipboard = async (text: string, tab: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedTab(tab)
      toast({
        title: "Copied!",
        description: "Badge code copied to clipboard",
      })
      setTimeout(() => setCopiedTab(null), 2000)
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy manually",
        variant: "destructive",
      })
    }
  }

  const downloadBadge = () => {
    const link = document.createElement("a")
    link.href = badgeSrc
    link.download = `security-badge-${owner}-${repo}.svg`
    link.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Security Badge</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">{grade}</span>
            <span className="text-sm text-muted-foreground">({score}/100)</span>
          </div>
        </CardTitle>
        <CardDescription>Add this badge to your README to showcase your security score</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Badge Preview */}
        <div className="flex items-center justify-center p-6 bg-muted/50 rounded-lg">
          <img src={badgeSrc} alt="Security Badge" className="h-5" />
        </div>

        {/* Embed Codes */}
        <Tabs defaultValue="markdown" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="rst">RST</TabsTrigger>
          </TabsList>

          <TabsContent value="markdown" className="space-y-2">
            <div className="relative">
              <pre className="p-3 bg-muted rounded-md text-xs overflow-x-auto">
                <code>{markdownCode}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(markdownCode, "markdown")}
              >
                {copiedTab === "markdown" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Add to README.md - clicking the badge will take visitors to your scan results
            </p>
          </TabsContent>

          <TabsContent value="html" className="space-y-2">
            <div className="relative">
              <pre className="p-3 bg-muted rounded-md text-xs overflow-x-auto">
                <code>{htmlCode}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(htmlCode, "html")}
              >
                {copiedTab === "html" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">For HTML documentation or websites</p>
          </TabsContent>

          <TabsContent value="rst" className="space-y-2">
            <div className="relative">
              <pre className="p-3 bg-muted rounded-md text-xs overflow-x-auto whitespace-pre">
                <code>{rstCode}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(rstCode, "rst")}
              >
                {copiedTab === "rst" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">For reStructuredText documentation</p>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={downloadBadge}>
            <Download className="h-4 w-4 mr-2" />
            Download SVG
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <a href={badgeSrc} target="_blank" rel="noopener noreferrer">
              View Badge
            </a>
          </Button>
        </div>

        {/* Viral Message */}
        <div className="p-3 bg-primary/10 rounded-md text-sm">
          <p className="font-semibold mb-1">Help us spread the word!</p>
          <p className="text-xs text-muted-foreground">
            Adding this badge to your README helps other developers discover TopFlow and improve their repository
            security.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
