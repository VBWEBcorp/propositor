# SEO — Référencement naturel (Mymag Starter)

Ce document décrit l'architecture SEO intégrée au starter. L'objectif est que **chaque page soit indexable par Google dès le premier déploiement** et que le sitemap envoyé dans la Search Console soit immédiatement traité.

## Architecture SEO

### 1. Meta tags dynamiques — `react-helmet-async`

Chaque page utilise le composant `<SeoHead>` (`src/components/seo/seo-head.tsx`) qui injecte dans le `<head>` :

| Tag | Rôle |
|-----|------|
| `<title>` | Titre unique par page (format : `Page — Mymag`) |
| `<meta name="description">` | Description unique ≤ 155 caractères |
| `<meta name="robots">` | `index,follow` par défaut |
| `<link rel="canonical">` | URL canonique absolue |
| `<meta property="og:*">` | Open Graph (Facebook, LinkedIn, etc.) |
| `<meta name="twitter:*">` | Twitter Card `summary_large_image` |
| `<script type="application/ld+json">` | Données structurées JSON-LD |

### 2. Données structurées JSON-LD

Helpers dans `src/components/seo/json-ld.tsx` :

- `organizationJsonLd()` — identité de l'entreprise
- `webSiteJsonLd()` — déclaration du site avec SearchAction
- `webPageJsonLd(name, description, path)` — une page
- `softwareApplicationJsonLd()` — application SaaS avec prix
- `faqJsonLd(faqs)` — page FAQ

La page d'accueil injecte un `@graph` combinant Organization + WebSite + WebPage + SoftwareApplication.

### 3. Pré-rendu statique (SSG)

`vite-plugin-seo-prerender` génère le HTML statique au build pour chaque route listée dans `vite.config.ts`. Googlebot reçoit donc un HTML complet avec toutes les balises `<meta>` et le JSON-LD, sans avoir besoin d'exécuter le JavaScript.

**Pour ajouter une route au pré-rendu** : l'ajouter dans le tableau `routes` de `seoPrerender()` dans `vite.config.ts`.

### 4. Sitemap

- Généré automatiquement au build via `scripts/generate-sitemap.ts`.
- Copié dans `dist/sitemap.xml` ET `public/sitemap.xml`.
- **Pour ajouter une page** : ajouter l'entrée dans le tableau `routes` du script.
- Commande manuelle : `npm run sitemap`.

### 5. robots.txt

Fichier `public/robots.txt` :
- Autorise tous les bots
- Bloque `/api/`
- Pointe vers le sitemap

### 6. HTML sémantique

- Un seul `<h1>` par page
- Hiérarchie stricte `h1 → h2 → h3`
- `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`, `<main>` bien placés
- `aria-label` sur les navigations multiples
- `alt` sur les images

## Configuration globale

Le fichier `src/lib/seo.ts` contient les constantes du site :

```ts
export const siteConfig = {
  name: 'Mymag',
  url: 'https://mymag.app',       // ← à changer par projet
  locale: 'fr_FR',
  description: '...',
  ogImage: 'https://mymag.app/og.png',
  twitterHandle: '@mymag',
  themeColor: '#6d28d9',
}
```

## Checklist pour chaque nouveau projet

1. Mettre à jour `siteConfig` dans `src/lib/seo.ts` (URL, nom, description, OG image)
2. Mettre à jour les defaults dans `index.html` (title, meta, OG, canonical)
3. Mettre à jour le domaine dans `public/robots.txt`
4. Mettre à jour `SITE_URL` dans `scripts/generate-sitemap.ts` (ou via env)
5. Placer un fichier `og.png` (1200×630px) dans `public/`
6. Placer un `apple-touch-icon.png` (180×180px) dans `public/`
7. Vérifier le build : `npm run build` puis inspecter `dist/index.html`

## Checklist SEO avant mise en prod

- [ ] Chaque page a un `<SeoHead>` avec title + description + canonical + jsonLd
- [ ] `dist/sitemap.xml` contient toutes les routes publiques
- [ ] `dist/robots.txt` autorise le crawl
- [ ] HTML pré-rendu dans `dist/` contient les meta dans le `<head>`
- [ ] Open Graph preview OK ([opengraph.xyz](https://www.opengraph.xyz/))
- [ ] Données structurées OK ([Rich Results Test](https://search.google.com/test/rich-results))
- [ ] Lighthouse performance ≥ 90
- [ ] Soumettre `sitemap.xml` dans Google Search Console

---

*Règle Cursor associée : `.cursor/rules/seo.mdc` (toujours appliquée).*
