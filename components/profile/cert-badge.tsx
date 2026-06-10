import { cn } from "@/lib/utils"
import { VENDOR_COLORS, VENDOR_LABELS } from "@/lib/types"
import type { UserCertification } from "@/lib/types"
import { CertLogo } from "@/components/icons/cert-logo"

interface CertBadgeProps {
  userCert: UserCertification
  onRemove?: (id: string) => void
  removeLabel?: string
  className?: string
}

export function CertBadge({ userCert, onRemove, removeLabel = "Remove", className }: CertBadgeProps) {
  const cert = userCert.certification
  if (!cert) return null

  const colorClass = VENDOR_COLORS[cert.vendor]

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium",
        colorClass,
        className,
      )}
    >
      <CertLogo cert={cert} className="h-4 w-4 shrink-0" />
      <span className="text-[10px] uppercase tracking-wider opacity-70">
        {VENDOR_LABELS[cert.vendor]}
      </span>
      <span className="mx-0.5 opacity-30">·</span>
      <span>{cert.name}</span>
      {cert.code && <span className="text-xs opacity-60">({cert.code})</span>}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(userCert.id)}
          className="ml-1 rounded-full opacity-50 hover:opacity-100 transition-opacity text-xs leading-none"
          aria-label={removeLabel}
        >
          ✕
        </button>
      )}
    </div>
  )
}
