# Design UI/UX — Mymag

Ce document fixe les consignes de design et d’expérience pour garder un niveau **SaaS premium** (références : Linear, Vercel, Stripe, Framer, Raycast). Éviter tout rendu “template cheap”, type Bootstrap ou admin daté.

## Principes

1. **Clarté avant tout** — La beauté sert la compréhension : hiérarchie lisible, parcours évident, CTA identifiables.
2. **Cohérence systémique** — Rayons, ombres, espacements et couleurs viennent des tokens (`src/index.css`, thème shadcn). Pas de valeurs magiques dispersées.
3. **Espacement haut de gamme** — Sections aérées, grilles respirantes, marges généreuses. Serrer uniquement pour des motifs denses volontaires (ex. densité data).
4. **Typographie** — **Inter** pour le corps, **Plus Jakarta Sans** pour les titres (`font-display`). Hiérarchie nette : un seul H1 par page, titres de section avec `SectionTitle`.
5. **Surfaces** — Cartes avec `rounded-xl` / `rounded-2xl` / `rounded-3xl`, bordures légères, ombres subtiles (`shadow-sm` / tokens `--shadow-*`), pas de surcharge.
6. **Couleurs** — Primaire violet/indigo (OKLCH) pour l’identité ; neutres froids pour le fond et le texte secondaire ; accents parcimonieux.
7. **Mode sombre** — Première classe via `ThemeToggle` ; vérifier contrastes et bordures en `dark`.
8. **Micro-interactions** — Framer Motion : apparitions en scroll, transitions courtes, easing premium (`[0.22, 1, 0.36, 1]`). Pas d’animations gratuites qui distraient.

## Structure de code

| Zone | Rôle |
|------|------|
| `src/components/ui` | Primitives shadcn + composants UI réutilisables (`SectionTitle`, etc.) |
| `src/components/layout` | Navbar, Footer, Logo |
| `src/components/sections` | Blocs de page (Hero, Features, …) |
| `src/layouts` | Enveloppes (ex. `RootLayout`) |
| `src/pages` | Pages routées |
| `src/app` | `router.tsx` |

## Composants

- **Boutons** — `Button` shadcn : variantes `default`, `outline`, `ghost`, tailles `sm` / `default` / `lg`.
- **Cartes** — `Card` + sous-composants ; éviter les divs brutes pour du contenu structuré.
- **Champs** — `Label` + `Input` ; états focus visibles.
- **Badges** — Pour statuts, labels courts, “eyebrow” textuels.
- **Navigation** — `Navbar` sticky, flou d’arrière-plan, menu mobile animé.

## Checklist avant merge UI

- [ ] Mobile + desktop (breakpoints `sm` / `md` / `lg`).
- [ ] Focus clavier visible sur éléments interactifs.
- [ ] Hover / active cohérents avec le design system.
- [ ] Pas de texte illisible sur fond (clair/sombre).
- [ ] Pas de classes Tailwind redondantes ou contradictoires.

## Évolution

Pour monter en charge : ajouter des pages, composer des sections, extraire des patterns récurrents dans `components/ui` ou `components/patterns` plutôt que dupliquer des grilles.

---

*Règle Cursor associée : `.cursor/rules/design-ui.mdc` (toujours appliquée).*
