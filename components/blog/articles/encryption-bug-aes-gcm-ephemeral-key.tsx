import { AlertTriangle, CheckCircle2, XCircle, Lock } from "lucide-react"

export function EncryptionBugContent() {
  return (
    <div className="space-y-6 text-muted-foreground leading-relaxed">
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Updated June 17, 2026 — small corrections</h3>
        <p className="text-sm">
          The pitch in &quot;The Setup&quot; used to say keys stay in the browser at all times; they&apos;re sent to our
          server to run a workflow (never stored), so the sentence now says that. And the Content Security Policy this
          post mentions didn&apos;t exist yet when it was written — it now runs in report-only mode.
        </p>
      </div>

      <p>
        I added AES-256-GCM encryption to protect the BYOK API keys that TopFlow stores in localStorage. The
        implementation compiled cleanly. Unit tests passed. The browser's Application tab showed{" "}
        <code className="bg-card px-1.5 py-0.5 rounded text-foreground text-sm font-mono">encrypted:A4Bx...</code>{" "}
        values where plaintext keys used to be. It looked exactly right.
      </p>
      <p>
        But every ciphertext was immediately unrecoverable. On the next decrypt call — milliseconds later, in the same
        browser session — the operation threw. A try/catch fallback silently returned the raw{" "}
        <code className="bg-card px-1.5 py-0.5 rounded text-foreground text-sm font-mono">encrypted:...</code> string
        as if it were a plaintext API key. The AI provider rejected it. From the user's perspective: "my API key stopped
        working." Not: "your decryption is broken."
      </p>
      <p>
        The bug was a single function call. Here's what happened, why AES-GCM fails this way, the fix, and what this
        teaches about writing and testing cryptographic code.
      </p>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">
        The Setup: BYOK Secrets in a Zero-Backend App
      </h2>
      <p>
        TopFlow is deliberately database-free. Its privacy pitch is "your keys live in your browser, not on our
        servers" (they&apos;re sent only to run a workflow, never stored). That means two
        kinds of long-lived, high-value credentials live in{" "}
        <code className="bg-card px-1.5 py-0.5 rounded text-foreground text-sm font-mono">localStorage</code>: AI
        provider API keys (OpenAI, Anthropic, Google, Groq) entered in the settings dialog, and GitHub tokens used by
        the security scanner.
      </p>
      <p>
        Storing these in plaintext means a single glance at DevTools &rarr; Application &rarr; Storage reveals all of
        them. The threat isn't just a sophisticated attacker — it's a shared office laptop, a borrowed device, a screen
        share during a demo, or a browser extension with storage access.
      </p>
      <p>
        The chosen control was AES-256-GCM via the browser-native Web Crypto API. GCM (Galois/Counter Mode) provides
        both confidentiality and integrity: a tampered ciphertext fails authentication and decryption throws, rather
        than silently returning garbage. Each value gets a random 96-bit IV, and the stored format is{" "}
        <code className="bg-card px-1.5 py-0.5 rounded text-foreground text-sm font-mono">
          encrypted:&lt;base64(iv ‖ ciphertext)&gt;
        </code>
        . A reasonable choice — if the key doesn't disappear between encrypt and decrypt.
      </p>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">The Bug: A Key That Lived for One Call</h2>
      <p>
        AES-GCM is a symmetric cipher. Encrypt with a key; decrypt with the same key. That constraint seems obvious,
        and it is — until a helper function hides it. The original{" "}
        <code className="bg-card px-1.5 py-0.5 rounded text-foreground text-sm font-mono">getEncryptionKey()</code>{" "}
        called{" "}
        <code className="bg-card px-1.5 py-0.5 rounded text-foreground text-sm font-mono">
          crypto.subtle.generateKey()
        </code>{" "}
        on every invocation:
      </p>

      <pre className="bg-panel border border-border rounded-lg p-4 overflow-x-auto text-sm my-6">
        <code>{`// ❌ Broken: generates a fresh 256-bit key on every call
async function getEncryptionKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    false,          // not extractable
    ["encrypt", "decrypt"]
  )
}`}</code>
      </pre>

      <p>
        On encrypt, call #1 produces key&nbsp;A. On decrypt, call #2 produces key&nbsp;B. Key&nbsp;A and key&nbsp;B are
        entirely different 256-bit random values. The authentication tag embedded in the ciphertext was computed with
        key&nbsp;A. Verification with key&nbsp;B produces a different tag. They don't match. Decryption throws.
      </p>

      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          Why AES-GCM Fails This Way (and Why It's Silent)
        </h3>
        <p className="text-sm">
          GCM authentication works via GHASH — a polynomial MAC function keyed to the encryption key. During encrypt, it
          computes a tag over the ciphertext and appends it. During decrypt, it recomputes the tag and compares. A
          mismatched key produces a mismatched tag, and the browser throws:{" "}
          <code className="bg-card px-1 py-0.5 rounded text-foreground text-xs font-mono">
            DOMException: The operation failed for an operation-specific reason
          </code>
          .
        </p>
        <p className="text-sm mt-3">
          There is no "wrong key but here's garbled output" mode. Authenticated encryption either passes and returns
          plaintext, or it throws. This is intentional — it protects against ciphertext tampering — but it means key
          management failures surface as exceptions, not bad data. Without a round-trip test, you won't notice until a
          user reports "my key stopped working."
        </p>
        <p className="text-sm mt-3">
          The silent fallback made it worse. The backward-compatibility path in{" "}
          <code className="bg-card px-1 py-0.5 rounded text-foreground text-xs font-mono">decryptValue()</code> caught
          the exception and returned the original value unchanged — intended for pre-encryption plaintext keys during
          migration. But it also meant the broken{" "}
          <code className="bg-card px-1 py-0.5 rounded text-foreground text-xs font-mono">encrypted:...</code> string
          was returned to the caller, passed to the serverless function as an "API key," and rejected by the provider
          with no indication that decryption had silently failed.
        </p>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">The Fix: Generate Once, Cache, Persist</h2>
      <p>
        The key needs to be the same across every call — including across page reloads. The fix is straightforward:
        generate once, cache the result in a module-scope variable, and persist the raw key bytes to localStorage so
        the same key is recovered after a reload.
      </p>

      <pre className="bg-panel border border-border rounded-lg p-4 overflow-x-auto text-sm my-6">
        <code>{`// ✅ Fixed: generate once, cache in memory, persist across sessions
let cachedKey: CryptoKey | null = null

async function getEncryptionKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey              // 1. Memory cache (same tab)

  let raw = loadPersistedKeyBytes()            // 2. Try localStorage
  if (!raw) {
    raw = new Uint8Array(32)                   // 3. First visit: generate
    crypto.getRandomValues(raw)
    persistKeyBytes(raw)                       // Save raw bytes for later
  }

  cachedKey = await crypto.subtle.importKey(
    "raw",
    raw as Uint8Array<ArrayBuffer>,
    { name: "AES-GCM", length: 256 },
    false,                                     // not extractable
    ["encrypt", "decrypt"]
  )
  return cachedKey
}`}</code>
      </pre>

      <p>
        Three tiers of lookup: memory cache (same tab session), localStorage (across reloads), and fresh generation
        (first visit or cleared storage). The critical distinction:{" "}
        <code className="bg-card px-1.5 py-0.5 rounded text-foreground text-sm font-mono">importKey()</code> loads a
        specific key from bytes, guaranteeing the same key object is returned regardless of which call site invokes the
        function.{" "}
        <code className="bg-card px-1.5 py-0.5 rounded text-foreground text-sm font-mono">generateKey()</code>{" "}
        produces a fresh random key every time — that's the root cause of the bug.
      </p>
      <p>
        The migration path is preserved: if{" "}
        <code className="bg-card px-1.5 py-0.5 rounded text-foreground text-sm font-mono">decryptValue()</code> receives
        a string that doesn't start with{" "}
        <code className="bg-card px-1.5 py-0.5 rounded text-foreground text-sm font-mono">encrypted:</code>, it returns
        it unchanged. A one-time{" "}
        <code className="bg-card px-1.5 py-0.5 rounded text-foreground text-sm font-mono">migrateApiKeys()</code>{" "}
        function runs on load to encrypt any legacy plaintext values in place.
      </p>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">The Test That Catches This</h2>
      <p>
        The broken implementation passed tests because they only verified that{" "}
        <code className="bg-card px-1.5 py-0.5 rounded text-foreground text-sm font-mono">encryptValue()</code> didn't
        throw and that the result looked different from the input. Neither check requires a stable key. The test that
        catches a key-custody bug is a round-trip:
      </p>

      <pre className="bg-panel border border-border rounded-lg p-4 overflow-x-auto text-sm my-6">
        <code>{`// ✅ Round-trip: the only test that catches key-custody bugs
it("encrypts and decrypts to the same value", async () => {
  const original = "sk-ant-my-api-key-12345"

  const encrypted = await encryptValue(original)
  expect(encrypted).toMatch(/^encrypted:/)    // Has the prefix
  expect(encrypted).not.toBe(original)        // Actually transformed

  const decrypted = await decryptValue(encrypted)
  expect(decrypted).toBe(original)            // Identity holds ← broken impl fails here
})

// Also verify IV randomness: two encryptions of the same input must differ
it("produces different ciphertexts for the same plaintext", async () => {
  const val = "same-input"
  const c1 = await encryptValue(val)
  const c2 = await encryptValue(val)
  expect(c1).not.toBe(c2)
})`}</code>
      </pre>

      <p>
        These two tests together prove the full contract: values are encrypted (not equal to plaintext), decryption
        recovers the original (identity), and each encryption is unique (IV randomness). The broken implementation
        would fail the identity assertion immediately — the return value of{" "}
        <code className="bg-card px-1.5 py-0.5 rounded text-foreground text-sm font-mono">decryptValue()</code> would
        be the raw{" "}
        <code className="bg-card px-1.5 py-0.5 rounded text-foreground text-sm font-mono">encrypted:...</code> string,
        not <code className="bg-card px-1.5 py-0.5 rounded text-foreground text-sm font-mono">original</code>.
      </p>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">
        The Honest Limitation: This Doesn't Stop XSS
      </h2>
      <p>
        A question worth answering directly: if the encryption key is stored in localStorage, what does encryption
        actually achieve?
      </p>

      <div className="space-y-3 my-6">
        <div className="bg-card border border-border rounded-lg p-4 flex items-start gap-4">
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Protects against at-rest exposure</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Casual DevTools inspection (Application tab shows ciphertext, not plaintext keys)</li>
              <li>Shared or borrowed device where another person opens the browser</li>
              <li>Screen share or demo where the storage tab is visible</li>
              <li>Browser extensions that read storage values without executing scripts in-page</li>
            </ul>
          </div>
        </div>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-4">
          <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Does not protect against</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>
                <strong className="text-foreground">XSS</strong> — an injected script runs in the same origin and can
                read both the ciphertext and the encryption key from localStorage simultaneously
              </li>
              <li>A stolen browser profile (key and ciphertext are both on disk, co-located)</li>
              <li>Physical access to an unlocked device with an open browser tab</li>
            </ul>
          </div>
        </div>
      </div>

      <p>
        The key-custody tradeoff: a client-held key raises the bar for at-rest exposure (now an attacker needs script
        execution, not just storage read access) but does not create a cryptographic boundary against XSS. True
        XSS-resistant key custody requires either a server-held key or a user passphrase (PBKDF2/Argon2) — at the
        cost of a server round-trip or a session unlock prompt.
      </p>
      <p>
        For TopFlow's zero-backend architecture, a server-held key is a non-starter. A passphrase-derived key is
        feasible but adds friction. The chosen approach — a persisted random key — is the right tradeoff here, as long
        as the limitation is documented honestly. The comment at the top of{" "}
        <a
          href="https://github.com/csupenn/topflow/blob/main/lib/security/encryption.ts"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          lib/security/encryption.ts
        </a>{" "}
        states it explicitly: a client-held key is not a defense against XSS. The real XSS controls live elsewhere —
        in a Content Security Policy (TopFlow&apos;s now runs in report-only mode; enforcement is next),
        in output handling, and in the Untrusted Reasoning Worker boundary that
        constrains what the LLM is permitted to produce.
      </p>

      <p className="bg-card border-l-4 border-primary p-4 italic">
        "Don't let 'we encrypt it' become security theater. Name the threat your control actually addresses."
      </p>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Takeaways</h2>

      <div className="space-y-3 my-6">
        {[
          {
            icon: Lock,
            title: "Test the round-trip, not just the encrypt call",
            body: "Verifying that encryptValue() doesn't throw and returns something different is not enough. Only an encrypt → decrypt → assert-identity test catches key-custody bugs. Add this to every cryptographic utility you write.",
          },
          {
            icon: AlertTriangle,
            title: "generateKey() and importKey() are not interchangeable",
            body: "generateKey() produces a fresh random key on every call. importKey() loads a specific key from bytes. Key-stability across calls requires the latter. This distinction isn't obvious from the Web Crypto API docs.",
          },
          {
            icon: XCircle,
            title: "Silent fallbacks in crypto code mask failures",
            body: "The backward-compatibility catch-and-return-input path turned a decryption exception into a silent wrong-value return. Crypto failures should surface loudly, or be architected so silent fallbacks are unreachable after the migration window closes.",
          },
          {
            icon: CheckCircle2,
            title: "Name the threat your control actually addresses",
            body: "'We encrypt API keys' is only meaningful if you specify: encrypt at rest, protecting against at-rest inspection, not against XSS. Precision prevents false security assumptions from accumulating.",
          },
          {
            icon: CheckCircle2,
            title: "Client-held keys are a real tradeoff, not security theater",
            body: "Encryption without a server-held key still raises the bar. The alternative — plaintext storage — is strictly worse. The key is understanding and documenting exactly what the bar was raised from and to.",
          },
        ].map((item, idx) => (
          <div key={idx} className="bg-card border border-border rounded-lg p-4 flex items-start gap-4">
            <item.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
              <p className="text-sm">{item.body}</p>
            </div>
          </div>
        ))}
      </div>

      <p>
        The full implementation — including the migration function, backward-compatibility path, and test suite — is in{" "}
        <a
          href="https://github.com/csupenn/topflow/blob/main/lib/security/encryption.ts"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          lib/security/encryption.ts
        </a>{" "}
        on GitHub. The security case study behind this fix — covering the threat model, attack trees, and the
        key-custody tradeoff spectrum — is{" "}
        <a
          href="https://github.com/csupenn/topflow/blob/main/docs/AI-Security/osv-scanner/02-secrets-at-rest-byok-key-encryption-2026-06-14-draft.md"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Tutorial 02 of the AI Security Series
        </a>
        .
      </p>

      <p>
        Try TopFlow's security workflows at{" "}
        <a href="https://www.topflow.dev" className="text-primary hover:underline">
          topflow.dev
        </a>{" "}
        — no signup, no API keys required.
      </p>
    </div>
  )
}
