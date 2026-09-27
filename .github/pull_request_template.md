## What and why

<!-- One or two sentences. Link the issue or tracker item. -->

## How it was verified

- [ ] `pnpm type-check` and `pnpm lint` (0 errors)
- [ ] `pnpm test:ci` (tests + coverage thresholds)
- [ ] `pnpm build`, and affected pages checked on a local production build
- [ ] Security fixes: a test that fails on the old code **for the right reason**, and passes now

## Public claims (README, pages, blog, images, badges)

- [ ] Every feature or number mentioned exists on `main` and is described at its real scope
- [ ] Sample or demo data is labeled as such where people see it
- [ ] No absolute security/compliance wording ("secure", "compliant", "sandboxed") without a scope
- [ ] Images show nothing the product doesn't do
- [ ] The public-claims guard passes (`lib/__tests__/public-claims.test.ts`)

## Privacy and security

- [ ] No user content, keys or IPs added to logs
- [ ] New outbound requests go through the SSRF guard; new write endpoints check who is asking
