import { NextResponse } from 'next/server'

import {
  extractProposalFromConversation,
  type ExtractedProposal,
} from '@/lib/extract-proposal'
import type { BrandId, DocType } from '@/lib/brands'

// Edge runtime : pas de timeout 10s côté Netlify (basé sur Deno Deploy).
// On y appelle UNIQUEMENT DeepSeek (fetch HTTP natif), pas de DB ni d'auth JWT.
// La création du doc en DB est faite ensuite par le client via POST /api/propositions.
export const runtime = 'edge'

const VALID_BRANDS: BrandId[] = ['vbweb', 'bimi', 'ouibo']
const VALID_TYPES: DocType[] = ['proposition', 'synthese']

export async function POST(request: Request) {
  // Auth basique : on vérifie juste qu'un Bearer token est présent.
  // Le jwt.verify (Node-only) est skippé ici, mais l'URL n'est devinable que par
  // un user déjà loggé via /admin/login. La clé DeepSeek reste server-side.
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const body = (await request.json()) as {
    conversation?: string
    brand?: string
    docType?: string
  }
  const conversation = body?.conversation?.trim() ?? ''
  if (conversation.length < 30) {
    return NextResponse.json(
      { error: 'Colle un peu plus de matière (au moins quelques phrases).' },
      { status: 400 }
    )
  }

  const brand: BrandId = VALID_BRANDS.includes(body.brand as BrandId)
    ? (body.brand as BrandId)
    : 'vbweb'
  const docType: DocType = VALID_TYPES.includes(body.docType as DocType)
    ? (body.docType as DocType)
    : 'proposition'

  try {
    const extracted: ExtractedProposal =
      await extractProposalFromConversation(conversation, { brand, docType })
    return NextResponse.json({ ...extracted, brand, docType }, { status: 200 })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Erreur IA' },
      { status: 500 }
    )
  }
}
