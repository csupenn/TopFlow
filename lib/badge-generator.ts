/**
 * Badge SVG Generator
 *
 * The README badge used to show a security grade, but the badge route only ever had sample data
 * (lib/demo-data), so every repository — including ones never scanned — got the same "95/100".
 * Until badges are backed by a real, cached scan, the badge carries no score: it only links people
 * to run the scanner themselves.
 */

const LABEL = "dependency scan"
const VALUE = "TopFlow"
const CHAR_WIDTH = 6.5 // average Verdana 11px character width
const PADDING = 10

const widthOf = (text: string) => Math.round(text.length * CHAR_WIDTH + PADDING)

/** shields.io-style badge with no score: "dependency scan | TopFlow". */
export function generateScanLinkBadge(): string {
  const labelWidth = widthOf(LABEL)
  const valueWidth = widthOf(VALUE)
  const totalWidth = labelWidth + valueWidth
  const aria = `${LABEL}: ${VALUE}`

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${aria}">
  <title>${aria}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="#3b82f6"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="${(labelWidth / 2) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${LABEL}</text>
    <text x="${(labelWidth / 2) * 10}" y="140" transform="scale(.1)">${LABEL}</text>
    <text aria-hidden="true" x="${(labelWidth + valueWidth / 2) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${VALUE}</text>
    <text x="${(labelWidth + valueWidth / 2) * 10}" y="140" transform="scale(.1)">${VALUE}</text>
  </g>
</svg>`.trim()
}
