/**
 * Canonical public origin. The apex (topflow.dev) 307-redirects here, so canonical URLs,
 * sitemap entries, robots and structured data must use this value — search engines expect
 * canonicals to be the final URL, not a redirect. Guarded by lib/__tests__/site-url.test.ts.
 */
export const SITE_URL = "https://www.topflow.dev"
