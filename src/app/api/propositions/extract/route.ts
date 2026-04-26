import { NextRequest, NextResponse } from 'next/server'

import { verifyAuth } from '@/lib/auth'
import { extractProposalFromConversation } from '@/lib/extract-proposal'
import { createProposition, getProposition } from '@/lib/propositions'
import type { BrandId, DocType } from '@/lib/brands'

export const maxDuration = 60

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function uniqueSlug(base: string): Promise<string> {
  const root = base || 'document'
  let slug = root
  let i = 2
  while (await getProposition(slug)) {
    slug = `${root}-${i}`
    i++
    if (i > 99) {
      slug = `${root}-${Date.now()}`
      break
    }
  }
  return slug
}

const VALID_BRANDS: BrandId[] = ['vbweb', 'bimi', 'ouibo']
const VALID_TYPES: DocType[] = ['proposition', 'synthese']

export async function POST(request: NextRequest) {
  const { authenticated } = await verifyAuth(request)
  if (!authenticated) {
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
    const extracted = await extractProposalFromConversation(conversation, {
      brand,
      docType,
    })
    const slug = await uniqueSlug(slugify(extracted.client))
    const created = await createProposition({
      slug,
      brand,
      docType,
      client: extracted.client,
      baseline: extracted.baseline,
      date: extracted.date,
      content: extracted.content,
    })
    return NextResponse.json(
      { slug: created.slug, client: created.client, brand: created.brand, docType: created.docType },
      { status: 201 }
    )
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Erreur inconnue' },
      { status: 500 }
    )
  }
}
