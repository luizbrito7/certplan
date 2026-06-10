/**
 * Maps certification slugs to their official badge image paths in /public/badges/.
 * Images sourced from Credly (AWS, CNCF, GCP, Cisco, CompTIA, HashiCorp)
 * and Microsoft Learn (Azure — level-based SVGs).
 * Custom certs (no entry here) fall back to the VendorIcon glyph.
 */

const CERT_BADGE_MAP: Record<string, string> = {
  // AWS
  "aws-clf-c02":  "/badges/aws-clf-c02.png",
  "aws-saa-c03":  "/badges/aws-saa-c03.png",
  "aws-sap-c02":  "/badges/aws-sap-c02.png",
  "aws-dva-c02":  "/badges/aws-dva-c02.png",
  "aws-soa-c02":  "/badges/aws-soa-c02.png",
  "aws-dop-c02":  "/badges/aws-dop-c02.png",
  "aws-ans-c01":  "/badges/aws-ans-c01.png",
  "aws-mls-c01":  "/badges/aws-mls-c01.png",
  "aws-scs-c02":  "/badges/aws-scs-c02.png",
  // Azure — Microsoft uses level-based badges (Fundamentals / Associate / Expert)
  "azure-az-900": "/badges/azure-fundamentals-badge.svg",
  "azure-ai-900": "/badges/azure-fundamentals-badge.svg",
  "azure-dp-900": "/badges/azure-fundamentals-badge.svg",
  "azure-sc-900": "/badges/azure-fundamentals-badge.svg",
  "azure-az-104": "/badges/azure-associate-badge.svg",
  "azure-az-204": "/badges/azure-associate-badge.svg",
  "azure-az-305": "/badges/azure-expert-badge.svg",
  "azure-az-400": "/badges/azure-expert-badge.svg",
  // Cisco
  "cisco-ccna":   "/badges/cisco-ccna.png",
  "cisco-encor":  "/badges/cisco-encor.png",
  // Kubernetes / CNCF
  "cncf-cka":     "/badges/cncf-cka.png",
  "cncf-ckad":    "/badges/cncf-ckad.png",
  "cncf-cks":     "/badges/cncf-cks.png",
  // GCP
  "gcp-cdl":      "/badges/gcp-cdl.png",
  "gcp-ace":      "/badges/gcp-ace.png",
  "gcp-pca":      "/badges/gcp-pca.png",
  "gcp-pde":      "/badges/gcp-pde.png",
  // CompTIA
  "comptia-security-plus":  "/badges/comptia-security-plus.png",
  "comptia-network-plus":   "/badges/comptia-network-plus.png",
  "comptia-a-plus":         "/badges/comptia-a-plus.png",
  // HashiCorp
  "hashicorp-terraform-associate": "/badges/hashicorp-terraform-associate.png",
  "hashicorp-vault-associate":     "/badges/hashicorp-vault-associate.png",
}

/** Returns the badge image path for a cert slug, or undefined if no image is registered. */
export function getCertBadge(slug?: string | null): string | undefined {
  if (!slug) return undefined
  return CERT_BADGE_MAP[slug]
}
