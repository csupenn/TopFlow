/**
 * Builder-side (pre-execution) workflow validation shown in the Validation panel.
 *
 * Security checks DELEGATE to the same modules the server enforces at execution
 * time — `ssrf.ts` (checkOutboundUrl) and `workflow-graph.ts` (detectWorkflowCycle) —
 * so the panel can never report "passed" for something the server will block, or
 * vice versa. Do not re-implement those rules here.
 */

import { checkOutboundUrl } from "./ssrf"
import { detectWorkflowCycle } from "./workflow-graph"

export type ValidationSeverity = "error" | "warning" | "info"
export type ValidationCategory = "ssrf" | "pii" | "validation" | "compliance" | "api_key"

export interface ValidationIssue {
  id: string
  severity: ValidationSeverity
  category: ValidationCategory
  title: string
  description: string
  nodeId?: string
  nodeName?: string
  suggestion?: string
}

export interface SecurityCheck {
  id: string
  name: string
  passed: boolean
  description: string
  impact: "high" | "medium" | "low"
}

export interface ValidationResult {
  isValid: boolean
  overallScore: number // 0-100
  errors: ValidationIssue[]
  warnings: ValidationIssue[]
  securityChecks: SecurityCheck[]
}

// PII Detection Patterns
const PII_PATTERNS = {
  email: {
    pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    name: "Email Address",
  },
  ssn: {
    pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
    name: "Social Security Number",
  },
  creditCard: {
    pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
    name: "Credit Card Number",
  },
  phone: {
    pattern: /\b(\+\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g,
    name: "Phone Number",
  },
  ipAddress: {
    pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    name: "IP Address",
  },
}

// Check if URL is a potential SSRF risk (rules: lib/security/ssrf.ts)
function checkSSRF(url: string): ValidationIssue | null {
  let urlObj: URL
  try {
    urlObj = new URL(url)
  } catch {
    return {
      id: `ssrf-${Date.now()}`,
      severity: "warning",
      category: "ssrf",
      title: "Invalid URL Format",
      description: `URL "${url}" is not a valid URL format.`,
      suggestion: "Check the URL syntax.",
    }
  }

  const outbound = checkOutboundUrl(url)
  if (!outbound.safe) {
    return {
      id: `ssrf-${Date.now()}`,
      severity: "error",
      category: "ssrf",
      title: "Blocked Outbound URL",
      description: `URL "${url}" is blocked: ${outbound.reason}.`,
      suggestion: "Use external, publicly accessible http(s) URLs only.",
    }
  }

  // Warn about non-HTTPS URLs
  if (urlObj.protocol !== "https:") {
    return {
      id: `ssrf-${Date.now()}`,
      severity: "warning",
      category: "ssrf",
      title: "Insecure HTTP Connection",
      description: `URL "${url}" uses HTTP instead of HTTPS.`,
      suggestion: "Use HTTPS for secure data transmission.",
    }
  }

  return null
}

// Check content for PII
function checkPII(content: string, context: string): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  for (const [key, { pattern, name }] of Object.entries(PII_PATTERNS)) {
    const matches = content.match(pattern)
    if (matches && matches.length > 0) {
      issues.push({
        id: `pii-${key}-${Date.now()}`,
        severity: "warning",
        category: "pii",
        title: `${name} Detected`,
        description: `Found ${matches.length} potential ${name.toLowerCase()}(s) in ${context}.`,
        suggestion: `Consider removing or masking ${name.toLowerCase()} data. Use placeholder variables instead of real data.`,
      })
    }
  }

  return issues
}

// Validate workflow structure
export function validateWorkflow(nodes: any[], edges: any[]): ValidationResult {
  const errors: ValidationIssue[] = []
  const warnings: ValidationIssue[] = []
  const securityChecks: SecurityCheck[] = []

  // Check for start node
  const startNodes = nodes.filter((node) => node.type === "start")
  if (startNodes.length === 0) {
    errors.push({
      id: "validation-no-start",
      severity: "error",
      category: "validation",
      title: "Missing Start Node",
      description: "Workflow must have at least one Start node.",
      suggestion: "Add a Start node to define the workflow entry point.",
    })
  } else if (startNodes.length > 1) {
    warnings.push({
      id: "validation-multiple-start",
      severity: "warning",
      category: "validation",
      title: "Multiple Start Nodes",
      description: `Found ${startNodes.length} Start nodes. Only the first will be used.`,
      suggestion: "Remove extra Start nodes for clarity.",
    })
  }

  // Check for end node
  const endNodes = nodes.filter((node) => node.type === "end")
  if (endNodes.length === 0) {
    warnings.push({
      id: "validation-no-end",
      severity: "warning",
      category: "validation",
      title: "Missing End Node",
      description: "Workflow should have at least one End node.",
      suggestion: "Add an End node to clearly mark workflow completion.",
    })
  }

  // Check for disconnected nodes
  const connectedNodeIds = new Set<string>()
  edges.forEach((edge) => {
    connectedNodeIds.add(edge.source)
    connectedNodeIds.add(edge.target)
  })

  nodes.forEach((node) => {
    if (!connectedNodeIds.has(node.id) && nodes.length > 1) {
      warnings.push({
        id: `validation-disconnected-${node.id}`,
        severity: "warning",
        category: "validation",
        title: "Disconnected Node",
        description: `Node "${node.data?.label || node.type || "Unnamed"}" is not connected to the workflow.`,
        nodeId: node.id,
        nodeName: node.data?.label || node.type,
        suggestion: "Connect this node or remove it if unused.",
      })
    }
  })

  // Check for cycles
  const hasCycle = detectWorkflowCycle(nodes, edges).hasCycle
  if (hasCycle) {
    errors.push({
      id: "validation-cycle",
      severity: "error",
      category: "validation",
      title: "Circular Dependency Detected",
      description: "Workflow contains a cycle which could cause infinite loops.",
      suggestion: "Remove circular connections between nodes.",
    })
  }

  // Security checks for HTTP Request nodes
  let ssrfCheckPassed = true
  let piiCheckPassed = true

  nodes.forEach((node) => {
    if (node.type === "httpRequest") {
      const url = node.data?.url || ""
      const ssrfIssue = checkSSRF(url)
      if (ssrfIssue) {
        ssrfIssue.nodeId = node.id
        ssrfIssue.nodeName = "HTTP Request"
        if (ssrfIssue.severity === "error") {
          errors.push(ssrfIssue)
          ssrfCheckPassed = false
        } else {
          warnings.push(ssrfIssue)
        }
      }
    }

    // Check for PII in prompt nodes
    if (node.type === "prompt" || node.type === "textModel") {
      const content = node.data?.content || node.data?.systemPrompt || ""
      const piiIssues = checkPII(content, `${node.type} node`)
      if (piiIssues.length > 0) {
        piiIssues.forEach((issue) => {
          issue.nodeId = node.id
          issue.nodeName = node.type
          warnings.push(issue)
        })
        piiCheckPassed = false
      }
    }

    // Check conditional nodes for valid expressions
    if (node.type === "conditional") {
      const condition = node.data?.condition || ""
      if (!condition.trim()) {
        errors.push({
          id: `validation-empty-condition-${node.id}`,
          severity: "error",
          category: "validation",
          title: "Empty Condition",
          description: "Conditional node has no condition defined.",
          nodeId: node.id,
          nodeName: "Conditional",
          suggestion: "Add a valid JavaScript condition.",
        })
      }
    }
  })

  // Define security checks
  securityChecks.push({
    id: "ssrf-prevention",
    name: "SSRF Prevention",
    passed: ssrfCheckPassed,
    description: "Checks for Server-Side Request Forgery vulnerabilities",
    impact: "high",
  })

  securityChecks.push({
    id: "pii-detection",
    name: "PII Detection",
    passed: piiCheckPassed,
    description: "Scans for personally identifiable information in prompts",
    impact: "high",
  })

  securityChecks.push({
    id: "cycle-detection",
    name: "Cycle Prevention",
    passed: !hasCycle,
    description: "Prevents infinite loops in workflow execution",
    impact: "medium",
  })

  securityChecks.push({
    id: "structure-validation",
    name: "Workflow Structure",
    passed: errors.filter((e) => e.category === "validation").length === 0,
    description: "Validates workflow has proper start/end nodes and connections",
    impact: "medium",
  })

  // Calculate overall security score (0-100)
  const passedChecks = securityChecks.filter((check) => check.passed).length
  const totalChecks = securityChecks.length
  const structureScore = (passedChecks / totalChecks) * 50 // 50% weight
  const issueScore = Math.max(0, 50 - errors.length * 10 - warnings.length * 2) // 50% weight
  const overallScore = Math.round(structureScore + issueScore)

  return {
    isValid: errors.length === 0,
    overallScore: Math.max(0, Math.min(100, overallScore)),
    errors,
    warnings,
    securityChecks,
  }
}

// Validate API keys for required nodes
export function validateApiKeys(apiKeys: Record<string, string>, nodes: any[]): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  const requiresOpenAI = nodes.some(
    (node) =>
      (node.type === "textModel" && node.data?.model?.includes("openai")) ||
      (node.type === "imageGeneration" && node.data?.model?.includes("openai")) ||
      (node.type === "audio" && node.data?.model?.includes("openai")),
  )

  const requiresAnthropic = nodes.some((node) => node.type === "textModel" && node.data?.model?.includes("anthropic"))

  const requiresGoogle = nodes.some(
    (node) =>
      (node.type === "textModel" && node.data?.model?.includes("gemini")) ||
      (node.type === "imageGeneration" && node.data?.model?.includes("gemini")),
  )

  if (requiresOpenAI && !apiKeys.openai) {
    issues.push({
      id: "api-key-openai",
      severity: "error",
      category: "api_key",
      title: "OpenAI API Key Missing",
      description: "Your workflow uses OpenAI models but no API key is configured.",
      suggestion: "Add your OpenAI API key in Settings.",
    })
  }

  if (requiresAnthropic && !apiKeys.anthropic) {
    issues.push({
      id: "api-key-anthropic",
      severity: "error",
      category: "api_key",
      title: "Anthropic API Key Missing",
      description: "Your workflow uses Anthropic models but no API key is configured.",
      suggestion: "Add your Anthropic API key in Settings.",
    })
  }

  if (requiresGoogle && !apiKeys.google) {
    issues.push({
      id: "api-key-google",
      severity: "error",
      category: "api_key",
      title: "Google API Key Missing",
      description: "Your workflow uses Google models but no API key is configured.",
      suggestion: "Add your Google API key in Settings.",
    })
  }

  return issues
}
