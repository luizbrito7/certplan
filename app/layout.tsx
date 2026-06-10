import type { Metadata } from "next"
import { Lexend } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"
import { AppHeader } from "@/components/nav/app-header"
import "./globals.css"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "CertPlan — Plan Your Certification Journey",
  description: "Schedule and track your IT certification exams in one place.",
}

const lexend = Lexend({
  variable: "--font-lexend",
  display: "swap",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lexend.variable} font-[family-name:var(--font-lexend)] antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppHeader />
          <main>{children}</main>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
