import { createRequire } from "module"

const require = createRequire(import.meta.url)
const { securityHeaderRules } = require("./lib/security/security-headers.cjs")

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Security headers (incl. CSP) — single source: lib/security/security-headers.cjs
  async headers() {
    return securityHeaderRules()
  },
}

export default nextConfig
