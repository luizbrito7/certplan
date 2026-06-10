"use client"

import Image from "next/image"
import Link from "next/link"

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2" aria-label="CertPlan home">
      <Image
        src="/logo-dark.png"
        alt="CertPlan"
        width={32}
        height={32}
        className="block dark:hidden"
        priority
      />
      <Image
        src="/logo-light.png"
        alt="CertPlan"
        width={32}
        height={32}
        className="hidden dark:block"
        priority
      />
      <span className="font-bold text-lg tracking-tight">CertPlan</span>
    </Link>
  )
}
