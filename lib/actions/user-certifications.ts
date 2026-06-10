"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { CertStatus, UserCertification } from "@/lib/types"

export async function addUserCertification(data: {
  certification_id: string
  status: CertStatus
  obtained_at?: string
}): Promise<{ data: UserCertification | null; error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: "Not authenticated" }

  const { data: uc, error } = await supabase
    .from("user_certifications")
    .insert({ ...data, user_id: user.id })
    .select("*, certification:certifications(*)")
    .single()

  if (error) return { data: null, error: error.message }
  revalidatePath("/profile")
  return { data: uc as UserCertification, error: null }
}

export async function removeUserCertification(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("user_certifications")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  revalidatePath("/profile")
  return { error: error?.message ?? null }
}

export async function updateUserCertification(
  id: string,
  data: { status?: CertStatus; obtained_at?: string | null },
): Promise<{ data: UserCertification | null; error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: "Not authenticated" }

  const { data: uc, error } = await supabase
    .from("user_certifications")
    .update(data)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*, certification:certifications(*)")
    .single()

  if (error) return { data: null, error: error.message }
  revalidatePath("/profile")
  return { data: uc as UserCertification, error: null }
}
