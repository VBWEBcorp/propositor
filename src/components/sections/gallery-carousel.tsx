'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { useContent } from '@/hooks/use-content'

const defaultImages = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=720&q=80',
]

const defaults = {
  eyebrow: 'Galerie',
  title: 'En coulisses',
  images: defaultImages,
}

const GAP = 20
const CARD_WIDTH = 340

export function GalleryCarousel() {
  const { data } = useContent('home', { gallery: defaults })
  const gallery = data.gallery ?? defaults
  const images = gallery.images ?? defaultImages

  const trackRef = useRef<HTMLDivElement>(null)
  const [maxScroll, setMaxScroll] = useState(0)
  const x = useMotionValue(0)
  const progress = useTransform(x, [0, -maxScroll || -1], [0, 1])

  useEffect(() => {
    function measure() {
      if (!trackRef.current) return
      setMaxScroll(Math.max(0, trackRef.current.scrollWidth - trackRef.current.clientWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const slide = useCallback(
    (dir: -1 | 1) => {
      const current = x.get()
      const step = CARD_WIDTH + GAP
      const next = Math.max(-maxScroll, Math.min(0, current - dir * step))
      animate(x, next, { type: 'spring', stiffness: 300, damping: 35 })
    },
    [x, maxScroll]
  )

  return (
    <section className="border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-3">
            <p className="font-display text-xs font-semibold tracking-[0.22em] text-primary uppercase">
              {gallery.eyebrow}
            </p>
            <h2 className="font-display text-2xl tracking-tight text-foreground sm:text-3xl">
              {gallery.title}
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <Button type="button" variant="outline" size="icon" className="rounded-full" aria-label="Image précédente" onClick={() => slide(-1)}>
              <ChevronLeft className="size-5" />
            </Button>
            <Button type="button" variant="outline" size="icon" className="rounded-full" aria-label="Image suivante" onClick={() => slide(1)}>
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </div>

        <div className="mt-10 overflow-hidden" role="region" aria-label="Galerie photos">
          <motion.div
            ref={trackRef}
            style={{ x }}
            drag="x"
            dragConstraints={{ left: -maxScroll, right: 0 }}
            dragElastic={0.08}
            className="flex cursor-grab active:cursor-grabbing"
          >
            {images.map((src: string, i: number) => (
              <motion.div key={i} className="shrink-0" style={{ width: CARD_WIDTH, marginRight: i < images.length - 1 ? GAP : 0 }}>
                <div className="group overflow-hidden rounded-2xl border border-border/80 bg-card/70 shadow-[var(--shadow-sm)] ring-1 ring-foreground/5 transition-shadow duration-300 hover:shadow-[var(--shadow-md)]">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={src} alt="" loading="lazy" width={720} height={540} className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="h-1 w-32 overflow-hidden rounded-full bg-border">
            <motion.div className="h-full rounded-full bg-primary/60" style={{ scaleX: progress, transformOrigin: 'left' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
