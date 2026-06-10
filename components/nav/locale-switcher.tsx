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

const LOCALE_LABELS: Record<Locale, string> = {
  "pt-BR": "PT",
  en: "EN",
}

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 px-2 font-medium text-xs"
          disabled={isPending}
          aria-label="Switch language"
        >
          <Languages className="h-4 w-4" />
          {LOCALE_LABELS[locale]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[90px]">
        {(Object.entries(LOCALE_LABELS) as [Locale, string][]).map(([l, label]) => (
          <DropdownMenuItem
            key={l}
            onClick={() => handleSelect(l)}
            className={locale === l ? "font-semibold" : ""}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
