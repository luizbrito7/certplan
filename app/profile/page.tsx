import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { createClient } from "@/lib/supabase/server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CertManager } from "@/components/profile/cert-manager"
import { ProfileForm } from "@/components/profile/profile-form"
import type { Certification, UserCertification } from "@/lib/types"

export const metadata = { title: "Certplan - My Profile" }

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const t = await getTranslations("profile")

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
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-5">
        <Avatar className="h-20 w-20 shrink-0 text-xl">
          <AvatarImage src={profile?.avatar_url ?? undefined} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h1 className="break-words text-2xl font-bold">{profile?.display_name ?? profile?.username}</h1>
          <p className="text-muted-foreground">@{profile?.username}</p>
          {profile?.bio && <p className="mt-1 text-sm">{profile.bio}</p>}
        </div>
      </div>

      <Separator />

      {/* Edit profile form */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t("editProfile")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>

      {/* Certifications I have */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            {t("haveLabel")}
            {haveCerts.length > 0 && (
              <Badge variant="secondary">{haveCerts.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CertManager
            status="have"
            userCerts={haveCerts}
            certifications={certifications}
            label=""
          />
        </CardContent>
      </Card>

      {/* Certifications seeking */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            {t("seekingLabel")}
            {seekingCerts.length > 0 && (
              <Badge variant="secondary">{seekingCerts.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CertManager
            status="seeking"
            userCerts={seekingCerts}
            certifications={certifications}
            label=""
          />
        </CardContent>
      </Card>
    </div>
  )
}
