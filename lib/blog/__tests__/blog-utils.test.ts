import { blogPosts, type BlogPost } from "../blog-data"
import { getLastModified } from "../blog-utils"

const post = (overrides: Partial<BlogPost> = {}): BlogPost => ({ ...blogPosts[0], ...overrides })

describe("getLastModified", () => {
  test("falls back to publishedAt when the post was never revised", () => {
    const p = post({ publishedAt: "March 15, 2026", updatedAt: undefined })
    expect(getLastModified(p).getTime()).toBe(new Date("March 15, 2026").getTime())
  })

  test("uses updatedAt when the post was revised", () => {
    const p = post({ publishedAt: "March 15, 2026", updatedAt: "September 26, 2026" })
    expect(getLastModified(p).getTime()).toBe(new Date("September 26, 2026").getTime())
  })
})

// Guards on the real post registry: these feed the sitemap, JSON-LD dateModified,
// and OpenGraph modifiedTime, so a typo would silently publish "Invalid Date".
describe("blogPosts registry", () => {
  test.each(blogPosts.map((p) => [p.slug, p] as const))("%s has parseable dates", (_slug, p) => {
    expect(Number.isNaN(new Date(p.publishedAt).getTime())).toBe(false)
    if (p.updatedAt) expect(Number.isNaN(new Date(p.updatedAt).getTime())).toBe(false)
  })

  test("no post is updated before it was published", () => {
    const backdated = blogPosts
      .filter((p) => p.updatedAt && new Date(p.updatedAt).getTime() < new Date(p.publishedAt).getTime())
      .map((p) => p.slug)
    expect(backdated).toEqual([])
  })

  test("slugs are unique", () => {
    const slugs = blogPosts.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})
