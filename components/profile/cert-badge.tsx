import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { VENDOR_LABELS } from "@/lib/types"
import type { UserCertification } from "@/lib/types"
import { CertLogo } from "@/components/icons/cert-logo"

interface CertBadgeProps {
  userCert: UserCertification
  onRemove?: (id: string) => void
  removeLabel?: string
  className?: string
  /** Dashed border + slightly muted badge — used for "seeking" certs */
  muted?: boolean
}

export function CertBadge({
  userCert,
  onRemove,
  removeLabel = "Remove",
  className,
  muted = false,
}: CertBadgeProps) {
  const cert = userCert.certification
  if (!cert) return null

  return (
    <div
      className={cn(
        "relative group flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/40",
        muted && "border-dashed",
        className,
      )}
    >
      {/* Official badge image, or vendor glyph as fallback */}
      <CertLogo
        cert={cert}
        className={cn("h-12 w-12 shrink-0 object-contain", muted && "opacity-75")}
      />

      {/* Name + vendor · code */}
      <div className="flex-1 min-w-0 pr-4">
        <p className="font-medium text-sm leading-snug">{cert.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {VENDOR_LABELS[cert.vendor]}
          {cert.code && (
            <>
              <span className="mx-1 opacity-40">·</span>
              {cert.code}
            </>
          )}
        </p>
      </div>

      {/* Remove button — visible on hover/focus (own profile only) */}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(userCert.id)}
          className="absolute right-2 top-2 rounded-full p-0.5 opacity-0 group-hover:opacity-50 hover:!opacity-100 focus:opacity-50 transition-opacity"
          aria-label={removeLabel}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
