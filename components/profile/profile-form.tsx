"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { updateProfile } from "@/lib/actions/profile"
import type { Profile } from "@/lib/types"
import { toast } from "sonner"

interface ProfileFormProps {
  profile: Profile | null
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "")
  const [username, setUsername] = useState(profile?.username ?? "")
  const [bio, setBio] = useState(profile?.bio ?? "")
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "")
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)
    const { error } = await updateProfile({
      display_name: displayName || undefined,
      username: username || undefined,
      bio: bio || undefined,
      avatar_url: avatarUrl || undefined,
    })
    setLoading(false)
    if (error) { toast.error(error); return }
    toast.success("Profile updated")
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label>Display Name</Label>
        <Input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" />
      </div>
      <div className="space-y-1.5">
        <Label>Username</Label>
        <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label>Avatar URL</Label>
        <Input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://…" />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label>Bio</Label>
        <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="A few words about yourself…" rows={3} />
      </div>
      <div className="sm:col-span-2 flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save changes
        </Button>
      </div>
    </div>
  )
}
