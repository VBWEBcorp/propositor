'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { CookieConsent } from '@/components/layout/cookie-consent'
import { FloatingCallButton } from '@/components/floating-call-button'
import { Footer } from '@/components/layout/footer'
import { MarketingBanner } from '@/components/marketing-banner'
import { MarketingPopup } from '@/components/marketing-popup'
import { Navbar } from '@/components/layout/navbar'

export function RootWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Vérifier si on est en espace admin ET si on est connecté
    const isAdminPath = pathname?.startsWith('/admin')
    const token = localStorage.getItem('authToken')
    setIsAdmin(isAdminPath && !!token)
  }, [pathname])

  // En espace admin connecté: pas de header/footer
  if (isAdmin) {
    return children
  }

  // Sinon: header + contenu + footer complet
  return (
    <>
      <MarketingBanner />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingCallButton />
      <MarketingPopup />
      <CookieConsent />
    </>
  )
}
