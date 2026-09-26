# Continuous Integration

TopFlow runs CI via GitHub Actions, defined in `.github/workflows/ci.yml`.

## When it runs

- **push** to `master`, `main`, or `dev`
- **pull_request** targeting `master`, `main`, or `dev`

> Note: GitHub evaluates `pull_request` workflows from the **base branch**, so the
> workflow must exist on the branch you target (e.g. `dev`) for PR checks to run.

## Jobs

1. **Lint and Type Check** — `pnpm lint`, then `pnpm type-check` (blocking).
2. **Run Tests** — `pnpm test` (Jest); a coverage report is uploaded as an artifact.
3. **Build Application** — `pnpm build`, gated on the first two jobs passing.

All jobs run on Node 22 + pnpm 9 with a cached pnpm store.

## Type safety is enforced twice

`typescript.ignoreBuildErrors` was removed from `next.config.mjs` (M1 / T7), so `next build`
fails on TypeScript errors. The dedicated `pnpm type-check` step (`tsc --noEmit`) runs earlier
and gives a faster, clearer failure — keep it green.

## Local-only files are excluded

`docs/` is excluded from both `tsconfig.json` and ESLint. Private working notes under `docs/`
are gitignored and may contain scratch `.ts` files; excluding the folder keeps the local
`type-check`/`lint` results identical to CI.

## Pre-commit hook

Husky runs `lint-staged`, which applies `eslint --fix` to the staged files only
(`app/`, `components/`, `lib/`, `hooks/`).

## Run the same checks locally

```bash
pnpm install
pnpm lint
pnpm type-check
pnpm test
pnpm build
```
