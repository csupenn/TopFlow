# AI Security Tutorials — TopFlow GitHub Security Scanner

A hands-on cybersecurity / AI-security training series built from **real hardening work** on
TopFlow's LLM workflow engine and its flagship GitHub Security Scanner. Each tutorial turns a
shipped pull request into a teaching case study: you see the threat, the model, the attack, the
design trade-offs, and the actual code that fixed it.

> These are training materials. They reference real files and PRs in this repository so learners
> can read the production code alongside the lesson.

## Who this is for
Application & platform engineers, security engineers, and AI/ML engineers shipping LLM-powered
products. Comfort with TypeScript and basic web security is assumed; each tutorial recaps the
concepts it depends on.

## How each tutorial is structured
A consistent template so the series compounds:

1. **Context & architecture** — where the risk lives in this system.
2. **Security mechanism** — the defensive concept(s), in general terms.
3. **Threat model** — assets, trust boundaries, entry points, STRIDE mapping for *this* architecture.
4. **Attack trees** — attacker goals decomposed into concrete paths (incl. the ones we did *not* fully close).
5. **Design considerations** — the decisions and trade-offs, with the roads not taken.
6. **Implementation case study** — a walkthrough of the real PR: code, tests, what was deferred and why.
7. **Hands-on labs & exercises** — do/observe/break, plus discussion questions.
8. **Takeaways, mappings & further reading** — OWASP / CWE / NIST / MITRE references and a checklist.

## Tutorials

| # | Topic | Source | Status | Read | Related blog post |
|---|---|---|---|---|---|
| 01 | Securing workflow egress & execution: SSRF guard, cycle detection, rate limiting | PR #12; updated for PR #29 (Sept 2026) | Draft 2026-06-14, updated 2026-09-26 | [tutorial](01-ssrf-cycle-detection-rate-limiting-2026-06-14-draft.md) | [Preventing SSRF Attacks in AI Agent Workflows](https://www.topflow.dev/blog/preventing-ssrf-attacks-ai-workflows) |
| 02 | Secrets at rest: BYOK key encryption in a zero-backend app | W1 key-encryption | Draft 2026-06-14 | [tutorial](02-secrets-at-rest-byok-key-encryption-2026-06-14-draft.md) | [The Bug That Made My Encryption Instantly Useless](https://www.topflow.dev/blog/encryption-bug-aes-gcm-ephemeral-key) |
| 03 | JS-node sandbox isolation: replacing `new Function()` with a real isolate | W1-T3 | Not started — blocked | — | — (pending T3: `quickjs-emscripten` dep-add PR) |
| 04 | Durable rate limiting: from in-memory to Redis/KV across serverless instances | W1-T4 (PR #20) | Draft 2026-06-14 | [tutorial](04-durable-rate-limiting-2026-06-14-draft.md) | — (planned) |
| 05 | The Untrusted Reasoning Worker: constraining LLMs on security/compliance paths | W2 Phase 1 | Draft 2026-06-14 | [tutorial](05-urw-constrained-selector-2026-06-14-draft.md) | [The Untrusted Reasoning Worker: Why I Don't Let the LLM Decide](https://www.topflow.dev/blog/untrusted-reasoning-worker-llm-security) |
| 06 | Security regression engineering: parser differentials, single source of truth, log-privacy canaries | PRs #25, #29, #30 (Sept 2026) | Planned — code shipped | — | — (planned) |

**Tutorial → implementation mapping:** each tutorial is written once the corresponding code lands. Tutorial 03 is blocked until the `quickjs-emscripten` dep-add PR merges. Tutorials 01, 02, 04, and 05 are complete drafts. Tutorial 06's code is merged and verified in production; the tutorial is next. Tutorial 05 was drafted alongside W2 Phase 1 shipment — no new deps required.

See `docs/development/osv-scanner/05-implementation-status.md` for the live implementation tracker (what's shipped, what's blocked, what's next).

## Companion design docs
- `docs/architecture/urw-llm-pipeline-design.md` — the Untrusted Reasoning Worker trust boundary.
- `docs/architecture/osv-real-scan-design.md` — the real OSV scanning architecture.
- `docs/development/osv-scanner/01-p0-security-hardening.md` — the hardening program these tutorials track.
