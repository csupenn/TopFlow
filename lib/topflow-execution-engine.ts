import { ExecutionEngine } from '@charliesu/workflow-core'
import type { Node } from '@xyflow/react'
import type { ExecutionContext } from '@charliesu/workflow-core'
import { generateText, generateObject, embed } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createGroq } from '@ai-sdk/groq'
import { z } from 'zod'
import {
  getNodeDelay,
  simulateDelay,
  getGitHubScannerMockResponse,
  hasDemoData,
  renderReport,
  resolveReportModel
} from './demo-mode'
import { assertSafeOutboundUrl } from './security/ssrf'
import {
  extractKnownIds,
  buildMinimizedView,
  buildUrwPrompt,
  URW_CONSTRAINED_SCHEMA,
  validateFindingIds,
  stripCommentary,
  buildAuditRecord,
} from './security/urw'

/**
 * TopFlow-specific execution engine
 * Extends base ExecutionEngine with AI model nodes and HTTP requests
 * Supports demo mode for workflows with cached mock data
 */
export class TopFlowExecutionEngine extends ExecutionEngine {
  private demoMode: boolean = false
  private workflowId?: string
  private executionResults: Map<string, any> = new Map()
  // Two-axis real-scan controls (opt-in; only set when a real scan is requested).
  private perAxis: boolean = false
  private dataMode: 'real' | 'demo' = 'demo'
  private narrativeMode: 'llm' | 'templated' = 'templated'
  private githubToken?: string

  constructor(options?: {
    demoMode?: boolean
    workflowId?: string
    dataMode?: 'real' | 'demo'
    narrativeMode?: 'llm' | 'templated'
    githubToken?: string
  }) {
    super()
    this.demoMode = options?.demoMode || false
    this.workflowId = options?.workflowId
    // Per-axis mode is engaged only when explicit axes are provided (real scan).
    if (options?.dataMode || options?.narrativeMode) {
      this.perAxis = true
      this.dataMode = options?.dataMode || (this.demoMode ? 'demo' : 'real')
      this.narrativeMode = options?.narrativeMode || (this.demoMode ? 'templated' : 'llm')
      this.githubToken = options?.githubToken
    }
  }

  /**
   * Override executeWorkflow to capture results
   */
  async executeWorkflow(
    nodes: Node[],
    edges: any[],
    context: ExecutionContext,
    onUpdate?: (update: any) => void
  ): Promise<any> {
    // Reset results for new execution
    this.executionResults = new Map()

    // Call parent executeWorkflow
    return super.executeWorkflow(nodes, edges, context, onUpdate)
  }

  /**
   * Override executeNode to handle TopFlow-specific node types
   */
  protected async executeNode(
    node: Node,
    inputs: Record<string, any>,
    context: ExecutionContext
  ): Promise<any> {
    let result: any

    const isScanner =
      this.workflowId === 'github-security-scanner' && hasDemoData(this.workflowId)

    if (isScanner && this.perAxis) {
      // Per-axis real scan: decide mock/templated vs real per node.
      const decided = await this.executeScannerNode(node, inputs, context)
      result = decided.handled ? decided.result : await this.executeRealNode(node, inputs, context)
    } else if (isScanner && this.demoMode) {
      // Legacy demo path (unchanged): mock every node of the scanner workflow.
      await simulateDelay(getNodeDelay(node.type || 'default'))
      result = getGitHubScannerMockResponse(node, Object.values(inputs), this.executionResults)
    } else {
      result = await this.executeRealNode(node, inputs, context)
    }

    // Store result for future nodes to access
    this.executionResults.set(node.id, result)

    return result
  }

  /**
   * Per-axis routing for the GitHub Scanner (only when real-scan is engaged).
   * Returns { handled: true, result } for nodes served from mock/templated data,
   * or { handled: false } to let the node run for real (data axis) / via the LLM
   * (narrative axis). See lib/demo-mode resolveScanModes.
   */
  private async executeScannerNode(
    node: Node,
    inputs: Record<string, any>,
    context: ExecutionContext
  ): Promise<{ handled: boolean; result?: any }> {
    const id = node.id
    const mock = async () => {
      await simulateDelay(getNodeDelay(node.type || 'default'))
      return getGitHubScannerMockResponse(node, Object.values(inputs), this.executionResults)
    }

    const dataLogicNodes = ['start', 'extract-repo', 'fetch-metadata', 'fetch-security', 'calculate-score', 'grade-check', 'end']
    const narrativeNodes = ['prompt-excellent', 'prompt-improve', 'ai-analysis', 'extract-actions']

    // Data axis: mock when demo, real otherwise.
    if (dataLogicNodes.includes(id)) {
      return this.dataMode === 'demo' ? { handled: true, result: await mock() } : { handled: false }
    }

    // Narrative axis: URW-constrained LLM when "llm"; templated render otherwise.
    if (narrativeNodes.includes(id)) {
      if (this.narrativeMode === 'llm') {
        // URW Phase 1: intercept the two narrative nodes that need constraints.
        if (id === 'ai-analysis') {
          return { handled: true, result: await this.executeUrwAnalysis(context) }
        }
        if (id === 'extract-actions') {
          return { handled: true, result: await this.executeUrwAssembly(context) }
        }
        // Other narrative nodes (prompt-excellent, prompt-improve) still run
        // to produce the grade-check branch label — their output feeds ai-analysis
        // which URW intercepts above, so the free-text never reaches the report.
        return { handled: false }
      }
      if (id === 'ai-analysis') {
        // Templated (no-LLM) report from the ACTUAL analysis (real or mock).
        const analysis = this.executionResults.get('fetch-security') || {}
        return { handled: true, result: renderReport(analysis) }
      }
      return { handled: true, result: await mock() }
    }

    // Dashboard image: only generate for real when an LLM narrative AND a Google key exist.
    if (id === 'generate-visual') {
      const canImage = this.narrativeMode === 'llm' && Boolean((context.apiKeys as any)?.google)
      return canImage ? { handled: false } : { handled: true, result: await mock() }
    }

    return { handled: false }
  }

  /**
   * Real execution for TopFlow-specific node types (the original switch).
   */
  private async executeRealNode(
    node: Node,
    inputs: Record<string, any>,
    context: ExecutionContext
  ): Promise<any> {
    const data = node.data as any

    switch (node.type) {
      case 'start':
        // Start nodes should output their stored value or context variable
        console.log('[TopFlowEngine] Start node output:', { nodeId: node.id })
        return data.output || context.variables?.[node.id] || data.defaultValue || ''

      case 'httpRequest':
        return this.executeHttpRequestNode(node, inputs)

      case 'textModel':
        return this.executeTextModelNode(node, inputs, context)

      case 'imageGeneration':
        return this.executeImageGenerationNode(node, inputs, context)

      case 'audio':
        return this.executeAudioNode(node, inputs, context)

      case 'embeddingModel':
        return this.executeEmbeddingModelNode(node, inputs, context)

      case 'structuredOutput':
        return this.executeStructuredOutputNode(node, inputs, context)

      case 'tool':
        return this.executeToolNode(node, inputs)

      case 'prompt':
        return this.executePromptTemplate(node, inputs)

      default:
        // Fall back to base implementation for shared nodes
        return super.executeNode(node, inputs, context)
    }
  }

  private async executeHttpRequestNode(node: Node, inputs: Record<string, any>): Promise<any> {
    const data = node.data as any
    let url = data.url || ''
    const method = (data.method || 'GET').toUpperCase()
    // Templates may store headers as a JSON string; only spread real objects.
    const headers: Record<string, string> = (data.headers && typeof data.headers === 'object') ? { ...data.headers } : {}
    const body = data.body || ''

    // Real-scan (per-axis) overrides for the GitHub Scanner data nodes:
    //  - point the security node at the real OSV endpoint
    //  - attach the user's GitHub token (BYOK): private repos + 5,000 req/hr
    if (this.perAxis && this.dataMode === 'real' && this.workflowId === 'github-security-scanner') {
      if (node.id === 'fetch-security') {
        url = '/api/scan/github/$input1.fullName'
        if (this.githubToken) headers['x-github-token'] = this.githubToken
      } else if (node.id === 'fetch-metadata' && this.githubToken) {
        headers['Authorization'] = `Bearer ${this.githubToken}`
      }
    }

    // Variable interpolation for URL with property access support
    let interpolatedUrl = url
    Object.entries(inputs).forEach(([key, value]) => {
      // Support property access like $input1.fullName
      const regex = new RegExp(`\\$${key}(?:\\.([\\w\\.]+))?`, 'g')
      interpolatedUrl = interpolatedUrl.replace(regex, (_match: string, propertyPath: string) => {
        if (propertyPath && typeof value === 'object' && value !== null) {
          // Access nested property
          const props = propertyPath.split('.')
          let result = value
          for (const prop of props) {
            result = result?.[prop]
            if (result === undefined) break
          }
          return String(result ?? '')
        }
        return String(value)
      })
    })

    // Convert relative URLs to absolute URLs for server-side fetch
    let finalUrl = interpolatedUrl
    if (interpolatedUrl.startsWith('/')) {
      // Server-side: use localhost
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      finalUrl = `${baseUrl}${interpolatedUrl}`
    } else {
      // SSRF guard: applied to user-supplied absolute URLs only. Engine-generated
      // relative app routes (handled above, e.g. the scanner's /api/scan/github)
      // are trusted internal calls and are intentionally exempt.
      assertSafeOutboundUrl(finalUrl)
    }

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }

    if (method !== 'GET' && method !== 'HEAD') {
      // Variable interpolation for body
      let interpolatedBody = body
      Object.entries(inputs).forEach(([key, value]) => {
        const varName = `$${key}`
        interpolatedBody = interpolatedBody.replace(new RegExp(`\\${varName}`, 'g'), String(value))
      })
      options.body = interpolatedBody
    }

    const response = await fetch(finalUrl, options)
    const result = await response.json()
    return result
  }

  private async executeTextModelNode(
    node: Node,
    inputs: Record<string, any>,
    context: ExecutionContext
  ): Promise<any> {
    const data = node.data as any
    const modelId = this.resolveModelId(data.model || 'openai/gpt-4o-mini', context.apiKeys)
    const temperature = data.temperature || 0.7
    const maxTokens = data.maxTokens || 2000

    // Get the model instance
    const model = this.getModel(modelId, context.apiKeys)

    // Get prompt from first input
    const prompt = inputs.input1 || ''

    const result = await generateText({
      model,
      prompt: String(prompt),
      temperature,
      maxOutputTokens: maxTokens,
    })

    return result.text
  }

  private async executeImageGenerationNode(
    node: Node,
    inputs: Record<string, any>,
    context: ExecutionContext
  ): Promise<any> {
    const data = node.data as any
    const modelId = data.model || 'gemini-2.0-flash-exp'

    const prompt = inputs.input1 || ''

    // Use createGoogleGenerativeAI with custom API key
    if (!context.apiKeys.google) {
      throw new Error('Google API key required for image generation')
    }
    const googleClient = createGoogleGenerativeAI({ apiKey: context.apiKeys.google })
    const model = googleClient(modelId)

    const result = await generateText({
      model,
      prompt: String(prompt),
    })

    // Extract base64 images from files
    const images =
      result.files?.filter((f: any) => f.mediaType.startsWith('image/')).map((f: any) => f.base64) || []

    // Return as object with images array (matches node component expected format)
    return {
      images: images.map(base64 => `data:image/png;base64,${base64}`)
    }
  }

  private async executeAudioNode(
    node: Node,
    inputs: Record<string, any>,
    context: ExecutionContext
  ): Promise<any> {
    const data = node.data as any
    const model = data.model || 'tts-1'
    const voice = data.voice || 'alloy'
    const speed = data.speed || 1.0

    const input = inputs.input1 || ''

    // OpenAI TTS API
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${context.apiKeys.openai}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        input: String(input),
        voice,
        speed,
      }),
    })

    const audioBuffer = await response.arrayBuffer()
    return audioBuffer
  }

  private async executeEmbeddingModelNode(
    node: Node,
    inputs: Record<string, any>,
    context: ExecutionContext
  ): Promise<any> {
    const data = node.data as any
    const modelId = data.model || 'text-embedding-3-small'

    const input = inputs.input1 || ''

    // Use createOpenAI with custom API key
    if (!context.apiKeys.openai) {
      throw new Error('OpenAI API key required for embedding model')
    }
    const openaiClient = createOpenAI({ apiKey: context.apiKeys.openai })

    const result = await embed({
       
      model: openaiClient.embedding(modelId) as any,
      value: String(input),
    })

    return result.embedding
  }

  // ---------------------------------------------------------------------------
  // URW Phase 1 — constrained-selector narrative methods
  // ---------------------------------------------------------------------------

  /**
   * Step 1 of 2 in the URW narrative path (replaces the free-text ai-analysis node).
   *
   * Instead of feeding the LLM the open-ended prompt-excellent/prompt-improve
   * output, we build a minimized, sanitized view of the actual scan findings
   * (IDs + severity — no advisory prose) and elicit only a constrained JSON
   * selection via generateObject + URW_CONSTRAINED_SCHEMA.
   *
   * Returns the constrained output as a JSON string so the downstream
   * executeUrwAssembly step can parse and validate it.
   */
  private async executeUrwAnalysis(context: ExecutionContext): Promise<string> {
    const analysis = this.executionResults.get('fetch-security') || {}
    const score    = (this.executionResults.get('calculate-score') as any)?.score ?? analysis.securityScore ?? 0
    const grade    = (this.executionResults.get('calculate-score') as any)?.grade ?? analysis.grade ?? 'N/A'

    const minimized = buildMinimizedView(analysis)
    const prompt    = buildUrwPrompt(minimized, score, grade)
    const modelId   = this.resolveReportModelId(context.apiKeys)
    const model     = this.getModel(modelId, context.apiKeys)

    const { object } = await generateObject({
      model,
      schema: URW_CONSTRAINED_SCHEMA,
      prompt,
      temperature: 0.1, // low temperature — ranking task, not creative writing
    })

    // Store the model used so the audit record in step 2 can reference it.
    this.executionResults.set('_urw_model', modelId)

    return JSON.stringify(object)
  }

  /**
   * Step 2 of 2 in the URW narrative path (replaces extract-actions).
   *
   * Parses the constrained output from executeUrwAnalysis, validates all
   * returned IDs against the ground-truth set from the real scan, drops
   * unknowns (fail closed), emits a per-run audit record, and assembles
   * the final Markdown report deterministically via renderReport.
   */
  private async executeUrwAssembly(context: ExecutionContext): Promise<string> {
    const analysis  = this.executionResults.get('fetch-security') || {}
    const score     = (this.executionResults.get('calculate-score') as any)?.score ?? analysis.securityScore ?? 0
    const rawOutput = this.executionResults.get('ai-analysis')

    const knownIds = extractKnownIds(analysis)

    // Parse the constrained JSON produced by executeUrwAnalysis.
    let parsed: any
    let schemaValid = true
    try {
      parsed = typeof rawOutput === 'string' ? JSON.parse(rawOutput) : rawOutput
    } catch {
      schemaValid = false
      parsed = { prioritizedFindingIds: [], recommendations: [], summaryLabel: 'NEEDS_ATTENTION' }
    }

    const validation = validateFindingIds(parsed, knownIds)

    // Fall back to deterministic order when the LLM returned no valid IDs.
    const order = validation.selectedIds.length > 0
      ? validation.selectedIds
      : Array.from(knownIds).slice(0, 10)

    const rawCommentary = parsed.commentaryHint as string | undefined
    const commentary    = stripCommentary(rawCommentary)
    const modelId       = (this.executionResults.get('_urw_model') as string | undefined) ?? 'unknown'

    // Emit per-run audit record (task 1.7).
    const audit = buildAuditRecord({
      workflowId:    this.workflowId ?? 'github-security-scanner',
      model:         modelId,
      knownIds,
      output:        parsed,
      validation,
      schemaValid,
      rawCommentary,
    })
    this.executionResults.set('_urw_audit', audit)

    if (validation.droppedIds.length > 0) {
      console.warn('[URW] Dropped fabricated/unknown IDs:', validation.droppedIds)
    }

    return renderReport(analysis, {
      score,
      order,
      recommendations: validation.selectedRecommendations,
      summaryLabel:    parsed.summaryLabel,
      commentary,
    })
  }

  /** Resolve which AI model to use for the URW narrative. */
  private resolveReportModelId(apiKeys: Record<string, string>): string {
    return resolveReportModel(apiKeys) ?? 'openai/gpt-4o-mini'
  }

  private async executeStructuredOutputNode(
    node: Node,
    inputs: Record<string, any>,
    context: ExecutionContext
  ): Promise<any> {
    const data = node.data as any
    const modelId = this.resolveModelId(data.model || 'openai/gpt-4o-mini', context.apiKeys)

    const model = this.getModel(modelId, context.apiKeys)
    const prompt = inputs.input1 || ''

    // Parse schema if it's a JSON string
    let schemaDefinition = data.schema
    if (typeof schemaDefinition === 'string') {
      try {
        schemaDefinition = JSON.parse(schemaDefinition)
      } catch (e) {
        throw new Error(`Failed to parse schema JSON: ${e}`)
      }
    }

    // Build Zod schema from the schema definition
    const zodSchema = this.convertToZodSchema(schemaDefinition)

    const result = await generateObject({
      model,
      schema: zodSchema,
      prompt: String(prompt),
    })

    return JSON.stringify(result.object)
  }

  /**
   * Convert JSON schema definition to Zod schema
   * Handles types: "string", "number", "boolean", ["string"], [{...}], {...}
   */
  private convertToZodSchema(definition: any): any {
    if (typeof definition === 'string') {
      // Simple type definition: "string", "number", "boolean"
      if (definition === 'string') return z.string()
      if (definition === 'number') return z.number()
      if (definition === 'boolean') return z.boolean()

      // Enum definition: "HIGH | MEDIUM | LOW"
      if (definition.includes('|')) {
        const values = definition.split('|').map((v: string) => v.trim())
        return z.enum(values as [string, ...string[]])
      }

      return z.string() // fallback
    }

    if (Array.isArray(definition)) {
      // Array definition: ["string"] or [{...}]
      if (definition.length === 0) {
        return z.array(z.any())
      }

      const itemSchema = this.convertToZodSchema(definition[0])
      return z.array(itemSchema)
    }

    if (typeof definition === 'object' && definition !== null) {
      // Object definition: { key: type, ... }
      const shape: Record<string, any> = {}

      for (const [key, value] of Object.entries(definition)) {
        shape[key] = this.convertToZodSchema(value)
      }

      return z.object(shape)
    }

    return z.any() // fallback
  }

  private async executePromptTemplate(node: Node, inputs: Record<string, any>): Promise<any> {
    const data = node.data as any
    let template = data.prompt || ''

    // For GitHub Scanner workflow, enhance inputs with execution results
    // This allows prompt nodes to access upstream data even after conditional branching
    if (this.workflowId === 'github-security-scanner') {
      const enhancedInputs: Record<string, any> = { ...inputs }

      // Map execution results to input1, input2, input3 based on GitHub Scanner structure
      if (this.executionResults.has('extract-repo')) {
        enhancedInputs.input1 = this.executionResults.get('extract-repo')
      }
      if (this.executionResults.has('calculate-score')) {
        enhancedInputs.input2 = this.executionResults.get('calculate-score')
      }
      if (this.executionResults.has('fetch-metadata')) {
        enhancedInputs.input3 = this.executionResults.get('fetch-metadata')
      }

      // Privacy: input names only — values carry user/scan content.
      console.log('[TopFlowEngine] Prompt node execution:', {
        nodeId: node.id,
        inputNames: Object.keys(enhancedInputs),
      })

      // Perform variable interpolation with enhanced inputs
      // Support both simple variables ($input1) and property access ($input1.fullName)
      Object.entries(enhancedInputs).forEach(([key, value]) => {
        // Property access pattern: $input1.property.nested
        const regex = new RegExp(`\\$${key}(?:\\.([\\w\\.]+))?`, 'g')
        template = template.replace(regex, (_match: string, propertyPath: string) => {
          if (propertyPath && typeof value === 'object' && value !== null) {
            // Access nested property
            const props = propertyPath.split('.')
            let result = value
            for (const prop of props) {
              result = result?.[prop]
              if (result === undefined) break
            }
            return String(result ?? '')
          }
          return String(value ?? '')
        })
      })

      return template
    }

    // For other workflows, use standard variable interpolation
    Object.entries(inputs).forEach(([key, value]) => {
      const varName = `$${key}`
      template = template.replace(new RegExp(`\\${varName}`, 'g'), String(value ?? ''))
    })

    return template
  }

  private async executeToolNode(node: Node, inputs: Record<string, any>): Promise<any> {
    const data = node.data as any
    const code = data.code || 'return { result: "Tool executed" }'

    // Sandboxed execution
    try {
      const fn = new Function(...Object.keys(inputs), code)
      return fn(...Object.values(inputs))
    } catch (error) {
      throw new Error(`Tool execution failed: ${error}`)
    }
  }

  /**
   * Provider-agnostic model resolution: if the requested provider's key is
   * missing but another provider key exists, fall back to an available model.
   * Prevents "OpenAI API key not configured" for users who only have, e.g., an
   * Anthropic key (the scanner template hardcodes an OpenAI model).
   */
  private resolveModelId(modelId: string, apiKeys: Record<string, string>): string {
    const [provider] = (modelId || '').split('/')
    if (apiKeys && (apiKeys as any)[provider]) return modelId
    return resolveReportModel(apiKeys || {}) || modelId
  }

  /**
   * Get AI model instance based on provider and API keys
   * Wraps models with v2 spec compatibility shim for AI SDK 5
   */
  private getModel(modelId: string, apiKeys: Record<string, string>) {
    const [provider, model] = modelId.split('/')

    switch (provider) {
      case 'openai':
        if (!apiKeys.openai) throw new Error('OpenAI API key not configured')
        const openaiClient = createOpenAI({ apiKey: apiKeys.openai })
        const openaiModel = openaiClient(model || 'gpt-4o-mini')
        return this.wrapToSpecV2(openaiModel, provider, model || 'gpt-4o-mini')

      case 'anthropic':
        if (!apiKeys.anthropic) throw new Error('Anthropic API key not configured')
        const anthropicClient = createAnthropic({ apiKey: apiKeys.anthropic })
        const anthropicModel = anthropicClient(model || 'claude-3-5-sonnet-20241022')
        return this.wrapToSpecV2(anthropicModel, provider, model || 'claude-3-5-sonnet-20241022')

      case 'google':
        if (!apiKeys.google) throw new Error('Google API key not configured')
        const googleClient = createGoogleGenerativeAI({ apiKey: apiKeys.google })
        const googleModel = googleClient(model || 'gemini-1.5-flash')
        return this.wrapToSpecV2(googleModel, provider, model || 'gemini-1.5-flash')

      case 'groq':
        if (!apiKeys.groq) throw new Error('Groq API key not configured')
        const groqClient = createGroq({ apiKey: apiKeys.groq })
        const groqModel = groqClient(model || 'llama-3.3-70b-versatile')
        return this.wrapToSpecV2(groqModel, provider, model || 'llama-3.3-70b-versatile')

      default:
        throw new Error(`Unknown model provider: ${provider}`)
    }
  }

  /**
   * Wrap model to report v2 spec for AI SDK 5 compatibility
   * This prevents "Unsupported model version v3" errors
   */
   
  private wrapToSpecV2(model: any, provider: string, modelId: string): any {
    if (!model || typeof model !== 'object') {
      throw new Error('Invalid language model instance')
    }

    const base = model as any
    return {
      specificationVersion: 'v2',
      provider,
      modelId,
      supportedUrls: base.supportedUrls,
      async doGenerate(options: any) {
        return base.doGenerate(options)
      },
      async doStream(options: any) {
        return base.doStream(options)
      },
    }
  }
}
