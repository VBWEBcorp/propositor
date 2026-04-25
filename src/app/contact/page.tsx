import type { Metadata } from 'next'

import { ContactContent } from './contact-content'
import { breadcrumbJsonLd, webPageJsonLd } from '@/components/seo/json-ld'

const description =
  'Contactez-nous pour discuter de votre projet. Devis gratuit, réponse rapide.'

export const metadata: Metadata = {
  title: 'Contact',
  description,
  alternates: { canonical: '/contact' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    webPageJsonLd('Contact', description, '/contact'),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: 'Contact', path: '/contact' },
    ]),
  ],
}

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactContent />
    </>
  )
}
