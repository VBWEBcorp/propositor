import { NextRequest, NextResponse } from 'next/server'

import { verifyAuth } from '@/lib/auth'
import { createProposition, listPropositions } from '@/lib/propositions'

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
  if (!body?.slug || !body?.client) {
    return NextResponse.json(
      { error: 'slug et client sont requis' },
      { status: 400 }
    )
  }

  const slug = String(body.slug)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (!slug) {
    return NextResponse.json({ error: 'Slug invalide' }, { status: 400 })
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
