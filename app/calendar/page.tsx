import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CalendarGrid } from "@/components/calendar/calendar-grid"
import type { Certification, ExamPlan } from "@/lib/types"

export const metadata = { title: "Calendar — CertPlan" }

export default async function CalendarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const [plansRes, certsRes] = await Promise.all([
    supabase
      .from("exam_plans")
      .select("*, certification:certifications(*)")
      .eq("user_id", user.id)
      .order("scheduled_at"),
    supabase
      .from("certifications")
      .select("*")
      .order("vendor")
      .order("name"),
  ])

  const plans = (plansRes.data ?? []) as ExamPlan[]
  const certifications = (certsRes.data ?? []) as Certification[]

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">My Calendar</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Click any day to schedule an exam, or click an event to view details.
        </p>
      </div>
      <div className="h-[calc(100vh-180px)] min-h-[600px]">
        <CalendarGrid initialPlans={plans} certifications={certifications} />
      </div>
    </div>
  )
}
