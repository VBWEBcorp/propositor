'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const handleRefuse = () => {
    localStorage.setItem('cookie-consent', 'refused')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 z-[100] max-w-sm rounded-xl border border-border/60 bg-card shadow-lg p-4"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            Ce site utilise des cookies essentiels.{' '}
            <Link href="/politique-cookies" className="text-primary underline underline-offset-2 hover:text-primary/80">
              En savoir plus
            </Link>
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleAccept}
              className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary/90"
            >
              Accepter
            </button>
            <button
              onClick={handleRefuse}
              className="rounded-lg border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              Refuser
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
