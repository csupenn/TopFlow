import { Metadata } from "next"
import { ScannerHero } from "./components/scanner-hero"
import { ScannerDemo } from "./components/scanner-demo"
import { ScannerFeatures } from "./components/scanner-features"
import { ExampleResults } from "./components/example-results"
import { BuiltWithTopFlow } from "./components/built-with-topflow"

export const metadata: Metadata = {
  title: "GitHub Security Scanner - Scan Any Repo in 30 Seconds | TopFlow",
  description: "Free GitHub repository security scanner. Get comprehensive security analysis, vulnerability detection, dependency checks, and compliance insights in 30 seconds. Built with TopFlow.",
  keywords: [
    "github security scanner",
    "repository security",
    "vulnerability scanner",
    "dependency security",
    "OWASP scanner",
    "code security",
    "compliance checker",
    "github analyzer",
    "security audit",
    "topflow"
  ],
  openGraph: {
    title: "GitHub Security Scanner - Scan Any Repo in 30 Seconds",
    description: "Free GitHub repository security scanner. Get comprehensive security analysis including OWASP Top 10, dependency checks, and compliance insights.",
    type: "website",
    url: "https://www.topflow.dev/showcase/security-scanner",
    images: [
      {
        url: "https://www.topflow.dev/demo-assets/images/github-security-dashboard.webp",
        width: 1200,
        height: 630,
        alt: "GitHub Security Scanner Dashboard"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "GitHub Security Scanner - Scan Any Repo in 30 Seconds",
    description: "Free GitHub repository security scanner. OWASP Top 10, dependency checks, compliance insights. Built with TopFlow.",
    images: ["https://www.topflow.dev/demo-assets/images/github-security-dashboard.webp"]
  },
  alternates: {
    canonical: "https://www.topflow.dev/showcase/security-scanner"
  }
}

export default function SecurityScannerShowcase() {
  return (
    <div id="top">
      <ScannerHero />
      <ScannerDemo />
      <ScannerFeatures />
      <ExampleResults />
      <BuiltWithTopFlow />
    </div>
  )
}
