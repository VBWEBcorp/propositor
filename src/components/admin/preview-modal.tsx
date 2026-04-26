'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Monitor, Smartphone, X } from 'lucide-react'

import { cn } from '@/lib/utils'

type Props = {
  open: boolean
  onClose: () => void
  src: string
  title?: string
}

export function PreviewModal({ open, onClose, src, title = 'Aperçu' }: Props) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex flex-col bg-zinc-950/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <header
            className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-display text-sm font-semibold text-white">
              {title}
            </p>

            <div className="inline-flex items-center gap-1 rounded-lg bg-white/10 p-1">
              <button
                type="button"
                onClick={() => setDevice('desktop')}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  device === 'desktop'
                    ? 'bg-white text-zinc-900'
                    : 'text-white/70 hover:text-white'
                )}
              >
                <Monitor className="size-3.5" />
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setDevice('mobile')}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  device === 'mobile'
                    ? 'bg-white text-zinc-900'
                    : 'text-white/70 hover:text-white'
                )}
              >
                <Smartphone className="size-3.5" />
                Mobile
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/15"
            >
              <X className="size-3.5" />
              Fermer
            </button>
          </header>

          <div
            className="flex flex-1 items-stretch justify-center overflow-auto p-4 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              key={device}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'flex flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5',
                device === 'desktop'
                  ? 'w-full max-w-5xl'
                  : 'w-[390px] max-w-full'
              )}
            >
              <iframe
                src={src}
                title={title}
                className="h-full w-full flex-1 border-0"
                style={{ minHeight: '70vh' }}
              />
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
