/**
 * Unified Navigation Data - Single Source of Truth
 *
 * This file serves as the single source for ALL navigation data:
 * - Sidebar navigation (hierarchical sections)
 * - Search functionality (with descriptions)
 * - Breadcrumbs and active states
 *
 * Benefits:
 * - No sync issues between multiple files
 * - Easier to maintain and update
 * - Type-safe with TypeScript
 * - Prevents broken links
 */

export interface UnifiedNavItem {
  title: string
  href: string
  description?: string  // For search results
  status?: 'available' | 'missing'  // Track which pages exist
}

export interface NavSection {
  title: string
  items: UnifiedNavItem[]
}

export interface NavCategory {
  category: 'learn' | 'build' | 'security'
  title: string
  href: string
  description: string
  sections: NavSection[]
}

/**
 * Complete navigation data for all documentation
 */
export const unifiedNavigation: NavCategory[] = [
  // ========================================
  // LEARN SECTION
  // ========================================
  {
    category: 'learn',
    title: 'Learn',
    href: '/docs/learn',
    description: 'Learn how to build secure AI workflows with TopFlow',
    sections: [
      {
        title: 'Getting Started',
        items: [
          {
            title: 'Introduction',
            href: '/docs/learn/introduction',
            description: 'Learn what TopFlow is, why it exists, and how it helps you build secure AI workflows with privacy baked in',
            status: 'available',
          },
          {
            title: 'Quick Start',
            href: '/docs/learn/quick-start',
            description: 'Build your first workflow in 5 minutes',
            status: 'available',
          },
          {
            title: 'Core Concepts',
            href: '/docs/learn/core-concepts',
            description: 'Understand nodes, edges, workflows, validation, and execution fundamentals',
            status: 'available',
          },
          {
            title: 'Workflows 101',
            href: '/docs/learn/workflows-101',
            description: 'Deep dive into workflow creation, validation, and execution patterns',
            status: 'available',
          },
        ],
      },
      {
        title: 'Resources',
        items: [
          {
            title: 'Tutorials',
            href: '/docs/learn/tutorials',
            description: 'Step-by-step guides for common use cases and workflow patterns',
            status: 'available',
          },
          {
            title: 'Best Practices',
            href: '/docs/learn/best-practices',
            description: 'Security patterns, performance tips, and workflow design principles',
            status: 'available',
          },
          {
            title: 'FAQ',
            href: '/docs/learn/faq',
            description: 'Frequently asked questions and troubleshooting tips',
            status: 'available',
          },
        ],
      },
    ],
  },

  // ========================================
  // BUILD SECTION
  // ========================================
  {
    category: 'build',
    title: 'Build',
    href: '/docs/build',
    description: 'Build AI-powered workflows with our comprehensive node library',
    sections: [
      {
        title: 'Node Reference',
        items: [
          {
            title: 'Overview',
            href: '/docs/build/nodes',
            description: 'Complete guide to all 12 node types available in TopFlow',
            status: 'available',
          },
          {
            title: 'Start Node',
            href: '/docs/build/nodes/start',
            description: 'Entry point for workflow execution - where all workflows begin',
            status: 'available',
          },
          {
            title: 'Text Model',
            href: '/docs/build/nodes/text-model',
            description: 'Generate text with AI models (GPT-4, Claude, Gemini, Groq)',
            status: 'available',
          },
          {
            title: 'Image Generation',
            href: '/docs/build/nodes/image-generation',
            description: 'Generate images with AI models (Flux Pro, Flux 1.1 Pro)',
            status: 'available',
          },
          {
            title: 'Tool',
            href: '/docs/build/nodes/tool',
            description: 'Define custom functions that AI models can call dynamically',
            status: 'available',
          },
          {
            title: 'HTTP Request',
            href: '/docs/build/nodes/http-request',
            description: 'Make HTTP requests to external APIs with SSRF prevention',
            status: 'available',
          },
          {
            title: 'Conditional',
            href: '/docs/build/nodes/conditional',
            description: 'Branch workflow execution based on conditions',
            status: 'available',
          },
          {
            title: 'JavaScript',
            href: '/docs/build/nodes/javascript',
            description: 'Transform data with JavaScript (hosted service: built-in template code only)',
            status: 'available',
          },
          {
            title: 'End Node',
            href: '/docs/build/nodes/end',
            description: 'Mark the end of workflow execution and output final results',
            status: 'available',
          },
        ],
      },
      {
        title: 'Development',
        items: [
          {
            title: 'API Reference',
            href: '/docs/build/api',
            description: 'Complete API documentation for workflow execution, code export, and validation',
            status: 'available',
          },
        ],
      },
    ],
  },

  // ========================================
  // SECURITY SECTION
  // ========================================
  {
    category: 'security',
    title: 'Security',
    href: '/docs/security',
    description: 'Enterprise-grade security controls and compliance frameworks',
    sections: [
      {
        title: 'Security & Compliance',
        items: [
          {
            title: 'Overview',
            href: '/docs/security',
            description: 'Security architecture, threat model, and defense-in-depth strategy',
            status: 'available',
          },
          {
            title: 'All Validations',
            href: '/docs/security/validations',
            description: '12 security checks including SSRF prevention, cycle detection, and input sanitization',
            status: 'available',
          },
          {
            title: 'Compliance Frameworks',
            href: '/docs/security/compliance',
            description: 'GDPR, SOC 2, HIPAA considerations and industry-specific security guidance',
            status: 'available',
          },
        ],
      },
    ],
  },
]

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get all navigation items as a flat array (for search)
 * Returns items with section and category metadata attached
 */
export function getAllNavItems(): Array<UnifiedNavItem & { section: string; category: string }> {
  const items: Array<UnifiedNavItem & { section: string; category: string }> = []

  unifiedNavigation.forEach((category) => {
    category.sections.forEach((section) => {
      section.items.forEach((item) => {
        items.push({
          ...item,
          section: section.title,
          category: category.title,
        })
      })
    })
  })

  return items
}

/**
 * Get sidebar data for a specific category
 * Returns hierarchical sections for rendering in sidebar
 */
export function getSidebarData(category: 'learn' | 'build' | 'security'): NavSection[] {
  const cat = unifiedNavigation.find((c) => c.category === category)
  return cat?.sections || []
}

/**
 * Get category overview data (for main navigation and quick links)
 */
export function getCategoryOverviews(): Array<{
  title: string
  href: string
  description: string
}> {
  return unifiedNavigation.map((cat) => ({
    title: cat.title,
    href: cat.href,
    description: cat.description,
  }))
}

/**
 * Find a navigation item by href
 */
export function findNavItem(href: string): (UnifiedNavItem & { section: string; category: string }) | undefined {
  return getAllNavItems().find((item) => item.href === href)
}

/**
 * Get breadcrumb trail for a page
 * Returns: [Category, Section, Page Title]
 */
export function getBreadcrumbs(href: string): string[] {
  const item = findNavItem(href)
  if (!item) return []
  return [item.category, item.section, item.title]
}

/**
 * Get all items in a category (flat list)
 * Useful for generating sitemaps or analytics
 */
export function getCategoryItems(category: 'learn' | 'build' | 'security'): UnifiedNavItem[] {
  const cat = unifiedNavigation.find((c) => c.category === category)
  if (!cat) return []

  return cat.sections.flatMap((section) => section.items)
}

/**
 * Validate all hrefs are unique
 * Returns array of duplicate hrefs (empty if all unique)
 */
export function validateUniqueHrefs(): string[] {
  const allHrefs = getAllNavItems().map((item) => item.href)
  const duplicates = allHrefs.filter((href, index) => allHrefs.indexOf(href) !== index)
  return Array.from(new Set(duplicates))
}

/**
 * Get statistics about navigation data
 * Useful for monitoring and debugging
 */
export function getNavigationStats() {
  const allItems = getAllNavItems()
  const availableCount = allItems.filter((item) => item.status === 'available').length
  const missingCount = allItems.filter((item) => item.status === 'missing').length

  return {
    totalPages: allItems.length,
    availablePages: availableCount,
    missingPages: missingCount,
    categories: unifiedNavigation.length,
    sections: unifiedNavigation.reduce((sum, cat) => sum + cat.sections.length, 0),
    completionPercentage: Math.round((availableCount / allItems.length) * 100),
  }
}
