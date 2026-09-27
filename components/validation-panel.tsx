"use client"

import type React from "react"

import { useMemo, useState } from "react"
import type { Node, Edge } from "@xyflow/react"
import { AlertCircle, AlertTriangle, Info, X, CheckCircle2, Shield, Lock, FileCheck, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  validateWorkflow,
  validateApiKeys,
  calculateValidationScore,
  getValidationGrade,
  type ValidationIssue,
} from "@charliesu/workflow-core"
import { shouldUseDemoMode } from "@/lib/demo-mode"
import { hasDemoData } from "@/lib/demo-data"

type ValidationPanelProps = {
  nodes: Node[]
  edges: Edge[]
  apiKeys: Record<string, string>
  onClose: () => void
  onNodeHighlight?: (nodeIds: string[]) => void
  onFixIssue?: (issueId: string) => void
  workflowId?: string
}

export function ValidationPanel({ nodes, edges, apiKeys, onClose, onNodeHighlight, onFixIssue, workflowId }: ValidationPanelProps) {
  const [activeTab, setActiveTab] = useState("all")

  const workflowIssues = useMemo(() => validateWorkflow(nodes, edges), [nodes, edges])

  // Check if demo mode should be used for this workflow
  const demoMode = useMemo(() => {
    return shouldUseDemoMode(apiKeys, workflowId)
  }, [apiKeys, workflowId])

  const demoDataAvailable = useMemo(() => {
    return workflowId ? hasDemoData(workflowId) : false
  }, [workflowId])

  // Only validate API keys if NOT in demo mode OR if no demo data available
  const apiKeyIssues = useMemo(() => {
    if (demoMode && demoDataAvailable) {
      // Demo mode is active and demo data available - downgrade API key errors to info
      const issues = validateApiKeys(apiKeys, nodes)
      return issues.map(issue => ({
        ...issue,
        type: "info" as const,
        message: `Demo Mode: ${issue.message} (Demo data will be used for this template)`
      }))
    }
    return validateApiKeys(apiKeys, nodes)
  }, [apiKeys, nodes, demoMode, demoDataAvailable])

  const allIssues = useMemo(() => [...workflowIssues, ...apiKeyIssues], [workflowIssues, apiKeyIssues])

  // Categorize issues
  const errors = allIssues.filter((i) => i.type === "error")
  const warnings = allIssues.filter((i) => i.type === "warning")
  const info = allIssues.filter((i) => i.type === "info")

  // Security-specific issues
  const securityIssues = useMemo(() => {
    return allIssues.filter((issue) => {
      const message = issue.message.toLowerCase()
      const field = issue.field?.toLowerCase() || ""
      const isSecurityRelated =
        message.includes("unsafe") ||
        message.includes("cycle") || // Infinite loops are security risks
        message.includes("security") ||
        message.includes("private network") ||
        message.includes("ssrf") ||
        field.includes("url")
      return isSecurityRelated
    })
  }, [allIssues])

  // Configuration issues (non-security)
  const configIssues = useMemo(() => {
    return allIssues.filter((issue) => !securityIssues.some(si =>
      si.type === issue.type && si.nodeId === issue.nodeId && si.message === issue.message
    ))
  }, [allIssues, securityIssues])

  // Detect compliance frameworks based on templates/nodes
  const complianceFrameworks = useMemo(() => {
    const frameworks = new Set<string>()

    nodes.forEach(node => {
      const label = String(node.data?.label ?? "").toLowerCase()
      const type = node.type || ""

      if (label.includes("gdpr") || label.includes("privacy")) frameworks.add("GDPR")
      if (label.includes("soc") || label.includes("audit")) frameworks.add("SOC 2")
      if (label.includes("hipaa") || label.includes("healthcare")) frameworks.add("HIPAA")
      if (label.includes("pci") || label.includes("payment")) frameworks.add("PCI DSS")
      if (label.includes("nerc") || label.includes("cip")) frameworks.add("NERC CIP")
      if (label.includes("iso") || label.includes("27001")) frameworks.add("ISO 27001")
    })

    return Array.from(frameworks)
  }, [nodes])

  // Security score calculation
  const securityScore = useMemo(() => {
    const securityErrors = securityIssues.filter(i => i.type === "error").length
    const securityWarnings = securityIssues.filter(i => i.type === "warning").length

    if (securityErrors > 0) return Math.max(0, 40 - securityErrors * 15)
    if (securityWarnings > 0) return Math.max(60, 90 - securityWarnings * 10)
    return 100
  }, [securityIssues])

  const score = calculateValidationScore(allIssues)
  const grade = getValidationGrade(score)

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "text-green-600 bg-green-50 border-green-200"
      case "B":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "C":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "D":
        return "text-orange-600 bg-orange-50 border-orange-200"
      default:
        return "text-red-600 bg-red-50 border-red-200"
    }
  }

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-200"
    if (score >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  const handleIssueClick = (issue: ValidationIssue) => {
    if (onNodeHighlight && issue.nodeId) {
      onNodeHighlight([issue.nodeId])
    }
  }

  const renderIssueList = (issues: ValidationIssue[], icon: React.ReactNode, colorClass: string) => {
    if (issues.length === 0) return null

    return (
      <div className="space-y-2">
        {issues.map((issue, index) => (
          <Card
            key={`${issue.type}-${issue.nodeId || 'global'}-${index}`}
            className={`cursor-pointer border p-3 transition-all hover:shadow-md ${colorClass}`}
            onClick={() => handleIssueClick(issue)}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{issue.message}</p>
                </div>
                {issue.suggestion && (
                  <p className="text-xs text-muted-foreground">Suggestion: {issue.suggestion}</p>
                )}
                {issue.nodeId && (
                  <p className="text-xs text-muted-foreground">Affected node: {issue.nodeId}</p>
                )}
                {issue.field && (
                  <p className="text-xs text-muted-foreground">Field: {issue.field}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  const renderSecurityInsights = () => {
    const httpNodes = nodes.filter(n => n.type === "httpRequest")
    const hasExternalCalls = httpNodes.length > 0
    const aiNodes = nodes.filter(n => n.type === "textModel" || n.type === "imageGeneration" || n.type === "embeddingModel")
    const hasDataProcessing = nodes.some(n => n.type === "javascript" || n.type === "structuredOutput")

    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Security Posture
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {/* SSRF Protection */}
          <Card className="border-primary/20 bg-primary/5 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="h-3 w-3 text-primary" />
              <p className="text-xs font-semibold">SSRF Protection</p>
            </div>
            <p className="text-xs text-muted-foreground">
              {hasExternalCalls ? "Active" : "N/A"}
            </p>
          </Card>

          {/* Input Validation */}
          <Card className="border-primary/20 bg-primary/5 p-3">
            <div className="flex items-center gap-2 mb-1">
              <FileCheck className="h-3 w-3 text-primary" />
              <p className="text-xs font-semibold">Input Validation</p>
            </div>
            <p className="text-xs text-muted-foreground">
              {allIssues.some(i => i.message.toLowerCase().includes("missing") || i.message.toLowerCase().includes("required")) ? "Issues Found" : "Configured"}
            </p>
          </Card>

          {/* Cycle Detection */}
          <Card className="border-primary/20 bg-primary/5 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-3 w-3 text-primary" />
              <p className="text-xs font-semibold">Cycle Detection</p>
            </div>
            <p className="text-xs text-muted-foreground">
              {allIssues.some(i => i.message.toLowerCase().includes("cycle")) ? "Cycle Found" : "No Cycles"}
            </p>
          </Card>

          {/* Data Processing */}
          <Card className="border-primary/20 bg-primary/5 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-3 w-3 text-primary" />
              <p className="text-xs font-semibold">Data Processing</p>
            </div>
            <p className="text-xs text-muted-foreground">
              {hasDataProcessing ? "Custom Logic" : "AI Only"}
            </p>
          </Card>
        </div>

        {/* Compliance Frameworks */}
        {complianceFrameworks.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold mb-2 text-muted-foreground">Detected Compliance Frameworks</h4>
            <div className="flex flex-wrap gap-2">
              {complianceFrameworks.map(framework => (
                <Badge key={framework} variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  {framework}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Security Best Practices */}
        <Card className="border-blue-200 bg-blue-50 p-3 mt-3">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-600 mb-1">Security Best Practices</p>
              <ul className="text-xs text-blue-600 space-y-1 list-disc list-inside">
                <li>API keys stored client-side (encrypted); sent only to run a workflow</li>
                <li>HTTP requests validated for SSRF</li>
                <li>Workflow execution timeout enforced (30s)</li>
                <li>No server-side data storage</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <aside className="absolute left-0 top-0 z-10 h-full w-full border-r border-border bg-card md:relative md:w-96">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="text-sm font-semibold">Workflow Validation</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="space-y-4 p-4">
          {/* Validation Score */}
          <Card className={`border-2 p-4 ${getGradeColor(grade)}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Validation Score</p>
                <p className="text-2xl font-bold">{score}/100</p>
              </div>
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full border-4 text-2xl font-bold ${getGradeColor(grade)}`}
              >
                {grade}
              </div>
            </div>
            {score === 100 && (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>Workflow is ready to execute!</span>
              </div>
            )}
          </Card>

          {/* Issue Summary */}
          <div className="grid grid-cols-3 gap-2">
            <Card className="border-red-200 bg-red-50 p-3 text-center">
              <p className="text-2xl font-bold text-red-600">{errors.length}</p>
              <p className="text-xs text-red-600">Errors</p>
            </Card>
            <Card className="border-yellow-200 bg-yellow-50 p-3 text-center">
              <p className="text-2xl font-bold text-yellow-600">{warnings.length}</p>
              <p className="text-xs text-yellow-600">Warnings</p>
            </Card>
            <Card className="border-blue-200 bg-blue-50 p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{info.length}</p>
              <p className="text-xs text-blue-600">Info</p>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="text-xs">
                All Issues
                {allIssues.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-[10px] px-1">
                    {allIssues.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="security" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Security
                {securityIssues.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-[10px] px-1">
                    {securityIssues.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="config" className="text-xs">
                Config
                {configIssues.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-[10px] px-1">
                    {configIssues.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* All Issues Tab */}
            <TabsContent value="all" className="mt-4 space-y-4">
              {allIssues.length === 0 ? (
                <Card className="border-green-200 bg-green-50 p-6 text-center">
                  <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-green-600" />
                  <p className="font-semibold text-green-600">All Good!</p>
                  <p className="text-sm text-green-600">No issues detected in your workflow.</p>
                </Card>
              ) : (
                <Accordion type="multiple" defaultValue={errors.length > 0 ? ["errors"] : []}>
                  {errors.length > 0 && (
                    <AccordionItem value="errors">
                      <AccordionTrigger className="text-sm font-semibold text-red-600">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Errors ({errors.length})
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {renderIssueList(
                          errors,
                          <AlertCircle className="h-4 w-4 text-red-600" />,
                          "border-red-200 bg-red-50",
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {warnings.length > 0 && (
                    <AccordionItem value="warnings">
                      <AccordionTrigger className="text-sm font-semibold text-yellow-600">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Warnings ({warnings.length})
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {renderIssueList(
                          warnings,
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />,
                          "border-yellow-200 bg-yellow-50",
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {info.length > 0 && (
                    <AccordionItem value="info">
                      <AccordionTrigger className="text-sm font-semibold text-blue-600">
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          Info ({info.length})
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {renderIssueList(info, <Info className="h-4 w-4 text-blue-600" />, "border-blue-200 bg-blue-50")}
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              )}
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="mt-4 space-y-4">
              {/* Security Score */}
              <Card className={`border-2 p-4 ${getSecurityScoreColor(securityScore)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Security Score
                    </p>
                    <p className="text-2xl font-bold">{securityScore}/100</p>
                  </div>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {securityScore >= 90 ? "Secure" : securityScore >= 70 ? "Fair" : "At Risk"}
                  </Badge>
                </div>
              </Card>

              {/* Security Issues */}
              {securityIssues.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-red-600">Security Issues Found</h3>
                  {renderIssueList(
                    securityIssues,
                    <AlertCircle className="h-4 w-4 text-red-600" />,
                    "border-red-200 bg-red-50",
                  )}
                </div>
              ) : (
                <Card className="border-green-200 bg-green-50 p-6 text-center">
                  <Shield className="mx-auto mb-2 h-8 w-8 text-green-600" />
                  <p className="font-semibold text-green-600">No Security Issues</p>
                  <p className="text-sm text-green-600">Your workflow follows security best practices.</p>
                </Card>
              )}

              {/* Security Insights */}
              {renderSecurityInsights()}
            </TabsContent>

            {/* Configuration Tab */}
            <TabsContent value="config" className="mt-4 space-y-4">
              {configIssues.length === 0 ? (
                <Card className="border-green-200 bg-green-50 p-6 text-center">
                  <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-green-600" />
                  <p className="font-semibold text-green-600">Well Configured!</p>
                  <p className="text-sm text-green-600">All nodes are properly configured.</p>
                </Card>
              ) : (
                <Accordion type="multiple" defaultValue={configIssues.some(i => i.type === "error") ? ["config-issues"] : []}>
                  <AccordionItem value="config-issues">
                    <AccordionTrigger className="text-sm font-semibold">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Configuration Issues ({configIssues.length})
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {renderIssueList(
                        configIssues,
                        <AlertCircle className="h-4 w-4 text-yellow-600" />,
                        "border-yellow-200 bg-yellow-50",
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </aside>
  )
}
