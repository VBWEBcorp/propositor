import type { Metadata } from 'next'

import { ServicesContent } from './services-content'
import {
  breadcrumbJsonLd,
  serviceJsonLd,
  webPageJsonLd,
} from '@/components/seo/json-ld'

const description =
  'Création de site, SEO, identité visuelle, développement sur mesure : découvrez nos services pour développer votre activité en ligne.'

const services = [
  { title: 'Création de site vitrine', desc: 'Un site moderne, rapide et responsive qui présente clairement votre activité et inspire confiance à vos visiteurs.' },
  { title: 'Application web', desc: 'Outils métier, plateformes de réservation, espaces clients : des applications pensées pour simplifier votre quotidien.' },
  { title: 'Référencement naturel (SEO)', desc: 'Optimisation technique, contenu stratégique et suivi de positionnement pour gagner en visibilité sur Google.' },
  { title: 'Identité visuelle', desc: 'Logo, charte graphique, supports de communication : une image cohérente qui vous ressemble.' },
  { title: 'Communication digitale', desc: 'Stratégie de contenu, réseaux sociaux et campagnes pour développer votre audience en ligne.' },
  { title: 'Développement sur mesure', desc: 'Intégrations, automatisations, API : des solutions techniques taillées pour vos besoins spécifiques.' },
  { title: 'Maintenance & sécurité', desc: 'Mises à jour, sauvegardes, monitoring et corrections pour un site toujours performant et sécurisé.' },
  { title: 'Analyse & reporting', desc: 'Tableaux de bord clairs pour suivre vos performances, comprendre vos visiteurs et ajuster votre stratégie.' },
]

export const metadata: Metadata = {
  title: 'Services',
  description,
  alternates: { canonical: '/services' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    webPageJsonLd('Services', description, '/services'),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: 'Services', path: '/services' },
    ]),
    ...services.map((s) => serviceJsonLd(s.title, s.desc, '/services')),
  ],
}

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicesContent />
    </>
  )
}
