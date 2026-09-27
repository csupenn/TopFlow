/**
 * @jest-environment node
 */
import * as badgeRoute from "../[owner]/[repo]/route"

describe("README badge route", () => {
  test.each(["facebook/react", "torvalds/linux", "csupenn/topflow"])(
    "shows no score or grade for %s (sample data used to give every repo 95/100)",
    async (repoPath) => {
      const [owner, repo] = repoPath.split("/")
      // Called the way Next.js calls it, so the test also exercises older handlers that read the params.
      const get = badgeRoute.GET as (...args: unknown[]) => Promise<Response>
      const res = await get(new Request(`https://www.topflow.dev/api/badge/${repoPath}`), {
        params: Promise.resolve({ owner, repo }),
      })
      const svg = await res.text()
      expect(res.headers.get("content-type")).toBe("image/svg+xml")
      expect(svg).not.toMatch(/\d+\s*\/\s*100/)
      expect(svg).not.toMatch(/>\s*[A-F][+-]?\s*</)
      expect(svg).toContain("dependency scan")
    },
  )

  test("has no POST handler (it let anyone set any repo's score)", () => {
    expect("POST" in badgeRoute).toBe(false)
  })
})
