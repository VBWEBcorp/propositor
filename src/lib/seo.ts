export const siteConfig = {
  name: 'Nom Entreprise',
  url: 'https://www.example.com',
  locale: 'fr_FR',
  description:
    'Votre entreprise - description courte et percutante de votre activité. Adaptez cette ligne à votre domaine.',
  ogImage: 'https://www.example.com/og.png',
  twitterHandle: '@votrecompte',
  themeColor: '#6d28d9',
  phone: '+33 1 23 45 67 89',
  email: 'contact@example.com',
  address: {
    street: '12 Rue Exemple',
    city: 'Paris',
    postalCode: '75001',
    country: 'FR',
  },
} as const

export type SeoMeta = {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  noindex?: boolean
  jsonLd?: Record<string, unknown>
}

export function buildTitle(page?: string) {
  if (!page) return siteConfig.name
  return `${page} - ${siteConfig.name}`
}

export const routes = [
  '/',
  '/a-propos',
  '/services',
  '/contact',
  '/mentions-legales',
  '/politique-de-confidentialite',
  '/conditions-generales',
  '/politique-cookies',
] as const
