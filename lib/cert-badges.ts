/**
 * Maps certification slugs to their official badge image paths in /public/badges/.
 *
 * Images are proprietary assets (AWS, Microsoft, CNCF, CompTIA, HashiCorp).
 * Add the actual PNG/SVG files to public/badges/ using the filenames below.
 * Any slug not listed here (incl. custom certs) falls back to the VendorIcon glyph.
 *
 * Naming convention: public/badges/<slug>.png
 */

// Slugs that match public/badges/<slug>.png files when available
const BADGE_SLUGS: readonly string[] = [
  // AWS
  "aws-clf-c02",
  "aws-saa-c03",
  "aws-sap-c02",
  "aws-dva-c02",
  "aws-soa-c02",
  "aws-dop-c02",
  "aws-ans-c01",
  "aws-mls-c01",
  "aws-scs-c02",
  // Azure
  "azure-az-900",
  "azure-az-104",
  "azure-az-204",
  "azure-az-305",
  "azure-az-400",
  "azure-ai-900",
  "azure-dp-900",
  "azure-sc-900",
  // Cisco
  "cisco-ccna",
  "cisco-encor",
  // Kubernetes / CNCF
  "cncf-cka",
  "cncf-ckad",
  "cncf-cks",
  // GCP
  "gcp-cdl",
  "gcp-ace",
  "gcp-pca",
  "gcp-pde",
  // Other
  "comptia-security-plus",
  "comptia-network-plus",
  "comptia-a-plus",
  "hashicorp-terraform-associate",
  "hashicorp-vault-associate",
]

/** Returns the badge image path for a cert slug, or undefined if no image is registered. */
export function getCertBadge(slug?: string | null): string | undefined {
  if (!slug) return undefined
  if (BADGE_SLUGS.includes(slug)) return `/badges/${slug}.png`
  return undefined
}
