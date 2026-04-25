import { Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

import { siteConfig } from '@/lib/seo'

const navLinks = [
  { label: 'Accueil', to: '/' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
]

const legalLinks = [
  { label: 'Mentions légales', to: '/mentions-legales' },
  { label: 'Confidentialité', to: '/politique-de-confidentialite' },
  { label: 'CGU', to: '/conditions-generales' },
  { label: 'Cookies', to: '/politique-cookies' },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-zinc-950 text-white">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-primary/5 blur-[100px]"
      />

      {/* Main footer */}
      <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[18px]"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            </span>
              <span className="text-white">{siteConfig.name}</span>
            </div>
            <p className="max-w-xs text-[13px] leading-relaxed text-zinc-400">
              {siteConfig.description}
            </p>
            {/* Contact info inline */}
            <div className="space-y-2.5 pt-1">
              <a
                href={`tel:${siteConfig.phone}`}
                className="group flex items-center gap-3 text-sm text-zinc-400 transition-colors hover:text-white"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-white/5 text-primary transition-colors group-hover:bg-white/10">
                  <Phone className="size-3.5" />
                </span>
                {siteConfig.phone}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="group flex items-center gap-3 text-sm text-zinc-400 transition-colors hover:text-white"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-white/5 text-primary transition-colors group-hover:bg-white/10">
                  <Mail className="size-3.5" />
                </span>
                {siteConfig.email}
              </a>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-primary">
                  <MapPin className="size-3.5" />
                </span>
                <span>
                  {siteConfig.address.street}, {siteConfig.address.postalCode}{' '}
                  {siteConfig.address.city}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Navigation">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Navigation
            </h3>
            <ul className="mt-5 space-y-3">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.to}
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Légal">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Légal
            </h3>
            <ul className="mt-5 space-y-3">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.to}
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

        </div>

        {/* Divider */}
        <div className="mt-14 border-t border-white/10" />

        {/* Bottom bar */}
        <div className="mt-6 flex items-center justify-center sm:justify-start">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  )
}
