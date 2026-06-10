import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CalendarDays, UserCircle, Bell, ShieldCheck } from "lucide-react"

const features = [
  {
    icon: CalendarDays,
    title: "Visual Exam Calendar",
    description: "Schedule your certification exams on an interactive monthly calendar. Click any day to plan a new exam.",
  },
  {
    icon: ShieldCheck,
    title: "Certification Catalog",
    description: "Browse AWS, Azure, Cisco, Kubernetes, GCP and more. Can't find yours? Add a custom certification.",
  },
  {
    icon: UserCircle,
    title: "Public Profile",
    description: "Showcase the certifications you have and the ones you're working towards. Share your profile with others.",
  },
  {
    icon: Bell,
    title: "Email Reminders",
    description: "Get notified by email before your exam date so you never miss a scheduled certification.",
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="flex justify-center mb-6">
          <Image src="/logo-dark.png" alt="CertPlan" width={72} height={72} className="block dark:hidden" />
          <Image src="/logo-light.png" alt="CertPlan" width={72} height={72} className="hidden dark:block" />
        </div>
        <h1 className="text-5xl font-bold tracking-tight leading-tight">
          Plan your certification<br />journey
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto">
          Schedule exams, track your certifications, and get reminders — all in one clean dashboard.
        </p>
        <div className="mt-8 flex gap-3 justify-center">
          <Button size="lg" asChild>
            <Link href="/auth/sign-up">Get started free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/auth/login">Sign in</Link>
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
