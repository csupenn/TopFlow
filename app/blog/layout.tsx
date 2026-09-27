import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog - AI Security & Compliance Insights | TopFlow",
  description: "Expert insights on AI security, workflow automation, GDPR compliance, and building privacy-first AI applications. Learn from a former CISO building secure AI systems.",
  keywords: [
    "AI security blog",
    "GDPR compliance",
    "workflow automation",
    "privacy-first AI",
    "secure AI development",
    "CISO insights",
    "compliance automation",
  ],
  alternates: {
    canonical: "https://www.topflow.dev/blog",
  },
  openGraph: {
    title: "TopFlow Blog - AI Security & Compliance Insights",
    description: "Expert insights on building secure, compliant AI systems from a former CISO. Learn about GDPR automation, SSRF prevention, and privacy-first architecture.",
    url: "https://www.topflow.dev/blog",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TopFlow Blog - AI Security & Compliance Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TopFlow Blog - AI Security & Compliance Insights",
    description: "Expert insights on building secure, compliant AI systems from a former CISO.",
    images: ["/og-image.png"],
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

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}