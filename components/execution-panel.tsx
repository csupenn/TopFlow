"use client"

import { useState } from "react"
import type { Node, Edge } from "@xyflow/react"
import { Play, X, CheckCircle, XCircle, Loader2, Copy, Download, Eye, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { WorkflowInputDialog } from "@/components/workflow-input-dialog"
import type { StartNodeData } from "@/components/nodes/start-node"
import { GitHubScannerResults } from "@/components/github-scanner-results"
import { decryptApiKeys, decryptValue } from "@/lib/security/encryption"

type ExecutionResult = {
  nodeId: string
  type: string
  output: any
  error?: string
}

type ExecutionPanelProps = {
  nodes: Node[]
  edges: Edge[]
  onClose: () => void
  onNodeStatusChange?: (nodeId: string, status: "idle" | "running" | "completed" | "error") => void
  onNodeOutputChange?: (nodeId: string, output: any) => void
  onShowEndNode?: () => void
  onViewFullReport?: () => void
  workflowId?: string
}

export function ExecutionPanel({
  nodes,
  edges,
  onClose,
  onNodeStatusChange,
  onNodeOutputChange,
  onShowEndNode,
  onViewFullReport,
  workflowId,
}: ExecutionPanelProps) {
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionLog, setExecutionLog] = useState<ExecutionResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [executionComplete, setExecutionComplete] = useState(false)
  const [showInputDialog, setShowInputDialog] = useState(false)
  const [startNodesWithInput, setStartNodesWithInput] = useState<Node<StartNodeData>[]>([])
  const [pendingUserInputs, setPendingUserInputs] = useState<Record<string, string> | null>(null)

  const finalEntries = executionLog.filter((entry) => entry.type === "end" && entry.output?.finalOutput !== undefined)
  const latestFinalEntry = finalEntries.length > 0 ? finalEntries[finalEntries.length - 1] : null
  const latestFinalOutput = latestFinalEntry?.output?.finalOutput
  const finalObject =
    latestFinalOutput && typeof latestFinalOutput === "object" && !Array.isArray(latestFinalOutput)
      ? (latestFinalOutput as Record<string, any>)
      : null

  const resolveStatusInfo = (status?: string | null) => {
    switch (status) {
      case "fulfilled":
      case "complete":
        return { label: "Fulfilled", className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/40" }
      case "pending_verification":
        return { label: "Pending Verification", className: "bg-amber-500/15 text-amber-700 border-amber-500/40" }
      case "rejected":
        return { label: "Rejected", className: "bg-rose-500/15 text-rose-600 border-rose-500/40" }
      default:
        return { label: "Complete", className: "bg-primary/15 text-primary border-primary/40" }
    }
  }

  const outcomeStatus = finalObject?.status || (latestFinalOutput ? "complete" : null)
  const outcomeStatusInfo = outcomeStatus ? resolveStatusInfo(outcomeStatus) : null

  const handleCopyFinalField = (field: string, value?: string) => {
    if (!value || typeof navigator === "undefined" || !navigator.clipboard) return
    navigator.clipboard.writeText(value)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleShowResults = () => {
    onClose()
    if (onShowEndNode) {
      onShowEndNode()
    }
  }

  const handleDownloadImage = (imageData: string, index: number) => {
    try {
      // Extract base64 data and mime type
      const [metadata, base64] = imageData.split(',')
      const mimeType = metadata.match(/:(.*?);/)?.[1] || 'image/png'
      const extension = mimeType.split('/')[1] || 'png'

      // Convert base64 to blob
      const byteString = atob(base64)
      const arrayBuffer = new ArrayBuffer(byteString.length)
      const uint8Array = new Uint8Array(arrayBuffer)

      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i)
      }

      const blob = new Blob([arrayBuffer], { type: mimeType })
      const url = URL.createObjectURL(blob)

      // Download file
      const a = document.createElement("a")
      a.href = url
      a.download = `generated-image-${Date.now()}-${index + 1}.${extension}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to download image:", error)
    }
  }

  const handleExecute = () => {
    // Check if any start nodes require user input
    const startNodes = nodes.filter((node) => node.type === "start") as Node<StartNodeData>[]
    const nodesWithInput = startNodes.filter((node) => node.data.label && node.data.label.trim())

    if (nodesWithInput.length > 0) {
      // Show input dialog
      setStartNodesWithInput(nodesWithInput)
      setShowInputDialog(true)
    } else {
      // No input needed, execute directly
      executeWorkflow(null)
    }
  }

  const handleInputSubmit = (
    inputs: Record<string, string>,
    scanOptions?: { githubToken?: string; scanMode?: "demo" | "real"; aiReport?: boolean }
  ) => {
    setShowInputDialog(false)
    setPendingUserInputs(inputs)
    executeWorkflow(inputs, scanOptions)
  }

  const handleInputCancel = () => {
    setShowInputDialog(false)
    setStartNodesWithInput([])
  }

  const executeWorkflow = async (
    userInputs: Record<string, string> | null,
    scanOptions?: { githubToken?: string; scanMode?: "demo" | "real"; aiReport?: boolean }
  ) => {
    setIsExecuting(true)
    setExecutionLog([])
    setError(null)
    setCurrentNodeId(null)
    setExecutionComplete(false)

    nodes.forEach((node) => {
      if (onNodeStatusChange) onNodeStatusChange(node.id, "idle")
      if (onNodeOutputChange) onNodeOutputChange(node.id, null)
    })

    try {
      const storedKeys = typeof window !== "undefined" ? localStorage.getItem("ai-agent-api-keys") : null
      // Decrypt at-rest BYOK keys before sending (legacy plaintext passes through).
      const keys = storedKeys ? await decryptApiKeys(JSON.parse(storedKeys)) : {}

      // Two-axis BYOK: GitHub token => real scan DATA; AI key (in `keys`) => LLM NARRATIVE.
      // Use the dialog's choice when present (already plaintext); otherwise fall back to
      // the saved (encrypted) token and decrypt it.
      let githubToken = scanOptions ? scanOptions.githubToken : undefined
      if (!scanOptions && typeof window !== "undefined") {
        const storedToken = localStorage.getItem("ai-agent-github-token")
        githubToken = storedToken ? await decryptValue(storedToken) : undefined
      }

      const response = await fetch("/api/execute-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodes,
          edges,
          apiKeys: keys,
          workflowId: workflowId || "template-threat-intel", // Default to threat intel workflow
          userInputs: userInputs, // Pass user inputs to API
          githubToken, // BYOK scan-data axis (scanner only; undefined => demo data)
          scanMode: scanOptions?.scanMode, // "real" | "demo" | undefined (auto)
          aiReport: scanOptions?.aiReport === true, // scanner: LLM report only when switched on (design §15)
        }),
      })

      if (!response.body) {
        throw new Error("No response body")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (!line.trim()) continue

          try {
            const update = JSON.parse(line)

            switch (update.type) {
              case "node_start":
                if (onNodeStatusChange && update.nodeId) {
                  onNodeStatusChange(update.nodeId, "running")
                  setCurrentNodeId(update.nodeId)
                }
                break

              case "node_complete":
                if (update.nodeId) {
                  if (onNodeStatusChange) {
                    onNodeStatusChange(update.nodeId, "completed")
                  }
                  if (onNodeOutputChange) {
                    onNodeOutputChange(update.nodeId, update.output)
                  }
                  const node = nodes.find((n) => n.id === update.nodeId)
                  setExecutionLog((prev) => [
                    ...prev,
                    {
                      nodeId: update.nodeId,
                      type: node?.type || "unknown",
                      output: update.output,
                    },
                  ])
                  setCurrentNodeId(null)
                }
                break

              case "node_error":
                if (update.nodeId && onNodeStatusChange) {
                  onNodeStatusChange(update.nodeId, "error")
                }
                const errorNode = nodes.find((n) => n.id === update.nodeId)
                setExecutionLog((prev) => [
                  ...prev,
                  {
                    nodeId: update.nodeId || "unknown",
                    type: errorNode?.type || "unknown",
                    output: null,
                    error: update.error,
                  },
                ])
                setCurrentNodeId(null)
                break

              case "complete":
                setCurrentNodeId(null)
                setExecutionComplete(true)
                break

              case "error":
                setError(update.error || "Execution failed")
                break
            }
          } catch (parseError) {
            console.error("Failed to parse update:", parseError)
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to execute workflow")
    } finally {
      setIsExecuting(false)
    }
  }

  const getNodeLabel = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return nodeId

    switch (node.type) {
      case "textModel":
        return `Text Model (${node.data.model})`
      case "embeddingModel":
        return `Embedding Model (${node.data.model})`
      case "tool":
        return `Tool (${node.data.name})`
      case "structuredOutput":
        return `Structured Output (${node.data.schemaName})`
      case "prompt":
        return "Prompt"
      case "imageGeneration":
        return "Image Generation"
      case "audio":
        return "Audio Generation"
      case "javascript":
        return "JavaScript"
      default:
        return node.type || "Unknown"
    }
  }

  // Convert execution log to outputs map for GitHub Scanner
  const workflowOutputs = executionLog.reduce((acc, entry) => {
    if (entry.output !== undefined) {
      acc[entry.nodeId] = entry.output
    }
    return acc
  }, {} as Record<string, any>)

  // Get repository name from start node input
  const startNodeInput = workflowOutputs["start"] || ""
  const repository = typeof startNodeInput === "string" ? startNodeInput : ""

  // Check if this is the GitHub Scanner workflow
  const isGitHubScanner = workflowId === "github-security-scanner"

  // Debug logging for GitHub Scanner
  if (isGitHubScanner && executionComplete) {
    console.log('[ExecutionPanel] GitHub Scanner execution complete:', {
      executionComplete,
      isExecuting,
      outputKeysCount: Object.keys(workflowOutputs).length,
      outputKeys: Object.keys(workflowOutputs),
      hasCalculateScore: !!workflowOutputs["calculate-score"],
      hasFetchMetadata: !!workflowOutputs["fetch-metadata"],
      hasExtractActions: !!workflowOutputs["extract-actions"],
      repository
    })
  }

  return (
    <aside className="absolute right-0 top-0 z-10 h-full w-full border-l border-border bg-card md:relative md:w-96">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="text-sm font-semibold text-foreground">Execution</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4">
        {executionComplete && !isExecuting ? (
          <div className="space-y-2">
            {isGitHubScanner && onViewFullReport ? (
              <Button
                onClick={onViewFullReport}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Full Report
              </Button>
            ) : !isGitHubScanner ? (
              <Button
                onClick={handleShowResults}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Eye className="mr-2 h-4 w-4" />
                Show Results
              </Button>
            ) : null}
            <p className="text-center text-xs text-muted-foreground">
              {isGitHubScanner ? "View detailed analysis in full screen" : "To run again, click \"Run\" in the header"}
            </p>
          </div>
        ) : (
          <Button
            data-execute-workflow
            onClick={handleExecute}
            disabled={isExecuting || nodes.length === 0}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isExecuting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Workflow
              </>
            )}
          </Button>
        )}

        {(finalObject || (latestFinalOutput && !finalObject)) && (
          <Card className="mt-4 border-primary/60 bg-primary/5 p-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Outcome Summary</p>
                <p className="text-base font-semibold text-foreground">
                  {finalObject?.requester || "Workflow completed"}
                </p>
                {finalObject?.requestId && (
                  <p className="text-xs text-muted-foreground/80">Request ID: {finalObject.requestId}</p>
                )}
              </div>
              {outcomeStatusInfo && (
                <Badge variant="outline" className={outcomeStatusInfo.className}>
                  {outcomeStatusInfo.label}
                </Badge>
              )}
            </div>

            {finalObject ? (
              <>
                <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground/90 sm:grid-cols-2">
                  <div>
                    <span className="font-semibold text-foreground/80">Channel:</span> {finalObject.channel || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground/80">Completed:</span>{" "}
                    {finalObject.completedAt
                      ? new Date(finalObject.completedAt).toLocaleString()
                      : finalObject.updatedAt
                        ? new Date(finalObject.updatedAt).toLocaleString()
                        : "Just now"}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground/80">Categories:</span>{" "}
                    {Array.isArray(finalObject.dataCategories) && finalObject.dataCategories.length > 0
                      ? finalObject.dataCategories.join(", ")
                      : "Not specified"}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground/80">Jurisdiction:</span>{" "}
                    {finalObject.jurisdiction || "EU"}
                  </div>
                  {finalObject.slaDeadline && (
                    <div className="col-span-full">
                      <span className="font-semibold text-foreground/80">SLA Deadline:</span>{" "}
                      {(() => {
                        const deadline = new Date(finalObject.slaDeadline)
                        const now = new Date()
                        const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                        const slaColor =
                          daysRemaining < 0
                            ? "text-rose-600"
                            : daysRemaining < 7
                              ? "text-amber-600"
                              : "text-emerald-600"
                        return (
                          <>
                            {deadline.toLocaleDateString()}{" "}
                            <span className={`font-semibold ${slaColor}`}>
                              ({daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days remaining`})
                            </span>
                          </>
                        )
                      })()}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {typeof finalObject.responseLetter === "string" && finalObject.responseLetter.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyFinalField("letter", finalObject.responseLetter)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      {copiedField === "letter" ? "Letter Copied" : "Copy Letter"}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyFinalField("json", JSON.stringify(finalObject, null, 2))}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {copiedField === "json" ? "JSON Copied" : "Copy JSON"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(finalObject, null, 2)], {
                        type: "application/json",
                      })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = `gdpr-request-${finalObject.requestId || "output"}.json`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download JSON
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const auditReport = `
GDPR Data Access Request - Audit Trail
========================================

Request ID: ${finalObject.requestId || "N/A"}
Requester: ${finalObject.requester || "N/A"}
Status: ${finalObject.status || "N/A"}
Completed: ${finalObject.completedAt ? new Date(finalObject.completedAt).toLocaleString() : "N/A"}

SLA Information:
${finalObject.slaDeadline ? `Deadline: ${new Date(finalObject.slaDeadline).toLocaleString()}` : "Standard 30-day SLA"}

Data Categories Requested:
${Array.isArray(finalObject.dataCategories) ? finalObject.dataCategories.map((c) => `- ${c}`).join("\n") : "Not specified"}

Channel: ${finalObject.channel || "N/A"}
Jurisdiction: ${finalObject.jurisdiction || "EU"}

Response Letter:
${"-".repeat(80)}
${finalObject.responseLetter || "No response letter generated"}
${"-".repeat(80)}

Attachments:
${finalObject.attachments?.bundleSummary || "No attachments"}

Audit Information:
${finalObject.audit ? JSON.stringify(finalObject.audit, null, 2) : "No audit information"}

---
Generated: ${new Date().toLocaleString()}
System: TopFlow GDPR Workflow Engine
`
                      const blob = new Blob([auditReport], { type: "text/plain" })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = `gdpr-audit-${finalObject.requestId || "report"}.txt`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Audit Report
                  </Button>
                  {finalObject.attachments?.downloadUrl && (
                    <Button size="sm" variant="ghost" asChild>
                      <a href={finalObject.attachments.downloadUrl} target="_blank" rel="noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download Attachments
                      </a>
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded bg-background/90 p-3 text-xs text-muted-foreground">
                {typeof latestFinalOutput === "string" ? latestFinalOutput : JSON.stringify(latestFinalOutput)}
              </div>
            )}
          </Card>
        )}

        {error && (
          <Card className="mt-4 border-destructive bg-destructive/10 p-3">
            <div className="flex items-start gap-2">
              <XCircle className="h-4 w-4 text-destructive" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">Error</p>
                <p className="text-xs text-destructive/80">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* GitHub Scanner Results - Show after execution completes */}
        {isGitHubScanner && executionComplete && !isExecuting && Object.keys(workflowOutputs).length > 0 && (
          <ScrollArea className="h-[calc(100vh-200px)] mt-4">
            <GitHubScannerResults outputs={workflowOutputs} repository={repository} />
          </ScrollArea>
        )}

        {/* Standard Execution Log - Hidden for GitHub Scanner when complete */}
        {executionLog.length > 0 && !(isGitHubScanner && executionComplete) && (
          <div className="mt-4">
            <h3 className="mb-2 text-sm font-medium text-foreground">Execution Log</h3>
            <ScrollArea className="h-[calc(100vh-250px)]">
              <div className="space-y-3">
                {currentNodeId && (
                  <Card className="border border-primary/50 bg-primary/5 p-3">
                    <div className="flex items-start gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{getNodeLabel(currentNodeId)}</p>
                        <p className="text-xs text-muted-foreground">Executing...</p>
                      </div>
                    </div>
                  </Card>
                )}
                {executionLog.map((result, index) => (
                  <Card
                    key={index}
                    className={`border p-3 ${
                      result.error ? "border-destructive bg-destructive/5" : "border-border bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {result.error ? (
                        <XCircle className="h-4 w-4 text-destructive" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-chart-3" />
                      )}
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-foreground">{getNodeLabel(result.nodeId)}</p>
                        {result.error ? (
                          <p className="text-xs text-destructive">{result.error}</p>
                        ) : result.type === "imageGeneration" && result.output ? (
                          (() => {
                            // Handle different image output formats
                            let imageArray: string[] = []

                            if (Array.isArray(result.output)) {
                              imageArray = result.output
                            } else if (typeof result.output === 'object' && result.output.images) {
                              imageArray = result.output.images
                            } else if (typeof result.output === 'string') {
                              imageArray = [result.output]
                            }

                            // Convert base64 strings to data URLs if needed
                            imageArray = imageArray.map((img: string) => {
                              if (typeof img !== 'string') return ''
                              // If already a data URL, return as-is
                              if (img.startsWith('data:')) return img
                              // If raw base64, add data URL prefix
                              return `data:image/png;base64,${img}`
                            }).filter(Boolean)

                            if (imageArray.length === 0) {
                              // No valid images, show raw output
                              return (
                                <div className="rounded bg-background p-2">
                                  <pre className="max-h-32 overflow-auto text-xs text-muted-foreground">
                                    {JSON.stringify(result.output, null, 2)}
                                  </pre>
                                </div>
                              )
                            }

                            return (
                              <div className="space-y-2">
                                {imageArray.map((imageDataUrl: string, idx: number) => (
                                  <div key={idx} className="space-y-1.5">
                                    <div className="rounded bg-background/90 border border-border/30 p-2">
                                      <div className="flex items-center gap-2 mb-2">
                                        <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-xs font-medium text-muted-foreground">Image {idx + 1}</span>
                                      </div>
                                      <img
                                        src={imageDataUrl}
                                        alt={`Generated image ${idx + 1}`}
                                        className="w-full rounded border border-border/30"
                                        onError={(e) => {
                                          console.error("[ExecutionPanel] Image failed to load:", imageDataUrl.substring(0, 50))
                                          e.currentTarget.src = "/image-error.png"
                                        }}
                                      />
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="w-full h-7 text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDownloadImage(imageDataUrl, idx)
                                      }}
                                    >
                                      <Download className="mr-1.5 h-3 w-3" />
                                      Download Image {idx + 1}
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )
                          })()
                        ) : (
                          <div className="rounded bg-background p-2">
                            <pre className="max-h-32 overflow-auto text-xs text-muted-foreground">
                              {typeof result.output === "string"
                                ? result.output
                                : JSON.stringify(result.output, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {executionLog.length === 0 && currentNodeId && (
          <div className="mt-4">
            <h3 className="mb-2 text-sm font-medium text-foreground">Execution Log</h3>
            <Card className="border border-primary/50 bg-primary/5 p-3">
              <div className="flex items-start gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{getNodeLabel(currentNodeId)}</p>
                  <p className="text-xs text-muted-foreground">Executing...</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {executionLog.length === 0 && !error && !isExecuting && !currentNodeId && (
          <Card className="mt-4 border-border bg-secondary/50 p-4">
            <p className="text-center text-sm text-muted-foreground">
              Click "Run Workflow" to execute your AI agent pipeline
            </p>
          </Card>
        )}
      </div>

      <WorkflowInputDialog
        open={showInputDialog}
        startNodes={startNodesWithInput}
        onSubmit={handleInputSubmit}
        onCancel={handleInputCancel}
        workflowId={workflowId}
      />
    </aside>
  )
}
