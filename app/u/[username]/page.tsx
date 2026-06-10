import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { CertBadge } from "@/components/profile/cert-badge"
import type { UserCertification } from "@/lib/types"

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params
  return { title: `@${username} — certplan` }
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single()

  if (!profile) notFound()

  const { data: userCerts } = await supabase
    .from("user_certifications")
    .select("*, certification:certifications(*)")
    .eq("user_id", profile.id)

  const certs = (userCerts ?? []) as UserCertification[]
  const haveCerts = certs.filter(c => c.status === "have")
  const seekingCerts = certs.filter(c => c.status === "seeking")

  const initials = profile.display_name
    ? profile.display_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : profile.username.slice(0, 2).toUpperCase()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-5">
        <Avatar className="h-20 w-20 text-xl">
          <AvatarImage src={profile.avatar_url ?? undefined} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{profile.display_name ?? profile.username}</h1>
          <p className="text-muted-foreground">@{profile.username}</p>
          {profile.bio && <p className="mt-1 text-sm">{profile.bio}</p>}
        </div>
      </div>

      <Separator />

      {/* Certs I have */}
      {haveCerts.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Certifications
          </h2>
          <div className="flex flex-wrap gap-2">
            {haveCerts.map(uc => <CertBadge key={uc.id} userCert={uc} />)}
          </div>
        </section>
      )}

      {/* Certs seeking */}
      {seekingCerts.length > 0 && (
        <>
          {haveCerts.length > 0 && <Separator />}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Working towards
            </h2>
            <div className="flex flex-wrap gap-2">
              {seekingCerts.map(uc => <CertBadge key={uc.id} userCert={uc} />)}
            </div>
          </section>
        </>
      )}

      {certs.length === 0 && (
        <p className="text-muted-foreground text-sm">No certifications added yet.</p>
      )}
    </div>
  )
}
