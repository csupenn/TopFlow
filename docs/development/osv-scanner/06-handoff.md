# Handoff — OSV Scanner Security Program

> **Historical (June 2026).** Kept as a record of the June pause. For current status see
> `05-implementation-status.md`; for the September work see its "Post-M1 hardening" and "M1.5" sections.

**Written:** 2026-06-14  
**Branch at pause:** `feature/t4-durable-rate-limiter` (current working branch)  
**Program tracker:** `05-implementation-status.md`  
**Roadmap:** `00-roadmap.md`

This document captures exactly where things stand so work can resume without context loss.
Read this first, then `05-implementation-status.md` for the granular task table.

---

## 1. What was completed in this session

### Bugs fixed (CI was failing on arrival)

| Bug | File | What happened |
|---|---|---|
| `prefer-const` lint error | `lib/security/__tests__/rate-limit.test.ts:20` | `let now = 0` never reassigned → changed to `const` |
| `window is not defined` crash | `jest.setup.js` | `matchMedia` mock ran unconditionally; `encryption.test.ts` uses `@jest-environment node` where `window` doesn't exist → wrapped in `if (typeof window !== 'undefined')` |
| `TS2769` type error | `lib/security/encryption.ts:46` | TypeScript 5.x made `Uint8Array` generic; `SubtleCrypto.importKey` requires `Uint8Array<ArrayBuffer>` not `Uint8Array<ArrayBufferLike>` → cast at call site |

### Security controls shipped

| Task | What shipped | Key files |
|---|---|---|
| **T1 SSRF egress guard** | Blocks private/reserved IP ranges, metadata endpoints, non-HTTP schemes; provenance-aware exemption for engine-internal routes | `lib/security/ssrf.ts` |
| **T2 Cycle detection** | DFS three-color pre-execution check, fail-closed, returns cycle path | `lib/security/workflow-graph.ts` |
| **T4 In-memory rate limiter** | Sliding-window, injectable clock, pluggable `RateLimitStore` interface | `lib/security/rate-limit.ts` |
| **T4 Durable rate limiter** | `UpstashRateLimitStore` using Redis sorted-set pipeline; env-var factory with in-memory fallback | `lib/security/upstash-rate-limit-store.ts` |
| **T5 AES-256-GCM encryption** | Fixed ephemeral-key bug (key now persisted to localStorage); encrypt-on-save / decrypt-on-load wired into all three dialogs | `lib/security/encryption.ts` |
| **T6 Claims reconciliation** | `architecture-overview.md` now accurately describes sandbox and rate-limit limitations and SSRF implementation | `docs/architecture/architecture-overview.md` |
| **T7 Drop `ignoreBuildErrors`** | `typescript.ignoreBuildErrors` removed from `next.config.mjs`; `tsc --noEmit` exits clean | `next.config.mjs` |
| **W2 Phase 1 URW constrained-selector** | Demotes LLM to ranker/selector on the scanner narrative path; minimized view, constrained schema, existence validation, deterministic assembly, commentary strip, audit record | `lib/security/urw.ts` + engine + `renderReport` |

### Tutorials drafted

| Tutorial | Topic | File |
|---|---|---|
| 01 | SSRF, cycle detection, rate limiting | `docs/AI-Security/osv-scanner/01-ssrf-cycle-detection-rate-limiting-2026-06-14-draft.md` |
| 02 | AES-256-GCM BYOK key encryption | `docs/AI-Security/osv-scanner/02-secrets-at-rest-byok-key-encryption-2026-06-14-draft.md` |
| 04 | Durable rate limiting: in-memory → Redis | `docs/AI-Security/osv-scanner/04-durable-rate-limiting-2026-06-14-draft.md` |
| 05 | Untrusted Reasoning Worker: constraining LLMs | `docs/AI-Security/osv-scanner/05-urw-constrained-selector-2026-06-14-draft.md` |

Tutorial 03 (JS-node sandbox) is not started — blocked until T3 ships.

### Infrastructure

- CI pipeline added: `.github/workflows/ci.yml` — lint → type-check → test → build on every PR to dev
- Test count grew from ~0 to **536 tests, 27 suites**, all passing
- `docs/development/osv-scanner/README.md` and `05-implementation-status.md` created as live trackers

---

## 2. Branch state right now

| Branch | Contents | Status |
|---|---|---|
| `main` | M0 + M1 security controls + W2 Phase 1 + Tutorials 01/02/05 | ✅ Last synced this session (22-commit merge) |
| `dev` | Same as main tip (`bb4333f`) | ✅ Clean |
| `feature/t6-t7-claims-reconciliation` | T6 (architecture-overview.md) + T7 (drop ignoreBuildErrors) | ✅ CI green — **needs merge to dev** |
| `feature/t4-durable-rate-limiter` | T4 durable rate limiter + Tutorial 04 | ✅ CI green — **needs merge to dev** |
| `feature/github-oauth` | OAuth work (pre-existing, unrelated) | Kept, untouched |

### Immediate next steps before resuming new work

1. Merge `feature/t6-t7-claims-reconciliation` → `dev`
2. Merge `feature/t4-durable-rate-limiter` → `dev`
3. Sync `dev` → `main` (PR with summary of T4/T6/T7 + Tutorial 04)
4. Set up Upstash env vars in Vercel and GitHub Actions — guide at:
   `docs/notes/zz_june_2026/redis/upstash-setup-guide.md`

---

## 3. Remaining backlog (ordered)

### T3 — JS-node sandbox replacement

**What:** Replace `new Function()` in JavaScript/Tool nodes with a real isolate.  
**Why blocked:** requires adding a new dependency (`quickjs-emscripten` or `isolated-vm`). CI uses `pnpm install --frozen-lockfile` — adding a dep requires updating `pnpm-lock.yaml` in the same PR.  
**How to do it:**
1. Create branch `feature/t3-js-sandbox`
2. Run `pnpm add quickjs-emscripten` locally → commits `pnpm-lock.yaml` alongside the code
3. Replace `new Function(code)(inputs)` in `lib/topflow-execution-engine.ts` with a QuickJS call
4. Add tests — especially a "sandbox escape" test (try to reach `process.env`, assert it's undefined)
5. Write Tutorial 03 in the same PR

**Candidate packages in priority order:**
- `quickjs-emscripten` — pure WASM, no native compilation, works on Vercel edge ← recommended
- `isolated-vm` — fastest but requires native compilation and a non-edge runtime
- Web Worker shim via `vm.runInNewContext` — no new dep but leaks Node globals

**Co-develops with:** W2 Phase 2 (trifecta guard) — both touch the execution engine.

---

### W2 Phase 2 — Trifecta guard + human-gated sinks

**What:** Close the "lethal trifecta" hazard for the future GitHub Action / PR-comment bot.  
**Context:** The trifecta = private repo data + untrusted issue/PR text + external write actions. Design doc: `docs/notes/zz_june_2026/osv-scanner-design/04-topflow-osv-scanner-framework-alignment-06-13-2026.md` §3c.  
**Concrete tasks:**
- Add a "quarantine reader" capability: any component that reads untrusted repo content (issues, PR bodies) must be capability-stripped (no tool access, no write capability) and emit only structured data
- Add human-gate stubs on any write path (PR open, comment post) — even if writes aren't built yet, the gate discipline must be in the spec before the capability is added
- Extend the URW audit record to include input trust classification

**Depends on:** T3 (same files). Batch together.

---

### Tutorial 03 — JS-node sandbox

**What:** Case-study tutorial covering the `new Function()` → real isolate migration.  
**Status:** Not started.  
**Blocked until:** T3 ships.  
**Write immediately after T3 PR merges** — same pattern as Tutorial 04.

---

### W3 — Second template: PII detection

**What:** Make the PII Detection & Redaction template real (currently demo-only).  
**Why now:** URW Phase 1 established the pattern; PII detection is the most compelling second instance (GDPR positioning).  
**Detail doc:** `03-p1-second-template.md`  
**Depends on:** W2 Phase 1 (✅ done).

---

### W4 — Distribution loop

**What:** GitHub Action / PR-comment bot + real README badges + SEO content pages.  
**Warning:** The PR-bot is a lethal-trifecta configuration — build W2 Phase 2 first. Do not ship write actions without the human gate.  
**Detail doc:** `04-p1-distribution-loop.md`  
**Depends on:** W2 Phase 2 complete.

---

## 4. Key architectural decisions (don't undo these)

**`RateLimitStore` is an interface, not a class.** The `RateLimiter` accepts any store. `createUpstashStore()` returns `null` when env vars are absent, which falls back to `MemoryRateLimitStore`. This was designed so the swap from in-memory to Redis was a 3-line route change. Keep this pattern for any future store variants.

**`generateObject` not `generateText` on the URW path.** The LLM analysis node uses `generateObject` with `URW_CONSTRAINED_SCHEMA` — this forces schema compliance at the provider API level. Switching to `generateText` + regex would break the structural injection guarantee.

**Advisory descriptions excluded from the minimized view.** `buildMinimizedView` deliberately omits `description` and `fix` fields from OSV findings before they reach the LLM. These are third-party text and the primary prompt-injection surface. Omission beats sanitization — do not re-add these fields.

**Fail-closed ID validation.** `validateFindingIds` drops any ID the LLM returns that isn't in the ground-truth `knownIds` set. If all returned IDs are fabricated, `executeUrwAssembly` falls back to deterministic ordering of all known IDs. The user always gets a report; fabrication degrades to the baseline, never to success.

**`jest.config.js` `transformIgnorePatterns`.** `@upstash/redis` ships ESM and needs to be transformed by babel-jest. The pattern is `'/node_modules/(?!@upstash/redis)'`. Do not revert this to a blanket `'/node_modules/'` or the Upstash store tests will fail with "unexpected token."

**Route test mocks `upstash-rate-limit-store`.** `app/api/execute-workflow/__tests__/route.test.ts` mocks the entire module (`jest.mock('@/lib/security/upstash-rate-limit-store', () => ({ createUpstashStore: () => null }))`). This prevents `@upstash/redis` (ESM) from being loaded in the jsdom test environment. Keep this mock.

---

## 5. Environment variables needed for production

| Variable | Where to get it | Where to set it | Purpose |
|---|---|---|---|
| `UPSTASH_REDIS_REST_URL` | Upstash console → REST API section | Vercel → Settings → Environment Variables; GitHub Actions secrets | Durable rate limiter |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash console → REST API section | Same | Durable rate limiter |

Without these vars the rate limiter silently falls back to in-memory (no crash, no error). The app works — but the cross-instance durability benefit is inactive.

Full setup walkthrough: `docs/notes/zz_june_2026/redis/upstash-setup-guide.md`

---

## 6. Test suite health (at pause point)

| Metric | Value |
|---|---|
| Total tests | 536 |
| Test suites | 27 |
| All passing | ✅ |
| TypeScript errors | 0 (`tsc --noEmit`) |
| Lint errors | 0 |

New suites added this session: `ssrf`, `workflow-graph`, `rate-limit`, `encryption`, `urw`, `upstash-rate-limit-store`.

CI runs on every PR to dev: `.github/workflows/ci.yml` — lint → type-check → test → build.

---

## 7. Where to resume (first 30 minutes back)

1. **Check CI** on the two pending branches (`feature/t6-t7-claims-reconciliation`, `feature/t4-durable-rate-limiter`) — both were green at pause.
2. **Merge both** → dev, then sync dev → main.
3. **Set Upstash env vars** in Vercel (see setup guide) so T4 is active in production.
4. **Start T3** on a new branch `feature/t3-js-sandbox` — `pnpm add quickjs-emscripten` is the first command.
