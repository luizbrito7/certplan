import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { createClient } from "@/lib/supabase/server"
import { CalendarGrid } from "@/components/calendar/calendar-grid"
import type { Certification, ExamPlan } from "@/lib/types"

export const metadata = { title: "Calendar — certplan" }

export default async function CalendarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const t = await getTranslations("calendar")

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
    <div className="flex flex-col flex-1 mx-auto w-full max-w-6xl px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("description")}
        </p>
      </div>
      <div className="flex-1 min-h-[600px] h-full">
        <CalendarGrid initialPlans={plans} certifications={certifications} />
      </div>
    </div>
  )
}
