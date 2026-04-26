export const siteConfig = {
  name: 'VBWEB',
  url: 'https://propositor.vbweb.fr',
  locale: 'fr_FR',
  description:
    'Propositions commerciales sur-mesure VBWEB — sites web, SEO, présence en ligne.',
  ogImage: 'https://propositor.vbweb.fr/og.png',
  twitterHandle: '',
  themeColor: '#4FC3F7',
  email: 'contact@vbweb.fr',
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
  return `${page} — ${siteConfig.name}`
}
