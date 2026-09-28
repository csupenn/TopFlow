"use client"

import { useState, useEffect } from "react"
import type { Node } from "@xyflow/react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { encryptValue, decryptValue } from "@/lib/security/encryption"
import type { StartNodeData } from "@/components/nodes/start-node"

type ScanOptions = { githubToken?: string; scanMode?: "demo" | "real"; aiReport?: boolean }

type WorkflowInputDialogProps = {
  open: boolean
  startNodes: Node<StartNodeData>[]
  onSubmit: (inputs: Record<string, string>, scanOptions?: ScanOptions) => void
  onCancel: () => void
  workflowId?: string
}

export function WorkflowInputDialog({ open, startNodes, onSubmit, onCancel, workflowId }: WorkflowInputDialogProps) {
  // GitHub Scanner gets two per-run switches (design doc §15): "Run a real scan" (scan-DATA axis,
  // optional BYOK GitHub token) and "Write the report with my AI key" (report-NARRATIVE axis). Both are
  // off by default; a saved AI key only makes the second one available, it never turns it on.
  const isScanner = workflowId === "github-security-scanner"
  const [githubToken, setGithubToken] = useState("")
  const [realScan, setRealScan] = useState(false)
  const [aiReport, setAiReport] = useState(false)
  const [hasAiKey, setHasAiKey] = useState(false)
  const [inputs, setInputs] = useState<Record<string, string>>(() => {
    const initialInputs: Record<string, string> = {}
    startNodes.forEach((node) => {
      initialInputs[node.id] = node.data.defaultValue || ""
    })
    return initialInputs
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Re-read defaultValues whenever dialog opens or startNodes change
  useEffect(() => {
    if (open) {
      const newInputs: Record<string, string> = {}
      startNodes.forEach((node) => {
        newInputs[node.id] = node.data.defaultValue || ""
      })
      setInputs(newInputs)
      setErrors({})
      setAiReport(false)

      // Scanner: the AI-report switch is only available when an AI provider key is saved.
      if (isScanner && typeof window !== "undefined") {
        try {
          const keys = JSON.parse(localStorage.getItem("ai-agent-api-keys") || "{}")
          setHasAiKey(["openai", "anthropic", "google", "groq"].some((p) => Boolean(keys?.[p])))
        } catch {
          setHasAiKey(false)
        }
      }

      // Scanner: load + decrypt any saved GitHub token (legacy plaintext passes through).
      if (isScanner && typeof window !== "undefined") {
        const stored = localStorage.getItem("ai-agent-github-token") || ""
        if (stored) {
          decryptValue(stored)
            .then((token) => {
              setGithubToken(token)
              setRealScan(Boolean(token))
            })
            .catch(() => {
              setGithubToken("")
              setRealScan(false)
            })
        } else {
          setGithubToken("")
          setRealScan(false)
        }
      }
    }
  }, [open, startNodes, isScanner])

  const validateInput = (nodeId: string, value: string, inputType: string): string | null => {
    if (!value.trim()) {
      return "This field is required"
    }

    switch (inputType) {
      case "url":
        try {
          new URL(value)
          return null
        } catch {
          return "Please enter a valid URL"
        }
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(value) ? null : "Please enter a valid email address"
      case "number":
        return isNaN(Number(value)) ? "Please enter a valid number" : null
      default:
        return null
    }
  }

  const handleInputChange = (nodeId: string, value: string) => {
    setInputs((prev) => ({ ...prev, [nodeId]: value }))
    // Clear error when user starts typing
    if (errors[nodeId]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[nodeId]
        return newErrors
      })
    }
  }

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {}

    // Validate all inputs
    startNodes.forEach((node) => {
      const value = inputs[node.id] || ""
      const inputType = node.data.inputType || "text"
      const error = validateInput(node.id, value, inputType)
      if (error) {
        newErrors[node.id] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    let scanOptions: ScanOptions | undefined
    if (isScanner) {
      const token = githubToken.trim()
      if (typeof window !== "undefined") {
        if (token) localStorage.setItem("ai-agent-github-token", await encryptValue(token))
        else localStorage.removeItem("ai-agent-github-token")
      }
      // realScan off => force demo; on => real (token optional: public repos scan tokenless).
      scanOptions = {
        githubToken: realScan && token ? token : undefined,
        scanMode: realScan ? "real" : "demo",
        aiReport: aiReport && hasAiKey,
      }
    }

    onSubmit(inputs, scanOptions)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Workflow Input Required</DialogTitle>
          <DialogDescription>
            This workflow requires input before execution. Please provide the following information:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {startNodes.map((node) => {
            const label = node.data.label || "Input"
            const placeholder = node.data.placeholder || ""
            const inputType = node.data.inputType || "text"
            const error = errors[node.id]

            return (
              <div key={node.id} className="space-y-2">
                <Label htmlFor={`input-${node.id}`}>
                  {label}
                  <span className="ml-1 text-red-500">*</span>
                </Label>
                <Input
                  id={`input-${node.id}`}
                  type={inputType === "number" ? "number" : "text"}
                  value={inputs[node.id] || ""}
                  onChange={(e) => handleInputChange(node.id, e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={placeholder}
                  className={error ? "border-red-500" : ""}
                />
                {error && (
                  <div className="flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
              </div>
            )
          })}

          {isScanner && (
            <div className="space-y-3 rounded-md border border-border p-3">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="real-scan-toggle">Run a real scan</Label>
                  <p className="text-xs text-muted-foreground">
                    Off = instant demo (sample data). On = live scan via OSV + the GitHub API.
                  </p>
                </div>
                <Switch id="real-scan-toggle" checked={realScan} onCheckedChange={setRealScan} />
              </div>

              {realScan && (
                <div className="space-y-2">
                  <Label htmlFor="github-token">GitHub token (optional)</Label>
                  <Input
                    id="github-token"
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="ghp_… — for private repos & higher rate limits"
                  />
                  <p className="text-xs text-muted-foreground">
                    Stored only in your browser, sent per-scan, never saved on our servers. Public
                    repos work without a token (lower rate limit).
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between gap-4 border-t border-border pt-3">
                <div className="space-y-0.5">
                  <Label htmlFor="ai-report-toggle">Write the report with my AI key</Label>
                  <p className="text-xs text-muted-foreground">
                    {hasAiKey
                      ? "Uses your own AI provider key and quota. Off = a report built from the scan data, no AI calls. With a Google key, also draws an AI-generated illustration."
                      : "Add an AI provider key under API Keys to enable. Without it, the report is built from the scan data, with no AI calls."}
                  </p>
                </div>
                <Switch id="ai-report-toggle" checked={aiReport} onCheckedChange={setAiReport} disabled={!hasAiKey} />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Start Workflow</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
