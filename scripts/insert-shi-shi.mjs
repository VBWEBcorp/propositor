import mongoose from 'mongoose'
import { readFileSync } from 'node:fs'

try {
  const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf-8')
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
} catch (e) {
  console.error('Impossible de lire .env.local:', e.message)
  process.exit(1)
}

const URI = process.env.MONGODB_URI
if (!URI) {
  console.error('No MONGODB_URI in .env.local')
  process.exit(1)
}

const SHI_SHI = {
  slug: 'shi-shi',
  brand: 'vbweb',
  docType: 'proposition',
  client: 'Shi Shi',
  baseline: 'Développement digital et stratégie d\'acquisition',
  date: '26/04/2026',
  number: 'N°2026-11',
  clientLogoUrl: '',
  content: `## 1. Contexte

Shi Shi est un complexe sportif premium situé à Lamai, dans le sud de Koh Samui. Le projet rassemble plusieurs activités haut de gamme sous une même identité :

- Tennis
- Pickleball
- Salle de fitness
- Restaurant healthy
- Kids club et babysitting
- Piscine

Le positionnement choisi est celui d'un véritable social club resort, articulé autour de trois valeurs fortes : le sport, le bien-être et le lien social. L'ambition est de devenir la référence multi-sport et lifestyle au sud de Koh Samui, en s'adressant prioritairement aux expatriés de la zone Lamai et sud, aux digital nomads installés sur l'île, ainsi qu'à la clientèle touristique internationale.

Derrière ce projet, deux jeunes entrepreneurs français qui relèvent le défi ambitieux de transformer une société thaïlandaise en un complexe premium qui leur ressemble, basé sur leurs passions personnelles.

## 2. Problématique

Aujourd'hui, Shi Shi dispose de tous les atouts physiques pour s'imposer comme une référence sur Koh Samui. Pourtant, trois freins majeurs limitent considérablement son développement digital :

### Aucune présence web professionnelle

Sans site internet moderne, Shi Shi est aujourd'hui invisible pour les milliers d'internautes qui recherchent activement ses services chaque mois sur Google.

### Aucun système de réservation en ligne

La friction est énorme pour les clients potentiels : chaque demande passe par WhatsApp, par téléphone ou nécessite un déplacement physique. Une grande partie du trafic potentiel se perd à cette étape.

### Notoriété digitale limitée

La cible expat, nomade et touristique ne trouve pas Shi Shi au moment décisif, c'est-à-dire lorsqu'elle cherche concrètement un terrain de tennis, une salle de sport, un restaurant healthy ou une activité pour ses enfants.

Conséquence directe : un volume de recherches massif sur Koh Samui profite chaque mois aux concurrents pendant que Shi Shi reste largement dépendant du bouche-à-oreille.

## 3. Constat marché

Une analyse approfondie du marché digital de Koh Samui a été menée sur l'ensemble des activités de Shi Shi. Les chiffres parlent d'eux-mêmes.

### Volume de recherche mensuel sur Google, Koh Samui (en anglais)

| Catégorie | Recherches mensuelles |
| --- | --- |
| Restaurant Lamai et alentours | ~5 500 |
| Gym / fitness Koh Samui | ~5 800 |
| Tennis Koh Samui | ~700 |
| Kids et family Koh Samui | ~600 |
| Piscine et pool Lamai | ~260 |
| Pickleball Koh Samui | ~150 |
| Padel Koh Samui | ~110 |
| **Total** | **~13 000 recherches / mois** |

13 000 personnes par mois cherchent activement des services correspondant à l'offre de Shi Shi sur Koh Samui. Aujourd'hui, Shi Shi n'en capte aucune.

### Une fenêtre d'opportunité unique

Le marché digital local est particulièrement sous-équipé. La majorité des concurrents disposent de sites datés, peu performants et mal référencés. Cette situation représente une fenêtre d'opportunité majeure : une marque qui investit aujourd'hui dans une stratégie digitale moderne et bien menée peut s'installer durablement en tête des résultats Google sur Koh Samui, et ce pour plusieurs années.

## 4. Stratégie proposée

L'approche s'articule autour de quatre piliers complémentaires pour capter ce trafic et le convertir en réservations concrètes.

### Pilier 1 : Site web sur mesure haute performance

Plateforme entièrement développée sur mesure avec Next.js, technologie ultra-rapide et particulièrement adaptée aux exigences modernes du référencement naturel et de l'expérience mobile.

Le site sera multilingue (anglais et français) et conçu nativement pour la conversion : parcours fluide, boutons d'action visibles, tarifs clairs, photos qualitatives, avis clients mis en avant.

L'architecture sera pensée pour le SEO, avec une page dédiée par activité, optimisée sur les mots-clés à fort volume identifiés lors de l'analyse marché.

> Note sur le volume de pages : la taille exacte du site sera ajustée au fur et à mesure pour atteindre l'objectif de référencement naturel. À titre indicatif, le projet pourrait nécessiter entre 20 et 35 pages stratégiques sur la première année (pages business par activité + contenus SEO de soutien).

### Pilier 2 : Système de réservation en ligne intégré

Outil de réservation autonome accessible 24h/24, 7j/7, avec :

- Gestion des créneaux et disponibilités en temps réel
- Paiement sécurisé via Stripe
- Confirmations automatiques par email
- Notifications WhatsApp pour les clients et l'équipe Shi Shi

Fini les allers-retours WhatsApp manuels. Les clients réservent en moins d'une minute, l'équipe Shi Shi récupère un temps précieux pour se concentrer sur l'expérience sur place.

### Pilier 3 : Acquisition multi-canal

Une stratégie d'acquisition complète articulée sur quatre leviers :

- **SEO local** : positionnement organique progressif sur les mots-clés prioritaires identifiés (restaurant Lamai, gym Koh Samui, tennis Koh Samui, et les variantes longue traîne associées)
- **Google Business Profile** : optimisation complète, posts hebdomadaires, gestion active des avis clients, mise à jour régulière des photos
- **Google Search Ads** : campagnes ciblées sur les requêtes à forte intention de réservation
- **Meta Ads** : sponsoring des publications Instagram et Facebook avec ciblage géolocalisé Koh Samui et audiences expat, sport et lifestyle

> Note sur la stratégie publicitaire : la répartition entre Meta Ads et Google Ads sera ajustée tout au long de la collaboration en fonction des performances observées. Le budget reste le même, l'objectif reste le même : générer plus de clients pour Shi Shi. Ce qui évolue, ce sont les leviers utilisés, en permanence optimisés selon les retours terrain.

### Pilier 4 : Optimisation continue de la conversion (CRO)

Mois après mois, analyse fine des comportements utilisateurs et ajustements ciblés pour augmenter le taux de transformation. Un visiteur supplémentaire qui réserve, c'est du chiffre d'affaires généré sans coût d'acquisition additionnel. Cette démarche d'amélioration continue transforme le site en machine à conversion plutôt qu'en simple vitrine.

## 5. Pourquoi travailler avec moi

Quatre éléments différenciants par rapport à une agence classique :

### Présence sur place à Koh Samui

Installation prévue à Koh Samui à partir de septembre 2026. Cela signifie une disponibilité pour passer régulièrement chez Shi Shi, comprendre la clientèle réelle, prendre les contenus visuels nécessaires et ajuster la stratégie en direct. Aucune agence basée à distance ne peut offrir ce niveau de proximité.

### Compétences full-stack

Une seule personne pour gérer le développement technique du site, la création du système de réservation, la stratégie SEO et le pilotage des campagnes publicitaires. Pas de dépendance à plusieurs prestataires, pas de pertes en ligne.

### Approche partenariale et long terme

Un engagement dans la durée, pas une prestation one-shot. L'objectif n'est pas de facturer mais de construire une croissance solide pour Shi Shi.

### Maîtrise des dernières technologies : SEO, GEO et recherche par IA

100% sur mesure, aucun WordPress vieillissant, aucun template générique. Stack technique moderne (Next.js, MongoDB, Stripe, Resend) pensée pour la performance, le référencement et l'évolutivité.

La même approche moderne est appliquée à la stratégie de visibilité. Les habitudes de recherche évoluent rapidement : aujourd'hui, les internautes ne se contentent plus de Google. Ils utilisent de plus en plus ChatGPT, Perplexity, Claude, Gemini ou la recherche IA intégrée à Google pour trouver des recommandations locales. Une stratégie efficace en 2026 ne peut plus se limiter au SEO traditionnel.

L'approche proposée intègre les trois niveaux complémentaires :

- **SEO classique** : positionnement sur les moteurs de recherche traditionnels (Google, Bing)
- **GEO (Generative Engine Optimization)** : optimisation pour apparaître dans les réponses générées par les intelligences artificielles
- **SEO local et géolocalisé** : présence forte sur Google Maps, Google Business Profile et les recherches "near me"

Cette triple approche garantit que Shi Shi sera trouvé, peu importe comment et où ses clients potentiels effectuent leurs recherches, aujourd'hui comme dans les années à venir. Plus aucune méthode old school, uniquement des techniques actuelles et alignées avec les nouvelles habitudes de consommation digitale.

## 6. Investissement

### Création de la plateforme

| Prestation | Valeur |
| --- | --- |
| Site web sur mesure Next.js | 2 000 € |
| Système de réservation en ligne avec paiement Stripe | 1 000 € |
| **Total valeur** | **3 000 €** |
| Remise de bienvenue (-20%) | **-600 €** |
| **Total à régler** | **2 400 €** |

**Modalités de paiement** : 50% à la signature, 50% à la livraison.
**Délai de livraison** : 4 à 6 semaines à compter de la validation des contenus.

### Accompagnement marketing mensuel

**800 € / mois**, engagement 12 mois minimum.

Inclus chaque mois :

- SEO local et optimisation continue du site
- Gestion complète du Google Business Profile
- Pilotage des campagnes Google Ads et Meta Ads (répartition ajustée selon performances)
- Optimisation continue du taux de conversion (CRO)
- Accès à l'application VBWEB
- Synthèse mensuelle`,
}

await mongoose.connect(URI)
const col = mongoose.connection.db.collection('propositions')

// Supprime l'ancienne version si elle existe
const removed = await col.deleteMany({
  $or: [{ slug: 'shi-shi' }, { client: 'Shi Shi' }],
})
console.log(`Supprimé ${removed.deletedCount} version(s) existante(s) de Shi Shi`)

await col.insertOne({
  ...SHI_SHI,
  createdAt: new Date(),
  updatedAt: new Date(),
})
console.log('✓ Insérée : Shi Shi (slug: shi-shi, N°2026-11)')

await mongoose.disconnect()
