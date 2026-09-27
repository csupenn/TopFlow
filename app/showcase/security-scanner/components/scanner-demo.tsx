"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Package,
  Lock,
  FileCode,
  Activity
} from "lucide-react"

export function ScannerDemo() {
  return (
    <div className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Coming Soon Banner - OSV Integration */}
          <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-background border-2 border-primary/30 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/20 rounded-full">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  🚀 Coming Soon: Real Vulnerability Data
                  <Badge className="bg-primary">Launching Next</Badge>
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  We're integrating <strong>Google's Open Source Vulnerabilities (OSV) database</strong> to provide real-time CVE data for all your scans!
                </p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <strong>Real CVE data</strong> from Google OSV
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <strong>7 ecosystems</strong>: npm, PyPI, Go, Rust, Maven, Ruby, PHP
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <strong>OSV Scanner node</strong>: Reusable in any workflow
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <strong>Private repo support</strong> with GitHub PAT
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  💡 <strong>Build Your Own Snyk</strong>: The OSV Scanner will be available as a composable node in the workflow builder, enabling custom security workflows!
                </p>
              </div>
            </div>
          </div>

          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">See It In Action</h2>
            <p className="text-xl text-muted-foreground">
              Here's what a security scan looks like for a real GitHub repository
            </p>
          </div>

          {/* Demo Results */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Overall Score Card */}
            <Card className="col-span-full bg-gradient-to-br from-primary/10 via-background to-background">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Shield className="h-6 w-6 text-primary" />
                      Security Score
                    </CardTitle>
                    <CardDescription className="mt-2">
                      facebook/react • Scanned 2 minutes ago
                    </CardDescription>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary">A+</div>
                    <div className="text-sm text-muted-foreground">95/100</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-green-500/10 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-500">12</div>
                    <div className="text-xs text-muted-foreground">Passed</div>
                  </div>
                  <div className="p-4 bg-yellow-500/10 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-500">3</div>
                    <div className="text-xs text-muted-foreground">Warnings</div>
                  </div>
                  <div className="p-4 bg-red-500/10 rounded-lg">
                    <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-500">0</div>
                    <div className="text-xs text-muted-foreground">Critical</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vulnerability Scan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Vulnerability Scan
                </CardTitle>
                <CardDescription>
                  OWASP Top 10 & CVE database check
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    SQL Injection
                  </span>
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    Pass
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    XSS Prevention
                  </span>
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    Pass
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    CSRF Protection
                  </span>
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    Pass
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Auth Best Practices
                  </span>
                  <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                    Warning
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Dependency Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  Dependency Analysis
                </CardTitle>
                <CardDescription>
                  Package security & outdated check
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Known Vulnerabilities
                  </span>
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    0 found
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Outdated Packages
                  </span>
                  <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                    3 found
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    License Compliance
                  </span>
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    Pass
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Dependency Health
                  </span>
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    Excellent
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Code Quality */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-purple-500" />
                  Code Quality
                </CardTitle>
                <CardDescription>
                  Best practices & maintainability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Test Coverage
                  </span>
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    85%
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Documentation
                  </span>
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    Excellent
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    CI/CD Pipeline
                  </span>
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    Configured
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Code Style
                  </span>
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    Consistent
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-orange-500" />
                  Compliance Checks
                </CardTitle>
                <CardDescription>
                  GDPR, SOC 2, HIPAA considerations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Data Privacy
                  </span>
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    GDPR Ready
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Security Policy
                  </span>
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    Present
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Audit Logging
                  </span>
                  <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                    Partial
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Encryption
                  </span>
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    TLS 1.3
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visual Dashboard Preview - NEW */}
          <div className="mt-8 p-6 bg-gradient-to-br from-primary/5 to-background border-2 border-primary/20 rounded-lg">
            <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Beautiful Security Dashboard
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Every scan generates a comprehensive visual dashboard with shareable badges and social media cards
            </p>
            <div className="rounded-lg overflow-hidden border-2 border-border">
              <img
                src="/demo-assets/images/github-security-dashboard.webp"
                alt="GitHub Security Dashboard"
                className="w-full"
              />
            </div>
          </div>

          {/* Live Badge Examples - ENHANCED */}
          <div className="mt-8 p-6 bg-background border rounded-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Live Auto-Generated Badges
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get a beautiful security badge for your README that updates automatically
            </p>
            <div className="space-y-4">
              {/* Example badges using our actual API */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <img
                    src="/api/badge/facebook/react"
                    alt="React Security Badge"
                    className="h-6"
                  />
                  <span className="text-xs text-muted-foreground font-mono">facebook/react</span>
                </div>
                <code className="text-xs bg-muted px-3 py-2 rounded overflow-x-auto block">
                  [![Security Score](https://www.topflow.dev/api/badge/facebook/react)](https://www.topflow.dev/showcase/security-scanner)
                </code>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <img
                    src="/api/badge/vercel/next.js"
                    alt="Next.js Security Badge"
                    className="h-6"
                  />
                  <span className="text-xs text-muted-foreground font-mono">vercel/next.js</span>
                </div>
                <code className="text-xs bg-muted px-3 py-2 rounded overflow-x-auto block">
                  [![Security Score](https://www.topflow.dev/api/badge/vercel/next.js)](https://www.topflow.dev/showcase/security-scanner)
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
