import { createHmac, randomBytes } from "crypto"

/**
 * Sliding-window rate limiter with a pluggable store.
 *
 * Default store is in-memory (per server instance). For multi-instance
 * durability the execute route passes `UpstashRateLimitStore`
 * (upstash-rate-limit-store.ts) when Upstash env vars are set.
 *
 * The clock is injectable for deterministic testing.
 */

export interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  /** Milliseconds until the window frees up for this key. */
  resetMs: number
}

export interface RateLimitStore {
  /**
   * Record a hit at `now` for `key` and return the timestamps (ms) still within
   * the trailing `windowMs` (including the just-recorded hit).
   */
  hit(key: string, now: number, windowMs: number): number[] | Promise<number[]>
}

/** In-memory sliding-window-log store (per process instance). */
export class MemoryRateLimitStore implements RateLimitStore {
  private hits = new Map<string, number[]>()

  hit(key: string, now: number, windowMs: number): number[] {
    const cutoff = now - windowMs
    const recent = (this.hits.get(key) || []).filter((t) => t > cutoff)
    recent.push(now)
    this.hits.set(key, recent)
    return recent
  }

  /** Drop keys with no hits inside the window (call periodically to bound memory). */
  prune(now: number, windowMs: number): void {
    const cutoff = now - windowMs
    for (const [key, arr] of this.hits) {
      const recent = arr.filter((t) => t > cutoff)
      if (recent.length) this.hits.set(key, recent)
      else this.hits.delete(key)
    }
  }
}

export interface RateLimiterOptions {
  limit: number
  windowMs: number
  store?: RateLimitStore
  now?: () => number
}

export class RateLimiter {
  private readonly limit: number
  private readonly windowMs: number
  private readonly store: RateLimitStore
  private readonly now: () => number

  constructor(opts: RateLimiterOptions) {
    this.limit = opts.limit
    this.windowMs = opts.windowMs
    this.store = opts.store || new MemoryRateLimitStore()
    this.now = opts.now || (() => Date.now())
  }

  async check(key: string): Promise<RateLimitResult> {
    const now = this.now()
    const hits = await this.store.hit(key, now, this.windowMs)
    const count = hits.length
    const oldest = hits[0] ?? now
    return {
      allowed: count <= this.limit,
      limit: this.limit,
      remaining: Math.max(0, this.limit - count),
      resetMs: Math.max(0, this.windowMs - (now - oldest)),
    }
  }
}

// ---------------------------------------------------------------------------
// Rate-limit keys (privacy)
//
// Keys are persisted in Redis (Upstash) for ~one window, so they must not contain
// the client IP. Each part is an HMAC-SHA256 under RATE_LIMIT_KEY_SECRET. A plain
// (unkeyed) hash is NOT enough: the whole IPv4 space can be hashed in seconds.
//
// If the secret is missing we fall back to a random per-instance secret: IPs stay
// unrecoverable, but instances no longer share keys, so limiting is per-instance
// until the secret is configured. We warn once (the warning never includes an IP).
// ---------------------------------------------------------------------------

let fallbackSecret: string | undefined

function defaultKeySecret(): string {
  const configured = process.env.RATE_LIMIT_KEY_SECRET
  if (configured) return configured
  if (!fallbackSecret) {
    fallbackSecret = randomBytes(32).toString("hex")
    console.warn(
      "[rate-limit] RATE_LIMIT_KEY_SECRET is not set — using a random per-instance secret. " +
        "Client IPs stay hashed, but rate limits are no longer shared across instances.",
    )
  }
  return fallbackSecret
}

function keyedHash(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("hex").slice(0, 32)
}

/**
 * Rate-limit key for a client IP and optional token. Neither value appears in the key:
 * both are HMAC-SHA256'd (128-bit truncated) under `secret` (default: RATE_LIMIT_KEY_SECRET).
 */
export function rateLimitKey(ip: string, token?: string, secret: string = defaultKeySecret()): string {
  const base = ip ? `ip:${keyedHash(ip, secret)}` : "anonymous"
  return token ? `${base}:t:${keyedHash(token, secret)}` : base
}
