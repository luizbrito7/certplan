"use client"

import { cn } from "@/lib/utils"
import type { ExamPlan } from "@/lib/types"
import { VENDOR_CHIP_COLORS } from "@/lib/types"
import { CertLogo } from "@/components/icons/cert-logo"

interface EventEmblemProps {
  plan: ExamPlan
  onClick?: (e: React.MouseEvent) => void
}

/**
 * Large centered badge for calendar cells.
 * Shows the certification's official badge image (or vendor glyph as fallback)
 * above the exam code/title, inside a brand-tinted rounded container.
 */
export function EventEmblem({ plan, onClick }: EventEmblemProps) {
  const cert = plan.certification
  const vendor = cert?.vendor ?? "other"
  const colorClass = VENDOR_CHIP_COLORS[vendor]
  const label = cert?.code ?? plan.title

  return (
    <button
      type="button"
      onClick={onClick}
      title={plan.title}
      className={cn(
        "w-full rounded-lg px-1 py-1.5 transition-opacity hover:opacity-80 flex flex-col items-center gap-0.5",
        colorClass,
        plan.status === "done" && "opacity-50",
        plan.status === "canceled" && "opacity-40 grayscale",
      )}
    >
      {cert ? (
        <CertLogo
          cert={cert}
          className={cn(
            "h-20 w-20",
            plan.status === "done" && "grayscale",
          )}
        />
      ) : (
        <span className="h-20 w-20" />
      )}
      <span
        className={cn(
          "text-[10px] font-semibold leading-tight text-center w-full truncate",
          plan.status === "done" && "line-through",
          plan.status === "canceled" && "line-through",
        )}
      >
        {label}
      </span>
    </button>
  )
}
