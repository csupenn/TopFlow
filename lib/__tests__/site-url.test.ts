/**
 * @jest-environment node
 */
import { readFileSync, readdirSync, statSync } from "fs"
import { join } from "path"
import { SITE_URL } from "../site"
import sitemap from "@/app/sitemap"
import robots from "@/app/robots"

// Canonical host is www.topflow.dev; the apex 307-redirects to it. Canonical URLs,
// sitemap entries and structured data must point at the final URL, not a redirect.

describe("canonical site URL", () => {
  test("is the www origin with no trailing slash", () => {
    expect(SITE_URL).toBe("https://www.topflow.dev")
  })

  test("every sitemap entry uses the canonical origin", () => {
    const urls = sitemap().map((e) => e.url)
    expect(urls.length).toBeGreaterThan(0)
    expect(urls.filter((u) => !u.startsWith(`${SITE_URL}/`) && u !== SITE_URL)).toEqual([])
  })

  test("robots points crawlers at the canonical sitemap", () => {
    expect(robots().sitemap).toBe(`${SITE_URL}/sitemap.xml`)
  })
})

describe("no apex-host URLs in source", () => {
  const ROOTS = ["app", "components", "lib"]
  const APEX = /https?:\/\/topflow\.dev(?![\w.-])/

  const files: string[] = []
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      if (name === "node_modules" || name === "__tests__") continue
      const p = join(dir, name)
      if (statSync(p).isDirectory()) walk(p)
      else if (/\.(tsx?|jsx?)$/.test(name)) files.push(p)
    }
  }
  ROOTS.forEach((r) => walk(join(process.cwd(), r)))

  test("uses https://www.topflow.dev (apex redirects)", () => {
    const offenders = files
      .filter((f) => APEX.test(readFileSync(f, "utf8")))
      .map((f) => f.replace(process.cwd() + "/", ""))
    expect(offenders).toEqual([])
  })
})
