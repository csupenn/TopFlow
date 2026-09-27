import { RateLimiter, MemoryRateLimitStore, rateLimitKey } from "../rate-limit"

describe("RateLimiter (sliding window, injected clock)", () => {
  test("allows up to the limit, blocks beyond, then resets after the window", async () => {
    let now = 1000
    const rl = new RateLimiter({ limit: 3, windowMs: 1000, now: () => now })

    expect((await rl.check("k")).allowed).toBe(true) // 1
    expect((await rl.check("k")).allowed).toBe(true) // 2
    const third = await rl.check("k") // 3
    expect(third.allowed).toBe(true)
    expect(third.remaining).toBe(0)
    expect((await rl.check("k")).allowed).toBe(false) // 4 → blocked

    now += 1001 // entire window elapses
    expect((await rl.check("k")).allowed).toBe(true) // allowed again
  })

  test("keys are isolated", async () => {
    const now = 0
    const rl = new RateLimiter({ limit: 1, windowMs: 1000, now: () => now })
    expect((await rl.check("a")).allowed).toBe(true)
    expect((await rl.check("a")).allowed).toBe(false)
    expect((await rl.check("b")).allowed).toBe(true)
  })

  test("reports remaining and resetMs", async () => {
    let now = 5000
    const rl = new RateLimiter({ limit: 2, windowMs: 1000, now: () => now })
    const first = await rl.check("k")
    expect(first.remaining).toBe(1)
    expect(first.limit).toBe(2)
    now += 400
    const second = await rl.check("k")
    expect(second.remaining).toBe(0)
    expect(second.resetMs).toBeLessThanOrEqual(1000)
    expect(second.resetMs).toBeGreaterThan(0)
  })
})

describe("rateLimitKey", () => {
  const SECRET = "test-secret-0123456789abcdef"

  test("distinguishes ip from ip+token and is stable", () => {
    expect(rateLimitKey("1.2.3.4", undefined, SECRET)).not.toBe(rateLimitKey("1.2.3.4", "tok", SECRET))
    expect(rateLimitKey("1.2.3.4", "tok", SECRET)).toBe(rateLimitKey("1.2.3.4", "tok", SECRET))
    expect(rateLimitKey("", undefined, SECRET)).toBe("anonymous")
  })

  test("does not leak the raw token", () => {
    expect(rateLimitKey("1.2.3.4", "super-secret-token", SECRET)).not.toContain("super-secret-token")
  })

  // Privacy: the key is persisted in Redis (Upstash) — it must never contain the client IP.
  test.each(["203.0.113.7", "10.0.0.1", "2001:db8::42", "::ffff:198.51.100.9"])(
    "never contains the raw IP %s",
    (ip) => {
      const key = rateLimitKey(ip, undefined, SECRET)
      expect(key).not.toContain(ip)
      expect(key).toMatch(/^ip:[0-9a-f]{32}$/)
    },
  )

  test("same IP → same key; different IPs → different keys", () => {
    expect(rateLimitKey("203.0.113.7", undefined, SECRET)).toBe(rateLimitKey("203.0.113.7", undefined, SECRET))
    expect(rateLimitKey("203.0.113.7", undefined, SECRET)).not.toBe(rateLimitKey("203.0.113.8", undefined, SECRET))
  })

  test("is keyed: a different secret yields a different key (not a plain, brute-forceable hash)", () => {
    expect(rateLimitKey("203.0.113.7", undefined, SECRET)).not.toBe(
      rateLimitKey("203.0.113.7", undefined, "another-secret-value-xyz"),
    )
  })

  test("reads the secret from RATE_LIMIT_KEY_SECRET by default", () => {
    const prev = process.env.RATE_LIMIT_KEY_SECRET
    process.env.RATE_LIMIT_KEY_SECRET = SECRET
    try {
      expect(rateLimitKey("203.0.113.7")).toBe(rateLimitKey("203.0.113.7", undefined, SECRET))
    } finally {
      if (prev === undefined) delete process.env.RATE_LIMIT_KEY_SECRET
      else process.env.RATE_LIMIT_KEY_SECRET = prev
    }
  })

  test("without a configured secret: still hashed with a per-instance random secret, and warns without the IP", () => {
    const prev = process.env.RATE_LIMIT_KEY_SECRET
    delete process.env.RATE_LIMIT_KEY_SECRET
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {})
    try {
      const a = rateLimitKey("203.0.113.7")
      expect(a).toMatch(/^ip:[0-9a-f]{32}$/)
      expect(a).toBe(rateLimitKey("203.0.113.7")) // stable within the instance
      expect(a).not.toBe(rateLimitKey("203.0.113.7", undefined, "")) // not an unkeyed hash
      const logged = warn.mock.calls.flat().join(" ")
      expect(logged).toContain("RATE_LIMIT_KEY_SECRET")
      expect(logged).not.toContain("203.0.113.7")
    } finally {
      warn.mockRestore()
      if (prev !== undefined) process.env.RATE_LIMIT_KEY_SECRET = prev
    }
  })
})

describe("MemoryRateLimitStore", () => {
  test("prune removes stale keys", () => {
    const store = new MemoryRateLimitStore()
    store.hit("k", 100, 1000)
    store.prune(2000, 1000) // 100 is older than 2000-1000=1000 → removed
    expect(store.hit("k", 2000, 1000).length).toBe(1) // fresh count after prune
  })
})
