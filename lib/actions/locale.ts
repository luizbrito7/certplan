"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { locales, type Locale } from "@/i18n/locales"
import { createClient } from "@/lib/supabase/server"

export async function setLocale(locale: Locale) {
  if (!(locales as readonly string[]).includes(locale)) return

  const cookieStore = await cookies()
  cookieStore.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  })

  // Persist in profile if the user is logged in
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from("profiles").update({ locale }).eq("id", user.id)
    }
  } catch {
    // Non-critical; cookie is already set
  }

  revalidatePath("/", "layout")
}
