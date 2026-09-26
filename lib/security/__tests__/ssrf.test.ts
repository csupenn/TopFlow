import { isBlockedHost, checkOutboundUrl, assertSafeOutboundUrl, SsrfBlockedError } from "../ssrf"

describe("isBlockedHost", () => {
  test.each([
    "localhost",
    "127.0.0.1",
    "127.1.2.3",
    "0.0.0.0",
    "10.0.0.5",
    "192.168.1.10",
    "172.16.0.1",
    "172.31.255.255",
    "169.254.169.254", // cloud metadata
    "100.64.0.1", // CGNAT
    "::1",
    "fe80::1",
    "fd00::1",
    "::ffff:10.0.0.1", // IPv4-mapped private
    "metadata.google.internal",
    "db.internal",
    "service.local",
  ])("blocks %s", (host) => {
    expect(isBlockedHost(host)).toBe(true)
  })

  test.each([
    "api.github.com",
    "api.osv.dev",
    "example.com",
    "8.8.8.8",
    "93.184.216.34",
    "172.32.0.1", // just outside the private /12
    "172.15.0.1",
    "raw.githubusercontent.com",
  ])("allows %s", (host) => {
    expect(isBlockedHost(host)).toBe(false)
  })
})

describe("checkOutboundUrl", () => {
  test("blocks cloud-metadata endpoint", () => {
    expect(checkOutboundUrl("http://169.254.169.254/latest/meta-data/").safe).toBe(false)
  })
  test("blocks loopback with port", () => {
    expect(checkOutboundUrl("http://127.0.0.1:3000/internal").safe).toBe(false)
  })
  test("blocks non-http scheme", () => {
    expect(checkOutboundUrl("file:///etc/passwd").safe).toBe(false)
  })
  test("blocks invalid URL", () => {
    expect(checkOutboundUrl("not a url").safe).toBe(false)
  })
  test("allows public https", () => {
    expect(checkOutboundUrl("https://api.github.com/repos/x/y").safe).toBe(true)
  })
  test("allows public http", () => {
    expect(checkOutboundUrl("http://example.com/").safe).toBe(true)
  })
})

describe("assertSafeOutboundUrl", () => {
  test("throws SsrfBlockedError for private targets", () => {
    expect(() => assertSafeOutboundUrl("http://10.0.0.1/")).toThrow(SsrfBlockedError)
  })
  test("does not throw for public targets", () => {
    expect(() => assertSafeOutboundUrl("https://api.osv.dev/v1/query")).not.toThrow()
  })
})

// Regression: the URL parser NORMALIZES hosts before isBlockedHost sees them.
// IPv4-mapped IPv6 comes out in hex (`[::ffff:127.0.0.1]` → `[::ffff:7f00:1]`), and
// decimal/octal/hex IPv4 forms become dotted-quad. These must be checked through
// checkOutboundUrl (what the engine calls), not just as raw host strings.
describe("checkOutboundUrl — URL-normalized host forms", () => {
  test.each([
    "http://[::ffff:127.0.0.1]/", // → [::ffff:7f00:1]
    "http://[::ffff:169.254.169.254]/latest/meta-data/", // cloud metadata → [::ffff:a9fe:a9fe]
    "http://[::ffff:10.0.0.1]/", // → [::ffff:a00:1]
    "http://[::ffff:192.168.1.1]/",
    "http://[0:0:0:0:0:ffff:7f00:1]/", // expanded mapped form
    "http://[::ffff:7f00:1]/", // hex written directly
    "http://[::127.0.0.1]/", // deprecated IPv4-compatible → [::7f00:1]
    "http://[0:0:0:0:0:0:0:1]/", // expanded loopback → [::1]
    "http://2130706433/", // decimal 127.0.0.1
    "http://0177.0.0.1/", // octal 127.0.0.1
    "http://0x7f.1/", // hex/short 127.0.0.1
    "http://0xa9fea9fe/", // hex 169.254.169.254
  ])("blocks %s", (url) => {
    expect(checkOutboundUrl(url).safe).toBe(false)
  })

  test.each([
    "http://[::ffff:8.8.8.8]/", // mapped public v4
    "http://[2606:4700:4700::1111]/", // public IPv6
  ])("allows %s", (url) => {
    expect(checkOutboundUrl(url).safe).toBe(true)
  })
})

describe("isBlockedHost — IPv6 hex-embedded IPv4", () => {
  test.each(["[::ffff:7f00:1]", "::ffff:a9fe:a9fe", "[::7f00:1]", "::ffff:a00:1"])("blocks %s", (host) => {
    expect(isBlockedHost(host)).toBe(true)
  })
  test("allows mapped public v4 in hex (::ffff:808:808 = 8.8.8.8)", () => {
    expect(isBlockedHost("::ffff:808:808")).toBe(false)
  })
})
