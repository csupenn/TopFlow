"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already dismissed the notice
    const dismissed = localStorage.getItem("cookie-notice-dismissed")
    if (!dismissed) {
      // Show notice after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem("cookie-notice-dismissed", "true")
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-in slide-in-from-bottom duration-500">
      <div className="bg-card/95 backdrop-blur-sm border-2 border-border rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <ShieldCheck className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-sm text-foreground">
              <strong>No cookies here.</strong> We use cookieless, anonymous page analytics (Vercel Web
              Analytics) to improve our demo.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </Link>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 shrink-0"
            onClick={handleDismiss}
            aria-label="Dismiss privacy notice"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-3 flex gap-2">
          <Button size="sm" onClick={handleDismiss} className="flex-1">
            Got it
          </Button>
          <Button size="sm" variant="outline" asChild className="flex-1">
            <Link href="/privacy">Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
