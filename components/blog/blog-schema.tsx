import type { BlogPost } from "@/lib/blog/blog-data"
import { getLastModified } from "@/lib/blog/blog-utils"

interface BlogSchemaProps {
  post: BlogPost
}

export function BlogSchema({ post }: BlogSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seo.description,
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.title,
      url: post.author.website,
      sameAs: [
        `https://x.com/${post.author.twitter.replace("@", "")}`,
        `https://www.linkedin.com/in/${post.author.linkedin}`,
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "TopFlow",
      url: "https://www.topflow.dev",
      logo: {
        "@type": "ImageObject",
        url: "https://www.topflow.dev/icon-light-32x32.png",
      },
    },
    datePublished: new Date(post.publishedAt).toISOString(),
    dateModified: getLastModified(post).toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.topflow.dev/blog/${post.slug}`,
    },
    keywords: post.seo.keywords.join(", "),
    articleSection: post.category,
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function BlogListSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "TopFlow Blog",
    description: "Insights on AI security, workflow automation, and compliance",
    url: "https://www.topflow.dev/blog",
    author: {
      "@type": "Person",
      name: "Charlie Su",
      jobTitle: "Former CISO & TopFlow Creator",
      url: "https://charliesu.com",
    },
    publisher: {
      "@type": "Organization",
      name: "TopFlow",
      url: "https://www.topflow.dev",
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
