# OSV Scanner — Development Docs

This folder is the working documentation hub for the GitHub Security Scanner feature and the broader security hardening program that grew out of it.

---

## What this is

The OSV scanner turns TopFlow into a **real** security tool: given a GitHub repo, it fetches dependency manifests, queries the [OSV.dev](https://osv.dev) API, and returns structured vulnerability findings. The LLM is used only as a constrained selector over those findings — it cannot invent CVEs or modify severities.

The work here is tracked across two P0 workstreams (W1 security hardening, W2 URW trust boundary), two P1 workstreams (W3 second template, W4 distribution loop), and W6 (real scans on the hosted service, AI spending on request, accurate results).

---

## Folder index

| File | What it covers |
|------|----------------|
| `README.md` | This file — orientation and navigation |
| `00-roadmap.md` | Priority matrix, milestone sequencing, cross-cutting concerns |
| `01-p0-security-hardening.md` | W1: closing the 5-layer defense integrity gap (SSRF, cycles, sandbox, rate limit, key encryption) |
| `02-p0-urw-trust-boundary.md` | W2: demoting the LLM to a constrained selector on security/compliance templates |
| `03-p1-second-template.md` | W3: making PII Detection real (the second URW-compliant template) |
| `04-p1-distribution-loop.md` | W4: real badge API, GitHub Action/PR bot, shareable report cards |
| `05-implementation-status.md` | Live tracking: what's shipped, what's in progress, what's blocked and why |
| `06-handoff.md` | Historical (June 2026 pause); superseded by `05-implementation-status.md` |
| `07-w6-real-scans-and-accurate-results.md` | W6: real scans on the hosted service, AI spending only on request, accurate results (design §15) |

## Tutorial series

Each shipped hardening slice has a companion tutorial in `docs/AI-Security/osv-scanner/` — the public-facing teaching layer. Tutorials cover threat model, attack trees, design decisions, code walkthrough, and hands-on labs. See that folder's `README.md` for the full tutorial index and status.

---

## Companion architecture docs (the "why" and the design)
- `docs/architecture/osv-real-scan-design.md` — two-axis BYOK model (data axis = GitHub token, narrative axis = AI key)
- `docs/architecture/urw-llm-pipeline-design.md` — Untrusted Reasoning Worker design for the LLM pipeline

---

## How to navigate

**Starting fresh?** Read `00-roadmap.md` for the priority matrix and milestone map, then the architecture docs to understand the design before touching code.

**Picking up a task?** Check `05-implementation-status.md` first — it records what's actually shipped vs what the roadmap claims, open blockers, and the constraints that affect sequencing.

**Adding to this folder?** Keep file names prefixed and numbered (`NN-slug.md`). Update `05-implementation-status.md` and this README when something ships or a new blocker is discovered.

---

## Key constraints (read before planning a task)

1. **`pnpm install --frozen-lockfile` in CI** — adding a new dependency requires updating the lockfile locally and committing it, which means a dedicated PR. The two highest-impact remaining tasks (JS-node sandbox replacement and durable Redis rate limiter) are both blocked on this. See `05-implementation-status.md` for the planned approach.

2. **`@jest-environment node` tests need a guarded `jest.setup.js`** — any test file that uses Web Crypto or other Node-only APIs must carry the `@jest-environment node` docblock. `jest.setup.js` must guard any `window.*` access with `typeof window !== 'undefined'`.

3. **TypeScript 5.x `Uint8Array` generics** — `SubtleCrypto.importKey` requires `Uint8Array<ArrayBuffer>`, not `Uint8Array<ArrayBufferLike>`. Cast at call sites; do not widen the type.

4. **No `typescript.ignoreBuildErrors` bypass** — the CI type-check gate is real. All new code must be type-clean before merging.
