import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { createServiceClient } from "@/lib/supabase/service"
import { ReminderEmailHtml } from "@/lib/email/reminder-template"
import { format, addHours } from "date-fns"

export async function GET(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createServiceClient()
  const now = new Date()
  const windowEnd = addHours(now, 25)

  // Find plans due within next 24h that haven't been reminded
  const { data: plans, error } = await supabase
    .from("exam_plans")
    .select("*, certification:certifications(name), profile:profiles!exam_plans_user_id_fkey(display_name, username)")
    .eq("status", "planned")
    .eq("reminder_sent", false)
    .gte("scheduled_at", now.toISOString())
    .lte("scheduled_at", windowEnd.toISOString())

  if (error) {
    console.error("Cron reminders error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const results: { id: string; sent: boolean }[] = []

  for (const plan of plans ?? []) {
    const profile = plan.profile as { display_name?: string; username?: string } | null
    const certName = (plan.certification as { name?: string } | null)?.name ?? plan.title
    const userName = profile?.display_name ?? profile?.username ?? "there"
    const examDate = format(new Date(plan.scheduled_at), "PPP 'at' HH:mm")
    const msUntil = new Date(plan.scheduled_at).getTime() - now.getTime()
    const daysUntil = Math.max(1, Math.ceil(msUntil / 86_400_000))

    // Get user email
    const { data: userRow } = await supabase.auth.admin.getUserById(plan.user_id)
    const email = userRow?.user?.email
    if (!email) continue

    const { error: sendError } = await resend.emails.send({
      from: "CertPlan <noreply@certplan.app>",
      to: email,
      subject: `Reminder: ${certName} exam ${daysUntil === 1 ? "tomorrow" : `in ${daysUntil} days`}`,
      html: ReminderEmailHtml({ userName, certName, examDate, daysUntil }),
    })

    if (!sendError) {
      await supabase.from("exam_plans").update({ reminder_sent: true }).eq("id", plan.id)
      results.push({ id: plan.id, sent: true })
    } else {
      results.push({ id: plan.id, sent: false })
    }
  }

  return NextResponse.json({ processed: results.length, results })
}
