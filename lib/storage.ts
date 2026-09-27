// Storage abstraction layer - easy to swap localStorage for Supabase later

import { getSecurityTemplates } from "./security-templates"

export interface WorkflowMetadata {
  id: string
  name: string
  description: string
  version: number
  createdAt: string
  updatedAt: string
  author: string
  isPublic: boolean
  tags: string[]
  category: string
}

export interface StoredWorkflow extends WorkflowMetadata {
  nodes: any[]
  edges: any[]
  securityScore?: number
  compliance?: string[]
}

export interface WorkflowVersion {
  id: string
  workflowId: string
  version: number
  nodes: any[]
  edges: any[]
  createdAt: string
  author: string
  message: string
}

// LocalStorage implementation (can be replaced with Supabase later)
export const WorkflowStorage = {
  // Workflows
  saveWorkflow: (workflow: StoredWorkflow): void => {
    const workflows = WorkflowStorage.getAllWorkflows()
    const index = workflows.findIndex((w) => w.id === workflow.id)

    if (index >= 0) {
      workflows[index] = { ...workflow, updatedAt: new Date().toISOString() }
    } else {
      workflows.push(workflow)
    }

    localStorage.setItem("ai-agent-workflows", JSON.stringify(workflows))
  },

  getWorkflow: (id: string): StoredWorkflow | null => {
    const workflows = WorkflowStorage.getAllWorkflows()
    return workflows.find((w) => w.id === id) || null
  },

  getAllWorkflows: (): StoredWorkflow[] => {
    if (typeof window === "undefined") {
      return []
    }
    const data = localStorage.getItem("ai-agent-workflows")
    return data ? JSON.parse(data) : []
  },

  deleteWorkflow: (id: string): void => {
    const workflows = WorkflowStorage.getAllWorkflows()
    const filtered = workflows.filter((w) => w.id !== id)
    localStorage.setItem("ai-agent-workflows", JSON.stringify(filtered))

    // Also delete associated versions
    const versions = WorkflowStorage.getWorkflowVersions(id)
    versions.forEach((v) => WorkflowStorage.deleteVersion(v.id))
  },

  // Versions
  saveVersion: (version: WorkflowVersion): void => {
    const versions = WorkflowStorage.getAllVersions()
    versions.push(version)
    localStorage.setItem("ai-agent-versions", JSON.stringify(versions))
  },

  getWorkflowVersions: (workflowId: string): WorkflowVersion[] => {
    const versions = WorkflowStorage.getAllVersions()
    return versions.filter((v) => v.workflowId === workflowId).sort((a, b) => b.version - a.version)
  },

  getAllVersions: (): WorkflowVersion[] => {
    if (typeof window === "undefined") {
      return []
    }
    const data = localStorage.getItem("ai-agent-versions")
    return data ? JSON.parse(data) : []
  },

  deleteVersion: (id: string): void => {
    const versions = WorkflowStorage.getAllVersions()
    const filtered = versions.filter((v) => v.id !== id)
    localStorage.setItem("ai-agent-versions", JSON.stringify(filtered))
  },

  // Templates
  getTemplates: (): StoredWorkflow[] => {
    // Return security templates + default templates + user's public workflows
    return [...getSecurityTemplates(), ...getDefaultTemplates(), ...WorkflowStorage.getAllWorkflows().filter((w) => w.isPublic)]
  },
}

export function getDefaultTemplates(): StoredWorkflow[] {
  return [
    {
      id: "template-content-generator",
      name: "AI Content Generator with Image",
      description: "Complete workflow: Fetch data from API → Generate text → Create image → Display results",
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: "AI Agent Builder",
      isPublic: true,
      tags: ["complete", "real-world", "text", "image", "api"],
      category: "Complete Workflows",
      nodes: [
        { id: "1", type: "start", position: { x: 50, y: 250 }, data: {} },
        {
          id: "2",
          type: "httpRequest",
          position: { x: 325, y: 250 },
          data: {
            url: "https://v0-generated-agent-builder.vercel.app/api/demo-country",
            method: "GET",
          },
        },
        {
          id: "3",
          type: "conditional",
          position: { x: 750, y: 250 },
          data: { condition: "input1.country === 'US'" },
        },
        {
          id: "4",
          type: "prompt",
          position: { x: 1150, y: 50 },
          data: { content: "Write a short poem about the United States" },
        },
        {
          id: "5",
          type: "prompt",
          position: { x: 1150, y: 450 },
          data: { content: "Write a welcoming message for visitors from {{input1.country}}" },
        },
        {
          id: "6",
          type: "textModel",
          position: { x: 1550, y: 50 },
          data: { model: "openai/gpt-4o-mini", temperature: 0.7, maxTokens: 300 },
        },
        {
          id: "7",
          type: "textModel",
          position: { x: 1550, y: 450 },
          data: { model: "openai/gpt-4o-mini", temperature: 0.7, maxTokens: 300 },
        },
        {
          id: "8",
          type: "prompt",
          position: { x: 1950, y: 250 },
          data: { content: "Create an artistic image prompt: {{input1}}" },
        },
        {
          id: "9",
          type: "imageGeneration",
          position: { x: 2400, y: 250 },
          data: { model: "black-forest-labs/flux-1.1-pro", aspectRatio: "16:9", outputFormat: "png" },
        },
        { id: "10", type: "end", position: { x: 2850, y: 250 }, data: {} },
      ],
      edges: [
        { id: "e1-2", source: "1", target: "2" },
        { id: "e2-3", source: "2", target: "3" },
        { id: "e3-4", source: "3", target: "4", sourceHandle: "true", label: "✓ US", style: { stroke: "#22c55e" } },
        { id: "e3-5", source: "3", target: "5", sourceHandle: "false", label: "✗ Other", style: { stroke: "#ef4444" } },
        { id: "e4-6", source: "4", target: "6" },
        { id: "e5-7", source: "5", target: "7" },
        { id: "e6-8", source: "6", target: "8" },
        { id: "e7-8", source: "7", target: "8" },
        { id: "e8-9", source: "8", target: "9" },
        { id: "e9-10", source: "9", target: "10" },
      ],
    },
    {
      id: "template-chatbot",
      name: "Simple Chatbot",
      description: "Basic conversational chatbot - perfect for testing your API keys",
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: "AI Agent Builder",
      isPublic: true,
      tags: ["chatbot", "conversation", "simple", "beginner"],
      category: "Chatbots",
      nodes: [
        { id: "1", type: "start", position: { x: 100, y: 200 }, data: {} },
        {
          id: "2",
          type: "prompt",
          position: { x: 400, y: 200 },
          data: { content: "You are a helpful assistant. User says: {{input1}}" },
        },
        {
          id: "3",
          type: "textModel",
          position: { x: 750, y: 200 },
          data: { model: "openai/gpt-4o-mini", temperature: 0.8, maxTokens: 500 },
        },
        { id: "4", type: "end", position: { x: 1100, y: 200 }, data: {} },
      ],
      edges: [
        { id: "e1-2", source: "1", target: "2" },
        { id: "e2-3", source: "2", target: "3" },
        { id: "e3-4", source: "3", target: "4" },
      ],
    },
    {
      id: "template-data-pipeline",
      name: "API Data Pipeline",
      description: "Fetch, transform, and structure external API data",
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: "AI Agent Builder",
      isPublic: true,
      tags: ["api", "data", "structured-output", "javascript"],
      category: "Data Processing",
      nodes: [
        { id: "1", type: "start", position: { x: 100, y: 200 }, data: {} },
        {
          id: "2",
          type: "httpRequest",
          position: { x: 400, y: 200 },
          data: { url: "https://jsonplaceholder.typicode.com/users/1", method: "GET" },
        },
        {
          id: "3",
          type: "javascript",
          position: { x: 750, y: 200 },
          data: {
            code: "// Transform the data\nreturn {\n  name: input1.name,\n  email: input1.email,\n  company: input1.company.name\n}",
          },
        },
        {
          id: "4",
          type: "structuredOutput",
          position: { x: 1100, y: 200 },
          data: { schemaName: "UserProfile", mode: "object" },
        },
        { id: "5", type: "end", position: { x: 1450, y: 200 }, data: {} },
      ],
      edges: [
        { id: "e1-2", source: "1", target: "2" },
        { id: "e2-3", source: "2", target: "3" },
        { id: "e3-4", source: "3", target: "4" },
        { id: "e4-5", source: "4", target: "5" },
      ],
    },
    {
      id: "template-image-generator",
      name: "AI Image Generator",
      description: "Generate images from text descriptions using AI",
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: "AI Agent Builder",
      isPublic: true,
      tags: ["image", "generation", "ai", "creative"],
      category: "Creative",
      nodes: [
        { id: "1", type: "start", position: { x: 100, y: 200 }, data: {} },
        {
          id: "2",
          type: "prompt",
          position: { x: 400, y: 200 },
          data: { content: "Enhance this image description with artistic details: {{input1}}" },
        },
        {
          id: "3",
          type: "textModel",
          position: { x: 750, y: 200 },
          data: { model: "openai/gpt-4o-mini", temperature: 0.9, maxTokens: 200 },
        },
        {
          id: "4",
          type: "imageGeneration",
          position: { x: 1100, y: 200 },
          data: { model: "black-forest-labs/flux-1.1-pro", aspectRatio: "1:1", outputFormat: "png" },
        },
        { id: "5", type: "end", position: { x: 1450, y: 200 }, data: {} },
      ],
      edges: [
        { id: "e1-2", source: "1", target: "2" },
        { id: "e2-3", source: "2", target: "3" },
        { id: "e3-4", source: "3", target: "4" },
        { id: "e4-5", source: "4", target: "5" },
      ],
    },
  ]
}
