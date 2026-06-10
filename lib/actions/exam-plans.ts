"use server"

import { createClient } from "@/lib/supabase/server"
import type { ExamPlan, ExamStatus } from "@/lib/types"

export async function createExamPlan(data: {
  certification_id: string
  title: string
  scheduled_at: string
  notes?: string
}): Promise<{ data: ExamPlan | null; error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: "Not authenticated" }

  const { data: plan, error } = await supabase
    .from("exam_plans")
    .insert({ ...data, user_id: user.id })
    .select("*, certification:certifications(*)")
    .single()

  if (error) return { data: null, error: error.message }
  return { data: plan as ExamPlan, error: null }
}

export async function updateExamPlan(
  id: string,
  data: Partial<{
    title: string
    scheduled_at: string
    notes: string
    status: ExamStatus
  }>,
): Promise<{ data: ExamPlan | null; error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: "Not authenticated" }

  const { data: plan, error } = await supabase
    .from("exam_plans")
    .update(data)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*, certification:certifications(*)")
    .single()

  if (error) return { data: null, error: error.message }
  return { data: plan as ExamPlan, error: null }
}

export async function deleteExamPlan(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("exam_plans")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  return { error: error?.message ?? null }
}
