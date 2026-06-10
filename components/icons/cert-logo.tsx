"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Certification } from "@/lib/types"
import { VendorIcon } from "./vendor-icon"
import { getCertBadge } from "@/lib/cert-badges"

interface CertLogoProps {
  cert: Pick<Certification, "slug" | "vendor" | "name">
  className?: string
  /** When true (default), VendorIcon fallback uses official brand color. */
  colored?: boolean
}

/**
 * Shows the official badge image for a certification.
 * Falls back to VendorIcon (brand glyph) when no image is available or fails to load.
 */
export function CertLogo({ cert, className, colored = true }: CertLogoProps) {
  const badgeSrc = getCertBadge(cert.slug)
  const [imgError, setImgError] = useState(false)

  if (!badgeSrc || imgError) {
    return (
      <VendorIcon
        vendor={cert.vendor}
        className={className}
        colored={colored}
      />
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={badgeSrc}
      alt={cert.name}
      className={cn("object-contain", className)}
      onError={() => setImgError(true)}
    />
  )
}
