import { Globe } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/seo'

type LogoProps = {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        'group inline-flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-foreground transition-opacity hover:opacity-90',
        className
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 transition-transform duration-300 group-hover:scale-[1.03]">
        <Globe className="size-[18px]" aria-hidden />
      </span>
      <span>{siteConfig.name}</span>
    </Link>
  )
}
