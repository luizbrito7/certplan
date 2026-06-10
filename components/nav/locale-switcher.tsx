"use client"

import { useTransition } from "react"
import { useLocale } from "next-intl"
import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { setLocale } from "@/lib/actions/locale"
import type { Locale } from "@/i18n/locales"
import { useRouter } from "next/navigation"

const LOCALE_OPTIONS: { locale: Locale; label: string; flag: string }[] = [
  { locale: "pt-BR", label: "PT", flag: "🇧🇷" },
  { locale: "en",    label: "EN", flag: "🇺🇸" },
]

export function LocaleSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleSelect(next: Locale) {
    startTransition(async () => {
      await setLocale(next)
      router.refresh()
    })
  }

  const current = LOCALE_OPTIONS.find(o => o.locale === locale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 px-2 font-medium text-xs cursor-pointer"
          disabled={isPending}
          aria-label="Switch language"
        >
          <Languages className="h-4 w-4" />
          {current?.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[100px]">
        {LOCALE_OPTIONS.map(({ locale: l, label, flag }) => (
          <DropdownMenuItem
            key={l}
            onClick={() => handleSelect(l)}
            className={`gap-2 cursor-pointer${locale === l ? " font-semibold" : ""}`}
          >
            <span>{flag}</span>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
