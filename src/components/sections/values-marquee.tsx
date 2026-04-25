import {
  Eye,
  Handshake,
  HeartHandshake,
  Lightbulb,
  Rocket,
  Shield,
  Sparkles,
  Target,
  type LucideIcon,
} from 'lucide-react'

const values: { icon: LucideIcon; label: string }[] = [
  { icon: Sparkles, label: 'Excellence' },
  { icon: Handshake, label: 'Confiance' },
  { icon: Lightbulb, label: 'Innovation' },
  { icon: Eye, label: 'Transparence' },
  { icon: Rocket, label: 'Performance' },
  { icon: HeartHandshake, label: 'Proximité' },
  { icon: Shield, label: 'Fiabilité' },
  { icon: Target, label: 'Sur mesure' },
]

function ValuesTrack({
  direction,
  variant,
}: {
  direction: 'left' | 'right'
  variant: 'light' | 'dark'
}) {
  const animClass =
    direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'

  const textClass =
    variant === 'dark'
      ? 'text-white/60'
      : 'text-foreground/70'
  const iconClass =
    variant === 'dark'
      ? 'text-white/30'
      : 'text-primary/50'
  const separatorClass =
    variant === 'dark'
      ? 'text-white/20'
      : 'text-border'

  const items = values.map((v) => (
    <span
      key={v.label}
      className={`inline-flex shrink-0 items-center gap-2.5 text-nowrap font-display text-sm font-medium tracking-wide uppercase sm:text-base ${textClass}`}
    >
      <v.icon className={`size-4 ${iconClass}`} aria-hidden />
      {v.label}
      <span className={separatorClass} aria-hidden>
        ·
      </span>
    </span>
  ))

  return (
    <div className="group flex overflow-hidden">
      <div
        className={`flex shrink-0 items-center gap-6 ${animClass}`}
        style={{ animationDuration: '35s' }}
      >
        {items}
      </div>
      <div
        aria-hidden
        className={`flex shrink-0 items-center gap-6 ${animClass}`}
        style={{ animationDuration: '35s' }}
      >
        {items}
      </div>
    </div>
  )
}

export function ValuesMarquee({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const wrapperClass =
    variant === 'dark'
      ? 'border-t border-white/10 bg-black/20 backdrop-blur-sm py-4 sm:py-5'
      : 'border-y border-border/60 bg-muted/15 py-6 sm:py-8'

  return (
    <div className={wrapperClass}>
      <ValuesTrack direction="left" variant={variant} />
    </div>
  )
}
