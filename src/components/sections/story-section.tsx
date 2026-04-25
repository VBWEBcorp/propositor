'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'

import { useContent } from '@/hooks/use-content'

const ease = [0.22, 1, 0.36, 1] as const

const defaults = {
  eyebrow: 'Notre histoire',
  title: 'Une approche humaine, des résultats concrets',
  paragraph1: 'Depuis nos débuts, nous croyons qu\'un bon site commence par une bonne écoute. Nous prenons le temps de comprendre votre métier, vos clients et vos objectifs avant de concevoir quoi que ce soit.',
  paragraph2: 'Le résultat : des projets qui vous ressemblent, qui parlent à votre audience, et qui travaillent pour vous 24h/24.',
  image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
}

export function StorySection() {
  const { data } = useContent('home', { story: defaults })
  const story = data.story ?? defaults

  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])
  const rotate = useTransform(scrollYProgress, [0, 1], [-2, 1])

  const titleWords = story.title.split(' ')
  const lastWord = titleWords.pop() ?? ''
  const leadingWords = titleWords.join(' ')

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-b border-border/60 bg-background"
    >
      {/* Ambient gradient mesh */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 size-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[160px]" />
        <div className="absolute right-0 bottom-0 size-[400px] rounded-full bg-sky-400/10 blur-[140px]" />
      </div>

      {/* Dotted grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.15]"
        style={{
          backgroundImage:
            'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          color: 'var(--foreground)',
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 75%)',
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="grid items-center gap-16 md:grid-cols-[1.1fr_1fr] md:gap-16 lg:gap-24">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease }}
            className="relative"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1 backdrop-blur">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              <span className="font-display text-[10px] font-semibold tracking-[0.22em] text-foreground/70 uppercase">
                {story.eyebrow}
              </span>
            </div>

            {/* Headline with gradient accent on last word */}
            <h2 className="mt-7 font-display text-[36px] leading-[1.02] tracking-[-0.035em] text-foreground sm:text-[44px] lg:text-[56px]">
              {leadingWords}{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-primary to-sky-500 bg-clip-text text-transparent">
                  {lastWord}
                </span>
                <svg
                  aria-hidden
                  viewBox="0 0 200 12"
                  className="absolute -bottom-1 left-0 h-2 w-full text-primary/60"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M2 8 Q 50 2, 100 7 T 198 5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease, delay: 0.4 }}
                  />
                </svg>
              </span>
            </h2>

            {/* Numbered paragraphs */}
            <div className="mt-10 space-y-7">
              {[story.paragraph1, story.paragraph2].map((paragraph, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, ease, delay: 0.15 + i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center pt-1">
                    <span className="font-display text-[11px] font-bold tracking-widest text-primary">
                      0{i + 1}
                    </span>
                    <span className="mt-2 w-px flex-1 bg-gradient-to-b from-border via-border/50 to-transparent" />
                  </div>
                  <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
                    {paragraph}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease, delay: 0.45 }}
              className="mt-10"
            >
              <Link
                href="/a-propos"
                className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary hover:text-white hover:shadow-md"
              >
                Lire notre histoire
                <span className="flex size-5 items-center justify-center rounded-full bg-foreground/8 transition-all duration-300 group-hover:bg-white/20">
                  <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right — Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease, delay: 0.15 }}
            style={{ y, rotate }}
            className="relative"
          >
            {/* Soft glow halo */}
            <div
              aria-hidden
              className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-primary/15 via-sky-400/8 to-transparent blur-3xl"
            />

            {/* Stacked accent card behind */}
            <div
              aria-hidden
              className="absolute inset-0 translate-x-4 translate-y-4 rounded-[1.75rem] border border-border/50 bg-card/40 backdrop-blur-sm"
            />

            {/* Main image card */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-border/60 bg-muted/40 shadow-[0_30px_80px_-20px_rgba(15,23,42,0.25)] ring-1 ring-foreground/5">
              <img
                src={story.image}
                alt=""
                className="size-full object-cover"
                loading="lazy"
                width={800}
                height={1000}
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-transparent"
              />

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease, delay: 0.6 }}
                className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-2xl border border-white/15 bg-black/40 p-3 backdrop-blur-md"
              >
                <div className="flex -space-x-2">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="flex size-7 items-center justify-center rounded-full border-2 border-black/40 bg-gradient-to-br from-primary to-sky-500 text-[10px] font-bold text-white"
                    >
                      {['A', 'B', 'C'][i]}
                    </span>
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-white">
                    Une équipe à votre écoute
                  </p>
                  <p className="text-[10px] text-white/70">
                    Disponible pour échanger
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
