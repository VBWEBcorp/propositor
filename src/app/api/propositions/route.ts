import { NextRequest, NextResponse } from 'next/server'

import { verifyAuth } from '@/lib/auth'
import {
  createProposition,
  getProposition,
  listPropositions,
} from '@/lib/propositions'

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

export async function GET() {
  const items = await listPropositions()
  return NextResponse.json(items, {
    headers: { 'cache-control': 'no-store' },
  })
}

export async function POST(request: NextRequest) {
  const { authenticated } = await verifyAuth(request)
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const body = await request.json()
  if (!body?.client) {
    return NextResponse.json({ error: 'client est requis' }, { status: 400 })
  }

  // Si slug fourni : on slugify ; sinon on auto-génère depuis le nom client (avec uniqueSlug)
  let slug: string
  if (body.slug) {
    slug = slugify(String(body.slug))
    if (!slug) {
      return NextResponse.json({ error: 'Slug invalide' }, { status: 400 })
    }
  } else {
    slug = await uniqueSlug(slugify(String(body.client)))
  }

  try {
    const created = await createProposition({ ...body, slug })
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    if ((e as { code?: number })?.code === 11000) {
      return NextResponse.json(
        { error: 'Ce slug existe déjà' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Erreur lors de la création' },
      { status: 500 }
    )
  }
}
