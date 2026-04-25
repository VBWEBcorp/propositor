'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight } from 'lucide-react'

interface PopupData {
  enabled: boolean
  title: string
  description: string
  buttonText: string
  buttonLink: string
  imageUrl?: string
  bgColor: string
  textColor: string
  buttonColor: string
  delay: number
}

export function MarketingPopup() {
  const [popup, setPopup] = useState<PopupData | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('marketing-popup-dismissed')) return

    const fetchPopup = async () => {
      try {
        const res = await fetch('/api/marketing')
        const data = await res.json()
        if (!data.enabled) return

        setPopup(data)
        const timer = setTimeout(() => setVisible(true), (data.delay || 5) * 1000)
        return () => clearTimeout(timer)
      } catch {
        // Silently fail
      }
    }

    fetchPopup()
  }, [])

  const handleClose = () => {
    setVisible(false)
    sessionStorage.setItem('marketing-popup-dismissed', '1')
  }

  if (!popup) return null

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={handleClose}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-3xl shadow-[0_25px_60px_-12px_rgba(0,0,0,0.4)]"
            style={{ backgroundColor: popup.bgColor, color: popup.textColor }}
          >
            {/* Decorative gradient orbs */}
            <div
              className="pointer-events-none absolute -top-20 -right-20 size-40 rounded-full opacity-20 blur-3xl"
              style={{ backgroundColor: popup.buttonColor }}
            />
            <div
              className="pointer-events-none absolute -bottom-16 -left-16 size-32 rounded-full opacity-15 blur-3xl"
              style={{ backgroundColor: popup.buttonColor }}
            />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 flex size-9 items-center justify-center rounded-full bg-black/5 backdrop-blur-sm border border-black/5 hover:bg-black/10 transition-all duration-200 hover:scale-110 cursor-pointer"
              style={{ color: popup.textColor }}
            >
              <X className="size-4" strokeWidth={2.5} />
            </motion.button>

            {/* Image */}
            {popup.imageUrl && (
              <div className="relative w-full h-52 overflow-hidden">
                <img
                  src={popup.imageUrl}
                  alt={popup.title}
                  className="w-full h-full object-cover"
                />
                {/* Image bottom gradient fade */}
                <div
                  className="absolute inset-x-0 bottom-0 h-20"
                  style={{
                    background: `linear-gradient(to top, ${popup.bgColor}, transparent)`,
                  }}
                />
              </div>
            )}

            {/* Content */}
            <div className={`relative px-7 ${popup.imageUrl ? 'pt-1 pb-7' : 'py-8'}`}>
              {/* Small accent line */}
              {!popup.imageUrl && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 48 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="h-1 rounded-full mb-5"
                  style={{ backgroundColor: popup.buttonColor }}
                />
              )}

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-2xl font-extrabold tracking-tight leading-tight pr-10"
              >
                {popup.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-3 text-sm leading-relaxed opacity-70"
              >
                {popup.description}
              </motion.p>

              {popup.buttonText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-6"
                >
                  <a
                    href={popup.buttonLink || '#'}
                    onClick={handleClose}
                    className="group inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      backgroundColor: popup.buttonColor,
                      boxShadow: `0 4px 14px -3px ${popup.buttonColor}80`,
                    }}
                  >
                    {popup.buttonText}
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </a>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
