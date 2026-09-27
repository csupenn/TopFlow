# TopFlow: Secure AI Workflow Builder

<div align="center">

[![Try the Scanner](https://img.shields.io/badge/🔍_Try_the_Scanner-No_Signup_Required-brightgreen?style=for-the-badge)](https://www.topflow.dev/builder?template=github-security-scanner)
[![GitHub Stars](https://img.shields.io/github/stars/csupenn/topflow?style=for-the-badge&color=yellow)](https://github.com/csupenn/topflow/stargazers)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**A visual builder for AI workflows, built by a former CISO to show security designed in, not bolted on.**

[Open the builder](https://www.topflow.dev/builder) • [Dependency scanner](https://www.topflow.dev/showcase/security-scanner) • [Docs](https://www.topflow.dev/docs) • [Blog](https://www.topflow.dev/blog)

</div>

---

## Flagship Example: GitHub Dependency Scanner

A TopFlow workflow that checks a repository's dependencies against the [OSV.dev](https://osv.dev) vulnerability
database and explains what to upgrade.

| Checks | Doesn't check |
|---|---|
| Known vulnerabilities in npm, PyPI, Go and Rust dependencies, with CVE (or advisory) ID, severity and fixed version | Your own source code (no injection, XSS or authentication analysis) |
| Whether the repo has a `SECURITY.md` and a Dependabot config | Compliance (GDPR, SOC 2, HIPAA) |
| A 0–100 score from a [fixed formula](https://www.topflow.dev/showcase/security-scanner) | Test coverage, CI setup or code quality |

- **Findings come from OSV.dev and the score is computed in code** ([`lib/osv/scanner.ts`](lib/osv/scanner.ts)).
  An LLM, using your own key, only writes the explanation, and it can't change the findings
  ([why](https://www.topflow.dev/blog/untrusted-reasoning-worker-llm-security)).
- **Runs show sample results by default.** Turn on **Run a real scan** in the run dialog for live data. Public
  repos work without a key; a GitHub token raises GitHub's rate limit and allows private repos.

**[Scan a repo →](https://www.topflow.dev/builder?template=github-security-scanner)**

---

## Security You Can Trust

The scanner runs on **TopFlow** — a privacy-first AI workflow platform built with enterprise-grade security architecture.

| | |
|---|---|
| **Zero server-side storage** | Workflows and API keys are stored only in your browser. When you run a workflow, it's sent over HTTPS to our server, used in memory for that request, and never stored or logged. |
| **BYOK model** | Bring your own AI provider keys, or use demo mode without any keys at all. |
| **5-layer defense** | Input sanitization → HTTPS/HSTS → rate limiting → SSRF prevention → restricted code execution (built-in template code only; isolate planned) |
| **Open source** | MIT licensed. Audit the code, fork it, own it. |

**How TopFlow compares:**

| | TopFlow | Other platforms |
|---|---|---|
| Data storage | None (localStorage only) | Cloud databases |
| API keys | Your own (BYOK) | Platform-managed |
| Code export | Production TypeScript | JSON/config only |
| Vendor lock-in | None | Proprietary formats |
| Cost | Free | Monthly subscriptions |
| Built by | Former CISO | SaaS companies |

---

## 9 Pre-Built Security Templates

The dependency scanner is one of nine ready-to-run security workflows (plus four general-purpose ones):

<table>
<tr>
<td align="center"><a href="https://www.topflow.dev/builder?template=github-security-scanner">🔍<br/><b>GitHub Dependency Scanner</b><br/><sub>OSV.dev vulnerability check</sub></a></td>
<td align="center"><a href="https://www.topflow.dev/builder?template=template-gdpr-access-request">🛡️<br/><b>GDPR Data Access Request</b><br/><sub>Article 15 requests, end to end</sub></a></td>
<td align="center"><a href="https://www.topflow.dev/builder?template=template-pii-detection">🔐<br/><b>PII Detection &amp; Redaction</b><br/><sub>Privacy-preserving pipeline</sub></a></td>
</tr>
<tr>
<td align="center"><a href="https://www.topflow.dev/builder?template=template-incident-response">🚨<br/><b>Security Incident Response</b><br/><sub>Triage and severity (NIST)</sub></a></td>
<td align="center"><a href="https://www.topflow.dev/builder?template=template-soc2-evidence">📋<br/><b>SOC 2 Control Evidence</b><br/><sub>Control evidence collection</sub></a></td>
<td align="center"><a href="https://www.topflow.dev/builder?template=template-hipaa-patient-access">🏥<br/><b>HIPAA Patient Access</b><br/><sub>Right of Access requests</sub></a></td>
</tr>
<tr>
<td align="center"><a href="https://www.topflow.dev/builder?template=template-eu-ai-act-assessment">⚖️<br/><b>EU AI Act Assessment</b><br/><sub>High-risk classification (Annex III)</sub></a></td>
<td align="center"><a href="https://www.topflow.dev/builder?template=template-iso27001-risk-assessment">📊<br/><b>ISO 27001 Risk Assessment</b><br/><sub>Annex A risk scoring</sub></a></td>
<td align="center"><a href="https://www.topflow.dev/builder?template=template-ot-critical-infra">🏭<br/><b>Critical Infrastructure Defense</b><br/><sub>IT/OT threat monitoring</sub></a></td>
</tr>
</table>

All templates include demo mode, TypeScript export, and a visual workflow editor.

---

## Quick Start

**Try instantly (no install):**
```
https://www.topflow.dev/builder?template=github-security-scanner&repo=YOUR_USERNAME/YOUR_REPO
```

**Run locally:**
```bash
git clone https://github.com/csupenn/topflow.git
cd topflow && pnpm install && pnpm dev
# Open http://localhost:3000
```

---

## Tech Stack

Next.js 15 · React 19 · TypeScript · TailwindCSS v4 · ReactFlow · Vercel AI SDK v5 · shadcn/ui · Zustand

**AI providers:** OpenAI · Anthropic · Google · Groq

---

## Documentation

- [Architecture Overview](docs/architecture/architecture-overview.md) — System design & security model
- [Security Docs](https://topflow.dev/docs/security) — Threat model & controls
- [Node Reference](https://topflow.dev/docs/build/nodes) — All 12 node types
- [AI Security Tutorials](docs/AI-Security/osv-scanner/README.md) — Hands-on case studies from real hardening work (SSRF, encryption, rate limiting, LLM constraints); published at [topflow.dev/blog](https://topflow.dev/blog)

---

## Contributing

Security improvements, compliance workflows, new node types, and test coverage are especially welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

**License:** MIT — use, modify, fork, and distribute freely.

---

<div align="center">
<sub>Built by <a href="https://charliesu.com">Charlie Su</a> · Former CISO · AI Security Advocate</sub><br/>
<sub>📧 <a href="mailto:charlie@charliesu.com">charlie@charliesu.com</a> · 💼 <a href="https://www.linkedin.com/in/charliesu-ai">LinkedIn</a> · <a href="https://github.com/csupenn/topflow/issues">Issues</a> · <a href="https://github.com/csupenn/topflow/discussions">Discussions</a></sub>
</div>
