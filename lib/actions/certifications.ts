"use server"

import { createClient } from "@/lib/supabase/server"
import type { Certification, Vendor } from "@/lib/types"

export async function createCustomCertification(data: {
  name: string
  vendor: Vendor
  code?: string
}): Promise<{ data: Certification | null; error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: "Not authenticated" }

  const slug = `custom-${user.id.slice(0, 8)}-${Date.now()}`

  const { data: cert, error } = await supabase
    .from("certifications")
    .insert({
      name: data.name,
      vendor: data.vendor,
      code: data.code ?? null,
      slug,
      is_custom: true,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: cert as Certification, error: null }
}
