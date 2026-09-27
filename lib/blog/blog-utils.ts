import type { BlogPost } from "./blog-data"

/** When the post last changed: `updatedAt` if it was revised, otherwise `publishedAt`. */
export function getLastModified(post: BlogPost): Date {
  return new Date(post.updatedAt ?? post.publishedAt)
}

export type ViewMode = "grid" | "list"
export type SortOption = "newest" | "oldest" | "category"

export function filterPostsByCategory(posts: BlogPost[], category: string | null): BlogPost[] {
  if (!category || category === "all") return posts
  return posts.filter((post) => post.category.toLowerCase() === category.toLowerCase())
}

export function searchPosts(posts: BlogPost[], query: string): BlogPost[] {
  if (!query.trim()) return posts

  const searchTerm = query.toLowerCase()

  return posts.filter((post) => {
    const searchableText = `${post.title} ${post.excerpt} ${post.category} ${post.seo.keywords.join(" ")}`.toLowerCase()
    return searchableText.includes(searchTerm)
  })
}

export function sortPosts(posts: BlogPost[], sortBy: SortOption): BlogPost[] {
  const sorted = [...posts]

  switch (sortBy) {
    case "newest":
      return sorted.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    case "oldest":
      return sorted.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())

    case "category":
      return sorted.sort((a, b) => a.category.localeCompare(b.category))

    default:
      return sorted
  }
}

export function getCategoryCount(posts: BlogPost[], category: string): number {
  if (category === "all") return posts.length
  return posts.filter((post) => post.category.toLowerCase() === category.toLowerCase()).length
}

export const BLOG_CATEGORIES = [
  { id: "all", label: "All Posts" },
  { id: "security", label: "Security" },
  { id: "workflows", label: "Workflows" },
  { id: "architecture", label: "Architecture" },
  { id: "compliance", label: "Compliance" },
] as const
