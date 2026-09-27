import { Metadata } from "next"

export const metadata: Metadata = {
  title: "TopFlow Showcases - Real-World AI Workflow Examples",
  description: "Explore real-world use cases built with TopFlow: GitHub Security Scanner, and more. See what you can build with visual AI workflows.",
  keywords: ["AI workflows", "workflow automation", "security scanner", "GitHub scanner", "TopFlow showcases"],
  openGraph: {
    title: "TopFlow Showcases - Real-World AI Workflow Examples",
    description: "Explore real-world use cases built with TopFlow: GitHub Security Scanner, and more.",
    type: "website",
    url: "https://www.topflow.dev/showcase",
  },
  twitter: {
    card: "summary_large_image",
    title: "TopFlow Showcases - Real-World AI Workflow Examples",
    description: "Explore real-world use cases built with TopFlow: GitHub Security Scanner, and more.",
  },
}

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
