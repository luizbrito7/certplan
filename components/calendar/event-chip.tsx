"use client"

import { cn } from "@/lib/utils"
import type { ExamPlan } from "@/lib/types"
import { VENDOR_CHIP_COLORS } from "@/lib/types"
import { VendorIcon } from "@/components/icons/vendor-icon"

interface EventChipProps {
  plan: ExamPlan
  onClick?: (e: React.MouseEvent) => void
}

export function EventChip({ plan, onClick }: EventChipProps) {
  const vendor = plan.certification?.vendor ?? "other"
  const colorClass = VENDOR_CHIP_COLORS[vendor]

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-1 rounded px-1.5 py-0.5 text-left text-xs font-medium leading-5 transition-opacity hover:opacity-80",
        colorClass,
        plan.status === "done" && "opacity-50 line-through",
        plan.status === "canceled" && "opacity-40 line-through",
      )}
      title={plan.title}
    >
      <VendorIcon vendor={vendor} className="h-3 w-3" />
      <span className="truncate">{plan.title}</span>
    </button>
  )
}
