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

const SEED = {
  slug: 'exemple',
  brand: 'vbweb',
  docType: 'proposition',
  client: 'Madame Micheline Maximin',
  baseline: 'Plateforme digitale de formation',
  date: '24/04/2026',
  number: 'N°2026-10',
  clientLogoUrl: '',
  content: `## Introduction

Suite à notre échange, nous vous proposons la mise en place d'une plateforme digitale complète permettant de présenter vos formations, gérer les inscriptions en ligne et centraliser l'ensemble des contenus pédagogiques dans un espace participant sécurisé.

L'objectif serait de démarrer début juin avec une version simple, fiable et efficace, puis de faire évoluer progressivement la plateforme selon vos besoins.

Vous trouverez ci-dessous le détail des fonctionnalités proposées, organisées entre socle principal et options activables immédiatement ou ultérieurement.

## A. Fonctionnalités socle (recommandé)

Ce socle permet de disposer d'une plateforme immédiatement opérationnelle et peut-être divisé en 3 lots :

### Lot A1 : Site web moderne sur-mesure → 1000€ HT

Création d'un site multi-pages comprenant par exemple les pages Accueil, Formations, Calendrier, À propos, Blog, Contact, FAQ et autres pages si nécessaire.

**Inclut également :**

- Audit SEO approfondi sur votre activité
- Stratégie de référencement Google (mots-clés, intentions de recherche, trafic)
- Design sur-mesure avec votre identité visuelle
- Catalogue des formations avec distinction parcours particuliers / entreprises
- Système de paiement sécurisé (Stripe, Klarna, paiement comptant)
- Système de droits d'accès par profil (public / participant / administrateur)

### Lot A2 : Espace participant sécurisé et personnalisé → 700€ HT

Chaque participant dispose d'un accès personnel lui permettant de :

- Se connecter à son espace sécurisé
- Accéder directement aux liens de session (Google Meet / visio)
- Consulter le programme détaillé après inscription
- Accéder aux documents récapitulatifs PDF après la formation

### Lot A3 : Espace administrateur → 700€ HT

Interface simple permettant de gérer la plateforme en autonomie :

- Tableau de bord personnalisable
- Statistiques simples (inscriptions, paiements, calendrier)
- Visualisation, modification et ajout de participants inscrits
- Modification des contenus du site (textes et images)

## B. Fonctionnalités optionnelles

Ces fonctionnalités peuvent être intégrées dès le lancement ou ajoutées ultérieurement selon vos priorités.

| Option | Description | Tarif |
| --- | --- | --- |
| Notifications | Emails + SMS (confirmations, rappels) | **250 € HT** |
| Newsletter | Envoi d'emails depuis l'espace admin | **200 € HT** |
| Marketing | Bannières et offres sur le site | **150 € HT** |
| Messagerie | Chat interne admin / participants | **250 € HT** |
| Blog | Création de contenus depuis l'admin | **250 € HT** |
| Réseaux sociaux | Publication LinkedIn / Instagram / TikTok | **350 € HT** |
| Chatbot | Assistant intelligent pour les visiteurs | **100 € HT** |

## C. Accompagnement mensuel

Afin d'assurer la stabilité, la sécurité et la progression de la plateforme dans sa capacité à être visible sur Google dans le temps, nous proposons un accompagnement mensuel.

### Lot D1 : Maintenance évolutive → 120€ HT / mois

- Maintenance technique et sécurité
- Gestion des droits et profils
- Modifications mensuelles incluses
- Support continu via l'application

### Lot D2 : Référencement Google SEO → 250€ HT / mois

- Optimisation technique mensuelle du site
- Création de 3 articles de blog mensuels
- Amélioration du positionnement Google continu

## Récap tarifaire

| Lot | Prestation | Montant |
| --- | --- | --- |
| A1 | Site web sur-mesure | **1 000 € HT** |
| A2 | Espace participant | **700 € HT** |
| A3 | Espace administrateur | **700 € HT** |
| D1 | Maintenance évolutive | **120 € HT / mois** |
| D2 | Référencement Google SEO | **250 € HT / mois** |
| **Total socle (A1+A2+A3)** |  | **2 400 € HT** |
| **Récurrent (D1+D2)** |  | **370 € HT / mois** |

Nous sommes disponibles pour ajuster le périmètre selon vos priorités afin de démarrer avec une plateforme simple et efficace, puis la faire évoluer progressivement dans le temps.`,
}

await mongoose.connect(URI)
const db = mongoose.connection.db
const col = db.collection('propositions')

const before = await col.countDocuments()
console.log(`Avant: ${before} docs`)

await col.deleteMany({})

await col.insertOne({
  ...SEED,
  createdAt: new Date(),
  updatedAt: new Date(),
})

const after = await col.countDocuments()
console.log(`Après: ${after} doc(s) — seul l'exemple subsiste`)

await mongoose.disconnect()
console.log('OK')
