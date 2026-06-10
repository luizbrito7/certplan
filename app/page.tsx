import Link from "next/link"
import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"
import { CalendarDays, UserCircle, Bell, ShieldCheck } from "lucide-react"

export default async function HomePage() {
  const t = await getTranslations("landing")

  const features = [
    {
      icon: CalendarDays,
      title: t("calendarTitle"),
      description: t("calendarDescription"),
    },
    {
      icon: ShieldCheck,
      title: t("catalogTitle"),
      description: t("catalogDescription"),
    },
    {
      icon: UserCircle,
      title: t("profileTitle"),
      description: t("profileDescription"),
    },
    {
      icon: Bell,
      title: t("remindersTitle"),
      description: t("remindersDescription"),
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="flex justify-center mb-6">
          <Image src="/logo-dark.png" alt="certplan" width={72} height={72} className="block dark:hidden" />
          <Image src="/logo-light.png" alt="certplan" width={72} height={72} className="hidden dark:block" />
        </div>
        <h1 className="text-5xl font-bold tracking-tight leading-tight">
          {t("heroTitle")}
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto">
          {t("heroSubtitle")}
        </p>
        <div className="mt-8 flex gap-3 justify-center">
          <Button size="lg" asChild>
            <Link href="/auth/sign-up">{t("getStartedFree")}</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/auth/login">{t("signIn")}</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 pb-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-xl border bg-card p-5 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
