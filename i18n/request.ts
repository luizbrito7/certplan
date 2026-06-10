import { getRequestConfig } from "next-intl/server"
import { cookies, headers } from "next/headers"
import { locales, defaultLocale, type Locale } from "./locales"

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value

  let locale: Locale = defaultLocale

  if (cookieLocale && (locales as readonly string[]).includes(cookieLocale)) {
    locale = cookieLocale as Locale
  } else {
    // Detect from Accept-Language header
    const headersList = await headers()
    const acceptLanguage = headersList.get("accept-language") ?? ""
    if (acceptLanguage.toLowerCase().startsWith("pt")) {
      locale = "pt-BR"
    } else if (acceptLanguage.toLowerCase().startsWith("en")) {
      locale = "en"
    }
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
