"use client"

import type React from "react"
import { DatabaseFreeBlogContent } from "@/components/blog/articles/why-i-built-topflow-without-a-database"
import { SecurityLayersBlogContent } from "@/components/blog/articles/five-layers-of-security-owasp-top-10"
import { GDPRComplianceBlogContent } from "@/components/blog/articles/gdpr-compliance-by-design"
import { OpenSourceSecurityContent } from "@/components/blog/articles/open-source-security-transparency"
import { CISOToFullStackContent } from "@/components/blog/articles/ciso-to-fullstack-developer"
import { SSRFPreventionContent } from "@/components/blog/articles/preventing-ssrf-attacks-ai-workflows"
import { BudgetSaaSContent } from "@/components/blog/articles/20-dollar-saas-infrastructure"
import { GDPRAutomationContent } from "@/components/blog/articles/gdpr-automation-3-minutes"
import { EncryptionBugContent } from "@/components/blog/articles/encryption-bug-aes-gcm-ephemeral-key"
import { URWContent } from "@/components/blog/articles/untrusted-reasoning-worker-llm-security"
import { NewFunctionSandboxContent } from "@/components/blog/articles/new-function-is-not-a-sandbox"

interface BlogContentProps {
  slug: string
}

export function BlogContent({ slug }: BlogContentProps) {
  const contentMap: Record<string, React.ReactNode> = {
    "why-i-built-topflow-without-a-database": <DatabaseFreeBlogContent />,
    "five-layers-of-security-owasp-top-10": <SecurityLayersBlogContent />,
    "gdpr-compliance-by-design": <GDPRComplianceBlogContent />,
    "open-source-security-transparency": <OpenSourceSecurityContent />,
    "ciso-to-fullstack-developer": <CISOToFullStackContent />,
    "preventing-ssrf-attacks-ai-workflows": <SSRFPreventionContent />,
    "20-dollar-saas-infrastructure": <BudgetSaaSContent />,
    "gdpr-automation-3-minutes": <GDPRAutomationContent />,
    "encryption-bug-aes-gcm-ephemeral-key": <EncryptionBugContent />,
    "untrusted-reasoning-worker-llm-security": <URWContent />,
    "new-function-is-not-a-sandbox": <NewFunctionSandboxContent />
  }

  const content = contentMap[slug]

  return (
    <div className="prose prose-invert max-w-none">
      {content || <div>Content coming soon...</div>}
    </div>
  )
}
