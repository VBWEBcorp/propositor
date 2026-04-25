'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NavLink {
  to: string
  label: string
}

const staticLinks: NavLink[] = [
  { to: '/', label: 'Accueil' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [links, setLinks] = useState<NavLink[]>(staticLinks)
  const pathname = usePathname()

  // Vérifier si la galerie et le blog sont activés
  useEffect(() => {
    const checkFeatures = async () => {
      try {
        const [galleryRes, blogRes] = await Promise.all([
          fetch('/api/gallery/settings'),
          fetch('/api/blog/settings'),
        ])
        const gallery = await galleryRes.json()
        const blog = await blogRes.json()

        const dynamicLinks: NavLink[] = [
          { to: '/', label: 'Accueil' },
          { to: '/a-propos', label: 'À propos' },
          { to: '/services', label: 'Services' },
        ]

        if (gallery.enabled) dynamicLinks.push({ to: '/gallery', label: 'Galerie' })
        if (blog.enabled) dynamicLinks.push({ to: '/blog', label: 'Blog' })

        dynamicLinks.push({ to: '/contact', label: 'Contact' })
        setLinks(dynamicLinks)
      } catch (error) {
        console.error('Failed to check features:', error)
      }
    }

    checkFeatures()
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Navigation principale"
        >
          {links.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60',
                pathname === l.to
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button size="sm" asChild>
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-border/70 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6">
              {links.map((l) => (
                <Link
                  key={l.to}
                  href={l.to}
                  className={cn(
                    'rounded-xl px-3 py-3 text-base font-medium transition-colors hover:bg-muted',
                    pathname === l.to
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-2 border-t border-border/60 pt-4">
                <Button className="w-full" asChild>
                  <Link href="/contact" onClick={() => setOpen(false)}>
                    Nous contacter
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
