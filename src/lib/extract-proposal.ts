import { BRANDS, type BrandId, type DocType } from '@/lib/brands'

const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions'
const DEEPSEEK_MODEL = 'deepseek-v4-flash'

const BASE_RULES = `RÈGLES STRICTES :
1. Tu NE reformules PAS, tu organises les mots tels quels.
2. AUCUN tiret long "—" ni "–" : remplace par virgule, deux-points ou point.
3. TABLEAUX MARKDOWN — c'est important pour la lisibilité :
   - DÈS QUE tu vois 3 items du même type avec un montant ou un chiffre (ex: 3+ lots avec prix, 3+ options chiffrées, 3+ KPI, 3+ concurrents comparés) → tu DOIS faire un tableau.
   - Récap tarifaire en fin de proposition → toujours un tableau si il y a plusieurs prix.
   - Comparaison (avant/après, plans, concurrents) → tableau.
   - Pas de tableau pour : un paragraphe narratif, une sous-liste "Inclut :" qui détaille un seul lot, moins de 3 entrées.
   Quand tu hésites entre liste à puces et tableau, et que les items ont une structure répétée (Label + Prix + ...) → choisis le tableau.

Sortie : JSON strict, aucun texte autour ni balise \`\`\`json.
{
  "client": "Nom du client",
  "baseline": "Objet court (≤80 caractères, phrase nominale)",
  "date": "JJ/MM/AAAA (sinon {TODAY})",
  "content": "Markdown du document"
}
`

const PROPOSITION_RULES = `Tu rédiges une PROPOSITION pour {BRAND_NAME}.
- ## pour sections principales (sentence case, ex: "A. Fonctionnalités socle"). Jamais MAJUSCULES.
- ### pour sous-sections / lots (ex: "Lot A1 : Site web → 1000€ HT")
- Listes à puces "-", **gras** pour les montants, > pour citations, → pour les prix.
- Pas de # H1.
Baseline = objet nominal court (ex: "Plateforme digitale de formation").
`

const SYNTHESE_RULES = `Tu rédiges une SYNTHÈSE SEO pour {BRAND_NAME}.
- ## pour sections principales en sentence case (ex: "État des lieux", "Plan d'action"). Jamais MAJUSCULES.
- ### pour sous-sections en sentence case.
- Listes à puces pour constats, **gras** pour chiffres-clés, > pour citations.
- Pas de # H1.
Baseline = objet nominal court (ex: "Audit SEO et plan d'action 2026").
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

  // Abort après 45s pour laisser le temps à Netlify Edge de répondre proprement (timeout 50s)
  const ctrl = new AbortController()
  const abortTimer = setTimeout(() => ctrl.abort(), 45_000)

  let res: Response
  try {
    res = await fetch(DEEPSEEK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      signal: ctrl.signal,
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        response_format: { type: 'json_object' },
        temperature: 0, // déterministe + plus rapide
        max_tokens: 4096, // limite pour éviter une réponse interminable
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: conversation },
        ],
      }),
    })
  } catch (e) {
    if ((e as { name?: string })?.name === 'AbortError') {
      throw new Error(
        'DeepSeek a mis plus de 45 secondes à répondre. Réessaie ou réduis le texte collé (~50% plus court).'
      )
    }
    throw e
  } finally {
    clearTimeout(abortTimer)
  }

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
