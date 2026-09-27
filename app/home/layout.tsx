import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TopFlow - Secure AI Workflow Builder with GitHub Security Scanner",
  description:
    "Build secure AI workflows with GitHub Security Scanner. Privacy-first platform with GDPR compliance, zero server-side storage, and BYOK model. Try demo instantly - no signup required.",
  keywords: [
    "github security scanner",
    "repository security analysis",
    "ai security automation",
    "secure ai workflows",
    "github vulnerability scanner",
    "devsecops automation",
    "ai agent orchestration",
    "privacy-first ai",
    "gdpr compliant ai",
    "byok ai platform",
  ],
  openGraph: {
    title: "TopFlow - GitHub Security Scanner & Secure AI Workflows",
    description:
      "Automate GitHub repository security scans with AI. Privacy-first, GDPR compliant, zero server-side storage. Try demo instantly.",
    images: [
      {
        url: "/demo-assets/images/github-security-dashboard.webp",
        width: 1200,
        height: 630,
        alt: "GitHub Security Scanner Dashboard - TopFlow",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TopFlow - GitHub Security Scanner & Secure AI Workflows",
    description: "Automate GitHub repository security scans with AI. Privacy-first, GDPR compliant.",
    images: ["/demo-assets/images/github-security-dashboard.webp"],
  },
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
