"use client"

import { useState } from "react"
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  isSameDay,
} from "date-fns"
import { cn } from "@/lib/utils"
import type { Certification, ExamPlan } from "@/lib/types"
import { CalendarHeader } from "./calendar-header"
import { EventChip } from "./event-chip"
import { EventDialog, type DialogState } from "./event-dialog"

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

interface CalendarGridProps {
  initialPlans: ExamPlan[]
  certifications: Certification[]
}

export function CalendarGrid({ initialPlans, certifications }: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [plans, setPlans] = useState<ExamPlan[]>(initialPlans)
  const [dialog, setDialog] = useState<DialogState>({ open: false, mode: "create" })

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  function plansForDay(day: Date) {
    return plans.filter(p => isSameDay(new Date(p.scheduled_at), day))
  }

  function openCreate(date: Date) {
    setDialog({ open: true, mode: "create", date })
  }

  function openView(plan: ExamPlan, e: React.MouseEvent) {
    e.stopPropagation()
    setDialog({ open: true, mode: "view", plan })
  }

  function handleSuccess(plan: ExamPlan, action: "create" | "update" | "delete") {
    setPlans(prev => {
      if (action === "create") return [...prev, plan]
      if (action === "update") return prev.map(p => p.id === plan.id ? plan : p)
      return prev.filter(p => p.id !== plan.id)
    })
    setDialog({ open: false, mode: "create" })
  }

  return (
    <div className="flex flex-col h-full border rounded-xl overflow-hidden bg-background">
      <CalendarHeader
        currentDate={currentDate}
        onPrev={() => setCurrentDate(d => subMonths(d, 1))}
        onNext={() => setCurrentDate(d => addMonths(d, 1))}
        onToday={() => setCurrentDate(new Date())}
        onNewEvent={() => openCreate(new Date())}
      />

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 border-b bg-muted/30">
        {WEEKDAYS.map(day => (
          <div key={day} className="py-2 text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 flex-1">
        {days.map((day, i) => {
          const dayPlans = plansForDay(day)
          const visible = dayPlans.slice(0, 3)
          const overflow = dayPlans.length - 3
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isLast = i === days.length - 1

          return (
            <div
              key={i}
              onClick={() => openCreate(day)}
              className={cn(
                "min-h-[110px] border-b border-r p-1 cursor-pointer transition-colors hover:bg-muted/20",
                !isCurrentMonth && "bg-muted/10",
                isLast && "border-r-0",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-7 w-7 items-center justify-center rounded-full text-sm",
                  isToday(day) && "bg-foreground text-background font-bold",
                  !isCurrentMonth && "text-muted-foreground",
                )}
              >
                {format(day, "d")}
              </span>
              <div className="mt-0.5 space-y-0.5">
                {visible.map(plan => (
                  <EventChip key={plan.id} plan={plan} onClick={e => openView(plan, e)} />
                ))}
                {overflow > 0 && (
                  <p className="pl-1 text-xs text-muted-foreground">+{overflow} more</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <EventDialog
        state={dialog}
        certifications={certifications}
        onClose={() => setDialog({ open: false, mode: "create" })}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
