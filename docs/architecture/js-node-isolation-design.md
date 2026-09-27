# Design: Isolating User Code in JavaScript and Tool Nodes (T3)

| | |
|---|---|
| **Status** | Proposed (design) — spike results included; Phase 0 validation pending |
| **Owner** | TopFlow |
| **Related** | `lib/topflow-execution-engine.ts`, `lib/security/trusted-code.ts`, `lib/conditions/safe-evaluate.ts`, `app/api/execute-workflow/route.ts`, `app/api/execute-workflow/__tests__/h17-user-code.test.ts`, `docs/development/osv-scanner/01-p0-security-hardening.md` (T3), `docs/architecture/architecture-overview.md` |
| **Scope** | How the hosted service can run user-written JavaScript/Tool node code safely again. Conditions stay on the safe parser. Does **not** change exported code (which users run on their own infrastructure). |

---

## 1. Summary

TopFlow's JavaScript and Tool nodes let users write code that runs during execution. Until September
2026 that code ran with `new Function(...)` **inside the server process**, where it could read
`process.env` (server secrets) and call `fetch` (bypassing the SSRF guard). That was H17. It was
**contained** on 2026-09-27: the hosted service now runs only code byte-identical to built-in template
code (`isTrustedCode`), and conditions are interpreted by a parser instead of evaluated. Custom code is
refused.

This design restores custom code with a real isolation boundary, in two layers:

1. **QuickJS compiled to WebAssembly** (`quickjs-emscripten-core` + the `release-sync` variant) — a
   separate JavaScript engine whose code has **no host APIs at all**: no `process`, `fetch`, `require`,
   timers or file system. Inputs go in and results come out as JSON only.
2. **A `worker_thread` per execution** with an **empty environment**, V8 memory limits and a wall-clock
   kill — so runaway memory, a crash of the WebAssembly module, or a QuickJS bug takes down only the
   worker, never the server function.

A spike (§6) confirmed the first layer blocks every escape we tried, and showed the second layer is
necessary: on its own, QuickJS took 6.2 s to hit its memory limit and then **aborted the host process**
when the runtime was disposed.

## 2. Why this matters

- **Feature loss today.** Containment made the hosted builder refuse all custom code, so the
  JavaScript/Tool nodes only work for built-in templates. That's safe but undermines the product.
- **The allowlist is a tripwire, not a boundary.** It's correct only as long as every template's code
  is itself harmless, and it forces exact string matching on code.
- **Credibility.** A security-focused product should demonstrate the right pattern for running
  untrusted code — isolation with explicit limits — not avoid the problem.

## 3. Threat model

**Assets:** server environment secrets (Upstash token, `RATE_LIMIT_KEY_SECRET`, …); the server's network
position (internal/metadata addresses — see SSRF); availability of the execution function; other users'
requests handled by the same warm function instance.

**Attacker:** anyone who can POST a workflow (no account needed); code is fully attacker-controlled.

| Threat | Before (≤ Sept 2026) | Contained (now) | This design |
|---|---|---|---|
| Read server secrets via `process.env` | ✗ possible | ✓ custom code refused | ✓ no `process` in QuickJS; worker has `env: {}` |
| Network egress / SSRF via `fetch` | ✗ possible | ✓ refused | ✓ no `fetch` or sockets in QuickJS |
| Escape via `constructor.constructor`, `Function` | ✗ n/a (already host) | ✓ refused | ✓ resolves to QuickJS globals only (spike) |
| CPU exhaustion (`while(true)`) | ✗ until 30 s route limit | ✓ refused | ✓ interrupt at 1 s + worker wall clock |
| Memory exhaustion | ✗ could crash the function | ✓ refused | ✓ QuickJS limit + worker `resourceLimits` + wall-clock kill |
| Crash / abort of the engine | — | — | ✓ confined to the worker |
| Cross-request data leakage | — | — | ✓ fresh module + runtime per run, nothing shared |
| Malicious *output* to downstream nodes | ✗ | — | ⚠ output is data: JSON-only, size-capped, still untrusted downstream |

## 4. Design

### 4.1 Execution path

```
engine (server)                       worker_thread (env: {}, resourceLimits)
────────────────                      ─────────────────────────────────────────
executeJavaScriptNode ──┐             load QuickJS module (fresh, ~5 ms)
executeToolNode ────────┴─ runIsolated(code, inputs, limits) ─► new runtime + context
                           │  JSON inputs (size-capped)           memory limit, stack limit
                           │                                      interrupt at deadline
                           │                                      eval wrapped code
                           ◄───────── { ok, value | error } ────  JSON.stringify(result)
                           wall-clock timer → worker.terminate()  exit (no dispose after failure)
```

### 4.2 Contract

`runIsolated(code: string, inputs: Record<string, JSONValue>, limits) → Promise<{ ok: true; value: JSONValue } | { ok: false; error: string }>`

- **In:** `inputs` are JSON-serialized; functions, class instances and circular structures are not
  supported (documented). Input size cap: 1 MB.
- **Code shape:** unchanged for users — the body of a function whose parameters are `input1…inputN`,
  using `return`. Wrapped as `(function(input1, …){ <code> }).apply(null, JSON.parse(<inputs>))`.
- **Out:** `JSON.stringify` of the return value; `undefined` → `null`. Output size cap: 256 KB.
- **Errors:** thrown errors, syntax errors, timeouts and limit hits all return `{ ok: false }` with a
  short message; the node fails, the workflow reports it. No stack traces from the host.
- **Host functions exposed:** **none**. (A bounded `console.log` capture may be added later as the only
  exception, returned alongside the result.)

### 4.3 Limits (initial values)

| Limit | Value | Enforced by |
|---|---|---|
| CPU time per node | 1 s | QuickJS interrupt handler (`shouldInterruptAfterDeadline`) |
| Wall-clock per node | 2 s | worker `terminate()` |
| QuickJS heap | 16 MB | `runtime.setMemoryLimit` |
| QuickJS stack | 512 KB | `runtime.setMaxStackSize` |
| Worker V8 heap | 64 MB old / 16 MB young | `new Worker(…, { resourceLimits })` |
| JS/Tool nodes per workflow run | 20 | engine (keeps total well under the 30 s route limit) |
| Input / output size | 1 MB / 256 KB | host, before/after the worker |

### 4.4 Packaging

- Depend on `quickjs-emscripten-core@0.32.0` + `@jitl/quickjs-wasmfile-release-sync@0.32.0` (≈1.5 MB
  on disk), **not** the umbrella `quickjs-emscripten` (≈2.4 MB, pulls four variants). Exact versions;
  lockfile regenerated with pnpm 9 in a dependency-only PR (CI uses `--frozen-lockfile`).
- The worker script and the `.wasm` file must ship inside the serverless function bundle —
  `outputFileTracingIncludes` in `next.config.mjs` if tracing misses them (Phase 0 check).

### 4.5 What stays as it is

- **Conditions** keep `lib/conditions/safe-evaluate.ts` (no code execution at all is better than
  isolated code execution); the builder's Test button already uses the same parser.
- **Exported code** is unchanged — it runs on the user's infrastructure, their trust decision.
- **The allowlist** stays as defense in depth until Phase 3, then is removed with its tests.

## 5. Alternatives considered

| Option | Why not |
|---|---|
| Keep the allowlist only | Safe, but custom code stays disabled |
| Node `vm` module | Node's docs: "not a security mechanism"; known escapes to host globals |
| `vm2` | Deprecated/archived after unfixable sandbox escapes |
| `isolated-vm` (V8 isolates) | Strong isolation, but a native module: build complexity on serverless, larger attack surface in native code; revisit if QuickJS performance is insufficient |
| `worker_threads` alone | Isolates memory/crashes but the worker is still Node: `fetch`, `require`, `process` exist |
| Child process with empty env | Same Node API surface; network egress not preventable without OS sandboxing |
| Hosted sandbox (microVM / edge isolates service) | Strong, but a new external dependency, cost and data-processing path for user code — against the "no extra processors" privacy stance |
| QuickJS in the main thread only | Spike: memory exhaustion took 6.2 s and disposing the runtime aborted the host process (§6) |

## 6. Spike results (2026-09-27, Node 24, scratch project — not in the repo)

**QuickJS alone** (`newQuickJSWASMModuleFromVariant(releaseSync)`, 32 MB limit, 1 s deadline):

| Case | Result |
|---|---|
| Module load (cold) | 4.9 ms |
| Honest transform | `{"name":"ADA","n":2}` |
| `process.env.SECRET` | `ReferenceError: 'process' is not defined` |
| `typeof process / fetch / require / globalThis.process` | all `"undefined"` |
| `this.constructor.constructor('return typeof process')()` | `"undefined"` |
| `Function('return typeof process')()` | `"undefined"` |
| `import('fs')` / `typeof setTimeout` | no module access / `"undefined"` |
| `while (true) {}` | `InternalError: interrupted` after 1,001 ms |
| Memory bomb (`'x'.repeat(1e6)` in a loop) | `out of memory` after **6,175 ms**, then **`Aborted(Assertion failed … JS_FreeRuntime)` crashed the host process on dispose** |

**QuickJS inside a `worker_thread`** (`env: {}`, `resourceLimits`, fresh module per run, 2 s wall clock):

| Case | Result |
|---|---|
| Honest code | `42` (40 ms incl. worker start) |
| `process.env.SECRET` | `'process' is not defined` |
| `while (true) {}` | interrupted at ~1 s |
| Memory bomb | killed at the 2 s wall-clock limit; **host unaffected** |
| Next run after the bomb | works (`"yes"`) |
| Average cost per run (20 runs) | **34.7 ms** |

## 7. Residual risks

- **QuickJS/WebAssembly engine bugs.** A bug in QuickJS stays inside the WebAssembly sandbox; escaping
  that requires a bug in V8's WebAssembly implementation. The worker layer adds a second boundary
  (empty env) for anything that does get out of QuickJS but not out of the worker.
- **Latency.** ~35 ms per JS/Tool node run; acceptable for workflow steps, capped by the per-run node limit.
- **Serverless packaging and behavior** (worker threads, wasm file tracing) are unverified on Vercel
  until Phase 0.
- **Output is untrusted.** Results flow into prompts, HTTP nodes and the UI; existing controls (SSRF
  guard on HTTP nodes, React escaping) apply, but nothing about isolation makes output safe.
- **Semantics.** QuickJS supports modern JavaScript but not Node APIs; templates relying on anything
  beyond ECMAScript built-ins would break (Phase 1 parity test catches this).

## 8. Phased adoption

- **Phase 0 — Packaging spike on a Vercel preview.** Dependency-only PR (exact versions, pnpm 9
  lockfile); a minimal `runIsolated` behind a feature flag that is off; confirm worker + wasm load in a
  preview deployment; measure cold/warm latency there. *Exit: preview runs `return 1` in isolation.*
- **Phase 1 — Parity.** Run every built-in template's JS/Tool code through `runIsolated` in tests and
  compare with today's results; fix or document differences. *Exit: all templates identical.*
- **Phase 2 — Enable custom code.** Engine calls `runIsolated` for all JS/Tool code; the allowlist
  remains as a second check only for templates. Extend the H17 regression test so custom code is
  *allowed* but the planted secret is still unreachable; add an escape-attempt corpus.
  *Exit: acceptance criteria below, on production.*
- **Phase 3 — Cleanup and write-up.** Remove the allowlist (or keep it as an optional "templates only"
  mode), remove the unused condition-sandbox page (tracker H18), update docs/FAQ (the §8.1 copy is done in Phase 2), Tutorial 03 (JS-node
  isolation), and the L9 epilogue.

### 8.1 Public copy to update when custom code is re-enabled (Phase 2 go-live)

While the containment is in place, public text deliberately says the hosted service runs **only built-in
template code**, and avoids promising that users can edit JavaScript/Tool nodes there. When Phase 2 is live
on production (acceptance criteria below), update every item in the same release. Where the text is
historical, add a dated update note rather than rewriting it.

| Where | Current wording (containment) | Change to |
|---|---|---|
| `app/showcase/security-scanner/page.tsx` (CTA) + `components/scanner-hero.tsx` — marked `T3-COPY` | "Inspect every node, or export it as TypeScript…" / "open and inspect" | Users can change the scoring and other JS nodes on the hosted service |
| `app/docs/build/nodes/javascript/page.tsx` (metadata, intro, security note) | custom code disabled; template code only | Isolation model, limits (§4.3), what code can't do |
| `app/docs/learn/faq/page.tsx` (3 places) | template code only, isolate planned | Isolated execution + limits |
| `lib/docs/unified-navigation.ts` (JavaScript entry) | "hosted service: built-in template code only" | Describe the isolation **without** the word "sandboxed" unless the claims guard is updated with evidence |
| `README.md` (5-layer row) | "built-in template code only; isolate planned" | Isolated execution (QuickJS + worker) |
| `docs/architecture/architecture-overview.md` | `new Function` not a sandbox; containment | New execution path (§4.1) |
| Blog: *5 Layers of Security* (A03 + layer table) | custom JavaScript disabled | Dated update note |
| Blog: *new Function is not a sandbox* ("What we can't tell you") | disabled until isolation ships | Dated update note linking the QuickJS post; body stays as written |
| `lib/__tests__/public-claims.test.ts` | bans "sandboxed JavaScript/execution/environment" | Revisit only if the new wording needs it — isolation, not a sandbox claim |
| `app/api/execute-workflow/__tests__/h17-user-code.test.ts` | custom code refused | Custom code allowed, planted secret still unreachable (Phase 2) |

Find stragglers before the release:

```bash
grep -rnE "T3-COPY|built-in template code|until (real )?isolation|isolat(e|ion) (planned|ships)|custom code is currently disabled" \
  app components lib README.md docs/architecture docs/guides
```

## 9. Acceptance criteria

The hosted service can run custom JavaScript/Tool code again when all of these hold on production:

1. A workflow whose JavaScript node reads a planted secret from `process.env` returns an error, and the
   secret never appears in the response or logs (existing H17 test, flipped to allow custom code).
2. An escape corpus (`constructor` chains, `Function`, `import()`, prototype pollution of `Object`,
   `globalThis` probing) cannot observe `process`, `fetch` or `require`.
3. `while(true){}` fails within 1.5 s; a memory bomb fails within the wall-clock limit; the next
   request on the same instance succeeds.
4. Every built-in template produces the same output as before (Phase 1 parity).
5. p95 added latency per JS/Tool node ≤ 100 ms on production.
6. No new CSP violations; no user code or inputs in server logs (log-privacy test still green).
