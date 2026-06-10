import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { CertManager } from "@/components/profile/cert-manager"
import { ProfileForm } from "@/components/profile/profile-form"
import type { Certification, UserCertification } from "@/lib/types"

export const metadata = { title: "My Profile — CertPlan" }

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const [profileRes, certsRes, userCertsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("certifications").select("*").order("vendor").order("name"),
    supabase
      .from("user_certifications")
      .select("*, certification:certifications(*)")
      .eq("user_id", user.id),
  ])

  const profile = profileRes.data
  const certifications = (certsRes.data ?? []) as Certification[]
  const userCerts = (userCertsRes.data ?? []) as UserCertification[]

  const haveCerts = userCerts.filter(c => c.status === "have")
  const seekingCerts = userCerts.filter(c => c.status === "seeking")

  const initials = profile?.display_name
    ? profile.display_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : profile?.username?.slice(0, 2).toUpperCase() ?? "CP"

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-5">
        <Avatar className="h-20 w-20 text-xl">
          <AvatarImage src={profile?.avatar_url ?? undefined} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{profile?.display_name ?? profile?.username}</h1>
          <p className="text-muted-foreground">@{profile?.username}</p>
          {profile?.bio && <p className="mt-1 text-sm">{profile.bio}</p>}
        </div>
      </div>

      <Separator />

      {/* Edit profile form */}
      <section>
        <h2 className="text-base font-semibold mb-4">Edit Profile</h2>
        <ProfileForm profile={profile} />
      </section>

      <Separator />

      {/* Certifications I have */}
      <section>
        <CertManager
          status="have"
          userCerts={haveCerts}
          certifications={certifications}
          label="Certifications I have"
        />
      </section>

      <Separator />

      {/* Certifications seeking */}
      <section>
        <CertManager
          status="seeking"
          userCerts={seekingCerts}
          certifications={certifications}
          label="Certifications I'm seeking"
        />
      </section>
    </div>
  )
}
