import { BRANDS, type BrandId, type DocType } from '@/lib/brands'

const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions'
const DEEPSEEK_MODEL = 'deepseek-v4-flash'

const BASE_RULES = `RÈGLE ABSOLUE : tu NE REFORMULES PAS. Tu NE PARAPHRASES PAS. Tu N'INVENTES RIEN. Tu prends les phrases telles que l'utilisateur les a écrites, tu te contentes de les organiser dans le bon ordre et de les structurer en markdown.

Si l'utilisateur a écrit "Notre objectif serait de démarrer début juin", tu écris exactement "Notre objectif serait de démarrer début juin" dans le content. Pas "L'objectif est de commencer en juin", pas "Démarrage prévu juin", non : tu copies-colles la phrase originale.

INTERDICTION ABSOLUE DES TIRETS LONGS : tu n'utilises JAMAIS les caractères "—" (em-dash) ni "–" (en-dash). Ces tirets sont la signature visuelle des textes générés par IA. Tu utilises à la place : virgules, deux-points, parenthèses, phrases plus courtes séparées par un point, ou tiret simple "-" UNIQUEMENT dans les listes markdown ou pour les flèches "→". Si l'utilisateur a écrit "—" dans son texte, tu le remplaces par une virgule, un deux-points ou tu coupes la phrase.

EMPLOI DES TABLEAUX MARKDOWN — JUGEMENT ÉDITORIAL :
Tu juges toi-même si un tableau apporte de la valeur. Utilise un tableau UNIQUEMENT quand il rend l'information visiblement plus claire que sa version textuelle/listée. Cas typiques où un tableau aide :
- Récap tarifaire compact (plusieurs prestations courtes avec montants)
- Liste d'options / fonctionnalités optionnelles avec prix unitaires
- Comparaison entre plusieurs choses (avant/après, deux plans, concurrents)
- Tableau de positions Google / KPI / chiffres alignés

Cas où un tableau N'aide PAS et serait à éviter :
- Quand chaque ligne a besoin d'être étoffée avec sa propre sous-liste "Inclut :"
- Quand il y a moins de 3 entrées (une liste à puces ou un paragraphe suffit)
- Quand le contenu est narratif / explicatif

Tu décides au cas par cas selon ce que l'utilisateur t'a fourni. Si tu n'es pas sûr, garde une liste à puces classique.

Sortie OBLIGATOIRE — JSON strict, AUCUN texte autour, AUCUNE balise \`\`\`json :

{
  "client": "Nom du client tel qu'écrit dans le texte",
  "baseline": "Objet court (max 80 caractères, phrase nominale)",
  "date": "Date au format JJ/MM/AAAA. Si non précisée, mets {TODAY}.",
  "content": "Markdown complet, voir règles selon type de document"
}
`

const PROPOSITION_RULES = `Tu rédiges une PROPOSITION COMMERCIALE pour {BRAND_NAME}. Format markdown du content :
- ## pour les sections principales, en SENTENCE CASE (première lettre majuscule, reste minuscule). Exemples : "Introduction", "A. Fonctionnalités socle (recommandé)", "B. Fonctionnalités optionnelles", "C. Accompagnement mensuel". JAMAIS tout en MAJUSCULES.
- ### pour les sous-sections / lots, en sentence case (ex: "Lot A1 : Site web moderne sur-mesure → 1000€ HT")
- Listes à puces avec - pour les fonctionnalités/inclusions
- **gras** pour les montants et mots-clés
- Citations > pour les paroles client
- Flèche → pour les prix dans les titres de lots
- AUCUN # H1 (le hero affiche déjà le client)

Pour la baseline : un objet nominal court (ex: "Plateforme digitale de formation", "Refonte de site et SEO local").
`

const SYNTHESE_RULES = `Tu rédiges une SYNTHÈSE SEO / AUDIT pour {BRAND_NAME}. Format markdown du content :
- ## pour les sections principales, en SENTENCE CASE (première lettre majuscule, reste minuscule). Exemples : "Synthèse exécutive", "État des lieux", "Opportunités", "Recommandations", "Plan d'action". JAMAIS tout en MAJUSCULES.
- ### pour les sous-sections en sentence case (axes spécifiques, KPI, étapes du plan).
- Listes à puces pour les constats, opportunités, recommandations détaillées.
- **gras** pour les chiffres-clés (positions Google, scores, %, volumes de recherche).
- Citations > pour les remontées clientes ou citations d'écran.
- Tableaux quand ça aide vraiment la lisibilité (positions/keywords, comparaison concurrent, KPI before/after, planning d'actions). Voir règles d'emploi des tableaux ci-dessous.
- AUCUN # H1.

Pour la baseline : un objet nominal court (ex: "Audit SEO et plan d'action 2026", "Synthèse de positionnement Google", "Bilan SEO trimestriel").
`

export type ExtractedProposal = {
  client: string
  baseline: string
  date: string
  content: string
}

function todayFr(): string {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

export async function extractProposalFromConversation(
  conversation: string,
  options?: { brand?: BrandId; docType?: DocType }
): Promise<ExtractedProposal> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error(
      'DEEPSEEK_API_KEY manquante dans .env.local — l\'IA ne peut pas tourner'
    )
  }

  const brandId: BrandId = options?.brand ?? 'vbweb'
  const docType: DocType = options?.docType ?? 'proposition'
  const brandName = BRANDS[brandId].name

  const today = todayFr()
  const docRules = (docType === 'synthese' ? SYNTHESE_RULES : PROPOSITION_RULES)
    .replace('{BRAND_NAME}', brandName)
  const system = `Tu es l'assistant éditorial d'une agence française.

${docRules}

${BASE_RULES}`.replace('{TODAY}', today)

  const res = await fetch(DEEPSEEK_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      response_format: { type: 'json_object' },
      temperature: 0.1,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: conversation },
      ],
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`DeepSeek ${res.status} — ${text.slice(0, 200)}`)
  }

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const raw = json.choices?.[0]?.message?.content
  if (!raw) throw new Error('Réponse DeepSeek vide')

  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(raw) as Record<string, unknown>
  } catch {
    throw new Error('DeepSeek n\'a pas renvoyé de JSON valide')
  }

  const rawContent = String(parsed.content ?? '').trim()
  if (!rawContent) throw new Error('L\'IA n\'a pas produit de contenu utilisable')

  return {
    client: stripDashes(String(parsed.client ?? 'Client').trim() || 'Client'),
    baseline: stripDashes(String(parsed.baseline ?? '').trim()),
    date: String(parsed.date ?? today).trim() || today,
    content: stripDashes(rawContent),
  }
}

/** Remplace les em-dashes (—) et en-dashes (–) par un tiret simple (-)
 * pour éviter le rendu "écrit par IA". Conserve les espaces autour. */
export function stripDashes(text: string): string {
  return text.replace(/[—–]/g, '-')
}
