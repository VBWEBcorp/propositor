import { connectDB } from '@/lib/db'
import {
  Proposition,
  type PropositionDoc,
} from '@/models/Proposition'
import type {
  PropositionPayload,
  PropositionWithMeta,
} from '@/lib/propositions-types'

export type {
  PropositionPayload,
  PropositionWithMeta,
} from '@/lib/propositions-types'
export type { BrandId, DocType } from '@/lib/brands'

const SEED_GUARD = { ran: false }

const SEED_DATA: PropositionPayload = {
  slug: 'exemple',
  brand: 'vbweb',
  docType: 'proposition',
  client: 'Madame Micheline Maximin',
  baseline: 'Plateforme digitale de formation',
  date: '24/04/2026',
  number: 'N°2026-10',
  content: `## Introduction

Suite à notre échange, nous vous proposons la mise en place d'une plateforme digitale complète permettant de présenter vos formations, gérer les inscriptions en ligne et centraliser l'ensemble des contenus pédagogiques dans un espace participant sécurisé.

L'objectif serait de démarrer début juin avec une version simple, fiable et efficace, puis de faire évoluer progressivement la plateforme selon vos besoins.

Vous trouverez ci-dessous le détail des fonctionnalités proposées, organisées entre socle principal et options activables immédiatement ou ultérieurement.

## A. Fonctionnalités socle (recommandé)

Ce socle permet de disposer d'une plateforme immédiatement opérationnelle et peut-être divisé en 3 lots :

### LOT A1 : Site web moderne sur-mesure → 1000€ HT

Création d'un site multi-pages comprenant par exemple les pages Accueil, Formations, Calendrier, À propos, Blog, Contact, FAQ et autres pages si nécessaire.

**Inclut également :**

- Audit SEO approfondi sur votre activité
- Stratégie de référencement Google (mots-clés, intentions de recherche, trafic)
- Design sur-mesure avec votre identité visuelle
- Structure internet et technique optimisée pour le référencement Google naturel
- Catalogue des formations avec distinction parcours particuliers / entreprises
- Intégration de vidéos dynamiques « Avis clients »
- Système de paiement sécurisé (Stripe, Klarna, paiement comptant)
- Système de droits d'accès par profil (public / participant / administrateur)
- Accompagnement pour la souscription de l'hébergement, du nom de domaine et autres plateformes (Stripe etc.)

### LOT A2 : Espace participant sécurisé et personnalisé → 700€ HT

Chaque participant dispose d'un accès personnel lui permettant de :

- Se connecter à son espace sécurisé
- Accéder directement aux liens de session (Google Meet / visio)
- Consulter le programme détaillé après inscription
- Accéder aux documents récapitulatifs PDF après la formation
- Accéder aux illustrations pédagogiques après la formation

### LOT A3 : Espace administrateur → 700€ HT

Interface simple permettant de gérer la plateforme en autonomie :

- Tableau de bord personnalisable
- Statistiques simples (inscriptions, paiements, calendrier etc.)
- Visualisation, modification et ajout de participants inscrits
- Visualisation, modifications et ajout des plannings de formation
- Modification des contenus du site (textes et images)

## B. Fonctionnalités optionnelles (activables maintenant ou plus tard)

Ces fonctionnalités peuvent être intégrées dès le lancement ou ajoutées ultérieurement selon vos priorités.

- Notifications automatiques (emails + SMS : confirmations, rappels, suivi) → **250€ HT**
- Newsletter (envoi d'emails aux participants depuis l'espace admin) → **200€ HT**
- Outils marketing / promotions (bannières informatives et offres sur le site) → **150€ HT**
- Messagerie interne entre vous et les participants depuis la plateforme → **250€ HT**
- Blog & événements (outil de création de contenus blog depuis l'espace admin) → **250€ HT**
- Publication réseaux sociaux (publication LinkedIn / Instagram / TikTok depuis l'espace admin) → **350€ HT**
- Chatbot intelligent répondant aux questions des visiteurs du site → **100€ HT**

## C. Accompagnement mensuel (maintenance évolutive + référencement Google)

Afin d'assurer la stabilité, la sécurité et la progression de la plateforme dans sa capacité à être visible sur Google dans le temps, nous proposons un accompagnement mensuel, qui peut-être divisé également en deux lots :

### LOT D1 : Maintenance évolutive de la plateforme → 120€ HT

**Inclut :**

- Maintenance technique et sécurité
- Gestion des droits et profils
- Modifications mensuelles incluses
- Evolutions progressives de la plateforme
- Support continu via l'application

### LOT D2 : Référencement Google (SEO) → 250€ HT

**Inclut :**

- Optimisation technique mensuelle du site pour répondre à la stratégie SEO
- Création de contenu (3 articles de blog produits mensuellement pour remonter dans les résultats Google)
- Amélioration du positionnement Google continu, ajustement de la stratégie de mots-clés en fonction des résultats

Nous sommes disponibles pour ajuster le périmètre selon vos priorités afin de démarrer avec une plateforme simple et efficace, puis la faire évoluer progressivement dans le temps.`,
}

async function ensureSeed() {
  if (SEED_GUARD.ran) return
  SEED_GUARD.ran = true
  // Seed UNIQUEMENT si la collection est totalement vide (première installation).
  // On ne réinjecte JAMAIS l'exemple si l'utilisateur l'a supprimé/renommé après.
  const total = await Proposition.estimatedDocumentCount()
  if (total === 0) {
    await Proposition.create(SEED_DATA)
  }
  // Migration idempotente : si des titres ##/### sont en MAJUSCULES (héritage), on les passe
  // en sentence case (1ère lettre majuscule, reste minuscule). Ne touche pas les titres déjà ok.
  await migrateAllCapsTitles()
}

function titleToSentenceCase(body: string): string {
  const lowered = body.toLowerCase()
  // Capitalise la 1ère lettre alpha au début, et la 1ère après chaque ". " (fin de phrase)
  return lowered.replace(
    /(^|\.\s+)([a-zà-ÿ])/g,
    (_m, sep: string, char: string) => sep + char.toUpperCase()
  )
}

function migrateMarkdownHeadings(content: string): string {
  return content.replace(/^(#{2,4})\s+(.+)$/gm, (match, hashes: string, body: string) => {
    // On évalue le ratio de majuscules HORS contenu entre parenthèses
    // (sinon "B. FONCTIONNALITÉS (activables maintenant)" est faussement à <60%)
    const outsideParens = body.replace(/\([^)]*\)/g, '')
    const letters = outsideParens.replace(/[^A-Za-zÀ-Ÿà-ÿ]/g, '')
    if (letters.length < 4) return match
    const upperCount = outsideParens.replace(/[^A-ZÀ-Ÿ]/g, '').length
    const ratio = upperCount / letters.length
    if (ratio < 0.6) return match // titre déjà en sentence case, on garde
    return `${hashes} ${titleToSentenceCase(body)}`
  })
}

async function migrateAllCapsTitles() {
  const docs = await Proposition.find({}, { _id: 1, content: 1 }).lean()
  for (const d of docs) {
    const id = (d as { _id: unknown })._id
    const original = (d as { content?: string }).content ?? ''
    const migrated = migrateMarkdownHeadings(original)
    if (migrated !== original) {
      await Proposition.updateOne({ _id: id }, { $set: { content: migrated } })
    }
  }
}

function toPlain(doc: PropositionDoc): PropositionWithMeta {
  return {
    slug: doc.slug,
    brand: doc.brand ?? 'vbweb',
    docType: doc.docType ?? 'proposition',
    client: doc.client,
    title: doc.title,
    baseline: doc.baseline,
    date: doc.date,
    number: doc.number,
    content: doc.content ?? '',
    clientLogoUrl: doc.clientLogoUrl ?? '',
    createdAt:
      doc.createdAt instanceof Date
        ? doc.createdAt.toISOString()
        : String(doc.createdAt),
    updatedAt:
      doc.updatedAt instanceof Date
        ? doc.updatedAt.toISOString()
        : String(doc.updatedAt),
  }
}

export async function nextProposalNumber(): Promise<string> {
  await connectDB()
  const year = new Date().getFullYear()
  const prefix = `${year}-`
  const docs = await Proposition.find(
    { number: { $regex: `^${prefix}` } },
    { number: 1 }
  ).lean()
  let max = 0
  for (const d of docs) {
    const n = (d as { number?: string }).number ?? ''
    const tail = parseInt(n.slice(prefix.length), 10)
    if (!Number.isNaN(tail) && tail > max) max = tail
  }
  const next = String(max + 1).padStart(2, '0')
  return `N°${year}-${next}`
}

export async function listPropositions(): Promise<PropositionWithMeta[]> {
  await connectDB()
  await ensureSeed()
  const docs = await Proposition.find().sort({ updatedAt: -1 }).lean()
  return docs.map((d) => toPlain(d as unknown as PropositionDoc))
}

export async function getProposition(
  slug: string
): Promise<PropositionWithMeta | null> {
  await connectDB()
  await ensureSeed()
  const doc = await Proposition.findOne({ slug }).lean()
  if (!doc) return null
  return toPlain(doc as unknown as PropositionDoc)
}

export async function createProposition(
  payload: Partial<PropositionPayload> & { slug: string; client: string }
): Promise<PropositionWithMeta> {
  await connectDB()
  const number = payload.number ?? (await nextProposalNumber())
  const doc = await Proposition.create({
    slug: payload.slug,
    brand: payload.brand ?? 'vbweb',
    docType: payload.docType ?? 'proposition',
    client: payload.client,
    title: payload.title ?? '',
    baseline: payload.baseline ?? '',
    date: payload.date ?? '',
    number,
    content: payload.content ?? '',
    clientLogoUrl: payload.clientLogoUrl ?? '',
  })
  return toPlain(doc.toObject() as unknown as PropositionDoc)
}

export async function updateProposition(
  slug: string,
  patch: Partial<PropositionPayload>
): Promise<PropositionWithMeta | null> {
  await connectDB()
  const doc = await Proposition.findOneAndUpdate(
    { slug },
    { $set: patch },
    { new: true }
  ).lean()
  if (!doc) return null
  return toPlain(doc as unknown as PropositionDoc)
}

export async function deleteProposition(slug: string): Promise<boolean> {
  await connectDB()
  const res = await Proposition.deleteOne({ slug })
  return res.deletedCount > 0
}

export async function listPropositionSlugs(): Promise<string[]> {
  await connectDB()
  await ensureSeed()
  const docs = await Proposition.find({}, { slug: 1 }).lean()
  return docs.map((d) => (d as { slug: string }).slug)
}
