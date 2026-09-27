export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content?: string
  publishedAt: string
  /**
   * Set when a published post is materially revised (e.g. a correction). Drives the visible
   * "Updated" line, JSON-LD dateModified, OpenGraph modifiedTime and the sitemap lastModified.
   * Pair every revision with an in-article note saying what changed.
   */
  updatedAt?: string
  readTime: string
  category: "Security" | "Workflows" | "Architecture" | "Compliance"
  author: {
    name: string
    title: string
    email: string
    twitter: string
    linkedin: string
    website: string
  }
  seo: {
    description: string
    keywords: string[]
  }
}

const authorCharlie = {
  name: "Charlie Su",
  title: "Former CISO & TopFlow Creator",
  email: "cssu@upenn.edu",
  twitter: "@charliesu_ai",
  linkedin: "charliesu-ai",
  website: "https://charliesu.com",
}

export const blogPosts: BlogPost[] = [
  {
    slug: "why-i-built-topflow-without-a-database",
    title: "Why I Built an AI App Without a Database (And You Might Too)",
    excerpt:
      "Most SaaS apps default to storing user data. TopFlow takes the opposite approach: zero server-side data storage. Here's why this privacy-first architecture matters.",
    publishedAt: "September 30, 2025",
    updatedAt: "June 17, 2026",
    readTime: "3 min read",
    category: "Architecture",
    author: authorCharlie,
    seo: {
      description:
        "Learn why TopFlow uses a privacy-first, database-free architecture and how it achieves GDPR compliance by design.",
      keywords: [
        "privacy-first architecture",
        "GDPR compliance",
        "no database SaaS",
        "stateless application",
        "AI security",
      ],
    },
  },
  {
    slug: "five-layers-of-security-owasp-top-10",
    title: "5 Layers of Security: How TopFlow Mitigates OWASP Top 10",
    excerpt:
      "As a former CISO, I don't just talk about security—I implement it. Here's TopFlow's 5-layer defense-in-depth model, how it maps to the OWASP Top 10 (2021), and the gaps that remain.",
    publishedAt: "October 14, 2025",
    updatedAt: "June 17, 2026",
    readTime: "5 min read",
    category: "Security",
    author: authorCharlie,
    seo: {
      description: "Deep dive into TopFlow's 5-layer security architecture and OWASP Top 10 mitigation strategies.",
      keywords: [
        "OWASP Top 10",
        "defense-in-depth",
        "SSRF prevention",
        "security architecture",
        "web application security",
      ],
    },
  },
  {
    slug: "gdpr-compliance-by-design",
    title: "GDPR Compliance by Design: The No-Database Approach",
    excerpt:
      "Most companies struggle with GDPR compliance. TopFlow is compliant by design—because it doesn't store any user data on servers. Here's how this radical approach works.",
    publishedAt: "October 28, 2025",
    updatedAt: "June 17, 2026",
    readTime: "2 min read",
    category: "Compliance",
    author: authorCharlie,
    seo: {
      description:
        "How TopFlow achieves GDPR compliance through privacy-first architecture without traditional database storage.",
      keywords: [
        "GDPR compliance",
        "privacy by design",
        "data minimization",
        "compliance automation",
        "GDPR Article 5",
      ],
    },
  },
  {
    slug: "open-source-security-transparency",
    title: "Open Source Security: Why I'm Sharing TopFlow's Architecture",
    excerpt:
      "TopFlow's entire architecture documentation is public. Here's why transparency makes security stronger, not weaker—and how it demonstrates real expertise.",
    publishedAt: "November 11, 2025",
    updatedAt: "June 17, 2026",
    readTime: "1 min read",
    category: "Security",
    author: authorCharlie,
    seo: {
      description:
        "Why open source security through transparency enables peer review and builds trust in production applications.",
      keywords: [
        "open source security",
        "security transparency",
        "public security documentation",
        "security by design",
        "peer review",
      ],
    },
  },
  {
    slug: "ciso-to-fullstack-developer",
    title: "From CISO to Full-Stack Developer: Building TopFlow in 4 Weeks",
    excerpt:
      "After 15 years in security leadership, I built a production AI workflow tool from scratch. Here's what I learned transitioning from strategic security to hands-on development.",
    publishedAt: "November 25, 2025",
    readTime: "8 min read",
    category: "Architecture",
    author: authorCharlie,
    seo: {
      description:
        "A former CISO's journey building a full-stack AI application, combining security expertise with modern development practices.",
      keywords: [
        "CISO developer",
        "security engineering",
        "career transition",
        "full-stack security",
        "security leadership",
      ],
    },
  },
  {
    slug: "preventing-ssrf-attacks-ai-workflows",
    title: "Preventing SSRF Attacks in AI Agent Workflows",
    excerpt:
      "AI agent builders that allow HTTP requests are vulnerable to SSRF attacks. Here's how TopFlow prevents them with URL validation, private IP blocking, and allowlist enforcement.",
    publishedAt: "December 9, 2025",
    updatedAt: "June 17, 2026",
    readTime: "4 min read",
    category: "Security",
    author: authorCharlie,
    seo: {
      description:
        "Learn how to prevent Server-Side Request Forgery (SSRF) attacks in AI agent workflows with practical implementation examples.",
      keywords: [
        "SSRF prevention",
        "server-side request forgery",
        "AI security",
        "URL validation",
        "cloud metadata protection",
      ],
    },
  },
  {
    slug: "20-dollar-saas-infrastructure",
    title: "The $20/Month SaaS: How I Built TopFlow on a Budget",
    excerpt:
      "Most MVPs cost $500-1,000/month in infrastructure. TopFlow runs on $20/month. Here's the complete stack breakdown and why it's possible without sacrificing quality.",
    publishedAt: "December 23, 2025",
    updatedAt: "June 17, 2026",
    readTime: "1 min read",
    category: "Architecture",
    author: authorCharlie,
    seo: {
      description:
        "Complete breakdown of building a production SaaS application for $20/month using serverless architecture and privacy-first design.",
      keywords: [
        "low cost SaaS",
        "serverless architecture",
        "budget infrastructure",
        "startup costs",
        "Next.js hosting",
      ],
    },
  },
  {
    slug: "encryption-bug-aes-gcm-ephemeral-key",
    title: "The Bug That Made My Encryption Instantly Useless",
    excerpt:
      "I added AES-256-GCM encryption to protect BYOK API keys in localStorage. It compiled, tests passed—but every ciphertext was immediately unrecoverable. Here's the silent bug, the fix, and what it teaches about cryptographic code.",
    publishedAt: "March 15, 2026",
    updatedAt: "June 17, 2026",
    readTime: "7 min read",
    category: "Security",
    author: authorCharlie,
    seo: {
      description:
        "A real AES-256-GCM bug where generateKey() produced a fresh key on every call, making decryption impossible. Learn the fix, the round-trip test that catches it, and the honest XSS limitation of client-held keys.",
      keywords: [
        "AES-GCM encryption bug",
        "Web Crypto API",
        "encryption at rest",
        "BYOK security",
        "localStorage encryption",
        "key management",
        "cryptographic testing",
      ],
    },
  },
  {
    slug: "untrusted-reasoning-worker-llm-security",
    title: "The Untrusted Reasoning Worker: Why I Don't Let the LLM Decide",
    excerpt:
      "Letting an LLM write a security report sounds convenient—until it starts inventing CVE IDs, accepts attacker instructions embedded in advisory text, and produces output no code can reliably check. Here's the pattern that fixes all three.",
    publishedAt: "April 10, 2026",
    readTime: "7 min read",
    category: "Security",
    author: authorCharlie,
    seo: {
      description:
        "The Untrusted Reasoning Worker (URW) pattern: how to use an LLM on security-sensitive paths without letting it fabricate facts, accept prompt injection, or produce uncheckable output. Real code from TopFlow's GitHub Security Scanner.",
      keywords: [
        "LLM security",
        "prompt injection prevention",
        "AI agent security",
        "constrained elicitation",
        "LLM hallucination",
        "agentic AI security",
        "OWASP LLM top 10",
      ],
    },
  },
  {
    slug: "new-function-is-not-a-sandbox",
    title: 'My Security Product\'s Docs Said "Sandboxed." One Line Read Every Secret.',
    excerpt:
      "TopFlow's docs promised workflow code had no access to globals. One line of JavaScript returned every server secret. How we found it, contained it within hours, and what we got wrong along the way.",
    publishedAt: "May 1, 2026",
    readTime: "6 min read",
    category: "Security",
    author: authorCharlie,
    seo: {
      description:
        "new Function() is not a sandbox: how a JavaScript workflow node could read server secrets, how we contained it, and the incident-response order that matters.",
      keywords: [
        "new Function sandbox",
        "untrusted code execution",
        "server secrets",
        "incident response",
        "JavaScript isolation",
        "QuickJS",
        "AI workflow security",
      ],
    },
  },
  {
    slug: "gdpr-automation-3-minutes",
    title: "GDPR Automation in 3 Minutes: How TopFlow Handles Data Subject Access Requests",
    excerpt:
      "Manual GDPR data access requests take 4+ hours per request. TopFlow automates the entire process in 3 minutes for $0.044. Here's how the workflow works and how you can customize it for production.",
    publishedAt: "December 31, 2025",
    updatedAt: "June 17, 2026",
    readTime: "3 min read",
    category: "Workflows",
    author: authorCharlie,
    seo: {
      description:
        "Learn how TopFlow automates GDPR Article 15 data subject access requests with a visual workflow that costs $0.044 per request and completes in 3 minutes.",
      keywords: [
        "GDPR automation",
        "data subject access request",
        "GDPR Article 15",
        "compliance automation",
        "AI workflow",
        "privacy automation",
      ],
    },
  },
]
