"use client"

export function SchemaOrg() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TopFlow",
    url: "https://www.topflow.dev",
    logo: "https://www.topflow.dev/icon.svg",
    description: "Privacy-first visual workflow builder for secure AI applications featuring GitHub Security Scanner, GDPR compliance, and automated security workflows. Built by former CISO.",
    founder: {
      "@type": "Person",
      name: "Charlie Su",
      url: "https://charliesu.com",
      jobTitle: "Former CISO",
    },
    sameAs: [
      "https://github.com/csupenn/topflow",
      "https://twitter.com/charliesu_ai",
      "https://www.linkedin.com/in/charliesu-ai",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Support",
      email: "charlie@charliesu.com",
    },
  }

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Charlie Su",
    url: "https://charliesu.com",
    jobTitle: "Former CISO & Founder",
    description: "AI Security Expert and creator of TopFlow. Building secure-by-default AI systems.",
    sameAs: [
      "https://twitter.com/charliesu_ai",
      "https://www.linkedin.com/in/charliesu-ai",
      "https://github.com/csupenn",
    ],
    worksFor: {
      "@type": "Organization",
      name: "TopFlow",
      url: "https://www.topflow.dev",
    },
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TopFlow",
    url: "https://www.topflow.dev",
    description: "Privacy-first visual workflow builder for secure AI applications with GitHub Security Scanner and automated security workflows",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.topflow.dev/docs?q={search_term_string}",
      },
      query_input: "required name=search_term_string",
    },
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TopFlow",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: "Privacy-first visual workflow builder for AI applications featuring GitHub Security Scanner. Automate repository security analysis and dependency vulnerability scanning, with GDPR compliance, SSRF prevention, and 12+ security validations. Built by former CISO.",
    url: "https://www.topflow.dev",
    screenshot: "https://www.topflow.dev/demo-assets/images/builder-screenshot.png",
    featureList: [
      "GitHub Security Scanner",
      "Automated Repository Analysis",
      "Vulnerability Detection",
      "Compliance Checking",
      "Privacy-First Architecture",
      "Zero Server-Side Storage",
      "BYOK Model",
      "Demo Mode",
    ],
    author: {
      "@type": "Person",
      name: "Charlie Su",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
    </>
  )
}
