# OSV Scanner — Implementation Status

**Last updated:** 2026-09-26  
**Branch baseline:** `main` = `dev` @ `b180e80` (PR #31)

This document is the ground truth between what the roadmap plans and what the code actually does. Update it as things land or get blocked — not after the fact.

---

## M0 — OSV stack + CI (complete)

| Item | Status | Commit / PR | Notes |
|------|:------:|-------------|-------|
| Real OSV scanning (`lib/osv/scanner.ts` + `/api/scan/github`) | ✅ Shipped | PR feature/osv-real-scan | Fetches manifests, queries OSV.dev, returns `ScanResult` |
| Per-axis BYOK gating (`resolveScanModes`, `resolveReportModel`, `renderReport`) | ✅ Shipped | PR feature/osv-real-scan-gating | Data axis = GitHub token, narrative axis = AI key |
| UI: real/demo toggle + GitHub-token field | ✅ Shipped | PR feature/osv-real-scan-ui | Sends `githubToken`/`scanMode` in the execute payload |
| CI on `dev` PRs (lint → type-check → test → build) | ✅ Shipped | PR feature/osv-ci-pipeline | `.github/workflows/ci.yml`; fork Actions pending enablement by repo owner |
| URW architecture design | ✅ Shipped | PR feature/urw-llm-pipeline-design | `docs/architecture/urw-llm-pipeline-design.md` |

---

## M1 — Trust core (in progress)

### W1 — 5-layer defense hardening

| Task | Status | Notes |
|------|:------:|-------|
| **T1 SSRF egress guard** (block private/reserved ranges, enforce http/s only, allow scanner's internal `/api/scan/github`) | ✅ Shipped | `feat(security): SSRF egress guard` — `lib/security/` |
| **T2 Cycle detection** (DFS pre-execution, reject cyclic graphs, server-side enforcement) | ✅ Shipped | Same commit as T1 |
| **T4 Durable rate limiter** (sliding-window, injected clock, `MemoryRateLimitStore` → `UpstashRateLimitStore`) | ✅ Shipped | `lib/security/rate-limit.ts` + `upstash-rate-limit-store.ts`; Redis when env vars present, in-memory fallback |
| **T5 Encrypt API keys at rest** (AES-256-GCM, Web Crypto, encrypt-on-save / decrypt-on-load) | ✅ Shipped | `lib/security/encryption.ts`; wired into settings + scanner dialogs; decrypt-before-send in execution panel |
| **T6 Reconcile claims/docs** | ✅ Done | `architecture-overview.md` updated: SSRF provenance-aware exemption documented, rate-limit describes MemoryStore→UpstashStore, sandbox limitation (T3 deferred) noted — PR #19 |
| **T3 JS-node sandbox replacement** (isolated-vm / QuickJS-wasm) | 🔴 Blocked | Requires new dependency — see blocker below |
| **T7 Drop `typescript.ignoreBuildErrors`** | ✅ Done | Removed from `next.config.mjs`; `tsc --noEmit` exits clean; CI type-check gate confirms — PR #19 |

### W2 — URW trust boundary

| Task | Status | Notes |
|------|:------:|-------|
| Phase 1 — constrained-selector (tasks 1.1–1.7) | ✅ Shipped | `lib/security/urw.ts` + engine + `renderReport`; 26 tests |
| Phase 2 — trifecta guard + human-gated sinks | 🔲 Not started | Co-develops with W1 T1/T2 (same files) |

---

## Bugs found and fixed during M1

### encryption.ts: silent key loss (critical)

**What was wrong:** `getEncryptionKey()` called `crypto.subtle.generateKey()` on every invocation. AES-GCM decryption requires the exact key used to encrypt. Every call produced a fresh key → ciphertext was immediately unrecoverable.

**How it was fixed:** The function now generates once, caches in module scope (`cachedKey`), and persists the raw key bytes to `localStorage` (base64-encoded) so it survives page reloads. On subsequent calls it imports the persisted bytes back via `importKey`. Legacy plaintext values pass through `decryptValue` unchanged for backward compatibility.

**Tests:** 9/9 round-trip tests pass (`lib/security/__tests__/encryption.test.ts`) — encrypt → decrypt identity, random IV (two ciphertexts of same input differ), `isEncrypted` prefix detection, `encryptApiKeys`/`decryptApiKeys` round-trip with empty-value skipping.

**Security note (honest limitation):** A client-held key is not XSS-proof. A script running in the page can read both the ciphertext and the key from `localStorage`. This protects against plaintext-at-rest inspection / casual exfiltration but not against a script-injection attacker. Documented in code comments and Tutorial 02.

### encryption.ts: TypeScript 5.x `Uint8Array` generic mismatch

**What was wrong:** `SubtleCrypto.importKey` expects `BufferSource` → `ArrayBufferView<ArrayBuffer>`. TypeScript 5.x made `Uint8Array` generic: `Uint8Array<ArrayBufferLike>`. The `raw` variable (which can be loaded from `Uint8Array.from(...)` or assigned `new Uint8Array(32)`) is typed as `Uint8Array<ArrayBufferLike>` after reassignment, which is not assignable to `ArrayBufferView<ArrayBuffer>`.

**How it was fixed:** Cast at the call site: `raw as Uint8Array<ArrayBuffer>`. The runtime value is always a plain `ArrayBuffer`-backed array; the cast is sound.

**CI symptom:** `TS2769: No overload matches this call` at `encryption.ts:46`, exit code 2 on the Lint and Type Check job.

### jest.setup.js: `window is not defined` in `@jest-environment node` tests

**What was wrong:** `jest.setup.js` unconditionally called `Object.defineProperty(window, 'matchMedia', ...)`. `encryption.test.ts` carries `@jest-environment node` (needed to use `node:crypto`'s `webcrypto`). In the Node environment, `window` is not defined → the setup file crashed before any test ran.

**How it was fixed:** Wrapped the `matchMedia` mock in `if (typeof window !== 'undefined')`.

**CI symptom:** `ReferenceError: window is not defined` in `jest.setup.js:112`, entire `encryption.test.ts` suite failed to run, exit code 1 on the Run Tests job.

### rate-limit.test.ts: `prefer-const` lint error

**What was wrong:** `let now = 0` in the "keys are isolated" test was never reassigned; ESLint's `prefer-const` rule rejects it.

**How it was fixed:** Changed to `const now = 0`.

**CI symptom:** 1 lint error, exit code 2 on the Lint and Type Check job.

---

## Post-M1 hardening (September 2026)

Found by re-baselining the repo after a pause and by tightening the test process. Two were real
defects in shipped code (H4 privacy, H11 SSRF bypass). Each shipped with a red-before/green-after test.

| Item | What | PR | Status |
|------|------|----|:------:|
| **H4 Log privacy** | Execution path logged user inputs, prompt inputs and repo names to server logs. Now logs counts/ids only; canary test `app/api/execute-workflow/__tests__/log-privacy.test.ts` runs the real route + engine + demo path | #25 | ✅ Shipped |
| **H1–H3 Gate parity** | Local type-check/lint = CI (`docs/` excluded); CI on Node 22; lint-staged lints staged files only | #26 | ✅ Shipped |
| **H6 Honest coverage** | Global 75% threshold was never met (~17%) and CI hid it (`continue-on-error`). Now per-file thresholds on the security core + execute route, a global ratchet floor, and a blocking `pnpm test:ci` | #28 | ✅ Shipped |
| **H11 SSRF bypass** | IPv4-mapped IPv6 in the URL parser's hex form (`[::ffff:a9fe:a9fe]` = `169.254.169.254`) passed `checkOutboundUrl`. Hex-embedded IPv4 is now decoded and re-checked; tests go through the parser | #29 | ✅ Shipped, verified in production |
| **H10 Validation panel parity** | `validation-engine.ts` (builder panel) had 0% coverage and a drifted copy of SSRF/cycle rules (reported "passed" for `[::1]`, CGNAT, `*.internal`, `file:`). Now delegates to `ssrf.ts` + `workflow-graph.ts`; 0% → 100% lines | #30 | ✅ Shipped |

### ssrf.ts: IPv4-mapped IPv6 bypass via URL normalization (H11)

**What was wrong:** the WHATWG `URL` parser rewrites embedded IPv4 in IPv6 hosts to hex before the
guard sees the hostname (`http://[::ffff:127.0.0.1]/` → `[::ffff:7f00:1]`). `isBlockedIpv6` matched only
the dotted `::ffff:a.b.c.d` form, so loopback/private/metadata targets written this way were allowed.

**Why tests missed it:** the existing test passed the dotted string directly to `isBlockedHost`; production
input always goes through `new URL()` first.

**Fix:** decode `::ffff:x:y` (mapped) and `::x:y` (deprecated compatible) to dotted IPv4 and apply the IPv4
rules. Regression tests call `checkOutboundUrl` with production-shaped URLs (including decimal/octal/hex
IPv4 hosts, which the parser already normalizes safely). Tutorial 01 documents the finding (Lab 6).

---

## Open blockers

### B1 — `pnpm install --frozen-lockfile` prevents adding new dependencies in CI

CI runs `pnpm install --frozen-lockfile`. Adding a new package (even devDependencies) fails the install step unless the `pnpm-lock.yaml` is updated and committed in the same PR. This blocks:

| Blocked task | Candidate package(s) | Risk level |
|--------------|---------------------|------------|
| **T3 JS-node sandbox** | `isolated-vm`, `quickjs-emscripten`, or a Worker-based shim | Medium — adds native module or wasm bundle |
| ~~**T4 Durable rate limiter**~~ | ✅ Shipped in PR #20 with `@upstash/redis` (custom sorted-set store, no `@upstash/ratelimit`) | — |

**Historical — approach used for T4 (now shipped):**
The `MemoryRateLimitStore` currently ships with an injected-clock interface specifically to make this swap clean. Adding `@upstash/ratelimit` is the right next step. The PR adding it must:
1. Run `pnpm add @upstash/ratelimit @upstash/redis` locally to update `pnpm-lock.yaml`
2. Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to Vercel environment and GitHub Actions secrets
3. Implement a `RedisRateLimitStore` satisfying the same interface as `MemoryRateLimitStore`
4. Fall back to `MemoryRateLimitStore` in test environments (no Redis in CI)

**Planned approach for T3 (JS-node sandbox):**
Evaluate in this order: (1) `quickjs-emscripten` — pure wasm, no native binaries, works in Vercel edge; (2) `isolated-vm` — fastest but requires native compilation and a non-edge runtime; (3) a Web Worker shim using `vm.runInNewContext` — no new dep but leaks Node globals. Recommendation: start with `quickjs-emscripten` for compatibility, open a dedicated PR.

---

## What's next (ordered)

1. ~~**W2 Phase 1** — constrained-selector~~ ✅ shipped (`lib/security/urw.ts`)
2. ~~**T4 durable rate limiter**~~ ✅ shipped (`lib/security/upstash-rate-limit-store.ts`; PR #20)
3. ~~**T6 claims reconciliation**~~ ✅ shipped (`docs/architecture/architecture-overview.md`; PR #19)
4. ~~**T7 drop `ignoreBuildErrors`**~~ ✅ shipped (`next.config.mjs`; PR #19)
5. ~~**Post-M1 hardening** (H4, H6, H10, H11)~~ ✅ shipped (PRs #25–#31, Sept 2026)
6. **Rate-limit key privacy** — key Redis by a keyed hash of the client IP, not the raw IP (today: raw IP, ~65 s TTL)
7. **CSP header** — report-only first, then enforce
8. **T3 JS-node isolation** — design: [`docs/architecture/js-node-isolation-design.md`](../../architecture/js-node-isolation-design.md) (QuickJS/WebAssembly inside a `worker_thread`; spike results included). Since Sept 2026 (H17) custom JS/Tool code is refused on the hosted service until this ships
9. **W2 Phase 2** — trifecta guard + human-gated sinks (co-develops with T3)
10. **W3 PII Detection** — M2, after URW Phase 1 establishes the pattern

---

## Tutorial series status (`docs/AI-Security/osv-scanner/`)

Each shipped hardening slice produces a companion tutorial — a case-study-style teaching doc covering threat model, attack trees, design decisions, implementation walkthrough, and hands-on labs. Tutorials are written **after** the code lands; they are the public evidence layer for the CISO positioning.

| Tutorial | Topic | Tied to | Code status | Tutorial status |
|----------|--------|---------|:-----------:|:---------------:|
| 01 | SSRF egress guard, cycle detection, rate limiting | W1-T1, T2, T4 (in-memory) | ✅ Shipped | ✅ Draft complete (updated Sept 2026: H11 finding + Lab 6) |
| 02 | Secrets at rest: AES-256-GCM BYOK key encryption | W1-T5 | ✅ Shipped | ✅ Draft complete |
| 03 | JS-node sandbox isolation (`new Function()` → real isolate) | W1-T3 | 🔴 Blocked (dep) | 🔲 Not started |
| 04 | Durable rate limiting: in-memory → Redis/KV | W1-T4 (durable) | ✅ Shipped | ✅ Draft complete |
| 05 | Untrusted Reasoning Worker: constraining LLMs on security paths | W2 Phase 1 | ✅ Shipped | ✅ Draft complete |
| 06 | Security regression engineering: parser differentials, single source of truth, log-privacy canaries | H4, H10, H11 | ✅ Shipped | 🔲 Planned |

**Rule:** a tutorial is not started until its code is merged to `dev` and CI is green. Once code ships, the tutorial draft targets completion in the same PR or the immediately following one.

Tutorial 02 documents the encryption bug-and-fix in full, including the XSS limitation and the client-held-key tradeoff (see `02-secrets-at-rest-…` for the authoritative write-up).

---

## Test coverage summary (as of `b180e80`, 2026-09-26)

| Suite | Tests |
|-------|------:|
| `lib/security/__tests__/ssrf.test.ts` | 52 |
| `lib/security/__tests__/validation-engine.test.ts` | 46 |
| `lib/security/__tests__/urw.test.ts` | 26 |
| `lib/security/__tests__/upstash-rate-limit-store.test.ts` | 7 |
| `lib/security/__tests__/rate-limit.test.ts` | 6 |
| `lib/security/__tests__/workflow-graph.test.ts` | 6 |
| `lib/security/__tests__/encryption.test.ts` | 5 |
| `app/api/execute-workflow/__tests__/route.test.ts` | 17 |
| `app/api/execute-workflow/__tests__/log-privacy.test.ts` | 2 |
| `lib/__tests__/osv-scanner.test.ts` | 11 |
| `lib/__tests__/scanner-axes.test.ts` | 10 |
| All other suites | 415 |
| **Total** | **603 — 29/29 suites passing** |

Coverage thresholds are **blocking** in CI (`pnpm test:ci`): the security core (`ssrf`, `rate-limit`,
`workflow-graph`, `urw`, `validation-engine`) and the execute-workflow route are held near their current
90–100%; a global ratchet floor covers the rest. Current numbers and the policy: `TESTING.md`.
