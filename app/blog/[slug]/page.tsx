import type { Metadata } from "next"
import { SITE_URL } from "@/lib/site"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Twitter, Linkedin, Mail, Globe } from "lucide-react"
import { blogPosts } from "@/lib/blog/blog-data"
import { getLastModified } from "@/lib/blog/blog-utils"
import { BlogContent } from "@/components/blog/blog-content"
import { BlogSchema } from "@/components/blog/blog-schema"

interface PageProps {
  params: Promise<{ slug: string }>
}

// Only slugs from generateStaticParams exist; unknown slugs get a real HTTP 404 at routing time.
// Without this, production returned HTTP 200 with a "Post Not Found" page for unknown slugs
// (a "soft 404" search engines index as a thin page). Root cause not confirmed — streaming is a
// likely factor — but this setting was verified to fix it.
export const dynamicParams = false

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return {
      title: "Post Not Found | TopFlow Blog",
    }
  }

  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`

  return {
    title: `${post.title} | TopFlow Blog`,
    description: post.seo.description,
    keywords: post.seo.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.seo.description,
      url: canonicalUrl,
      type: "article",
      publishedTime: new Date(post.publishedAt).toISOString(),
      modifiedTime: getLastModified(post).toISOString(),
      authors: [post.author.name],
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@charliesu_ai",
      title: post.title,
      description: post.seo.description,
      images: ["/og-image.png"],
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
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <BlogSchema post={post} />

      {/* Header with back button */}
      <div className="border-b border-border bg-panel">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="mx-auto max-w-4xl px-6 py-12">
        {/* Category badge */}
        <div className="mb-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight text-balance">{post.title}</h1>

        {/* Excerpt */}
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed text-pretty">{post.excerpt}</p>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-12 pb-8 border-b border-border">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{post.publishedAt}</span>
          </div>
          {post.updatedAt && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">Updated {post.updatedAt}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{post.readTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>By</span>
            <a
              href={post.author.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              {post.author.name}
            </a>
          </div>
        </div>

        {/* Blog Content */}
        <BlogContent slug={post.slug} />

        {/* Author Bio */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">About the Author</h3>
            <p className="text-muted-foreground mb-4">
              <strong className="text-foreground">{post.author.name}</strong> is a {post.author.title.toLowerCase()}.
              With extensive experience in cybersecurity and compliance, Charlie combines strategic security leadership
              with hands-on technical expertise.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={post.author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Globe className="w-4 h-4" />
                Website
              </a>
              <a
                href={`https://x.com/${post.author.twitter.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </a>
              <a
                href={`https://www.linkedin.com/in/${post.author.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
              <a
                href={`mailto:${post.author.email}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-foreground mb-6">More Articles</h3>
          <div className="grid gap-4">
            {blogPosts
              .filter((p) => p.slug !== post.slug)
              .slice(0, 3)
              .map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="block group bg-card border border-border rounded-lg p-4 hover:border-primary transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className="text-xs text-muted-foreground mb-1 block">{relatedPost.category}</span>
                      <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                        {relatedPost.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">{relatedPost.readTime}</p>
                    </div>
                    <ArrowLeft className="w-5 h-5 text-primary rotate-180 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </article>
    </div>
  )
}
