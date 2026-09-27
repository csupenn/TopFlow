"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Key, Sparkles, Zap, Shield, Download } from "lucide-react"

type DemoCompletionCTAProps = {
  onConfigureKeys: () => void
  onDismiss?: () => void
}

export function DemoCompletionCTA({ onConfigureKeys, onDismiss }: DemoCompletionCTAProps) {
  return (
    <Card className="mt-4 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Ready to Run Your Own Workflows?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              You just experienced a demo with cached results. Add your API keys to unlock the full power of live AI
              models.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <Zap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-muted-foreground">
                <strong className="text-foreground">Live AI Execution:</strong> Connect to OpenAI, Anthropic, Google,
                and Groq
              </span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-muted-foreground">
                <strong className="text-foreground">Privacy-First:</strong> Your API keys are stored in your browser
                and used only in memory to run your workflow — never stored or logged
              </span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Download className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-muted-foreground">
                <strong className="text-foreground">Export to Code:</strong> Generate production-ready TypeScript for
                your projects
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button onClick={onConfigureKeys} className="bg-primary hover:bg-primary/90">
              <Key className="mr-2 h-4 w-4" />
              Add Your API Keys
            </Button>
            {onDismiss && (
              <Button variant="ghost" onClick={onDismiss}>
                Maybe Later
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
