import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Builder - TopFlow | Visual AI Workflow Designer",
  description: "Build secure AI workflows visually with TopFlow's drag-and-drop interface. Features 12 security validations, SSRF prevention, and GDPR-compliant architecture.",
  keywords: [
    "AI workflow builder",
    "visual workflow designer",
    "drag and drop AI",
    "AI agent builder",
    "workflow automation",
    "no-code AI",
    "secure workflow builder",
    "AI orchestration tool",
  ],
  alternates: {
    canonical: "https://www.topflow.dev/builder",
  },
  openGraph: {
    title: "TopFlow Builder - Visual AI Workflow Designer",
    description: "Create secure AI workflows with drag-and-drop simplicity. Build, validate, and export production-ready AI agent code.",
    url: "https://www.topflow.dev/builder",
    type: "website",
    images: [
      {
        url: "/og-site.png",
        width: 1200,
        height: 630,
        alt: "TopFlow: secure AI workflows",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TopFlow Builder - Visual AI Workflow Designer",
    description: "Create secure AI workflows with drag-and-drop simplicity.",
    images: ["/og-site.png"],
    creator: "@charliesu_ai",
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

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}