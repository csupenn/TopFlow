# W6 — Real Scans on the Hosted Service, AI Spending on Request, Accurate Results (P0/P1)

**Priority:** P0 (release blockers first), then P1 · **Effort:** M overall, in small PRs
**Design:** `docs/architecture/osv-real-scan-design.md` §15 (Revision 2)
**Tracker rows:** `05-implementation-status.md` → "M1.5"

---

## Goal

The GitHub Security Scanner should do what its page says, for any visitor, without surprise costs:

1. **Keep the zero-setup demo** (sample data for a few well-known repos), labeled as sample data.
2. **Real scans work on the hosted service** for public repos, anonymously or with the visitor's own GitHub token.
3. **No AI-provider spending unless the visitor asks for it in that run.** Saved keys make the AI report
   *available*; a per-run switch decides.
4. **Results are accurate:** fix suggestions, dependency scope and the score hold up when someone checks them.

## Owner constraints

- The v1.4.0 demo used sample data on purpose, to launch quickly; it stays.
- No LLM or image-model calls by default.
- No server-side GitHub token on the hosted service (the `GITHUB_TOKEN` fallback is for self-hosting).

## Target behavior

Two per-run switches in the run dialog, both off by default (design §15.3):

| "Run a real scan" | "Write the report with my AI key" | Data | Report | Who pays |
|:---:|:---:|---|---|---|
| off | off | sample (labeled) | built from the data | nobody |
| off | on | sample (labeled) | URW-constrained LLM | visitor's AI key |
| on | off | real (OSV + GitHub) | built from the data | GitHub quota (anonymous or visitor token); OSV is free |
| on | on | real | URW-constrained LLM | visitor's AI key + the above |

With the AI report on and a Google key saved, the image step also runs; the image is labeled "AI-generated
illustration, not scan data".

## Tasks

| # | Task | Status |
|---|---|:--:|
| 1 | Engine calls `scanRepository()` in process for the Security Scan node (no HTTP to its own origin) | ✅ in `dev` |
| 2 | Narrative axis follows the per-run switch (`aiReport`); scanner always takes the per-axis path (URW); image only with the switch + Google key, labeled | ✅ in `dev` |
| 3 | Rate-limit `GET /api/scan/github` (10/min per client, HMAC-keyed IP) | ✅ in `dev` |
| 4 | Keep `<` / `>` in `condition` fields through input sanitizing | ✅ in `dev` |
| 5 | Scanner skips template-wide API-key validation (uses only the keys a run needs) | ✅ in `dev` |
| 6 | Run dialog: AI-report switch (disabled without a saved AI key); visible switch styling | ✅ in `dev` |
| 7 | Sample-data labeling in report header, badge and exports; no substituted data for repos outside the sample set; remove `85`/`B+` defaults | 🔲 |
| 8 | Fix-version suggestions from the affected range that contains the installed version (no downgrades, no needless major or pre-release jumps) | 🔲 |
| 9 | Production vs development dependencies from lockfiles; report both, score on production | 🔲 |
| 10 | Score formula that keeps distinguishing repositories with many findings; scanner page formula table in sync | 🔲 |
| 11 | Accuracy CI gate: recorded OSV/GitHub responses for a known-vulnerable and a known-clean lockfile (no network in CI) | 🔲 |
| 12 | Skip the unchosen side of conditional branches in the engine (the base engine runs both) | 🔲 |
| 13 | Later: real cached badge (W4 task 1); decide whether real scans become the default | 🔲 |

## Acceptance criteria

Design §15.8, plus:

- Tasks 1–6: `app/api/execute-workflow/__tests__/scanner-real-scan-and-cost.test.ts` (real route + engine, AI SDK
  and scanner mocked) and `app/api/scan/github/__tests__/rate-limit.test.ts`. Each was checked to fail on the
  previous code for the intended reason (AI calls > 0; request to the app's own origin; 11th request → 200;
  `grade-check` error from the stripped `>=`).
- Task 8: fixtures built from real OSV records for packages with more than one affected release line.
- A stranger scans their own public repo on the hosted service without help, and every number shown can be
  traced to code.

## Rollout

Tasks 1–6 ship in one release: fixing the builder's real-scan path alone would have let saved AI keys start
spending on the hosted service. Tasks 7–12 ship as separate small PRs, each with its own failing-first test.
