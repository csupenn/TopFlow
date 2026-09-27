import { CheckCircle2, XCircle, Users, Shield, Zap, ExternalLink } from "lucide-react"

export function OpenSourceSecurityContent() {
  return (
    <div className="space-y-6 text-muted-foreground leading-relaxed">
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Updated June 17, 2026</h3>
        <p className="text-sm">
          Removed an unsupported claim (&quot;hundreds of developers&quot; reviewing the code) and added what
          transparency looked like in practice this month.
        </p>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">The Security Through Obscurity Myth</h2>
      <p>
        There's a persistent belief in our industry: don't share security details publicly. The thinking goes that if
        attackers know how your system works, they can exploit it more easily. This is security through obscurity—and
        it's fundamentally flawed.
      </p>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Why Transparency Strengthens Security</h2>
      <p>TopFlow's approach is radical: all architecture documentation is public. Here's why this makes security stronger:</p>

      <div className="space-y-4 my-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Peer Review at Scale
          </h3>
          <p>
            When security architecture is public, anyone can review it — and outside eyes catch what an internal
            team has stopped seeing.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Accountability Through Visibility
          </h3>
          <p>
            Public documentation creates accountability. When your security decisions are visible, you&apos;re more careful
            about what you claim — and when a claim is wrong, the correction is public too. An audit
            of TopFlow&apos;s own posts and docs found several claims ahead of the code (and one serious issue); we fixed
            them in the open, with dated update notes.
          </p>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Conclusion</h2>
      <p>
        Security through transparency isn't just a philosophy—it's a competitive advantage. When you're confident enough
        to share your architecture publicly, you're demonstrating that your security controls can withstand scrutiny.
      </p>
      <p className="mt-4">
        TopFlow's full source — including the security controls described in these posts — is on{" "}
        <a
          href="https://github.com/csupenn/topflow"
          className="text-primary hover:underline inline-flex items-center gap-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/csupenn/topflow
          <ExternalLink className="w-3 h-3" />
        </a>
        . Read the code, open an issue, or fork it.
      </p>
    </div>
  )
}
