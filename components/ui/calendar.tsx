"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center h-8 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 p-0 opacity-50 hover:opacity-100",
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 p-0 opacity-50 hover:opacity-100",
        ),
        weekdays: "flex",
        weekday: "flex-1 rounded-md w-8 text-[0.8rem] font-normal text-muted-foreground text-center",
        weeks: "w-full border-collapse",
        week: "flex mt-2",
        day: "relative p-0 text-center text-sm",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal",
        ),
        range_start: "rounded-l-md bg-accent",
        range_end: "rounded-r-md bg-accent",
        range_middle: "rounded-none",
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
        today: "bg-accent text-accent-foreground rounded-md",
        outside:
          "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
