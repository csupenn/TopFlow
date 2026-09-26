import type { Node, Edge } from "@xyflow/react"
import { TopFlowExecutionEngine } from "@/lib/topflow-execution-engine"
import { validateWorkflow, validateApiKeys } from "@charliesu/workflow-core"
import type { ExecutionUpdate } from "@charliesu/workflow-core"
import { shouldUseDemoMode, hasDemoData as hasNewDemoData, resolveScanModes, type ScanMode } from "@/lib/demo-mode"
import { getDemoWorkflowResult, hasDemoData as hasLegacyDemoData } from "@/lib/demo-data"
import { RateLimiter, rateLimitKey } from "@/lib/security/rate-limit"
import { detectWorkflowCycle } from "@/lib/security/workflow-graph"
import { createUpstashStore } from "@/lib/security/upstash-rate-limit-store"

export const maxDuration = 30

// ============================================================================
// Rate Limiting (sliding window; Upstash Redis when env vars present, else in-memory)
// ============================================================================

const limiter = new RateLimiter({
  limit: 10,
  windowMs: 60_000,
  store: createUpstashStore() ?? undefined, // null → MemoryRateLimitStore default
})

// ============================================================================
// Input Sanitization
// ============================================================================

function sanitizeInput(input: any, skipKeys: string[] = []): any {
  if (typeof input === "string") {
    return input.replace(/[<>]/g, "")
  }
  if (Array.isArray(input)) {
    return input.map((item) => sanitizeInput(item, skipKeys))
  }
  if (typeof input === "object" && input !== null) {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(input)) {
      if (skipKeys.includes(key)) {
        sanitized[key] = value
      } else {
        sanitized[key] = sanitizeInput(value, skipKeys)
      }
    }
    return sanitized
  }
  return input
}

// ============================================================================
// Main Route Handler
// ============================================================================

export async function POST(req: Request) {
  // Rate limiting (per client IP)
  const clientIp = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "anonymous"
  const rl = await limiter.check(rateLimitKey(clientIp))
  if (!rl.allowed) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil(rl.resetMs / 1000)),
          "X-RateLimit-Limit": String(rl.limit),
          "X-RateLimit-Remaining": String(rl.remaining),
        },
      }
    )
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const sendUpdate = (update: ExecutionUpdate) => {
        controller.enqueue(encoder.encode(JSON.stringify(update) + "\n"))
      }

      try {
        const {
          nodes,
          edges,
          apiKeys = {},
          workflowId,
          userInputs,
          githubToken,
          scanMode,
        }: {
          nodes: Node[]
          edges: Edge[]
          apiKeys?: Record<string, string>
          workflowId?: string
          userInputs?: Record<string, string>
          githubToken?: string
          scanMode?: ScanMode
        } = await req.json()

        // Privacy: log shape only (counts/flags), never user-supplied content —
        // server logs are retained data. See __tests__/log-privacy.test.ts.
        console.log('[Execute Workflow] Request received:', {
          workflowId,
          nodeCount: nodes.length,
          edgeCount: edges.length,
          hasApiKeys: Object.keys(apiKeys).length > 0,
          userInputCount: userInputs ? Object.keys(userInputs).length : 0,
        })

        // Process start nodes - use userInputs if provided, otherwise use defaultValue
        const processedNodes = nodes.map((node) => {
          if (node.type === "start") {
            // Priority: userInputs > existing output > defaultValue
            const outputValue = (userInputs && userInputs[node.id]) || node.data.output || node.data.defaultValue

            if (outputValue) {
              return {
                ...node,
                data: {
                  ...node.data,
                  output: outputValue,
                },
              }
            }
          }
          return node
        })

        // ============================================================================
        // Demo Mode Handling
        // ============================================================================

        // Two-axis BYOK resolution for the GitHub Scanner (see lib/demo-mode).
        // GitHub token => real scan DATA; AI key => LLM report NARRATIVE.
        // Real-scan per-axis behavior is strictly opt-in: with no token / no
        // explicit scanMode, this collapses to the prior single-boolean demo gate.
        const isScanner = workflowId === "github-security-scanner"
        const scanAxes = isScanner
          ? resolveScanModes({ apiKeys, githubToken, scanMode })
          : null
        const realScan = Boolean(isScanner && scanAxes && scanAxes.dataMode === "real")
        const demoMode = isScanner ? scanAxes!.demoMode : shouldUseDemoMode(apiKeys, workflowId)

        // Check both legacy and new demo mode systems
        const hasLegacyDemo = hasLegacyDemoData(workflowId)
        const hasNewDemo = hasNewDemoData(workflowId)

        console.log('[Execute Workflow] Demo mode check:', {
          workflowId,
          demoMode,
          hasLegacyDemo,
          hasNewDemo
        })

        // For workflows without demo data, check early and show error
        if (demoMode && !hasLegacyDemo && !hasNewDemo) {
          // Demo mode enabled but no demo data available for this workflow
          sendUpdate({
            type: "error",
            error: `Demo mode is active (no API keys configured), but this workflow does not have cached demo data. Please add API keys in Settings or use a template with demo data available.`,
          })
          controller.close()
          return
        }

        // Use legacy demo system for workflows with pre-generated results
        if (demoMode && hasLegacyDemo) {
          const legacyDemoResult = getDemoWorkflowResult(workflowId)

          if (legacyDemoResult) {
            // Use legacy demo system for non-GitHub-Scanner workflows
            for (const [nodeId, nodeResult] of Object.entries(legacyDemoResult.nodeResults)) {
              sendUpdate({
                type: "node_start",
                nodeId,
              })

              // Simulate realistic execution delay (300-800ms per node)
              const duration = 300 + Math.random() * 500
              await new Promise((resolve) => setTimeout(resolve, duration))

              sendUpdate({
                type: "node_complete",
                nodeId,
                output: nodeResult.output,
              })
            }

            sendUpdate({ type: "complete" })
            controller.close()
            return
          }
        }

        // If hasNewDemo is true, execution will continue to use TopFlowExecutionEngine with demo mode

        // ============================================================================
        // Input Sanitization
        // ============================================================================

        const sanitizedNodes = processedNodes.map((node) => ({
          ...node,
          data: sanitizeInput(node.data, ["code", "schema", "output"]),
        }))

        // ============================================================================
        // Validation (Cycles, SSRF)
        // ============================================================================

        // Fail-closed cycle detection before execution (independent of the engine's
        // own validation) — a cyclic graph could otherwise drive an infinite loop.
        const cycleCheck = detectWorkflowCycle(sanitizedNodes, edges)
        if (cycleCheck.hasCycle) {
          sendUpdate({
            type: "error",
            error: `Workflow contains a cycle (${(cycleCheck.cycle || []).join(" → ")}). Remove the circular dependency before running.`,
          })
          controller.close()
          return
        }

        const validationIssues = validateWorkflow(sanitizedNodes, edges)
        const errors = validationIssues.filter((issue) => issue.type === "error")

        if (errors.length > 0) {
          sendUpdate({
            type: "error",
            error: `Validation failed: ${errors[0].message}`,
          })
          controller.close()
          return
        }

        // API key validation - only when an LLM will actually run.
        // (A real scan with a templated, no-LLM report needs no AI key.)
        const needsAiKeyValidation = isScanner
          ? scanAxes!.narrativeMode === "llm"
          : !demoMode
        if (needsAiKeyValidation) {
          const apiKeyIssues = validateApiKeys(apiKeys, sanitizedNodes)
          const apiKeyErrors = apiKeyIssues.filter((issue) => issue.type === "error")

          if (apiKeyErrors.length > 0) {
            sendUpdate({
              type: "error",
              error: apiKeyErrors[0].message,
            })
            controller.close()
            return
          }
        }

        // ============================================================================
        // Execute Workflow using TopFlowExecutionEngine
        // ============================================================================

        // Pass per-axis options only for an opt-in real scan; otherwise keep the
        // exact legacy construction so demo/live behavior is unchanged.
        const engine = new TopFlowExecutionEngine(
          realScan
            ? {
                demoMode,
                workflowId,
                dataMode: scanAxes!.dataMode,
                narrativeMode: scanAxes!.narrativeMode,
                githubToken,
              }
            : { demoMode, workflowId }
        )

        // Extract start node outputs as initial variables
        const initialVariables: Record<string, any> = {}
        sanitizedNodes.forEach((node) => {
          if (node.type === "start" && node.data.output) {
            initialVariables[node.id] = node.data.output
          }
        })

        const result = await engine.executeWorkflow(
          sanitizedNodes,
          edges,
          {
            apiKeys,
            variables: initialVariables,
          },
          sendUpdate
        )

        if (!result.success) {
          sendUpdate({
            type: "error",
            error: result.error || "Workflow execution failed",
          })
        }

        controller.close()
      } catch (error) {
        // Log the error type only: messages can echo user input (URLs, node config).
        // The full message is still streamed back to the requesting client below.
        console.error("Workflow execution error:", error instanceof Error ? error.name : typeof error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"

        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              type: "error",
              error: errorMessage,
            }) + "\n"
          )
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
