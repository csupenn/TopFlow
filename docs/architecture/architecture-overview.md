# TopFlow Architecture Overview

## Introduction

TopFlow is a security-focused visual workflow builder for creating AI-powered applications. Built by a former CISO, it demonstrates how to build AI systems with security baked in, not bolted on. This document provides a comprehensive overview of TopFlow's architecture for developers, security professionals, and contributors.

## Core Design Principles

### 1. Privacy-First Architecture
- **Zero Server Storage**: All user data (workflows, API keys) stored exclusively in browser localStorage; sent to the server only for the duration of an execution request (in memory, never stored or logged)
- **No Backend Database**: Eliminates data breach risks by not storing user data server-side
- **GDPR Compliant by Design**: Can't violate privacy laws for data you don't collect
- **User Data Sovereignty**: Users maintain 100% control over their data

### 2. Security-First Design
- **5-Layer Defense-in-Depth**: Security controls at every layer
- **OWASP Top 10 Coverage**: Protection against common web vulnerabilities
- **SSRF Prevention**: Egress guard (`lib/security/ssrf.ts`) — blocks private/reserved IP ranges, cloud metadata endpoints, non-HTTP schemes; provenance-aware exemption for engine-internal routes
- **Sandboxed Execution**: JavaScript nodes run via `new Function()` with limited scope (a real isolate is planned — see T3)

### 3. Bring Your Own Key (BYOK) Model
- **User-Provided API Keys**: Users supply their own AI provider credentials
- **Local Storage Only**: Keys are stored only in the browser (AES-256-GCM) and sent per request for execution; never stored or logged server-side
- **Zero Platform Costs**: No ongoing API expenses for the platform
- **Provider Flexibility**: Support for OpenAI, Anthropic, Google, Groq

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser (Client)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Next.js   │  │   ReactFlow  │  │   localStorage   │  │
│  │   App (SPA) │  │    Canvas    │  │   (Workflows)    │  │
│  └──────┬──────┘  └──────┬───────┘  └──────────────────┘  │
│         │                 │                                  │
│  ┌──────▼─────────────────▼──────────────────────────────┐  │
│  │           TopFlow Application Layer                    │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────┐ │  │
│  │  │   Nodes    │  │ Validation │  │ Code Generator │ │  │
│  │  │(@topflow/  │  │  Pipeline  │  │   (TypeScript) │ │  │
│  │  │workflow-   │  └────────────┘  └────────────────┘ │  │
│  │  │   core)    │                                      │  │
│  │  └────────────┘                                      │  │
│  └────────────────────────┬─────────────────────────────┘  │
└───────────────────────────┼─────────────────────────────────┘
                            │
                     HTTPS/TLS 1.3
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    Vercel Edge Network                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────────┐  │
│  │ Rate Limiter │  │   DDoS      │  │   Request        │  │
│  │(10 req/min/IP│  │ Protection  │  │   Validation     │  │
│  │ in-memory)   │  │             │  │                  │  │
│  └──────┬───────┘  └─────┬───────┘  └────────┬─────────┘  │
│         └─────────────────┼───────────────────┘            │
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          Serverless Execution Functions              │   │
│  │  ┌─────────────────┐  ┌────────────────────────┐   │   │
│  │  │ /api/execute-   │  │  Security Controls:    │   │   │
│  │  │   workflow      │  │  - SSRF Prevention     │   │   │
│  │  │                 │  │  - Input Sanitization  │   │   │
│  │  │ (Streaming SSE) │  │  - Timeout (30s max)   │   │   │
│  │  └─────────┬───────┘  │  - Cycle Detection     │   │   │
│  │            │           └────────────────────────┘   │   │
│  └────────────┼─────────────────────────────────────────┘   │
└───────────────┼──────────────────────────────────────────────┘
                │
         HTTPS Only
                │
┌───────────────▼──────────────────────────────────────────────┐
│              External AI Providers (BYOK)                    │
│  ┌──────────┐  ┌────────────┐  ┌──────────┐  ┌──────────┐ │
│  │  OpenAI  │  │ Anthropic  │  │  Google  │  │   Groq   │ │
│  └──────────┘  └────────────┘  └──────────┘  └──────────┘ │
└───────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. Core Application (`/app`)

#### Main Application (`app/page.tsx`)
- **Single Page Application**: Entire workflow builder in one page
- **State Management**: React hooks (`useState`) for UI state
- **Canvas Control**: ReactFlow instance management
- **Feature Dialogs**: Templates, code export, API settings, version history

#### Builder Interface (`app/builder/page.tsx`)
- **Visual Workflow Designer**: Drag-and-drop node creation
- **Real-time Validation**: Instant feedback on workflow issues
- **Live Execution**: Stream execution results in real-time
- **Code Export**: Generate production TypeScript code

### 2. Node System (`@topflow/workflow-core`)

TopFlow's nodes are published as a separate npm package for reusability:

```bash
npm install @topflow/workflow-core
```

#### Node Categories

**AI Model Nodes**:
- `TextModelNode`: LLM text generation (GPT, Claude, Gemini)
- `ImageGenerationNode`: AI image creation
- `EmbeddingModelNode`: Vector embeddings for RAG
- `AudioNode`: Text-to-speech synthesis

**Data & Control Flow**:
- `StartNode`: Workflow entry point
- `EndNode`: Output collection
- `PromptNode`: Template with variable interpolation
- `ConditionalNode`: Branching logic (true/false outputs)

**Integration Nodes**:
- `JavaScriptNode`: Custom code execution (`new Function()` — real isolate planned)
- `HttpRequestNode`: External API calls
- `ToolNode`: AI SDK tool definitions
- `StructuredOutputNode`: Schema-validated outputs

### 3. Execution Engine (`/app/api/execute-workflow`)

#### Execution Pipeline

```typescript
1. Request Validation
   ├── Rate limiting (10 req/min)
   ├── Input sanitization
   └── Workflow structure validation

2. Graph Construction
   ├── Build node dependency map
   ├── Detect cycles (DFS)
   └── Identify entry points

3. Topological Execution
   ├── Sort nodes by dependencies
   ├── Execute in parallel where possible
   └── Cache intermediate results

4. Streaming Response
   ├── Server-Sent Events (SSE)
   ├── Real-time status updates
   └── Progressive output delivery
```

#### Security Controls

- **SSRF Prevention**: `lib/security/ssrf.ts` — blocks private/reserved ranges, metadata IPs, non-HTTP schemes; exempt engine-internal relative routes by provenance
- **Input Sanitization**: XSS protection via character stripping
- **Timeout Enforcement**: 30-second maximum execution time
- **JavaScript Sandboxing**: `new Function()` with limited scope (not a true isolate — real sandbox is T3, planned)

### 4. Code Generation System (`/lib/code-generator`)

Generates production-ready TypeScript code from visual workflows:

```typescript
// Generated Standalone Function
export async function runWorkflow(input?: string) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  // Node executions in topological order
  const prompt_1 = `Analyze: ${input}`
  const model_1 = await client.chat.completions.create({...})

  return model_1.choices[0].message.content
}

// Or as API Route Handler
export async function POST(req: Request) {
  const { input } = await req.json()
  const result = await runWorkflow(input)
  return Response.json({ result })
}
```

### 5. Validation Pipeline (`/lib/validation`)

Multi-stage validation with scoring system:

```typescript
Validation Stages:
├── Structural Validation
│   ├── Cycle detection
│   ├── Orphan nodes
│   └── Start/End presence
├── Configuration Validation
│   ├── Required fields
│   ├── Model availability
│   └── Schema validation
├── Security Validation
│   ├── SSRF detection
│   ├── Script injection
│   └── Resource limits
└── API Key Validation
    └── Provider credentials

Scoring: 100 → Grade A
         -10 per error (blocks execution)
         -10 per warning (allows execution)
```

### 6. Storage Layer (`/lib/storage`)

localStorage abstraction with swappable backend:

```typescript
Storage Keys:
├── ai-agent-workflows        // Saved workflows
├── ai-agent-versions        // Version history
├── ai-agent-api-keys       // Encrypted API keys
├── ai-agent-builder-workflow // Current state
└── ai-agent-builder-autosave-{timestamp} // Auto-saves
```

## Security Architecture

### 5-Layer Defense Model

#### Layer 1: Client-Side (Browser)
- Input validation and sanitization
- XSS prevention via CSP headers
- API key encryption in localStorage
- HTTPS-only communication

#### Layer 2: Transport (HTTPS/TLS)
- TLS 1.3 minimum
- HSTS headers
- Certificate pinning
- Secure WebSocket for streaming

#### Layer 3: API Gateway (Vercel Edge)
- Rate limiting (10 requests/minute/IP — sliding window, in-memory per serverless instance; durable Redis/KV store is T4, planned)
- DDoS protection
- Request size limits
- Geographic restrictions (optional)

#### Layer 4: Execution Layer (Serverless)
```typescript
Security Controls:
├── URL Validation
│   ├── Protocol: HTTPS only
│   ├── Blocked: localhost, 127.0.0.1
│   ├── Blocked: 10.*, 172.16.*, 192.168.*
│   └── Blocked: 169.254.169.254 (AWS metadata)
├── Code Execution
│   ├── Sandboxed via new Function()
│   ├── No eval() usage
│   └── Limited global access
└── Resource Limits
    ├── 30-second timeout
    ├── Memory limits
    └── CPU throttling
```

#### Layer 5: External APIs
- BYOK model (user credentials)
- No shared API keys
- Provider-specific security
- Audit logging

## Data Flow Patterns

### 1. Workflow Creation
```
User Action → State Update → Canvas Render → localStorage
     │             │              │              │
Add Node ──► nodes.push() ──► ReactFlow ──► persist()
Connect ───► edges.push() ──► Update ────► auto-save
Configure ─► node.data ────► Re-render ──► debounce(save)
```

### 2. Workflow Execution
```
Execute Button → Validation → API Request → Streaming Response
       │            │             │              │
    Validate ──► Score ≥60 ──► POST /api ──► SSE Stream
                    │                           │
                 Block ◄──────────────────► Update UI
```

### 3. Code Export
```
Export Button → Graph Analysis → Code Generation → Display
      │              │                │               │
   Traverse ──► Dependencies ──► TypeScript ──► Syntax Highlight
                     │                              │
                 AI SDK imports              Copy to Clipboard
```

## State Management

### Primary State (React)
```typescript
// Main application state in app/page.tsx
const [nodes, setNodes] = useState<Node[]>([])
const [edges, setEdges] = useState<Edge[]>([])
const [selectedNode, setSelectedNode] = useState<Node | null>()
const [currentWorkflow, setCurrentWorkflow] = useState<Workflow>()
```

### Auxiliary State (Zustand)
```typescript
// Undo/redo history only
interface WorkflowStore {
  history: HistoryEntry[]
  currentIndex: number
  undo: () => void
  redo: () => void
}
```

### Persistence Strategy
- **Auto-save**: Every 30 seconds (debounced)
- **Version History**: Last 50 states
- **Auto-save Cleanup**: Keep last 5 only
- **Export/Import**: JSON format

## Performance Optimizations

### Client-Side
- **React.memo()**: All node components memoized
- **useCallback**: Event handler optimization
- **useMemo**: Expensive computations cached
- **Virtual Scrolling**: ReactFlow node virtualization
- **Code Splitting**: Dynamic imports for providers

### Server-Side
- **Streaming SSE**: Prevents timeout on long workflows
- **Result Caching**: Node outputs cached during execution
- **Parallel Execution**: Independent nodes run concurrently
- **Edge Functions**: Global distribution via Vercel

### Bundle Size
- **Tree Shaking**: Unused AI providers excluded
- **Dynamic Imports**: Load providers on-demand
- **WebP Images**: 97.7% size reduction for demo assets
- **Minification**: Aggressive production optimization

## Deployment Architecture

### Production Stack
```yaml
Platform: Vercel
Domain: topflow.dev
Runtime: Next.js 15 (App Router)
Functions: Serverless (Node.js 20)
Storage: Client-side localStorage
CDN: Vercel Edge Network
SSL: Automatic HTTPS
Cost: < $20/month
```

### Environment Variables
```bash
# Optional - for server-side execution
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...
GROQ_API_KEY=...

# Required
NODE_ENV=production
```

## Extension Points

### Adding Custom Nodes

1. **Create Node Component**:
```typescript
// components/nodes/custom-node.tsx
export function CustomNode({ data, id }: NodeProps<CustomNodeData>) {
  return <NodeWrapper>...</NodeWrapper>
}
```

2. **Register Node Type**:
```typescript
// app/page.tsx
const nodeTypes = {
  custom: CustomNode,
  ...existingTypes
}
```

3. **Add Execution Logic**:
```typescript
// app/api/execute-workflow/route.ts
case 'custom':
  result = await executeCustom(node, inputs)
```

4. **Add Code Generation**:
```typescript
// lib/code-generator.ts
case 'custom':
  code += generateCustomCode(node, inputs)
```

## Technology Stack

### Core Technologies
- **Framework**: Next.js 15 (App Router)
- **React**: 19.1.0
- **TypeScript**: 5.x
- **Styling**: TailwindCSS v4
- **Canvas**: ReactFlow 12.8.6

### AI Integration
- **Vercel AI SDK**: v5
- **Providers**: OpenAI, Anthropic, Google, Groq
- **Node Package**: @topflow/workflow-core

### UI Components
- **Component Library**: shadcn/ui (Radix UI)
- **Icons**: lucide-react
- **Animations**: Framer Motion
- **Notifications**: Sonner

## Contributing

TopFlow is open source and welcomes contributions. Key areas:

### Priority Areas
1. **JS-node sandbox** (T3): Replace `new Function()` with a real isolate (`quickjs-emscripten`) — requires a dep-add PR
2. **Durable rate limiter** (T4): Swap in-memory store for Redis/KV (`@upstash/ratelimit`) — requires a dep-add PR
3. **Node Types**: New AI capabilities
4. **Providers**: Additional AI services
5. **Documentation**: Tutorials and guides

### Development Setup
```bash
# Clone repository
git clone https://github.com/[username]/topflow.git

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run tests (529 tests, 26 suites)
pnpm test
```

## License

TopFlow is available under the MIT License. See LICENSE file for details.

## Security Disclosure

For security vulnerabilities, please email security@topflow.dev instead of using public issue trackers.

## Acknowledgments

Built with:
- Vercel AI SDK by Vercel
- ReactFlow by xyflow
- shadcn/ui components
- The open source community

---

*TopFlow demonstrates that security and usability aren't mutually exclusive. Built by a former CISO to show how AI systems should be architected with security as a first principle, not an afterthought.*