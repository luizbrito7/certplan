import { ptBR } from "date-fns/locale"
import type { Locale } from "date-fns"

/** Maps an app locale string to a date-fns Locale object. */
export function getDateFnsLocale(locale: string): Locale | undefined {
  if (locale === "pt-BR") return ptBR
  return undefined // en uses date-fns default
}
