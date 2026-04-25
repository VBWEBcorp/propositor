'use client'

import { motion } from 'framer-motion'
import {
  BarChart3, Code, Globe, Megaphone, Palette, Search, ShieldCheck, Smartphone,
} from 'lucide-react'

import { CtaSection } from '@/components/sections/cta-section'
import { PageHero } from '@/components/sections/page-hero'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useContent } from '@/hooks/use-content'

const ease = [0.22, 1, 0.36, 1] as const
const defaultIcons = [Globe, Smartphone, Search, Palette, Megaphone, Code, ShieldCheck, BarChart3]

const defaults = {
  hero: {
    eyebrow: 'Services',
    title: "Tout ce qu'il faut pour réussir en ligne",
    description: "Des prestations complètes, de la conception à l'accompagnement continu, adaptées à toutes les tailles d'entreprise.",
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80',
  },
  services: [
    { title: 'Création de site vitrine', description: 'Un site moderne, rapide et responsive qui présente clairement votre activité et inspire confiance à vos visiteurs.' },
    { title: 'Application web', description: 'Outils métier, plateformes de réservation, espaces clients : des applications pensées pour simplifier votre quotidien.' },
    { title: 'Référencement naturel (SEO)', description: 'Optimisation technique, contenu stratégique et suivi de positionnement pour gagner en visibilité sur Google.' },
    { title: 'Identité visuelle', description: 'Logo, charte graphique, supports de communication : une image cohérente qui vous ressemble.' },
    { title: 'Communication digitale', description: 'Stratégie de contenu, réseaux sociaux et campagnes pour développer votre audience en ligne.' },
    { title: 'Développement sur mesure', description: 'Intégrations, automatisations, API : des solutions techniques taillées pour vos besoins spécifiques.' },
    { title: 'Maintenance & sécurité', description: 'Mises à jour, sauvegardes, monitoring et corrections pour un site toujours performant et sécurisé.' },
    { title: 'Analyse & reporting', description: 'Tableaux de bord clairs pour suivre vos performances, comprendre vos visiteurs et ajuster votre stratégie.' },
  ],
}

export function ServicesContent() {
  const { data } = useContent('services', defaults)
  const hero = data.hero ?? defaults.hero
  const services = data.services ?? defaults.services

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        image={hero.image}
        breadcrumb="Services"
      />

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s: any, i: number) => {
              const Icon = defaultIcons[i] ?? Globe
              return (
                <motion.div
                  key={s.title || i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.45, ease, delay: i * 0.03 }}
                >
                  <Card className="h-full rounded-2xl border-border/80 bg-card/70 shadow-[var(--shadow-sm)] ring-1 ring-foreground/5 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
                    <CardHeader>
                      <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <CardTitle className="font-display text-base">{s.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">{s.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  )
}
