'use client'

import { motion } from 'framer-motion'
import { Mail, MapPin, Phone } from 'lucide-react'

import { PageHero } from '@/components/sections/page-hero'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useContent } from '@/hooks/use-content'
import { siteConfig } from '@/lib/seo'

const ease = [0.22, 1, 0.36, 1] as const

const defaults = {
  hero: {
    eyebrow: 'Contact',
    title: 'Parlons de votre projet',
    description: 'Remplissez le formulaire ci-dessous ou contactez-nous directement. Nous répondons sous 24h.',
    image: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1920&q=80',
  },
  info: {
    phone: siteConfig.phone,
    email: siteConfig.email,
    street: siteConfig.address.street,
    postalCode: siteConfig.address.postalCode,
    city: siteConfig.address.city,
  },
}

export function ContactContent() {
  const { data } = useContent('contact', defaults)
  const hero = data.hero ?? defaults.hero
  const info = data.info ?? defaults.info

  // Fallback vers siteConfig si les champs sont vides
  const phone = info.phone || siteConfig.phone
  const email = info.email || siteConfig.email
  const street = info.street || siteConfig.address.street
  const postalCode = info.postalCode || siteConfig.address.postalCode
  const city = info.city || siteConfig.address.city

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        image={hero.image}
        breadcrumb="Contact"
      />

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
            >
              <Card className="rounded-2xl border-border/80 bg-card/70 shadow-[var(--shadow-md)] ring-1 ring-foreground/5">
                <CardHeader>
                  <CardTitle className="font-display text-lg">Envoyer un message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstname">Prénom</Label>
                        <Input id="firstname" name="firstname" placeholder="Jean" autoComplete="given-name" className="h-11 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastname">Nom</Label>
                        <Input id="lastname" name="lastname" placeholder="Dupont" autoComplete="family-name" className="h-11 rounded-xl" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="jean@entreprise.fr" autoComplete="email" className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone (optionnel)</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="06 12 34 56 78" autoComplete="tel" className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Votre message</Label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Décrivez votre projet en quelques mots..."
                        className="w-full rounded-xl border border-input bg-transparent px-3 py-2.5 text-sm leading-relaxed text-foreground transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full">Envoyer le message</Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease, delay: 0.06 }}
              className="space-y-5"
            >
              <Card className="rounded-2xl border-border/80 bg-card/70 shadow-[var(--shadow-sm)] ring-1 ring-foreground/5">
                <CardContent className="space-y-6 pt-6">
                  <div className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                      <Phone className="size-4" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Téléphone</p>
                      <a href={`tel:${phone}`} className="text-sm text-muted-foreground hover:text-foreground">{phone}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                      <Mail className="size-4" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Email</p>
                      <a href={`mailto:${email}`} className="text-sm text-muted-foreground hover:text-foreground">{email}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                      <MapPin className="size-4" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Adresse</p>
                      <p className="text-sm text-muted-foreground">{street}<br />{postalCode} {city}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="overflow-hidden rounded-2xl border border-border/80 bg-muted/30 shadow-[var(--shadow-sm)] ring-1 ring-foreground/5">
                <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
                  <p>Intégrez ici votre carte Google Maps<br /><span className="text-xs">(iframe ou API)</span></p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
