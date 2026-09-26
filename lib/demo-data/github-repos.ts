/**
 * GitHub Repository Security Scanner - Mock Data
 *
 * This file contains mock security analysis data for popular repositories
 * Used for demo mode to avoid GitHub API rate limiting
 *
 * @see /docs/repositioning-proposal/00-open-source-prep/01-github-repo-security-scanner-demo/
 */

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface Vulnerability {
  id: string
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  component: string
  description: string
  fix: string
  effort: string
}

export interface VulnerabilityBreakdown {
  critical: number
  high: number
  medium: number
  low: number
  details: Vulnerability[]
}

export interface DependencyAudit {
  total: number
  outdated: number
  vulnerable: number
  licenses: string[]
  riskBreakdown: {
    high: number
    medium: number
    low: number
  }
}

export interface CodeQuality {
  coverage: number
  complexity: "Low" | "Medium" | "High"
  documentation: number
  testRatio: number
  linesOfCode: number
  technicalDebt: string
}

export interface OwaspCompliance {
  A01_broken_access: "PASS" | "WARNING" | "FAIL"
  A02_crypto_failures: "PASS" | "WARNING" | "FAIL"
  A03_injection: "PASS" | "WARNING" | "FAIL"
  A04_insecure_design: "PASS" | "WARNING" | "FAIL"
  A05_security_misconfig: "PASS" | "WARNING" | "FAIL"
  A06_vulnerable_components: "PASS" | "WARNING" | "FAIL"
  A07_auth_failures: "PASS" | "WARNING" | "FAIL"
  A08_data_integrity: "PASS" | "WARNING" | "FAIL"
  A09_logging_failures: "PASS" | "WARNING" | "FAIL"
  A10_ssrf: "PASS" | "WARNING" | "FAIL"
}

export interface SecurityPractices {
  has_security_policy: boolean
  dependabot_enabled: boolean
  code_scanning: boolean
  secret_scanning: boolean
  branch_protection: boolean
  signed_commits: boolean
  two_factor_required: boolean
}

export interface Recommendation {
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  title: string
  description: string
  effort: string
  impact: string
}

export interface ShareData {
  tweetText: string
  linkedInTitle: string
  linkedInSummary: string
  ogImage: string
}

export interface RepoAnalysis {
  // Basic Metadata
  repository: string
  stars: number
  forks: number
  language: string
  lastAnalyzed: string

  // Security Score
  securityScore: number
  grade: string

  // Vulnerability Details
  vulnerabilities: VulnerabilityBreakdown

  // Dependency Audit
  dependencyAudit: DependencyAudit

  // Code Quality Metrics
  codeQuality: CodeQuality

  // OWASP Top 10 Compliance
  owaspCompliance: OwaspCompliance

  // Security Best Practices
  securityPractices: SecurityPractices

  // Visual Assets
  threatMapImage?: string

  // Recommendations
  recommendations: Recommendation[]

  // Share Configuration
  shareData: ShareData
}

// ============================================================================
// Mock Repository Data (7 MVP Repositories)
// ============================================================================

export const MOCK_REPO_ANALYSIS: Record<string, RepoAnalysis> = {
  "facebook/react": {
    repository: "facebook/react",
    stars: 242192,
    forks: 50363,
    language: "JavaScript",
    lastAnalyzed: new Date().toISOString(),

    securityScore: 95,
    grade: "A+",

    vulnerabilities: {
      critical: 0,
      high: 1,
      medium: 3,
      low: 7,
      details: [
        {
          id: "CVE-2024-1234",
          severity: "HIGH",
          component: "webpack-dev-server",
          description: "Prototype pollution vulnerability in development server",
          fix: "Update webpack-dev-server to version 4.15.2 or higher",
          effort: "5 minutes"
        },
        {
          id: "SNYK-JS-2024-5678",
          severity: "MEDIUM",
          component: "jest",
          description: "Regular expression denial of service (ReDoS) in test runner",
          fix: "Update jest to version 29.7.1",
          effort: "10 minutes"
        },
        {
          id: "GHSA-2024-9012",
          severity: "MEDIUM",
          component: "eslint-plugin-react",
          description: "Insecure default configuration in linting rules",
          fix: "Update configuration to enable recommended rules",
          effort: "15 minutes"
        }
      ]
    },

    dependencyAudit: {
      total: 1247,
      outdated: 89,
      vulnerable: 2,
      licenses: ["MIT", "Apache-2.0", "BSD-3-Clause"],
      riskBreakdown: {
        high: 2,
        medium: 15,
        low: 72
      }
    },

    codeQuality: {
      coverage: 87,
      complexity: "Low",
      documentation: 92,
      testRatio: 1.3,
      linesOfCode: 156789,
      technicalDebt: "2.3 days"
    },

    owaspCompliance: {
      A01_broken_access: "PASS",
      A02_crypto_failures: "PASS",
      A03_injection: "PASS",
      A04_insecure_design: "WARNING",
      A05_security_misconfig: "PASS",
      A06_vulnerable_components: "WARNING",
      A07_auth_failures: "PASS",
      A08_data_integrity: "PASS",
      A09_logging_failures: "WARNING",
      A10_ssrf: "PASS"
    },

    securityPractices: {
      has_security_policy: true,
      dependabot_enabled: true,
      code_scanning: true,
      secret_scanning: true,
      branch_protection: true,
      signed_commits: false,
      two_factor_required: true
    },

    recommendations: [
      {
        priority: "HIGH",
        title: "Update webpack-dev-server to patch prototype pollution",
        description: "Critical security patch available for webpack-dev-server addressing CVE-2024-1234",
        effort: "5 minutes",
        impact: "+3 security score"
      },
      {
        priority: "MEDIUM",
        title: "Enable commit signing for enhanced code integrity",
        description: "GPG-signed commits prevent impersonation and ensure code authenticity",
        effort: "30 minutes",
        impact: "+2 security score"
      },
      {
        priority: "LOW",
        title: "Add SAST scanning to CI/CD pipeline",
        description: "Automated static analysis catches vulnerabilities before production",
        effort: "2 hours",
        impact: "+1 security score"
      }
    ],

    shareData: {
      tweetText: "🔒 facebook/react scored 95/100 (A+) on @TopFlowAI security scanner! Excellent security posture with minimal vulnerabilities.",
      linkedInTitle: "React Repository Security Analysis - Grade A+",
      linkedInSummary: "Comprehensive security audit of facebook/react reveals excellent security practices with 95/100 score",
      ogImage: "/api/og/github-scanner/facebook-react"
    }
  },

  "nodejs/node": {
    repository: "nodejs/node",
    stars: 115156,
    forks: 31328,
    language: "JavaScript",
    lastAnalyzed: new Date().toISOString(),

    securityScore: 95,
    grade: "A+",

    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 2,
      low: 5,
      details: [
        {
          id: "CVE-2024-3456",
          severity: "MEDIUM",
          component: "openssl",
          description: "Moderate severity issue in OpenSSL dependency",
          fix: "Update to Node.js v20.11.0 which includes OpenSSL 3.0.13",
          effort: "Coordinated release"
        },
        {
          id: "GHSA-2024-7890",
          severity: "MEDIUM",
          component: "npm",
          description: "Package confusion vulnerability in npm registry",
          fix: "Update npm to version 10.4.0 or higher",
          effort: "10 minutes"
        }
      ]
    },

    dependencyAudit: {
      total: 892,
      outdated: 43,
      vulnerable: 1,
      licenses: ["MIT", "ISC", "Apache-2.0"],
      riskBreakdown: {
        high: 0,
        medium: 8,
        low: 35
      }
    },

    codeQuality: {
      coverage: 91,
      complexity: "Low",
      documentation: 95,
      testRatio: 1.8,
      linesOfCode: 1245678,
      technicalDebt: "1.2 days"
    },

    owaspCompliance: {
      A01_broken_access: "PASS",
      A02_crypto_failures: "PASS",
      A03_injection: "PASS",
      A04_insecure_design: "PASS",
      A05_security_misconfig: "PASS",
      A06_vulnerable_components: "WARNING",
      A07_auth_failures: "PASS",
      A08_data_integrity: "PASS",
      A09_logging_failures: "PASS",
      A10_ssrf: "PASS"
    },

    securityPractices: {
      has_security_policy: true,
      dependabot_enabled: true,
      code_scanning: true,
      secret_scanning: true,
      branch_protection: true,
      signed_commits: true,
      two_factor_required: true
    },

    recommendations: [
      {
        priority: "MEDIUM",
        title: "Monitor OpenSSL security advisories",
        description: "Stay informed about OpenSSL vulnerabilities affecting Node.js",
        effort: "Ongoing",
        impact: "Proactive security"
      },
      {
        priority: "LOW",
        title: "Expand fuzzing test coverage",
        description: "Increase fuzzing to discover edge cases in core modules",
        effort: "4 hours",
        impact: "+1 security score"
      },
      {
        priority: "LOW",
        title: "Document security release process",
        description: "Enhance transparency of coordinated vulnerability disclosure",
        effort: "2 hours",
        impact: "Improved trust"
      }
    ],

    shareData: {
      tweetText: "🔒 nodejs/node scored 95/100 (A+) on @TopFlowAI security scanner! Gold standard for runtime security.",
      linkedInTitle: "Node.js Repository Security Analysis - Grade A+",
      linkedInSummary: "Node.js demonstrates exceptional security practices with 95/100 score and comprehensive vulnerability management",
      ogImage: "/api/og/github-scanner/nodejs-node"
    }
  },

  "django/django": {
    repository: "django/django",
    stars: 86438,
    forks: 35729,
    language: "Python",
    lastAnalyzed: new Date().toISOString(),

    securityScore: 85,
    grade: "B+",

    vulnerabilities: {
      critical: 0,
      high: 2,
      medium: 8,
      low: 15,
      details: [
        {
          id: "CVE-2024-4567",
          severity: "HIGH",
          component: "django.contrib.sessions",
          description: "Session fixation vulnerability in session middleware",
          fix: "Upgrade to Django 5.0.2 or 4.2.10",
          effort: "15 minutes"
        },
        {
          id: "CVE-2024-8901",
          severity: "HIGH",
          component: "django.db.models",
          description: "SQL injection via raw query parameters",
          fix: "Use parameterized queries, upgrade to latest patch",
          effort: "30 minutes"
        }
      ]
    },

    dependencyAudit: {
      total: 456,
      outdated: 67,
      vulnerable: 3,
      licenses: ["BSD-3-Clause", "MIT"],
      riskBreakdown: {
        high: 3,
        medium: 22,
        low: 42
      }
    },

    codeQuality: {
      coverage: 92,
      complexity: "Medium",
      documentation: 88,
      testRatio: 2.1,
      linesOfCode: 387654,
      technicalDebt: "4.1 days"
    },

    owaspCompliance: {
      A01_broken_access: "PASS",
      A02_crypto_failures: "PASS",
      A03_injection: "WARNING",
      A04_insecure_design: "PASS",
      A05_security_misconfig: "WARNING",
      A06_vulnerable_components: "WARNING",
      A07_auth_failures: "PASS",
      A08_data_integrity: "PASS",
      A09_logging_failures: "PASS",
      A10_ssrf: "PASS"
    },

    securityPractices: {
      has_security_policy: true,
      dependabot_enabled: false,
      code_scanning: true,
      secret_scanning: false,
      branch_protection: true,
      signed_commits: false,
      two_factor_required: false
    },

    recommendations: [
      {
        priority: "HIGH",
        title: "Upgrade to Django 5.0.2 or 4.2.10 immediately",
        description: "Critical security patches available for session fixation and SQL injection",
        effort: "15 minutes",
        impact: "+5 security score"
      },
      {
        priority: "HIGH",
        title: "Enable Dependabot for automated dependency updates",
        description: "Automated dependency scanning catches vulnerabilities early",
        effort: "10 minutes",
        impact: "+3 security score"
      },
      {
        priority: "MEDIUM",
        title: "Enable secret scanning on repository",
        description: "Prevent accidental credential commits to public repository",
        effort: "5 minutes",
        impact: "+2 security score"
      }
    ],

    shareData: {
      tweetText: "🔒 django/django scored 85/100 (B+) on @TopFlowAI security scanner. Solid security with room for improvement.",
      linkedInTitle: "Django Repository Security Analysis - Grade B+",
      linkedInSummary: "Django framework shows strong security fundamentals with 85/100 score, recommended security enhancements identified",
      ogImage: "/api/og/github-scanner/django-django"
    }
  },

  "OWASP/owasp-mastg": {
    repository: "OWASP/owasp-mastg",
    stars: 12653,
    forks: 2789,
    language: "Python",
    lastAnalyzed: new Date().toISOString(),

    securityScore: 85,
    grade: "B+",

    vulnerabilities: {
      critical: 0,
      high: 1,
      medium: 6,
      low: 12,
      details: [
        {
          id: "SNYK-PY-2024-1234",
          severity: "HIGH",
          component: "mkdocs-material",
          description: "XSS vulnerability in documentation theme",
          fix: "Update mkdocs-material to version 9.5.10",
          effort: "10 minutes"
        },
        {
          id: "GHSA-2024-5678",
          severity: "MEDIUM",
          component: "pillow",
          description: "Image processing vulnerability in PIL library",
          fix: "Update Pillow to version 10.2.0",
          effort: "5 minutes"
        }
      ]
    },

    dependencyAudit: {
      total: 234,
      outdated: 45,
      vulnerable: 2,
      licenses: ["CC-BY-SA-4.0", "MIT"],
      riskBreakdown: {
        high: 1,
        medium: 18,
        low: 26
      }
    },

    codeQuality: {
      coverage: 78,
      complexity: "Low",
      documentation: 98,
      testRatio: 0.8,
      linesOfCode: 45678,
      technicalDebt: "1.5 days"
    },

    owaspCompliance: {
      A01_broken_access: "PASS",
      A02_crypto_failures: "PASS",
      A03_injection: "PASS",
      A04_insecure_design: "PASS",
      A05_security_misconfig: "WARNING",
      A06_vulnerable_components: "WARNING",
      A07_auth_failures: "PASS",
      A08_data_integrity: "PASS",
      A09_logging_failures: "PASS",
      A10_ssrf: "PASS"
    },

    securityPractices: {
      has_security_policy: true,
      dependabot_enabled: false,
      code_scanning: false,
      secret_scanning: false,
      branch_protection: true,
      signed_commits: false,
      two_factor_required: false
    },

    recommendations: [
      {
        priority: "HIGH",
        title: "Update mkdocs-material to patch XSS vulnerability",
        description: "Documentation site vulnerable to cross-site scripting attacks",
        effort: "10 minutes",
        impact: "+4 security score"
      },
      {
        priority: "MEDIUM",
        title: "Enable GitHub code scanning",
        description: "Automated security analysis for pull requests",
        effort: "15 minutes",
        impact: "+3 security score"
      },
      {
        priority: "MEDIUM",
        title: "Enable Dependabot security updates",
        description: "Automated alerts and PRs for vulnerable dependencies",
        effort: "5 minutes",
        impact: "+3 security score"
      }
    ],

    shareData: {
      tweetText: "🔒 OWASP/owasp-mastg scored 85/100 (B+) on @TopFlowAI security scanner. Security guidance project maintains good security.",
      linkedInTitle: "OWASP MASTG Repository Security Analysis - Grade B+",
      linkedInSummary: "OWASP Mobile Application Security Testing Guide repository scores 85/100 with strong documentation practices",
      ogImage: "/api/og/github-scanner/owasp-mastg"
    }
  },

  "vuejs/vue": {
    repository: "vuejs/vue",
    stars: 209838,
    forks: 34156,
    language: "TypeScript",
    lastAnalyzed: new Date().toISOString(),

    securityScore: 70,
    grade: "B",

    vulnerabilities: {
      critical: 1,
      high: 4,
      medium: 12,
      low: 23,
      details: [
        {
          id: "CVE-2024-2345",
          severity: "CRITICAL",
          component: "vue-router",
          description: "Open redirect vulnerability in router navigation guards",
          fix: "Upgrade vue-router to version 4.2.5",
          effort: "20 minutes"
        },
        {
          id: "CVE-2024-6789",
          severity: "HIGH",
          component: "vue",
          description: "XSS vulnerability in template compiler",
          fix: "Upgrade to Vue 3.4.15",
          effort: "30 minutes"
        },
        {
          id: "SNYK-JS-2024-9012",
          severity: "HIGH",
          component: "vite",
          description: "Arbitrary file read via malicious Vite plugin",
          fix: "Update Vite to version 5.0.12",
          effort: "15 minutes"
        }
      ]
    },

    dependencyAudit: {
      total: 1456,
      outdated: 234,
      vulnerable: 8,
      licenses: ["MIT", "Apache-2.0", "ISC"],
      riskBreakdown: {
        high: 8,
        medium: 67,
        low: 159
      }
    },

    codeQuality: {
      coverage: 83,
      complexity: "Medium",
      documentation: 85,
      testRatio: 1.1,
      linesOfCode: 234567,
      technicalDebt: "6.7 days"
    },

    owaspCompliance: {
      A01_broken_access: "WARNING",
      A02_crypto_failures: "PASS",
      A03_injection: "FAIL",
      A04_insecure_design: "WARNING",
      A05_security_misconfig: "WARNING",
      A06_vulnerable_components: "FAIL",
      A07_auth_failures: "PASS",
      A08_data_integrity: "WARNING",
      A09_logging_failures: "PASS",
      A10_ssrf: "WARNING"
    },

    securityPractices: {
      has_security_policy: false,
      dependabot_enabled: false,
      code_scanning: false,
      secret_scanning: false,
      branch_protection: true,
      signed_commits: false,
      two_factor_required: false
    },

    recommendations: [
      {
        priority: "HIGH",
        title: "Immediately patch critical open redirect vulnerability",
        description: "CVE-2024-2345 allows attackers to redirect users to malicious sites",
        effort: "20 minutes",
        impact: "+10 security score"
      },
      {
        priority: "HIGH",
        title: "Update Vue core to patch XSS vulnerability",
        description: "Template compiler XSS allows arbitrary code execution",
        effort: "30 minutes",
        impact: "+8 security score"
      },
      {
        priority: "HIGH",
        title: "Create SECURITY.md with vulnerability disclosure policy",
        description: "Establish clear process for reporting security issues",
        effort: "45 minutes",
        impact: "+5 security score"
      }
    ],

    shareData: {
      tweetText: "🔒 vuejs/vue scored 70/100 (B) on @TopFlowAI security scanner. Critical updates needed for production safety.",
      linkedInTitle: "Vue.js Repository Security Analysis - Grade B",
      linkedInSummary: "Vue.js framework scores 70/100 with critical security updates recommended before production use",
      ogImage: "/api/og/github-scanner/vuejs-vue"
    }
  },

  "vercel/next.js": {
    repository: "vercel/next.js",
    stars: 137100,
    forks: 28943,
    language: "TypeScript",
    lastAnalyzed: new Date().toISOString(),

    securityScore: 65,
    grade: "C+",

    vulnerabilities: {
      critical: 2,
      high: 8,
      medium: 18,
      low: 34,
      details: [
        {
          id: "CVE-2024-3456",
          severity: "CRITICAL",
          component: "next/server",
          description: "Server-side request forgery (SSRF) in image optimization API",
          fix: "Upgrade to Next.js 14.1.0",
          effort: "10 minutes"
        },
        {
          id: "CVE-2024-7890",
          severity: "CRITICAL",
          component: "next/middleware",
          description: "Authentication bypass in middleware edge runtime",
          fix: "Upgrade to Next.js 14.1.0 and review middleware",
          effort: "1 hour"
        },
        {
          id: "GHSA-2024-1234",
          severity: "HIGH",
          component: "webpack",
          description: "Arbitrary code execution via malicious webpack plugin",
          fix: "Update webpack to version 5.90.0",
          effort: "15 minutes"
        }
      ]
    },

    dependencyAudit: {
      total: 2134,
      outdated: 456,
      vulnerable: 15,
      licenses: ["MIT", "Apache-2.0", "BSD-3-Clause", "ISC"],
      riskBreakdown: {
        high: 15,
        medium: 123,
        low: 318
      }
    },

    codeQuality: {
      coverage: 76,
      complexity: "High",
      documentation: 79,
      testRatio: 0.9,
      linesOfCode: 567890,
      technicalDebt: "12.4 days"
    },

    owaspCompliance: {
      A01_broken_access: "FAIL",
      A02_crypto_failures: "WARNING",
      A03_injection: "WARNING",
      A04_insecure_design: "FAIL",
      A05_security_misconfig: "FAIL",
      A06_vulnerable_components: "FAIL",
      A07_auth_failures: "FAIL",
      A08_data_integrity: "WARNING",
      A09_logging_failures: "PASS",
      A10_ssrf: "FAIL"
    },

    securityPractices: {
      has_security_policy: false,
      dependabot_enabled: false,
      code_scanning: false,
      secret_scanning: false,
      branch_protection: true,
      signed_commits: false,
      two_factor_required: false
    },

    recommendations: [
      {
        priority: "HIGH",
        title: "URGENT: Upgrade to Next.js 14.1.0 to patch SSRF and auth bypass",
        description: "Two critical vulnerabilities allow remote code execution and authentication bypass",
        effort: "1 hour",
        impact: "+15 security score"
      },
      {
        priority: "HIGH",
        title: "Enable GitHub security features (Dependabot, code scanning, secret scanning)",
        description: "Automated security tooling prevents vulnerabilities from reaching production",
        effort: "30 minutes",
        impact: "+10 security score"
      },
      {
        priority: "HIGH",
        title: "Create comprehensive SECURITY.md",
        description: "Document security policies, vulnerability disclosure, and security guarantees",
        effort: "2 hours",
        impact: "+5 security score"
      }
    ],

    shareData: {
      tweetText: "⚠️ vercel/next.js scored 65/100 (C+) on @TopFlowAI security scanner. Critical security updates required.",
      linkedInTitle: "Next.js Repository Security Analysis - Grade C+",
      linkedInSummary: "Next.js framework scores 65/100 with critical SSRF and authentication vulnerabilities requiring immediate attention",
      ogImage: "/api/og/github-scanner/vercel-nextjs"
    }
  },

  "aquasecurity/trivy": {
    repository: "aquasecurity/trivy",
    stars: 25134,
    forks: 2567,
    language: "Go",
    lastAnalyzed: new Date().toISOString(),

    securityScore: 90,
    grade: "A",

    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 4,
      low: 9,
      details: [
        {
          id: "CVE-2024-5678",
          severity: "MEDIUM",
          component: "github.com/docker/docker",
          description: "Container escape via malicious image layer",
          fix: "Update Docker library to v24.0.9",
          effort: "15 minutes"
        },
        {
          id: "GHSA-2024-9012",
          severity: "MEDIUM",
          component: "golang.org/x/net",
          description: "HTTP/2 rapid reset vulnerability",
          fix: "Update golang.org/x/net to v0.20.0",
          effort: "10 minutes"
        }
      ]
    },

    dependencyAudit: {
      total: 678,
      outdated: 54,
      vulnerable: 2,
      licenses: ["Apache-2.0", "MIT", "BSD-3-Clause"],
      riskBreakdown: {
        high: 0,
        medium: 12,
        low: 42
      }
    },

    codeQuality: {
      coverage: 85,
      complexity: "Medium",
      documentation: 88,
      testRatio: 1.5,
      linesOfCode: 123456,
      technicalDebt: "3.2 days"
    },

    owaspCompliance: {
      A01_broken_access: "PASS",
      A02_crypto_failures: "PASS",
      A03_injection: "PASS",
      A04_insecure_design: "PASS",
      A05_security_misconfig: "WARNING",
      A06_vulnerable_components: "WARNING",
      A07_auth_failures: "PASS",
      A08_data_integrity: "PASS",
      A09_logging_failures: "PASS",
      A10_ssrf: "PASS"
    },

    securityPractices: {
      has_security_policy: true,
      dependabot_enabled: true,
      code_scanning: true,
      secret_scanning: true,
      branch_protection: true,
      signed_commits: false,
      two_factor_required: true
    },

    recommendations: [
      {
        priority: "MEDIUM",
        title: "Update Docker and golang.org/x/net dependencies",
        description: "Address container escape and HTTP/2 vulnerabilities",
        effort: "25 minutes",
        impact: "+3 security score"
      },
      {
        priority: "LOW",
        title: "Enable commit signing for release branches",
        description: "GPG-signed commits ensure artifact integrity",
        effort: "45 minutes",
        impact: "+2 security score"
      },
      {
        priority: "LOW",
        title: "Expand SBOM generation for all releases",
        description: "Software Bill of Materials improves supply chain transparency",
        effort: "2 hours",
        impact: "+1 security score"
      }
    ],

    shareData: {
      tweetText: "🔒 aquasecurity/trivy scored 90/100 (A) on @TopFlowAI security scanner! Excellent security for a security tool.",
      linkedInTitle: "Trivy Repository Security Analysis - Grade A",
      linkedInSummary: "Aqua Security's Trivy vulnerability scanner demonstrates strong security practices with 90/100 score",
      ogImage: "/api/og/github-scanner/aquasecurity-trivy"
    }
  },

  "request/request": {
    repository: "request/request",
    stars: 25600,
    forks: 3100,
    language: "JavaScript",
    lastAnalyzed: new Date().toISOString(),

    securityScore: 30,
    grade: "D",

    vulnerabilities: {
      critical: 2,
      high: 5,
      medium: 12,
      low: 20,
      details: [
        {
          id: "CVE-2023-28155",
          severity: "CRITICAL",
          component: "request@2.88.2",
          description: "SSRF vulnerability allows arbitrary HTTP requests via redirect following",
          fix: "Migrate to 'got', 'axios', or 'node-fetch' (request is deprecated)",
          effort: "4-8 hours"
        },
        {
          id: "CVE-2023-26136",
          severity: "CRITICAL",
          component: "tough-cookie (dependency)",
          description: "Prototype pollution via Cookie header parsing",
          fix: "No fix available - request is deprecated since 2020",
          effort: "N/A - requires migration"
        },
        {
          id: "CVE-2022-24999",
          severity: "HIGH",
          component: "qs (dependency)",
          description: "Prototype pollution via querystring parsing",
          fix: "Migrate to modern HTTP client with updated dependencies",
          effort: "6-8 hours"
        },
        {
          id: "GHSA-2024-xxxx",
          severity: "HIGH",
          component: "tunnel-agent (dependency)",
          description: "Unpatched vulnerabilities in proxy tunneling",
          fix: "Switch to actively maintained HTTP client",
          effort: "4-6 hours"
        },
        {
          id: "SNYK-JS-REQUEST-2024",
          severity: "HIGH",
          component: "request@2.88.2",
          description: "Multiple unpatched security issues due to deprecation",
          fix: "Complete migration to 'got' or 'axios'",
          effort: "8-12 hours"
        }
      ]
    },

    dependencyAudit: {
      total: 52,
      outdated: 18,
      vulnerable: 8,
      licenses: ["Apache-2.0", "ISC", "MIT"],
      riskBreakdown: {
        high: 8,
        medium: 22,
        low: 16
      }
    },

    codeQuality: {
      coverage: 82,
      complexity: "Medium",
      documentation: 75,
      testRatio: 1.8,
      linesOfCode: 12345,
      technicalDebt: "8.5 days"
    },

    owaspCompliance: {
      A01_broken_access: "FAIL",
      A02_crypto_failures: "WARNING",
      A03_injection: "WARNING",
      A04_insecure_design: "WARNING",
      A05_security_misconfig: "WARNING",
      A06_vulnerable_components: "FAIL",
      A07_auth_failures: "PASS",
      A08_data_integrity: "WARNING",
      A09_logging_failures: "PASS",
      A10_ssrf: "FAIL"
    },

    securityPractices: {
      has_security_policy: true,
      dependabot_enabled: false,
      code_scanning: false,
      secret_scanning: false,
      branch_protection: false,
      signed_commits: false,
      two_factor_required: false
    },

    recommendations: [
      {
        priority: "CRITICAL",
        title: "Migrate away from 'request' immediately",
        description: "The 'request' library has been deprecated since 2020 and contains multiple unpatched critical vulnerabilities. Migrate to 'got' (recommended), 'axios', or 'node-fetch' for continued security support.",
        effort: "8-12 hours",
        impact: "Eliminates all current vulnerabilities"
      },
      {
        priority: "HIGH",
        title: "Update all dependencies to actively maintained versions",
        description: "Many dependencies (tough-cookie, qs, tunnel-agent) are outdated or unmaintained. Modern HTTP clients include updated, secure dependencies.",
        effort: "Included in migration",
        impact: "+25 security score"
      },
      {
        priority: "HIGH",
        title: "Enable Dependabot and automated security scanning",
        description: "Once migrated to a maintained library, enable GitHub's automated security features to prevent future vulnerabilities.",
        effort: "15 minutes",
        impact: "+10 security score"
      },
      {
        priority: "MEDIUM",
        title: "Implement branch protection and code review requirements",
        description: "Protect main branch to prevent direct pushes and require peer review for all changes.",
        effort: "30 minutes",
        impact: "+5 security score"
      }
    ],

    shareData: {
      tweetText: "⚠️ request/request scored 30/100 (D) on @TopFlowAI security scanner. DEPRECATED - migrate to modern alternatives immediately!",
      linkedInTitle: "Request Library Security Analysis - Grade D (DEPRECATED)",
      linkedInSummary: "The deprecated 'request' npm library shows critical security vulnerabilities with 30/100 score. Migration to actively maintained alternatives is strongly recommended.",
      ogImage: "/api/og/github-scanner/request-request"
    }
  }
}

// ============================================================================
// Fallback Generation for Unknown Repositories
// ============================================================================

/**
 * Generate consistent hash code from string
 * Used for deterministic random generation
 */
function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

/**
 * Convert score to letter grade
 */
function getGrade(score: number): string {
  if (score >= 95) return "A+"
  if (score >= 90) return "A"
  if (score >= 85) return "A-"
  if (score >= 80) return "B+"
  if (score >= 70) return "B"
  if (score >= 60) return "C+"
  if (score >= 50) return "C"
  return "D"
}

/**
 * Generate vulnerability breakdown from seed
 */
function generateVulnerabilities(seed: number): VulnerabilityBreakdown {
  const critical = seed % 2
  const high = (seed % 4) + 1
  const medium = (seed % 8) + 3
  const low = (seed % 12) + 5

  return {
    critical,
    high,
    medium,
    low,
    details: [
      {
        id: `CVE-2024-${(seed % 9000) + 1000}`,
        severity: high > 2 ? "HIGH" : "MEDIUM",
        component: ["webpack", "vite", "babel", "eslint"][seed % 4],
        description: "Security vulnerability detected in dependency",
        fix: "Update to latest version",
        effort: ["5 minutes", "15 minutes", "30 minutes", "1 hour"][seed % 4]
      }
    ]
  }
}

/**
 * Generate recommendations based on score
 */
function generateRecommendations(score: number): Recommendation[] {
  const recommendations: Recommendation[] = []

  if (score < 90) {
    recommendations.push({
      priority: "HIGH",
      title: "Update vulnerable dependencies",
      description: "Several outdated packages have known security issues",
      effort: "30 minutes",
      impact: "+5 security score"
    })
  }

  if (score < 80) {
    recommendations.push({
      priority: "HIGH",
      title: "Enable GitHub security features",
      description: "Activate Dependabot, code scanning, and secret scanning",
      effort: "15 minutes",
      impact: "+8 security score"
    })
  }

  recommendations.push({
    priority: "MEDIUM",
    title: "Add SECURITY.md policy",
    description: "Document vulnerability disclosure process",
    effort: "1 hour",
    impact: "+3 security score"
  })

  return recommendations
}

/**
 * Generate dynamic analysis for unknown repositories
 * Produces consistent results based on repository name
 */
export function generateDynamicAnalysis(repoPath: string): RepoAnalysis {
  const seed = hashCode(repoPath)
  const baseScore = 65 + (seed % 30) // 65-94 range

  const [owner, repo] = repoPath.split("/")

  return {
    repository: repoPath,
    stars: (seed % 50000) + 1000,
    forks: (seed % 10000) + 100,
    language: ["JavaScript", "TypeScript", "Python", "Go", "Rust"][seed % 5],
    lastAnalyzed: new Date().toISOString(),

    securityScore: baseScore,
    grade: getGrade(baseScore),

    vulnerabilities: generateVulnerabilities(seed),

    dependencyAudit: {
      total: (seed % 1000) + 100,
      outdated: (seed % 200) + 20,
      vulnerable: (seed % 10) + 1,
      licenses: ["MIT", "Apache-2.0", "BSD-3-Clause"],
      riskBreakdown: {
        high: seed % 5,
        medium: (seed % 20) + 5,
        low: (seed % 50) + 10
      }
    },

    codeQuality: {
      coverage: (seed % 30) + 70,
      complexity: (["Low", "Medium", "High"] as const)[seed % 3],
      documentation: (seed % 20) + 75,
      testRatio: 0.5 + (seed % 15) / 10,
      linesOfCode: (seed % 500000) + 50000,
      technicalDebt: `${((seed % 10) + 1).toFixed(1)} days`
    },

    owaspCompliance: {
      A01_broken_access: seed % 3 === 0 ? "WARNING" : "PASS",
      A02_crypto_failures: "PASS",
      A03_injection: seed % 4 === 0 ? "WARNING" : "PASS",
      A04_insecure_design: "PASS",
      A05_security_misconfig: seed % 5 === 0 ? "WARNING" : "PASS",
      A06_vulnerable_components: seed % 3 === 0 ? "WARNING" : "PASS",
      A07_auth_failures: "PASS",
      A08_data_integrity: "PASS",
      A09_logging_failures: "PASS",
      A10_ssrf: "PASS"
    },

    securityPractices: {
      has_security_policy: seed % 2 === 0,
      dependabot_enabled: seed % 3 === 0,
      code_scanning: seed % 2 === 0,
      secret_scanning: seed % 3 === 0,
      branch_protection: true,
      signed_commits: seed % 4 === 0,
      two_factor_required: seed % 2 === 0
    },

    recommendations: generateRecommendations(baseScore),

    shareData: {
      tweetText: `🔒 ${repoPath} scored ${baseScore}/100 (${getGrade(baseScore)}) on @TopFlowAI security scanner!`,
      linkedInTitle: `${repo} Repository Security Analysis - Grade ${getGrade(baseScore)}`,
      linkedInSummary: `Security audit of ${repoPath} reveals ${getGrade(baseScore)} grade with ${baseScore}/100 score`,
      ogImage: `/api/og/github-scanner/${owner}-${repo}`
    }
  }
}

// ============================================================================
// Helper: Get repository analysis (pre-loaded or dynamic)
// ============================================================================

export function getRepoAnalysis(repoPath: string): RepoAnalysis {
  // Check if we have pre-loaded data (8 repositories)
  if (MOCK_REPO_ANALYSIS[repoPath]) {
    return MOCK_REPO_ANALYSIS[repoPath]
  }

  // Unknown repo in demo mode: return default (facebook/react).
  // (Don't log repoPath — it is user input; see execute-workflow log-privacy test.)
  console.log('[Demo Data] Unknown repo in demo mode - using default: facebook/react')
  return MOCK_REPO_ANALYSIS["facebook/react"]
}
