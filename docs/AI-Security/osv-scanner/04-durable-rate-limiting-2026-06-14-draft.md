# Tutorial 04 — Durable Rate Limiting: From In-Memory to Redis Across Serverless Instances

| | |
|---|---|
| **Series** | AI Security Tutorials — TopFlow |
| **Level** | Intermediate |
| **Depends on** | Tutorial 01 (in-memory sliding-window limiter) |
| **Source** | W1-T4 durable store (`lib/security/upstash-rate-limit-store.ts` + route wiring) |
| **Files** | `lib/security/rate-limit.ts`, `lib/security/upstash-rate-limit-store.ts`, `app/api/execute-workflow/route.ts`, `lib/security/__tests__/upstash-rate-limit-store.test.ts` |
| **Status** | Draft — 2026-06-14 |
| **Est. time** | 45–70 min (with labs) |

### Learning objectives
By the end you can: (1) explain why in-memory rate limiting fails in serverless environments and
what "durable" means in this context; (2) describe the sliding-window-log algorithm using a Redis
sorted set; (3) read the `RateLimitStore` interface and explain why it was designed before the
Redis adapter; (4) trace the four-command pipeline (ZADD → ZREMRANGEBYSCORE → ZRANGE → EXPIRE)
and explain what each does; (5) apply the graceful-fallback pattern and mock-in-tests pattern to
your own security controls.

---

## 1. Context & architecture

Tutorial 01 shipped a sliding-window rate limiter on the `POST /api/execute-workflow` route.
It worked — but with one documented honest limitation:

> *"In-memory store, pluggable for Redis/KV — trades cross-instance durability now for a clean,
> testable, shippable increment."*

That limitation matters more than it looks on paper. TopFlow deploys to Vercel's serverless
runtime. Each invocation of the function may land on a **different cold-started instance** — each
with its own empty in-memory `Map`. An attacker sending 10 requests per minute to a route with
10 instances effectively gets **100 requests per minute** while every instance reports "limit not
exceeded."

```
Attacker                Vercel serverless
   │
   ├─ req 1 ──► Instance A (hits: 1)   ✅ allowed
   ├─ req 2 ──► Instance B (hits: 1)   ✅ allowed  ← same key, different process
   ├─ req 3 ──► Instance A (hits: 2)   ✅ allowed
   ├─ req 4 ──► Instance C (hits: 1)   ✅ allowed  ← new cold start
   …
   └─ req 10 ─► Instance A (hits: 5)   ✅ allowed  ← never reaches limit per instance
```

For a standalone server (one process, one `Map`) this isn't an issue. For serverless, it is the
**fundamental availability gap** in any in-memory rate limiter. The fix: move the state out of
the process and into a **shared external store** — Redis.

This tutorial covers the store swap: how the existing `RateLimitStore` interface made it a
three-line change to the route, what the Redis sorted-set algorithm does, and how to keep the
test suite hermetic (no real Redis in CI).

---

## 2. Security mechanism: durable sliding-window limiting

Two concepts combine here:

**Sliding window** (from Tutorial 01): count only the hits in the trailing N seconds. More
accurate than a fixed window, which resets on a boundary and allows a 2× burst across the seam.

**Durable shared store**: the hit log lives in a database visible to all instances, not in
process memory. Every instance reads and writes the *same* counters. A request landing on a
fresh cold start sees the real accumulated count.

The combination — **durable sliding window** — closes the multi-instance gap while preserving
the accuracy of the sliding-window algorithm. The cost is one network round-trip to Redis per
request (Upstash uses HTTP REST, so ~5–20 ms, typically well inside the route's total latency
budget).

---

## 3. Threat model

**Assets:** AI-provider API credits (an AI workflow call can cost $0.01–$1 per execution);
server compute budget; service availability for legitimate users.

**Trust boundary:** `POST /api/execute-workflow` is unauthenticated. The request body, headers,
and source IP are all attacker-controlled.

**STRIDE for the rate-limiting layer:**

| STRIDE | Threat |
|---|---|
| **S**poofing | Attacker fakes client IP via `X-Forwarded-For` manipulation (mitigated: the limiter reads the header set by Vercel's edge, not the request body) |
| **T**ampering | — (rate limit state is in Redis, not the request) |
| **R**epudiation | Flooding from a single IP is hard to dispute — per-IP keying + Redis audit log |
| **I**nfo disclosure | Client IPs (personal data under GDPR) persisted in a third-party store. *Originally keys were `rl:<raw IP>`; since Sept 2026 each key is an HMAC-SHA256 of the IP under `RATE_LIMIT_KEY_SECRET`, so Redis never holds an IP (see §5 item 7).* |
| **D**enial of service | **Endpoint flooding** (the headline threat) — burning credits, degrading availability |
| **E**levation of privilege | Cost-flooding the AI-provider budget can exhaust quota for all users |

Mapped to standards: rate limiting primarily covers **OWASP API4:2023 Unrestricted Resource
Consumption** and **NIST AI 600-1 § unbounded consumption of AI resources**.

---

## 4. Attack trees

**Attack tree A — Defeat in-memory limiting (now closed)**
```
GOAL: exceed the 10 req/min limit without triggering a 429
├── A1 route requests across multiple serverless instances
│       each instance holds an independent counter → each allows 10 req/min
│       → CLOSED by Redis shared store (all instances share one counter)
├── A2 trigger cold starts to reset per-instance counters
│       cold start = new process = counter at 0
│       → CLOSED by Redis (counter persists in external store)
└── A3 wait for a process recycle (instance TTL)
        → CLOSED: Redis key has its own TTL (windowMs + 5s), independent of instance lifetime
```

**Attack tree B — Defeat the shared limiter (residual)**
```
GOAL: exceed the 10 req/min limit even with Redis
├── B1 rotate source IPs (one key per IP; use N IPs → N × 10 req/min)
│       → PARTIAL: per-IP + per-token keying; full mitigation requires WAF / IP reputation
├── B2 forge X-Forwarded-For header to spoof IP
│       → mitigated by reading Vercel-set headers, not the body; still residual at CDN layer
└── B3 exploit Redis downtime (failover window)
        → falls back to in-memory (graceful degradation, not fail-closed)
        → RESIDUAL: documented trade-off (see §5.4)
```

The most honest residual is **B3**: if Redis is unavailable, the limiter silently falls back to
per-instance in-memory counting. The application stays up, but the cross-instance guarantee
breaks. This is a deliberate product trade-off — availability over perfect enforcement.

---

## 5. Design considerations

1. **Interface-first design pays off at swap time.** The `RateLimitStore` interface was designed
   in Tutorial 01 specifically to be swappable. Implementing `UpstashRateLimitStore` required
   zero changes to `RateLimiter` and three lines in the route. This is the payoff: a security
   control designed as a dependency injection point, not a hardcoded implementation.

2. **Redis sorted set for sliding-window-log.** The natural Redis structure for a sliding window
   is a **sorted set** (`ZSET`): score = timestamp (ms), member = unique string. The algorithm:
   - `ZADD` — record this hit
   - `ZREMRANGEBYSCORE 0 {cutoff}` — evict entries older than the window
   - `ZRANGE 0 -1` — read back the surviving entries (one per hit in window)
   - `EXPIRE` — set a TTL so idle keys don't accumulate forever

   The count of surviving entries is the hit count for the window. The oldest surviving score
   is used to compute `resetMs`.

3. **Pipeline, not Lua script.** All four commands are sent in a single pipeline (one HTTP
   round-trip to Upstash). This is not fully atomic — a crash between ZADD and ZREMRANGEBYSCORE
   leaves a stale entry until the next call evicts it. For a rate limiter, a slightly stale
   count in one direction is acceptable. A Lua script (`EVAL`) would be fully atomic but adds
   complexity and a Redis scripting dependency. Pipeline is the right pragmatic choice here.

4. **Graceful fallback, not fail-closed.** `createUpstashStore()` returns `null` when env vars
   are absent; the route falls back to `MemoryRateLimitStore`. Two consequences:
   - CI and local dev work without any Redis configuration.
   - If Redis goes down in production, the fallback is per-instance in-memory. The limiter
     degrades gracefully rather than taking the route down. The alternative — fail closed on
     Redis unavailability (return 429 for all requests) — is more secure but less available.
     For this product (showcase with real users), availability wins.

5. **HTTP REST, not TCP.** Upstash serves Redis over HTTPS REST. Serverless functions can't
   maintain persistent TCP connections across invocations (each cold start is a new process).
   The REST API is the only practical option for Vercel serverless. Trade-off: ~5–20 ms latency
   overhead vs. a persistent TCP connection that would be ~1 ms but can't exist here.

6. **Unique member per hit, not just timestamp.** Two requests arriving within the same
   millisecond would produce the same `score` and, if `member = String(now)`, the ZADD would
   update in-place (sorted sets deduplicate by member). Using `member = "${now}:${random}"` makes
   each hit a distinct entry. The random suffix is parsed back out when reading timestamps.

---

7. **Hash the IP before it reaches Redis — with a keyed hash (added Sept 2026).** The key is persisted
   by a third party (Upstash) for about one window (~65 s), so it should not contain the client IP. A
   plain SHA-256 is not enough: all 2³² IPv4 addresses hash in about 40 minutes on one laptop core (measured ~1.7 M SHA-256/s;
   minutes across cores, seconds on a GPU), so an unkeyed hash is
   reversible. `rateLimitKey()` uses HMAC-SHA256 under `RATE_LIMIT_KEY_SECRET` (128-bit truncated,
   `ip:<hex>`). If the secret is missing, a random per-instance secret is used instead: IPs stay
   unrecoverable, at the cost of per-instance (not shared) limits until the secret is configured — a
   privacy-first failure mode, announced by a one-time warning that never includes an IP.

## 6. Implementation case study

### The `RateLimitStore` interface (unchanged from Tutorial 01)

```typescript
// lib/security/rate-limit.ts
export interface RateLimitStore {
  hit(key: string, now: number, windowMs: number): number[] | Promise<number[]>
}
```

The interface returns the raw timestamps of hits in the current window. `RateLimiter.check()`
uses `hits.length` for count and `hits[0]` for the oldest timestamp (to compute `resetMs`).
By returning timestamps instead of just a count, the interface gives callers full information.

### `UpstashRateLimitStore` — the Redis adapter

```typescript
// lib/security/upstash-rate-limit-store.ts
export class UpstashRateLimitStore implements RateLimitStore {
  constructor(private redis: Redis) {}

  async hit(key: string, now: number, windowMs: number): Promise<number[]> {
    const rkey  = `rl:${key}`
    const cutoff = now - windowMs
    const member = `${now}:${Math.random().toString(36).slice(2, 9)}`  // unique per hit
    const ttlSeconds = Math.ceil((windowMs + 5_000) / 1_000)           // window + 5s buffer

    const pipeline = this.redis.pipeline()
    pipeline.zadd(rkey, { score: now, member })          // record this hit
    pipeline.zremrangebyscore(rkey, 0, cutoff)           // evict expired entries
    pipeline.zrange(rkey, 0, -1)                         // read back survivors (member strings)
    pipeline.expire(rkey, ttlSeconds)                    // auto-TTL on the key

    const results = await pipeline.exec()
    const members = (results[2] as string[] | null) ?? []
    return members
      .map(m => parseInt(m.split(':')[0], 10))           // extract timestamp from member string
      .filter(t => !isNaN(t))                            // guard against malformed entries
      .sort((a, b) => a - b)                             // ascending so hits[0] = oldest
  }
}
```

**Why `rl:` prefix?** Namespaces the rate-limit keys in case the same Redis is shared with
other features. All rate-limit keys are visible under `rl:*` for monitoring.

**Why `windowMs + 5_000` TTL?** The window is 60s; entries older than 60s are evicted on the
next call. The `+5_000` buffer ensures the key survives a brief gap in traffic without a stale
count appearing after expiry and re-creation.

### Factory function — env-var fallback

```typescript
export function createUpstashStore(): UpstashRateLimitStore | null {
  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new UpstashRateLimitStore(new Redis({ url, token }))
}
```

### Route wiring — three-line change

```typescript
// app/api/execute-workflow/route.ts
import { createUpstashStore } from '@/lib/security/upstash-rate-limit-store'

const limiter = new RateLimiter({
  limit: 10,
  windowMs: 60_000,
  store: createUpstashStore() ?? undefined,  // null → MemoryRateLimitStore default
})
```

`RateLimiter` itself did not change. The `store` option was already part of `RateLimiterOptions`
from Tutorial 01's pluggable-store design.

### Testing — mock the Redis client

Real Redis is not available in CI. The store's own tests inject a mock pipeline that returns
pre-set `zrange` results:

```typescript
function makeMockRedis(zrangeResult: string[]) {
  const pipeline = {
    zadd: () => pipeline,
    zremrangebyscore: () => pipeline,
    zrange: () => pipeline,
    expire: () => pipeline,
    exec: async () => [1, 0, zrangeResult, 1],  // zrange result at index 2
  }
  return { pipeline: () => pipeline } as Redis
}
```

The route test mocks the entire module so `@upstash/redis` (ESM) is never loaded in the jsdom
test environment:

```typescript
// app/api/execute-workflow/__tests__/route.test.ts
jest.mock('@/lib/security/upstash-rate-limit-store', () => ({
  createUpstashStore: () => null,
}))
```

This keeps the test suite **hermetic** — no network, no credentials, no environment variables
required. The existing `rate-limit.test.ts` tests remain unchanged (they inject
`MemoryRateLimitStore` directly and don't touch the new adapter).

**Test coverage added:** pipeline command order verified, timestamp parsing, NaN filtering, null
zrange (empty key), `RateLimiter` integration (allow at 6/10, block at 11/10).

---

## 7. Hands-on labs

> **Prerequisites:** an Upstash account (free tier sufficient) at [upstash.com](https://upstash.com).
> Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in `.env.local`.

1. **Observe the fallback.** Without setting env vars, run the app locally and trigger the rate
   limit (hit the endpoint 11× quickly). Confirm you get a `429`. Add `console.log` in
   `createUpstashStore()` to verify it logs "no env vars, using in-memory." Remove after.

2. **Connect real Redis.** Set the env vars and restart. Trigger 11 requests. Open the Upstash
   console → Data Browser → search for `rl:*`. Observe the sorted set key, its members
   (`{timestamp}:{random}`), and its TTL. Watch entries evict as you wait 60 seconds.

3. **Verify cross-instance behaviour (conceptual).** In the Upstash console, manually add 9
   entries to a `rl:test-ip` key with scores in the past 60 seconds (`ZADD rl:test-ip {score}
   "{score}:x"` × 9). Then make a single request from that IP and observe it gets a `429`
   (the 10th allowed + the 11th would block — try it with 10 pre-added entries).

4. **Break the uniqueness invariant.** Change `member` in `upstash-rate-limit-store.ts` to
   `String(now)` (no random suffix). Send two concurrent requests within 1 ms (wrk or
   autocannon). Observe the sorted set has fewer entries than expected — ZADD deduplicates
   same-member entries. Restore the random suffix and re-run.

5. **Simulate Redis failure.** Point `UPSTASH_REDIS_REST_URL` at a non-existent URL. Observe
   the store constructor throws at startup (not gracefully, because `new Redis()` doesn't
   validate eagerly). Propose a fix: wrap `new Redis()` in a try/catch in `createUpstashStore()`
   and return `null` on error. Implement it and add a test.

**Discussion:** The fallback from Redis to in-memory is fail-open for the multi-instance
guarantee. When would you choose fail-closed instead (return 429 on all requests when Redis is
down)? What type of application would prefer that? Does TopFlow's BYOK model change the
calculus?

---

## 8. Takeaways, mappings & further reading

- **Interface-first design enables zero-friction swaps.** `RateLimitStore` was designed to be
  injectable before a Redis adapter existed. When the adapter arrived, the rate limiter, the
  route, and every existing test remained unchanged. Security controls benefit from the same
  dependency-inversion thinking as application code.

- **Sorted sets are the right Redis primitive for sliding-window-log.** INCR+EXPIRE is simpler
  but gives you fixed-window semantics (and burst doubling at window boundaries). If accurate
  per-second counting matters, use a sorted set.

- **Graceful degradation is a product decision, not a security oversight.** Documenting it
  (as the architecture-overview.md now does) is the honest move. Undocumented degradation
  is a gap; documented degradation is an explicit trade-off.

- **Keep tests hermetic.** Mock the external dependency (Redis) at the boundary, not deep
  inside the implementation. The mock tests the store *logic* (pipeline commands, parsing,
  sorting); a real-Redis integration test (staging/manual) verifies the *wire protocol*. Both
  are needed, but only the mock belongs in CI.

| Control | CWE | OWASP / NIST |
|---|---|---|
| Durable sliding-window rate limiter | CWE-770 (Resource allocation without limits) | API4:2023 Unrestricted Resource Consumption |
| Per-IP + per-token keying | CWE-307 (Improper restriction of excessive attempts) | OWASP API4:2023 |
| Graceful Redis fallback (documented) | CWE-703 (Improper error handling) | — |

**Further reading:** Redis sorted set commands (`ZADD`, `ZREMRANGEBYSCORE`, `ZRANGE`) —
Redis docs; Upstash REST API docs; OWASP API Security Top 10 (API4); Martin Fowler on
Dependency Injection; companion Tutorial 01 (in-memory sliding window baseline).
