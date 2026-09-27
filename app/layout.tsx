import type React from "react"
import { SITE_URL } from "@/lib/site"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { CookieNotice } from "@/components/cookie-notice"
import { SchemaOrg } from "@/components/schema-org"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TopFlow - Secure AI Workflows & GitHub Security Scanner",
    template: "%s | TopFlow",
  },
  description:
    "Build secure AI workflows with GitHub Security Scanner demo. Privacy-first platform with GDPR compliance, zero server-side storage, BYOK model. Automate repository security analysis, vulnerability scanning, and compliance checks. Try demo instantly - no signup required.",
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
    "security workflow automation",
    "compliance automation",
  ],
  authors: [{ name: "Charlie Su" }],
  creator: "TopFlow",
  publisher: "TopFlow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.topflow.dev",
    siteName: "TopFlow",
    title: "TopFlow - GitHub Security Scanner & Secure AI Workflows",
    description:
      "Automate GitHub repository security scans with AI. Privacy-first platform with GDPR compliance by design. Try demo instantly - no signup or API keys required.",
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
    description: "Automate GitHub repository security scans with AI. Privacy-first, GDPR compliant. Try demo instantly.",
    images: ["/demo-assets/images/github-security-dashboard.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <SchemaOrg />
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </ErrorBoundary>
        <CookieNotice />
        <Analytics />
      </body>
    </html>
  )
}
