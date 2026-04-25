'use client'

import { Star } from 'lucide-react'

import { SectionTitle } from '@/components/ui/section-title'
import { useContent } from '@/hooks/use-content'

const defaultTestimonials = [
  { name: 'Marie D.', company: 'Boulangerie Le Fournil', text: "Depuis le nouveau site, je reçois 3 fois plus d'appels. Les clients nous trouvent enfin sur Google.", stars: 5 },
  { name: 'Thomas L.', company: 'Cabinet Conseil TLR', text: 'Un travail soigné, un site clair et professionnel. Mes prospects comprennent immédiatement ce que je propose.', stars: 5 },
  { name: 'Camille B.', company: 'Atelier Camille', text: "Le site reflète parfaitement l'univers de ma marque. J'ai gagné en crédibilité auprès de mes clients.", stars: 5 },
  { name: 'Laurent M.', company: 'LM Rénovation', text: 'En trois mois, mon chiffre a augmenté de 40 %. Le site et le SEO font vraiment la différence.', stars: 5 },
  { name: 'Nadia K.', company: 'Agence NovaTour', text: "Un accompagnement au top, des délais respectés et un résultat qui dépasse mes attentes.", stars: 5 },
  { name: 'Sophie R.', company: 'Studio Pilates Zen', text: "L'équipe a su capter l'ambiance de mon studio. Les réservations ont décollé.", stars: 5 },
  { name: 'Pierre V.', company: 'Transports Vallée', text: "Un investissement rentabilisé en quelques semaines. Des contacts qualifiés chaque jour.", stars: 5 },
  { name: 'Julie A.', company: "Les Jardins d'Alice", text: "Ils ont transformé notre présence en ligne. Le site est magnifique et nos ventes ont triplé.", stars: 5 },
  { name: 'Franck G.', company: 'Studio FG', text: "Design épuré, navigation fluide, exactement ce que je voulais pour présenter mes projets.", stars: 4 },
  { name: 'Émilie T.', company: 'Clinique Vétérinaire du Parc', text: "Nos clients trouvent toutes les infos facilement. La prise de rendez-vous a changé notre quotidien.", stars: 5 },
]

const defaults = {
  eyebrow: 'Témoignages',
  title: 'Ils nous font confiance',
  description: 'Des entreprises de tous horizons qui ont gagné en visibilité et en crédibilité.',
  testimonials: defaultTestimonials,
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-label="Google">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: { name: string; company: string; text: string; stars: number }
}) {
  return (
    <figure className="flex h-[200px] w-[300px] shrink-0 flex-col overflow-hidden rounded-xl border border-border/60 bg-card/80 px-5 py-4 shadow-[var(--shadow-xs)] ring-1 ring-foreground/[0.03] backdrop-blur-sm">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`size-3 ${i < testimonial.stars ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`}
              aria-hidden
            />
          ))}
        </div>
        <GoogleLogo />
      </div>
      <blockquote className="mt-3 flex-1 min-h-0 overflow-hidden">
        <p className="line-clamp-4 text-[13px] leading-relaxed text-foreground/85">
          &ldquo;{testimonial.text}&rdquo;
        </p>
      </blockquote>
      <figcaption className="mt-3 flex items-center gap-2.5 border-t border-border/40 pt-3 shrink-0">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
          {testimonial.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-foreground">{testimonial.name}</p>
          <p className="truncate text-[11px] text-muted-foreground">{testimonial.company}</p>
        </div>
      </figcaption>
    </figure>
  )
}

function MarqueeRow({
  items,
  direction,
}: {
  items: { name: string; company: string; text: string; stars: number }[]
  direction: 'left' | 'right'
}) {
  const animationClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'

  return (
    <div className="group relative flex gap-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-24" />
      <div className={`flex shrink-0 gap-6 py-2 ${animationClass} group-hover:[animation-play-state:paused]`}>
        {items.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} testimonial={t} />
        ))}
      </div>
      <div aria-hidden className={`flex shrink-0 gap-6 py-2 ${animationClass} group-hover:[animation-play-state:paused]`}>
        {items.map((t, i) => (
          <TestimonialCard key={`${t.name}-dup-${i}`} testimonial={t} />
        ))}
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const { data } = useContent('testimonials', defaults)
  const testimonials = data.testimonials ?? defaults.testimonials

  const mid = Math.ceil(testimonials.length / 2)
  const topRow = testimonials.slice(0, mid)
  const bottomRow = testimonials.slice(mid)

  return (
    <section className="overflow-hidden border-y border-border/60 bg-muted/10">
      <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 lg:px-8 lg:pt-20">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-border/70 bg-card px-4 py-2 shadow-sm">
            <GoogleLogo />
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="size-4 fill-amber-400 text-amber-400"
                  aria-hidden
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-foreground">
              5,0 sur Google
            </span>
          </div>
        </div>
        <div className="mt-6">
          <SectionTitle
            eyebrow={data.eyebrow ?? defaults.eyebrow}
            title={data.title ?? defaults.title}
            description={data.description ?? defaults.description}
          />
        </div>
      </div>

      <div className="mt-10 space-y-6 pb-14 lg:pb-20">
        <MarqueeRow items={topRow} direction="left" />
        {bottomRow.length > 0 && <MarqueeRow items={bottomRow} direction="right" />}
      </div>
    </section>
  )
}
