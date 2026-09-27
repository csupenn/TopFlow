import { NextResponse } from "next/server"
import { generateScanLinkBadge } from "@/lib/badge-generator"

/**
 * README badge. It deliberately shows no score: the only data this route ever had was sample data,
 * which gave every repository the same grade. A graded badge needs a real, cached scan (see the
 * scanner page); until then the badge just links readers to run the scanner.
 *
 * GET only. (The old POST let anyone set any repository's score, unauthenticated.)
 */
export async function GET() {
  return new NextResponse(generateScanLinkBadge(), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
