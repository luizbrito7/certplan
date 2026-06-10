import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CalendarDays, User, LogOut } from "lucide-react"
import { Logo } from "./logo"

async function signOut() {
  "use server"
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}

export async function AppHeader() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username, display_name, avatar_url")
      .eq("id", user.id)
      .single()
    profile = data
  }

  const initials = profile?.display_name
    ? profile.display_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : profile?.username?.slice(0, 2).toUpperCase() ?? "CP"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Logo />

        <nav className="flex items-center gap-1">
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/calendar">
                  <CalendarDays className="h-4 w-4 mr-1.5" />
                  Calendar
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-1 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url ?? undefined} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{profile?.display_name ?? profile?.username}</p>
                    <p className="text-xs text-muted-foreground">@{profile?.username}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form action={signOut}>
                      <button type="submit" className="flex w-full items-center text-destructive">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/sign-up">Get started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
