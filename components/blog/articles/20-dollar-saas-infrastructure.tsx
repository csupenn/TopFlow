import { Code, Zap, Users, CheckCircle2, Lock, XCircle } from "lucide-react"

export function BudgetSaaSContent() {
  return (
    <div className="space-y-6 text-muted-foreground leading-relaxed">
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Updated June 17, 2026</h3>
        <p className="text-sm">
          Fixed two inconsistencies: the &quot;standard stack&quot; heading now matches its itemized total, and the
          count of architectural decisions matches the list.
        </p>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">Typical SaaS Infrastructure Costs</h2>
      <p>Before diving into TopFlow's budget approach, let's establish a baseline. Here's what most MVPs spend:</p>

      <div className="bg-card border border-border rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Standard SaaS Stack ($220-450/month)</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>PostgreSQL (managed)</span>
            <span className="text-foreground font-mono">$50-100/mo</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Server hosting</span>
            <span className="text-foreground font-mono">$100-200/mo</span>
          </div>
          <div className="flex justify-between items-center">
            <span>CDN and monitoring</span>
            <span className="text-foreground font-mono">$70-150/mo</span>
          </div>
          <div className="border-t border-border mt-4 pt-4 flex justify-between items-center font-semibold">
            <span className="text-foreground">Total Monthly Cost:</span>
            <span className="text-foreground font-mono text-xl">$220-450/mo</span>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">TopFlow's $20/Month Stack</h2>
      <p>TopFlow runs on a radically different architecture that eliminates most infrastructure costs:</p>

      <div className="bg-chart-3/10 border border-chart-3/20 rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">TopFlow Infrastructure Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Vercel Hobby Plan</span>
            <span className="text-foreground font-mono">$0/mo</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Upstash Redis (Free Tier)</span>
            <span className="text-foreground font-mono">$0/mo</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Domain</span>
            <span className="text-foreground font-mono">$1/mo</span>
          </div>
          <div className="border-t border-chart-3/30 mt-4 pt-4 flex justify-between items-center font-semibold">
            <span className="text-foreground text-lg">Total Monthly Cost:</span>
            <span className="text-chart-3 font-mono text-2xl">$1/mo</span>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">How This Is Possible</h2>
      <p>Three architectural decisions enable this dramatic cost reduction:</p>

      <div className="space-y-6 my-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            1. No Database = $0
          </h3>
          <p className="text-sm">Eliminates database hosting costs entirely.</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            2. Serverless = $0 Idle Costs
          </h3>
          <p className="text-sm">Scale to zero when no one is using the app.</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            3. BYOK Model = $0 API Costs
          </h3>
          <p className="text-sm">Users provide their own AI provider API keys.</p>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Key Takeaways</h2>
      <div className="bg-card border border-border rounded-lg p-6 my-6">
        <ul className="space-y-2 list-disc list-inside">
          <li><strong className="text-foreground">Challenge assumptions:</strong> Do you really need a database?</li>
          <li><strong className="text-foreground">Embrace serverless:</strong> Pay only for what you use</li>
          <li><strong className="text-foreground">Privacy = Cost savings:</strong> Not storing data is free</li>
        </ul>
      </div>

      <p>
        Want to see a $20/month SaaS in action? Try TopFlow at{" "}
        <a href="https://www.topflow.dev" className="text-primary hover:underline">
          topflow.dev
        </a>
        .
      </p>
    </div>
  )
}
