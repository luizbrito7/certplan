"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Profile } from "@/lib/types"

export async function updateProfile(data: {
  display_name?: string
  bio?: string
  avatar_url?: string
  username?: string
}): Promise<{ data: Profile | null; error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: "Not authenticated" }

  const { data: profile, error } = await supabase
    .from("profiles")
    .update(data)
    .eq("id", user.id)
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  revalidatePath("/profile")
  return { data: profile as Profile, error: null }
}
