# Security Policy

TopFlow is a security-focused project, and reports are welcome. Please report vulnerabilities **privately**
so they can be fixed before details are public.

## How to report

- **Email:** charlie@charliesu.com, with "TopFlow security" in the subject.
- Include what you found, the steps to reproduce it (URLs, a minimal workflow, requests), the impact you
  expect, and whether you'd like to be credited.
- Please don't open a public issue or discussion for a vulnerability.

## What to expect

- An acknowledgment within **5 business days**.
- An assessment and a planned fix or mitigation, with status updates as work progresses.
- Credit in the release notes once a fix ships, if you'd like it.

This is a one-maintainer project, so these are targets, not a service-level agreement.

## Scope

**In scope**

- The hosted service at `https://www.topflow.dev` (builder, execution API, blog, docs).
- The code in this repository (`main` and `dev`).

**Out of scope**

- Third-party services TopFlow calls (AI providers, GitHub, OSV.dev, Vercel, Upstash): report those to their owners.
- Denial of service, load testing, or sustained traffic against the hosted service.
- Social engineering, physical attacks, and spam.
- Findings that require a compromised device or browser extension, and best-practice suggestions without a
  demonstrated impact.

## Rules of engagement (safe harbor)

We won't pursue good-faith research that follows these rules:

- Only test against accounts, data and repositories you own. Don't access, change or keep anyone else's data.
- Use **harmless probes** on the hosted service: prove impact with the smallest possible request, don't send
  payloads that read secrets or write data, and stop as soon as you've confirmed the issue.
- Respect the rate limits; don't try to degrade the service.
- Give us reasonable time to fix before disclosing publicly.

## Known limitations (no need to report)

These are documented and tracked; reports that add new impact are still welcome:

- **Content Security Policy** is in report-only mode while violations are reviewed.
- **Custom JavaScript/Tool node code** is refused on the hosted service until isolation ships; see
  [`docs/architecture/js-node-isolation-design.md`](docs/architecture/js-node-isolation-design.md).
- **Execution requests** have structural validation but no full runtime schema yet.

## Supported versions

Only the current `main` branch (deployed to `https://www.topflow.dev`) receives security fixes.
