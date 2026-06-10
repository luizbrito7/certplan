"use client"

import { format } from "date-fns"
import { useLocale, useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getDateFnsLocale } from "@/lib/date"

interface CalendarHeaderProps {
  currentDate: Date
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  onNewEvent: () => void
}

export function CalendarHeader({
  currentDate,
  onPrev,
  onNext,
  onToday,
  onNewEvent,
}: CalendarHeaderProps) {
  const t = useTranslations("calendar")
  const locale = useLocale()
  const dateLocale = getDateFnsLocale(locale)

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onToday}>
          {t("today")}
        </Button>
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onPrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-lg font-semibold tracking-tight">
          {format(currentDate, "MMMM yyyy", { locale: dateLocale })}
        </h2>
      </div>

      <Button size="sm" onClick={onNewEvent}>
        <Plus className="h-4 w-4 mr-1.5" />
        {t("newEvent")}
      </Button>
    </div>
  )
}
