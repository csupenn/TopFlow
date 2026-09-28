"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ArrowRight, Calendar, Clock, Tag, Shield, Github, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { blogPosts } from "@/lib/blog/blog-data"
import { BlogListSchema } from "@/components/blog/blog-schema"
import { BlogControls } from "@/components/blog/blog-controls"
import { BlogFilters } from "@/components/blog/blog-filters"
import { BlogListView } from "@/components/blog/blog-list-view"
import { BlogEmptyState } from "@/components/blog/blog-empty-state"
import {
  filterPostsByCategory,
  searchPosts,
  sortPosts,
  getCategoryCount,
  BLOG_CATEGORIES,
  type ViewMode,
  type SortOption,
} from "@/lib/blog/blog-utils"

export default function BlogPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Load view preference from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem("topflow-blog-view") as ViewMode | null
    if (savedView) setViewMode(savedView)

    const savedSort = localStorage.getItem("topflow-blog-sort") as SortOption | null
    if (savedSort) setSortBy(savedSort)
  }, [])

  // Save view preference
  useEffect(() => {
    localStorage.setItem("topflow-blog-view", viewMode)
  }, [viewMode])

  // Save sort preference
  useEffect(() => {
    localStorage.setItem("topflow-blog-sort", sortBy)
  }, [sortBy])

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Apply filters and sorting
  const filteredPosts = useMemo(() => {
    let posts = [...blogPosts]

    // Apply category filter
    posts = filterPostsByCategory(posts, activeCategory)

    // Apply search
    posts = searchPosts(posts, debouncedSearch)

    // Apply sorting
    posts = sortPosts(posts, sortBy)

    return posts
  }, [activeCategory, debouncedSearch, sortBy])

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    BLOG_CATEGORIES.forEach((category) => {
      counts[category.id] = getCategoryCount(blogPosts, category.id)
    })
    return counts
  }, [])

  const handleClearFilters = () => {
    setActiveCategory("all")
    setSearchQuery("")
    setDebouncedSearch("")
  }

  const featuredPost = sortBy === "newest" && activeCategory === "all" && !debouncedSearch ? filteredPosts[0] : null
  const displayPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts

  return (
    <div className="min-h-screen bg-background">
      <BlogListSchema />

      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/home" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">TopFlow</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/builder">
                <Button variant="ghost" size="sm">
                  Builder
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="ghost" size="sm">
                  Docs
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="ghost" size="sm" className="text-primary">
                  Blog
                </Button>
              </Link>
              <Link href="/builder">
                <Button size="sm">Try Demo</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <div className="mx-auto max-w-6xl px-6 py-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Blog</h1>
        <p className="text-sm text-muted-foreground">
          Insights on AI security, workflow automation, and compliance from{" "}
          <a
            href="https://charliesu.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Charlie Su
          </a>
          , former CISO and creator of TopFlow.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Publication dates follow our editorial calendar. &ldquo;Updated&rdquo; notes carry the date of the
          correction; engineering dates are in the linked commits and design docs.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Controls */}
        <BlogControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Filters */}
        <BlogFilters
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          categoryCounts={categoryCounts}
          totalPosts={blogPosts.length}
          filteredCount={filteredPosts.length}
          searchQuery={debouncedSearch}
          onClearFilters={handleClearFilters}
        />

        {/* Featured Post (only show in default state) */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.slug}`} className="block group mb-16">
            <div className="bg-card border border-border rounded-lg p-8 hover:border-primary transition-all duration-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">Featured</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{featuredPost.category}</span>
              </div>

              <h2 className="text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                {featuredPost.title}
              </h2>

              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">{featuredPost.excerpt}</p>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{featuredPost.publishedAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{featuredPost.readTime}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Empty State */}
        {displayPosts.length === 0 && <BlogEmptyState onClearFilters={handleClearFilters} />}

        {/* Posts Display */}
        {displayPosts.length > 0 && (
          <>
            {viewMode === "list" ? (
              <BlogListView posts={displayPosts} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                    <div className="bg-card border border-border rounded-lg p-6 h-full hover:border-primary transition-all duration-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs text-muted-foreground">{post.category}</span>
                      </div>

                      <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">{post.excerpt}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{post.publishedAt}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>

                        <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA Section Card */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-8 text-center">
          <h3 className="mb-3 text-2xl font-bold text-foreground">Ready to Build Secure Workflows?</h3>
          <p className="mb-6 text-muted-foreground max-w-2xl mx-auto">
            Try TopFlow with your own API keys or use our pre-cached demo data. No signup required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/builder">
              <Button size="lg">Try Demo</Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="lg">
                Read Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="text-sm font-medium text-foreground">
                TopFlow: Secure AI Agent Orchestration
              </div>
              <div className="text-sm text-muted-foreground">
                © 2026 TopFlow. Built by Charlie Su, Former CISO.
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="https://github.com/csupenn/topflow" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Home
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="text-xs text-center md:text-left text-muted-foreground space-y-2">
            <p>Security-first AI automation for compliance and privacy teams.</p>
            <p className="flex items-center justify-center md:justify-start gap-2">
              <Shield className="h-3 w-3" />
              <span>Privacy-First: Minimal tracking, client-side storage.</span>
              <Link href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
