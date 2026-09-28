/**
 * Demo Mode Detection and Configuration
 *
 * Determines when to use cached demo data vs live API calls
 * Supports automatic detection, manual override, and smart fallbacks
 */

import { type Node } from "@xyflow/react"
import { getRepoAnalysis, type RepoAnalysis } from "@/lib/demo-data/github-repos"

export type DemoModePreference = "auto" | "live" | "demo"

export interface ApiKeys {
  openai?: string
  anthropic?: string
  google?: string
  groq?: string
}

export interface DemoModeConfig {
  enabled: boolean
  reason:
    | "no-api-keys"
    | "user-preference"
    | "demo-available"
    | "forced-live"
    | "auto-disabled"
  workflowHasDemoData: boolean
}

/**
 * Determine if demo mode should be used
 *
 * Decision logic:
 * 1. If user explicitly chose "demo" → always use demo
 * 2. If user explicitly chose "live" → never use demo (even without keys, will error)
 * 3. If "auto" (default):
 *    - No API keys + demo data available → use demo
 *    - No API keys + no demo data → error (can't execute)
 *    - Has API keys → use live
 */
export function shouldUseDemoMode(
  apiKeys: ApiKeys,
  workflowId?: string,
  userPreference: DemoModePreference = "auto"
): boolean {
  // Back-compat wrapper. "Demo mode" == BOTH axes non-live (mock scan data AND a
  // templated, no-LLM report). See resolveScanModes for the two-axis model.
  return resolveScanModes({ apiKeys, userPreference }).demoMode
}

// ============================================================================
// Two-axis BYOK model (see docs/architecture/osv-real-scan-design.md §6)
// ----------------------------------------------------------------------------
// "Bring your own key" is TWO independent keys gating TWO independent axes:
//   - scan-DATA axis      -> GitHub token (real vs mock vulnerabilities)
//   - report-NARRATIVE ax -> AI provider key (LLM-written vs templated report)
// Each axis degrades gracefully; neither implies the other.
// ============================================================================

/** Explicit per-scan override for the data axis. */
export type ScanMode = "auto" | "demo" | "real"

export interface ScanAxes {
  /** "real" => fetch live data (GitHub + OSV); "demo" => curated mock data. */
  dataMode: "real" | "demo"
  /** "llm" => a provider LLM writes the report; "templated" => deterministic render. */
  narrativeMode: "llm" | "templated"
  /** Back-compat: true only when BOTH axes are non-live (pure zero-setup demo). */
  demoMode: boolean
}

/**
 * Resolve the two scan axes from the available keys + explicit preferences.
 *
 * - narrative: explicit demo/live preference wins. When `aiReport` is given (the GitHub Scanner always
 *              passes it), the LLM runs only if the user switched the AI report on for this run AND an
 *              AI key exists: saved keys never trigger spending on their own (design §15). Without
 *              `aiReport` (other workflows via shouldUseDemoMode): LLM iff an AI key exists.
 * - data:      explicit scanMode wins; a "demo" preference forces mock data; otherwise
 *              real iff a GitHub token is present. (Public repos can scan tokenless at
 *              the lower rate limit, but we only flip to "real" on an explicit signal so
 *              the zero-setup demo stays the default.)
 */
export function resolveScanModes(opts: {
  apiKeys?: ApiKeys
  githubToken?: string
  scanMode?: ScanMode
  userPreference?: DemoModePreference
  /** Scanner only: the per-run "Write the report with my AI key" switch. */
  aiReport?: boolean
}): ScanAxes {
  const apiKeys = opts.apiKeys || {}
  const hasAiKey = Boolean(
    apiKeys.openai || apiKeys.anthropic || apiKeys.google || apiKeys.groq
  )
  const hasGithubToken = Boolean(opts.githubToken)
  const scanMode: ScanMode = opts.scanMode || "auto"
  const pref: DemoModePreference = opts.userPreference || "auto"

  let narrativeMode: "llm" | "templated"
  if (pref === "demo") narrativeMode = "templated"
  else if (pref === "live") narrativeMode = "llm"
  else if (opts.aiReport !== undefined) narrativeMode = opts.aiReport && hasAiKey ? "llm" : "templated"
  else narrativeMode = hasAiKey ? "llm" : "templated"

  let dataMode: "real" | "demo"
  if (scanMode === "real") dataMode = "real"
  else if (scanMode === "demo") dataMode = "demo"
  else if (pref === "demo") dataMode = "demo"
  else dataMode = hasGithubToken ? "real" : "demo"

  return {
    dataMode,
    narrativeMode,
    demoMode: dataMode === "demo" && narrativeMode === "templated",
  }
}

/**
 * Provider-agnostic report model: pick a sensible model id from whichever AI
 * provider key the user actually has. Returns null when no AI key is present.
 */
export function resolveReportModel(apiKeys: ApiKeys): string | null {
  const order: Array<[keyof ApiKeys, string]> = [
    ["anthropic", "anthropic/claude-3-5-sonnet-20241022"],
    ["openai", "openai/gpt-4o-mini"],
    ["google", "google/gemini-1.5-flash"],
    ["groq", "groq/llama-3.3-70b-versatile"],
  ]
  for (const [key, model] of order) if (apiKeys[key]) return model
  return null
}

/**
 * Get detailed demo mode configuration with reasoning
 */
export function getDemoModeConfig(
  apiKeys: ApiKeys,
  workflowId?: string,
  userPreference: DemoModePreference = "auto",
  demoDataAvailable: boolean = false
): DemoModeConfig {
  const hasAnyKey = Boolean(
    apiKeys.openai || apiKeys.anthropic || apiKeys.google || apiKeys.groq
  )

  // User forced demo mode
  if (userPreference === "demo") {
    return {
      enabled: true,
      reason: "user-preference",
      workflowHasDemoData: demoDataAvailable,
    }
  }

  // User forced live mode
  if (userPreference === "live") {
    return {
      enabled: false,
      reason: "forced-live",
      workflowHasDemoData: demoDataAvailable,
    }
  }

  // Auto mode logic
  if (!hasAnyKey) {
    if (demoDataAvailable) {
      return {
        enabled: true,
        reason: "no-api-keys",
        workflowHasDemoData: true,
      }
    }
    // No keys and no demo data - will error on execution
    return {
      enabled: false,
      reason: "auto-disabled",
      workflowHasDemoData: false,
    }
  }

  // Has API keys - use live mode
  return {
    enabled: false,
    reason: "forced-live",
    workflowHasDemoData: demoDataAvailable,
  }
}

/**
 * Get required API keys for a workflow based on node configurations
 */
export function getRequiredApiKeys(
  nodes: any[]
): (keyof ApiKeys)[] {
  const required = new Set<keyof ApiKeys>()

  for (const node of nodes) {
    const { type, data } = node

    // Text model nodes
    if (type === "textModel") {
      const model = data.model || ""
      if (model.includes("gpt") || model.includes("openai")) {
        required.add("openai")
      } else if (model.includes("claude")) {
        required.add("anthropic")
      } else if (model.includes("gemini") || model.includes("palm")) {
        required.add("google")
      } else if (model.includes("groq")) {
        required.add("groq")
      }
    }

    // Image generation nodes
    if (type === "imageGeneration") {
      const model = data.model || ""
      if (model.includes("dall-e")) {
        required.add("openai")
      } else if (model.includes("gemini") || model.includes("imagen")) {
        required.add("google")
      }
    }

    // Embedding nodes
    if (type === "embeddingModel") {
      const model = data.model || ""
      if (model.includes("openai") || model.includes("ada")) {
        required.add("openai")
      } else if (model.includes("voyage")) {
        required.add("openai") // Assuming Voyage uses OpenAI SDK
      }
    }

    // Audio nodes
    if (type === "audio") {
      required.add("openai") // TTS typically uses OpenAI
    }
  }

  return Array.from(required)
}

/**
 * Check if user has all required API keys for a workflow
 */
export function hasRequiredApiKeys(
  apiKeys: ApiKeys,
  nodes: any[]
): { hasAll: boolean; missing: string[] } {
  const required = getRequiredApiKeys(nodes)
  const missing = required.filter((key) => !apiKeys[key])

  return {
    hasAll: missing.length === 0,
    missing,
  }
}

/**
 * Get user-friendly message about demo mode status
 */
export function getDemoModeMessage(config: DemoModeConfig): string {
  if (config.enabled) {
    switch (config.reason) {
      case "no-api-keys":
        return "Running in Demo Mode - Add API keys in Settings to use live AI models"
      case "user-preference":
        return "Running in Demo Mode - Using cached demo data"
      case "demo-available":
        return "Demo Mode Available - Click 'Run Demo' to test without API keys"
      default:
        return "Running in Demo Mode"
    }
  } else {
    switch (config.reason) {
      case "forced-live":
        return "Running with Live AI Models"
      case "auto-disabled":
        return "No API keys configured and no demo data available"
      default:
        return "Live Mode"
    }
  }
}

/**
 * Get call-to-action for demo mode banner
 */
export function getDemoModeCTA(config: DemoModeConfig): {
  text: string
  action: "add-keys" | "try-demo" | "none"
} {
  if (config.enabled && config.reason === "no-api-keys") {
    return {
      text: "Add API Keys",
      action: "add-keys",
    }
  }

  if (!config.enabled && config.workflowHasDemoData) {
    return {
      text: "Try Demo Instead",
      action: "try-demo",
    }
  }

  return {
    text: "",
    action: "none",
  }
}

// ============================================================================
// GitHub Scanner Demo Mode - Extended Functionality
// ============================================================================

/**
 * Node execution delays for realistic demo experience (milliseconds)
 */
export const DEMO_NODE_DELAYS: Record<string, number> = {
  start: 0,
  javascript: 300,
  httpRequest: 800,
  textModel: 2500,
  imageGeneration: 3000,
  structuredOutput: 1500,
  conditional: 200,
  prompt: 200,
  end: 100,
  embeddingModel: 1500,
  audio: 2000,
  tool: 500
}

/**
 * Check if a workflow has demo data available
 */
export function hasDemoData(workflowId: string | undefined): boolean {
  console.log('[Demo Mode] Checking if workflow has demo data:', { workflowId, hasDemoData: workflowId === "github-security-scanner" })
  if (!workflowId) return false
  return workflowId === "github-security-scanner"
}

/**
 * Get realistic delay for a node type
 */
export function getNodeDelay(nodeType: string): number {
  return DEMO_NODE_DELAYS[nodeType] || 500
}

/**
 * Simulate network delay
 */
export async function simulateDelay(delayMs: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, delayMs))
}

/**
 * Render a human-readable Markdown security report from a RepoAnalysis-shaped
 * object. Shared by demo mode AND the real-scan "templated" (no-LLM) fallback,
 * so a real scan can produce a real report even without an AI provider key.
 *
 * Defensive about fields the real scan does not populate (codeQuality,
 * recommendations) so it works for both curated mock data and live scan output.
 */
export function renderReport(
  analysis: any,
  opts?: {
    repo?:            string
    score?:           number
    // URW Phase 1: validated, deterministic assembly inputs.
    // When provided, findings are ordered by LLM-prioritized + validated IDs
    // and per-finding effort/impact come from the constrained schema output.
    order?:           string[]
    recommendations?: Array<{ findingId: string; effort: string; impact: string }>
    summaryLabel?:    string
    commentary?:      string   // stripped, non-authoritative, max 280 chars
  }
): string {
  const repo = opts?.repo || analysis?.repository || "the repository"
  const score = opts?.score ?? analysis?.securityScore ?? 0
  const grade = analysis?.grade || "N/A"
  const vulns = analysis?.vulnerabilities || { critical: 0, high: 0, medium: 0, low: 0 }
  let details: any[] = Array.isArray(vulns.details) ? vulns.details : []

  // URW deterministic assembly: re-order details by validated LLM priority.
  // Fall back to the original order if the selected set is empty.
  if (opts?.order && opts.order.length > 0) {
    const rankMap = new Map(opts.order.map((id, i) => [id, i]))
    const sorted = [...details].sort((a, b) => {
      const ra = rankMap.get(a.id) ?? rankMap.get(a.osvId) ?? Infinity
      const rb = rankMap.get(b.id) ?? rankMap.get(b.osvId) ?? Infinity
      return ra - rb
    })
    // Only include validated findings; append any not in the ranked set at the end.
    const inRanked = new Set(opts.order)
    const tail = details.filter(d => !inRanked.has(d.id) && !inRanked.has(d.osvId))
    details = [...sorted.filter(d => inRanked.has(d.id) || inRanked.has(d.osvId)), ...tail]
  }

  const vulnSummary = `${vulns.critical || 0} critical, ${vulns.high || 0} high, ${vulns.medium || 0} medium, ${vulns.low || 0} low`
  const language = analysis?.language || "the project"

  // Only assert practices explicitly true/false; a real scan leaves some null/unknown.
  const practices = analysis?.securityPractices || {}
  const practiceLabels: Array<[string, string]> = [
    ["has_security_policy", "Security policy documented"],
    ["code_scanning", "Code scanning enabled"],
    ["branch_protection", "Branch protection rules"],
    ["dependabot_enabled", "Dependabot monitoring"],
    ["secret_scanning", "Secret scanning active"],
  ]
  const enabledPractices = practiceLabels.filter(([k]) => practices[k] === true).map(([, l]) => l)

  const cq = analysis?.codeQuality
  const recs: any[] = Array.isArray(analysis?.recommendations) ? analysis.recommendations : []

  const codeQualityBullets = cq ? `\n- Test coverage: ${cq.coverage}%\n- ${language} best practices followed` : ""
  const codeQualitySection = cq
    ? `\n\n## Code Quality Metrics\n\n- **Test Coverage**: ${cq.coverage}%\n- **Code Complexity**: ${cq.complexity}\n- **Documentation**: ${cq.documentation}%\n- **Lines of Code**: ${(cq.linesOfCode ?? 0).toLocaleString()}`
    : ""

  const strengthsBlock = enabledPractices.length
    ? enabledPractices.map((p) => `- ${p}`).join("\n")
    : "- No automated security controls detected yet"

  // URW: use per-finding effort/impact from validated recommendations when available.
  const urwRecMap = new Map(
    (opts?.recommendations ?? []).map(r => [r.findingId, r])
  )
  const findingsBlock = details.slice(0, 5).map((v) => {
    const urwRec = urwRecMap.get(v.id) || urwRecMap.get(v.osvId)
    const effort = urwRec?.effort ?? v.effort
    return `### ${v.severity}: ${v.id}\n**Component:** ${v.component}\n**Issue:** ${v.description}\n**Fix:** ${v.fix}\n**Effort:** ${effort}`
  }).join("\n\n")

  // Prefer curated recommendations (mock data); when URW provides validated
  // per-finding metadata, use that; otherwise derive from actual findings.
  const recommendationsBlock = recs.length
    ? recs.slice(0, 5).map((r, i) => `${i + 1}. **${r.title}** (${r.effort}): ${r.description}`).join("\n\n")
    : (opts?.recommendations?.length
      ? opts.recommendations.slice(0, 5).map((r, i) => {
          const finding = details.find(d => d.id === r.findingId || d.osvId === r.findingId)
          if (!finding) return null
          return `${i + 1}. **Upgrade ${finding.component}** (Effort: ${r.effort}, Impact: ${r.impact}): ${finding.fix} — resolves ${finding.id} (${finding.severity}).`
        }).filter(Boolean).join("\n\n")
      : details.slice(0, 5).map((v, i) => `${i + 1}. **Upgrade ${v.component}** (${v.effort}): ${v.fix} — resolves ${v.id} (${v.severity}).`).join("\n\n"))
      || "No dependency vulnerabilities detected. Maintain current practices."

  // URW: non-authoritative AI commentary (stripped, labeled, not on the factual path).
  const commentarySection = opts?.commentary
    ? `\n\n---\n*AI Commentary (non-authoritative — informational only):* ${opts.commentary}`
    : ""

  if (score >= 90) {
    return `# 🎉 Security Excellence Report

**Repository:** ${repo}
**Security Score:** ${score}/100
**Overall Grade:** ${grade}

## Top Security Strengths

${(enabledPractices.length ? enabledPractices : ["Clean dependency tree", "Maintained codebase"]).map((p, i) => `${i + 1}. **${p}**: ${repo} maintains strong security practices`).join("\n\n")}${codeQualitySection}

## Vulnerability Status

Found ${vulnSummary} vulnerabilities across all categories.

## Why This Matters

This repository demonstrates security excellence by maintaining comprehensive security controls and proactive vulnerability management.

## Minor Enhancements

${recommendationsBlock}

Maintaining these practices keeps the security score high.${commentarySection}`
  } else if (score >= 80) {
    return `# Strong Security Report

**Repository:** ${repo}
**Security Score:** ${score}/100
**Overall Grade:** ${grade}

## Security Strengths

${strengthsBlock}${codeQualityBullets}

## Areas for Improvement

Found ${vulnSummary} vulnerabilities that should be addressed.

${findingsBlock}

## Recommended Actions

${recommendationsBlock}

Implementing these improvements would elevate the security score further.${commentarySection}`
  } else {
    return `# Security Improvement Report

**Repository:** ${repo}
**Security Score:** ${score}/100
**Overall Grade:** ${grade}

## Current Strengths

${strengthsBlock}${codeQualityBullets}

## Vulnerability Summary

Found ${vulnSummary} vulnerabilities that need attention.

${findingsBlock}

## Priority Recommendations

${recommendationsBlock}

## Expected Impact

Implementing the priority recommendations above would meaningfully increase your security score.${commentarySection}`
  }
}

/**
 * Generate mock response for GitHub Scanner workflow nodes
 */
export function getGitHubScannerMockResponse(
  node: Node,
  inputs: any[],
  executionResults?: Map<string, any>
): any {
  const nodeType = node.type
  const nodeId = node.id


  switch (nodeId) {
    case "start":
      // Pass through user input (from dialog or URL param)
      // User input is stored in node.data.output by the execution route
      const startOutput = node.data.output || inputs[0] || node.data.defaultValue || "https://github.com/facebook/react"
      return startOutput

    case "extract-repo": {
      // Parse repository from URL
      const url = inputs[0] || "https://github.com/facebook/react"
      const patterns = [
        /github\.com\/([^/]+)\/([^/]+)/,
        /^([^/]+)\/([^/]+)$/
      ]

      for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) {
          const owner = match[1]
          const repo = match[2].replace(/\.git$/, '')
          const result = {
            owner,
            repo,
            fullName: `${owner}/${repo}`
          }
          return result
        }
      }

      // Fallback
      console.log('[Demo Mode] extract-repo node - using fallback')
      return {
        owner: "facebook",
        repo: "react",
        fullName: "facebook/react"
      }
    }

    case "fetch-metadata": {
      // Mock GitHub API metadata - use actual repo data
      const repoData = inputs[0] || { fullName: "facebook/react" }
      const repoPath = repoData.fullName || "facebook/react"

      // Get the full analysis to extract metadata
      const analysis: RepoAnalysis = getRepoAnalysis(repoPath)


      return {
        name: repoData.repo || analysis.repository.split('/')[1],
        owner: { login: repoData.owner || analysis.repository.split('/')[0] },
        stargazers_count: analysis.stars,
        forks_count: analysis.forks,
        open_issues_count: 0,
        updated_at: analysis.lastAnalyzed,
        default_branch: "main",
        language: analysis.language,
        description: `${analysis.repository} - ${analysis.language} framework`,
        full_name: analysis.repository
      }
    }

    case "fetch-security": {
      // Get mock security analysis
      const repoData = inputs[0] || { fullName: "facebook/react" }
      const requestedRepo = repoData.fullName

      const analysis: RepoAnalysis = getRepoAnalysis(requestedRepo)

      // Add metadata to indicate if we're using fallback
      const isUsingDefault = analysis.repository !== requestedRepo

      return {
        ...analysis,
        _demoMode: true,
        _requestedRepo: requestedRepo,
        _isUsingDefault: isUsingDefault
      }
    }

    case "calculate-score": {
      // Pre-calculated score from security data
      const security = inputs[1] || inputs[0]

      if (security && typeof security === 'object' && 'securityScore' in security) {
        // Use gentler scoring formula that matches overall score better
        const vulns = security.vulnerabilities || { critical: 0, high: 0, medium: 0, low: 0 }
        const totalVulns = vulns.critical + vulns.high + vulns.medium + vulns.low

        // Start from overall score and adjust components proportionally
        const baseScore = security.securityScore || 85

        // Vulnerability score: Deduct based on severity
        const vulnDeduction = (vulns.critical * 8) + (vulns.high * 4) + (vulns.medium * 2) + (vulns.low * 0.5)
        const vulnerabilityScore = Math.max(40, Math.min(100, baseScore - vulnDeduction + 5))

        // Dependency score: Based on vulnerable packages
        const depAudit = security.dependencyAudit || { vulnerable: 0, outdated: 0 }
        const depScore = Math.max(60, 100 - (depAudit.vulnerable * 10) - (depAudit.outdated * 0.1))

        // Practices: Percentage of enabled practices
        const practices = security.securityPractices || {}
        const practiceCount = Object.values(practices).filter(v => v === true).length
        const practiceTotal = Object.keys(practices).length || 1
        const practicesScore = Math.round((practiceCount / practiceTotal) * 100)

        // OWASP: Percentage of passing checks
        const owasp = security.owaspCompliance || {}
        const owaspPass = Object.values(owasp).filter(v => v === "PASS").length
        const owaspTotal = Object.keys(owasp).length || 1
        const owaspScore = Math.round((owaspPass / owaspTotal) * 100)

        console.log('[Demo Mode] calculate-score - calculated components:', {
          vulnerability: Math.round(vulnerabilityScore),
          dependency: Math.round(depScore),
          practices: practicesScore,
          owasp: owaspScore,
          totalVulns,
          baseScore
        })

        return {
          score: security.securityScore,
          grade: security.grade,
          components: {
            vulnerability: Math.round(vulnerabilityScore),
            dependency: Math.round(depScore),
            practices: practicesScore,
            owasp: owaspScore
          },
          breakdown: {
            vulnerabilities: vulns,
            dependencies: { vulnerable: depAudit.vulnerable, outdated: depAudit.outdated }
          }
        }
      }

      // Fallback
      return {
        score: 85,
        grade: "B+",
        components: {
          vulnerability: 85,
          dependency: 75,
          practices: 85,
          owasp: 80
        }
      }
    }

    case "grade-check": {
      // Conditional evaluation
      const scoreData = inputs[0]
      const score = scoreData?.score || 85
      return score >= 80
    }

    case "prompt-excellent": {
      // After conditional branch, inputs only contains [true]
      // Need to get upstream data from executionResults or reconstruct
      let repoData, scoreData, metadata

      if (executionResults) {
        repoData = executionResults.get("extract-repo") || { fullName: "facebook/react" }
        scoreData = executionResults.get("calculate-score") || { score: 85, grade: "B+" }
        metadata = executionResults.get("fetch-metadata") || { stars: 0, forks: 0, language: "Unknown" }
        const securityData = executionResults.get("fetch-security") || {}

        // If using default fallback, use the actual repo from analysis (not requested repo)
        if (securityData._isUsingDefault && metadata.full_name) {
          repoData = { fullName: metadata.full_name }
        }
      } else {
        // Fallback: try inputs array
        repoData = inputs[0] || { fullName: "facebook/react" }
        scoreData = inputs[1] || { score: 85, grade: "B+" }
        metadata = inputs[2] || { stars: 0, forks: 0, language: "Unknown" }
      }


      return `🎉 SECURITY EXCELLENCE REPORT

Repository: ${repoData.fullName}
Security Score: ${scoreData.score}/100 (Grade: ${scoreData.grade})
Stars: ${metadata.stars || metadata.stargazers_count || 0} | Forks: ${metadata.forks || metadata.forks_count || 0} | Language: ${metadata.language || "Unknown"}

Generate a congratulatory security analysis report highlighting:

1. **Top Security Strengths**: Identify 3 exceptional security practices
2. **Why This Matters**: Explain why this repository sets a security standard
3. **Minor Enhancements**: 2-3 low-effort improvements that could boost the score
4. **Security Badges**: Recommend which security badges to display in README

Tone: Professional but celebratory. Focus on positive reinforcement.`
    }

    case "prompt-improve": {
      // After conditional branch, inputs only contains [false]
      // Need to get upstream data from executionResults or reconstruct
      let repoData, scoreData, metadata

      if (executionResults) {
        repoData = executionResults.get("extract-repo") || { fullName: "facebook/react" }
        scoreData = executionResults.get("calculate-score") || { score: 85, grade: "B+", breakdown: { vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 } } }
        metadata = executionResults.get("fetch-metadata") || { stars: 0, forks: 0, language: "Unknown" }
        const securityData = executionResults.get("fetch-security") || {}

        // If using default fallback, use the actual repo from analysis (not requested repo)
        if (securityData._isUsingDefault && metadata.full_name) {
          repoData = { fullName: metadata.full_name }
        }
      } else {
        // Fallback: try inputs array
        repoData = inputs[0] || { fullName: "facebook/react" }
        scoreData = inputs[1] || { score: 85, grade: "B+", breakdown: { vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 } } }
        metadata = inputs[2] || { stars: 0, forks: 0, language: "Unknown" }
      }

      const vulns = scoreData.breakdown?.vulnerabilities || { critical: 0, high: 0, medium: 0, low: 0 }


      return `📊 SECURITY IMPROVEMENT REPORT

Repository: ${repoData.fullName}
Security Score: ${scoreData.score}/100 (Grade: ${scoreData.grade})
Stars: ${metadata.stars || metadata.stargazers_count || 0} | Forks: ${metadata.forks || metadata.forks_count || 0} | Language: ${metadata.language || "Unknown"}

Vulnerability Summary:
- Critical: ${vulns.critical}
- High: ${vulns.high}
- Medium: ${vulns.medium}
- Low: ${vulns.low}

Generate a constructive security improvement report with:

1. **Current Strengths**: What security practices are already in place
2. **Priority Fixes**: Top 5 security improvements ranked by impact
3. **Step-by-Step Guide**: Detailed instructions for each fix
4. **Effort Estimates**: Time required for each improvement
5. **Expected Impact**: How much each fix will improve the security score

Tone: Supportive and actionable. Make improvements feel achievable.`
    }

    case "ai-analysis": {
      // The ai-analysis node receives the prompt text (not structured data)
      // Parse the repository name and score from the prompt
      const promptText = inputs[0] || ""


      // Extract repository name from prompt (e.g., "Repository: django/django")
      const repoMatch = promptText.match(/Repository:\s*([^\s\n]+\/[^\s\n]+)/)
      const repo = repoMatch ? repoMatch[1] : "facebook/react"

      // Extract score from prompt (e.g., "Security Score: 85/100")
      const scoreMatch = promptText.match(/Security Score:\s*(\d+)\/100/)
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 85


      // Get the full RepoAnalysis object
      const analysis: RepoAnalysis = getRepoAnalysis(repo)


      // Render the report from the analysis via the shared renderer (also used
      // by the real-scan templated/no-LLM fallback in the execution engine).
      return renderReport(analysis, { repo, score })
    }

    case "extract-actions": {
      const repoInfo = inputs[0] || { fullName: "facebook/react" }
      const repo = repoInfo.fullName || "facebook/react"

      // Get the full RepoAnalysis object
      const analysis: RepoAnalysis = getRepoAnalysis(repo)

      // Build strengths from enabled practices
      const strengths = []
      if (analysis.securityPractices.has_security_policy) strengths.push("Active security policy documentation")
      if (analysis.securityPractices.code_scanning) strengths.push("Code scanning enabled")
      if (analysis.securityPractices.branch_protection) strengths.push("Strong code review requirements")
      if (analysis.securityPractices.dependabot_enabled) strengths.push("Automated dependency scanning enabled")
      if (analysis.securityPractices.secret_scanning) strengths.push("Secret scanning protection")

      // Get critical findings from actual vulnerabilities
      const criticalFindings = analysis.vulnerabilities.details
        .filter(v => v.severity === "CRITICAL" || v.severity === "HIGH")
        .map(v => `${v.severity}: ${v.description}`)

      return {
        summary: "Security analysis complete with actionable recommendations",
        score: analysis.securityScore,
        grade: analysis.grade,
        strengths,
        criticalFindings,
        recommendations: analysis.recommendations.map(rec => ({
          priority: rec.priority,
          action: rec.title,
          effort: rec.effort,
          impact: rec.impact,
          timeline: rec.effort
        })),
        badges: {
          security: analysis.grade,
          coverage: analysis.codeQuality.coverage,
          maintained: true
        },
        nextSteps: [
          `Review and implement ${analysis.recommendations.filter(r => r.priority === 'HIGH').length} high-priority recommendations`,
          "Set up automated security monitoring",
          "Establish regular security audit schedule"
        ]
      }
    }

    case "generate-visual":
      // No image without a real image-generation run. (This used to return a stock illustration of
      // checks the scanner doesn't perform, shown as if it were the user's dashboard.)
      return {
        skipped: true,
        reason: "No dashboard image: image generation needs an LLM narrative and a Google API key."
      }

    case "end":
      // End node collects all outputs
      return {
        completed: true,
        finalOutputs: inputs,
        executionTime: new Date().toISOString()
      }

    default:
      // Default response
      return `Mock output from node ${nodeId}`
  }
}
