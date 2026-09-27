import Link from "next/link"
import { ExternalLink } from "lucide-react"

const REPO = "https://github.com/csupenn/topflow/blob"

export function NewFunctionSandboxContent() {
  return (
    <div className="space-y-6 text-muted-foreground leading-relaxed">
      <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">The Sentence That Was Wrong</h2>
      <p>
        TopFlow lets you add a JavaScript step to an AI workflow: write a few lines, and the server runs them between
        the other steps. Our documentation filed that step under &quot;sandboxed&quot; and described it like this:
      </p>
      <p className="bg-card border-l-4 border-primary p-4 italic">
        &quot;JavaScript code runs in a limited scope with no access to global objects, file system, or network.&quot;
      </p>
      <p>
        It read well. It sounded like the kind of thing a security-focused product should say. It was also untested.
      </p>
      <p>
        While auditing our own blog posts and docs against the code, a sentence at a time, we got to that one and did
        the obvious thing: we tried it. One line was enough:
      </p>
      <pre className="bg-panel border border-border rounded-lg p-4 overflow-x-auto text-sm">
        <code>{`return process.env`}</code>
      </pre>
      <p>
        The step returned every environment variable on the server. On the live service, that includes our rate
        limiter&apos;s IP-hashing key and, where configured, the credentials for its Redis store. And{" "}
        <code className="text-primary text-sm bg-muted px-1 rounded">fetch</code> was sitting right there to send them
        anywhere. No account was needed to submit a workflow.
      </p>
      <p>
        This post is about how that happened, how we contained it within hours, the one mistake we made during the
        response, and the fix we&apos;re building.
      </p>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">
        Why <code className="text-primary bg-muted px-1 rounded">new Function</code> Feels Safe
      </h2>
      <p>The code path was short. Each JavaScript and Tool node ran like this:</p>
      <pre className="bg-panel border border-border rounded-lg p-4 overflow-x-auto text-sm">
        <code>{`const fn = new Function(...Object.keys(inputs), code)
return fn(...Object.values(inputs))`}</code>
      </pre>
      <p>
        The file,{" "}
        <a
          href={`${REPO}/c379f5a/lib/topflow-execution-engine.ts`}
          className="text-primary hover:underline inline-flex items-center gap-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          lib/topflow-execution-engine.ts
          <ExternalLink className="w-3 h-3" />
        </a>
        , even carried a comment above those lines calling them sandboxed.
      </p>
      <p>
        Here&apos;s why that&apos;s an easy mistake. Code created with{" "}
        <code className="text-primary text-sm bg-muted px-1 rounded">new Function</code> really <em>can&apos;t</em> see
        the local variables around it: try to read one and you get a{" "}
        <code className="text-primary text-sm bg-muted px-1 rounded">ReferenceError</code>. So it feels scoped. But it
        sees every <strong>global</strong> in the process:{" "}
        <code className="text-primary text-sm bg-muted px-1 rounded">process</code>,{" "}
        <code className="text-primary text-sm bg-muted px-1 rounded">process.env</code>,{" "}
        <code className="text-primary text-sm bg-muted px-1 rounded">fetch</code>,{" "}
        <code className="text-primary text-sm bg-muted px-1 rounded">globalThis</code>. Hiding local variables isn&apos;t
        isolation. For anything that matters,{" "}
        <code className="text-primary text-sm bg-muted px-1 rounded">new Function</code> is{" "}
        <code className="text-primary text-sm bg-muted px-1 rounded">eval</code> with better manners.
      </p>
      <p>
        Conditional nodes had the same shape: their condition string was evaluated with{" "}
        <code className="text-primary text-sm bg-muted px-1 rounded">new Function(..., &quot;return &quot; + condition)</code>.
        So the question wasn&apos;t &quot;can a JavaScript node do this?&quot; It was &quot;which three node types
        can?&quot;
      </p>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Proving It Without Touching Real Secrets</h2>
      <p>The temptation in a moment like this is to confirm the problem in production. We didn&apos;t. Instead:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          On a <strong>local</strong> production build, we started the server with a fake secret in its environment,
          then ran a workflow whose JavaScript node returned only <em>names and types</em>, never values. It reported{" "}
          <code className="text-primary text-sm bg-muted px-1 rounded">envVarCount: 121</code>,{" "}
          <code className="text-primary text-sm bg-muted px-1 rounded">sawTestSecretName: true</code>,{" "}
          <code className="text-primary text-sm bg-muted px-1 rounded">hasFetch: &quot;function&quot;</code>.
        </li>
        <li>
          Against production we used a <strong>harmless probe</strong>: a custom node whose code is just{" "}
          <code className="text-primary text-sm bg-muted px-1 rounded">return 1</code>. If it returns{" "}
          <code className="text-primary text-sm bg-muted px-1 rounded">1</code>, custom code runs; if it&apos;s refused,
          it doesn&apos;t. That answers the only question that matters without reading anything.
        </li>
      </ul>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Containment in Hours, Not a Rewrite</h2>
      <p>
        The proper fix is real isolation, and that takes time to build and review. The hole was open <em>now</em>, so
        we contained it first, without breaking the product. Two changes:
      </p>

      <h3 className="text-2xl font-semibold text-foreground mt-8 mb-3">1. Only code we ship can run</h3>
      <p>
        The server now runs JavaScript or Tool code only if it&apos;s byte-identical to code in one of TopFlow&apos;s
        built-in templates (
        <a
          href={`${REPO}/main/lib/security/trusted-code.ts`}
          className="text-primary hover:underline inline-flex items-center gap-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          lib/security/trusted-code.ts
          <ExternalLink className="w-3 h-3" />
        </a>
        ):
      </p>
      <pre className="bg-panel border border-border rounded-lg p-4 overflow-x-auto text-sm">
        <code>{`case 'javascript':
  if (!isTrustedCode(data.code)) throw new Error(UNTRUSTED_CODE_MESSAGE)
  return super.executeNode(node, inputs, context)`}</code>
      </pre>
      <p>
        Users&apos; inputs still flow into that code as function arguments, so every template, including the GitHub
        security scanner, which uses JavaScript steps, keeps working. Custom code gets a clear refusal explaining why.
      </p>

      <h3 className="text-2xl font-semibold text-foreground mt-8 mb-3">2. Conditions stopped being code</h3>
      <p>
        Instead of evaluating the condition string, the server now parses it with a small interpreter (
        <a
          href={`${REPO}/main/lib/conditions/safe-evaluate.ts`}
          className="text-primary hover:underline inline-flex items-center gap-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          lib/conditions/safe-evaluate.ts
          <ExternalLink className="w-3 h-3" />
        </a>
        ) that understands input variables, comparisons,{" "}
        <code className="text-primary text-sm bg-muted px-1 rounded">&amp;&amp;</code>,{" "}
        <code className="text-primary text-sm bg-muted px-1 rounded">||</code>,{" "}
        <code className="text-primary text-sm bg-muted px-1 rounded">!</code> and a few string methods, and nothing
        else. There&apos;s no <code className="text-primary text-sm bg-muted px-1 rounded">eval</code> left to escape
        from. We tested it against JavaScript&apos;s own answers for every condition our templates use, and against the
        classic escapes:{" "}
        <code className="text-primary text-sm bg-muted px-1 rounded">
          constructor.constructor(&quot;return process&quot;)()
        </code>{" "}
        is simply a syntax the parser doesn&apos;t accept.
      </p>

      <p>We chose these over the obvious alternatives on purpose:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <em>Block all JavaScript nodes:</em> would have broken the flagship scanner.
        </li>
        <li>
          <em>
            Delete secrets from <code className="text-primary text-sm bg-muted px-1 rounded">process.env</code> first:
          </em>{" "}
          <code className="text-primary text-sm bg-muted px-1 rounded">fetch</code> and every other global would
          remain.
        </li>
        <li>
          <em>
            Node&apos;s <code className="text-primary text-sm bg-muted px-1 rounded">vm</code> module:
          </em>{" "}
          Node&apos;s own documentation says it &quot;is not a security mechanism.&quot;
        </li>
      </ul>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">A Test That Fails for the Right Reason</h2>
      <p>
        The regression test (
        <a
          href={`${REPO}/main/app/api/execute-workflow/__tests__/h17-user-code.test.ts`}
          className="text-primary hover:underline inline-flex items-center gap-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          h17-user-code.test.ts
          <ExternalLink className="w-3 h-3" />
        </a>
        ) plants a secret in <code className="text-primary text-sm bg-muted px-1 rounded">process.env</code>, runs the{" "}
        <em>real</em> route and engine, and tries to read it three ways: a JavaScript node, a Tool node, and a
        condition. Against the fixed code, the secret never appears. Against the old code, the tests fail, and we
        checked <em>why</em> they fail: the secret was right there in the response. A security test that fails for some
        other reason proves nothing.
      </p>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">The Mistake: &quot;Merged&quot; Is Not &quot;Live&quot;</h2>
      <p>Here&apos;s the part we&apos;d rather not write, which is why it&apos;s worth writing.</p>
      <p>
        The fix was reviewed and merged into our development branch. The secrets were rotated. Then we ran the harmless
        probe against production, and it returned{" "}
        <code className="text-primary text-sm bg-muted px-1 rounded">1</code>. Production deploys from a different
        branch, and the fix hadn&apos;t been released yet. The hole was still open, which meant the <strong>new</strong>{" "}
        secrets had been exposed to it too.
      </p>
      <p>
        We released, re-ran the probe until production refused custom code, confirmed the templates and ordinary
        conditions still worked, and rotated every secret <strong>again</strong>. That second rotation is the one that
        counts.
      </p>
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-6">
        <p className="font-semibold text-foreground mb-3">The order that matters, which we now follow as a rule:</p>
        <ol className="list-decimal pl-6 space-y-1">
          <li>Reproduce safely (no real secrets).</li>
          <li>Contain.</li>
          <li>
            <strong>Release</strong>, and <strong>verify in production</strong> with a harmless probe.
          </li>
          <li>
            <strong>Then</strong> rotate credentials.
          </li>
        </ol>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">What We Can&apos;t Tell You</h2>
      <p>
        We don&apos;t log workflow content (a deliberate privacy choice), so our logs can&apos;t say whether anyone ever
        used this. We assume the worst: every secret that existed while the hole was open has been replaced.
      </p>
      <p>
        Custom JavaScript and Tool code is disabled on the hosted service until real isolation ships. Exported code
        (which runs on your own infrastructure) is unaffected.
      </p>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">The Real Fix: Isolation, Not Trust</h2>
      <p>
        The plan is to run custom code in <strong>QuickJS compiled to WebAssembly</strong>, a separate JavaScript
        engine with no <code className="text-primary text-sm bg-muted px-1 rounded">process</code>, no{" "}
        <code className="text-primary text-sm bg-muted px-1 rounded">fetch</code>, no{" "}
        <code className="text-primary text-sm bg-muted px-1 rounded">require</code>, inside a{" "}
        <strong>worker thread</strong> per run, with an empty environment, a memory limit and a hard time limit.
      </p>
      <p>
        In a spike, every escape we tried inside QuickJS saw nothing of the host. The spike also taught us why the
        worker layer matters: on its own, QuickJS took six seconds to hit its memory limit and then crashed the whole
        process when cleaned up. Inside a worker, the same attack is killed after two seconds and the server
        doesn&apos;t notice. The full design, including what we rejected and why, is public:{" "}
        <a
          href={`${REPO}/main/docs/architecture/js-node-isolation-design.md`}
          className="text-primary hover:underline inline-flex items-center gap-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          js-node-isolation-design.md
          <ExternalLink className="w-3 h-3" />
        </a>
        .
      </p>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Key Takeaways</h2>
      <div className="bg-card border border-border rounded-lg p-6 my-6">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <code className="text-primary text-sm bg-muted px-1 rounded">eval</code>,{" "}
            <code className="text-primary text-sm bg-muted px-1 rounded">new Function</code> and{" "}
            <code className="text-primary text-sm bg-muted px-1 rounded">vm</code> are not sandboxes. Code inside your
            process can reach everything the process can.
          </li>
          <li>
            Test your security claims, especially the ones in your docs. Ours was never tested; it was just believed.
          </li>
          <li>Prove problems without reading real secrets: fake secrets locally, harmless probes in production.</li>
          <li>Contain first, fix properly second, and design containment so the product keeps working.</li>
          <li>&quot;Merged&quot; isn&apos;t &quot;live.&quot; Verify in production, then rotate credentials.</li>
          <li>Say what you don&apos;t know. We can&apos;t prove the hole was never used, so we act as if it was.</li>
        </ul>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Go Deeper</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <a
            href={`${REPO}/main/docs/architecture/js-node-isolation-design.md`}
            className="text-primary hover:underline inline-flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            The isolation design (QuickJS + worker threads)
            <ExternalLink className="w-3 h-3" />
          </a>
        </li>
        <li>
          <Link href="/docs/build/nodes/javascript" className="text-primary hover:underline">
            The JavaScript node documentation
          </Link>
          , now accurate.
        </li>
        <li>
          <Link href="/blog/five-layers-of-security-owasp-top-10" className="text-primary hover:underline">
            5 Layers of Security
          </Link>{" "}
          (its A03 section now describes this issue) and{" "}
          <Link href="/blog/preventing-ssrf-attacks-ai-workflows" className="text-primary hover:underline">
            Preventing SSRF Attacks
          </Link>
          : <code className="text-primary text-sm bg-muted px-1 rounded">fetch</code> from user code would have bypassed
          the SSRF guard entirely.
        </li>
      </ul>
    </div>
  )
}
