"use client"

import { cn } from "@/lib/utils"
import type { ExamPlan } from "@/lib/types"
import { VENDOR_CHIP_COLORS } from "@/lib/types"

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
        "w-full truncate rounded px-1.5 py-0.5 text-left text-xs font-medium leading-5 transition-opacity hover:opacity-80",
        colorClass,
        plan.status === "done" && "opacity-50 line-through",
        plan.status === "canceled" && "opacity-40 line-through",
      )}
      title={plan.title}
    >
      {plan.title}
    </button>
  )
}
