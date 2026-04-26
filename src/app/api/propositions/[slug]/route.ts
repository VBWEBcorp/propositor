import { NextRequest, NextResponse } from 'next/server'

import { verifyAuth } from '@/lib/auth'
import {
  deleteProposition,
  getProposition,
  updateProposition,
} from '@/lib/propositions'

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const item = await getProposition(slug)
  if (!item) {
    return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  }
  return NextResponse.json(item, { headers: { 'cache-control': 'no-store' } })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { authenticated } = await verifyAuth(request)
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { slug: currentSlug } = await params
  const body = (await request.json()) as Record<string, unknown> & { slug?: string }

  // Gestion du rename de slug
  if (typeof body.slug === 'string' && body.slug !== currentSlug) {
    const cleaned = slugify(body.slug)
    if (!cleaned) {
      return NextResponse.json({ error: 'Slug invalide' }, { status: 400 })
    }
    if (cleaned !== currentSlug) {
      const conflict = await getProposition(cleaned)
      if (conflict) {
        return NextResponse.json(
          { error: 'Ce slug est déjà utilisé' },
          { status: 409 }
        )
      }
    }
    body.slug = cleaned
  }

  const updated = await updateProposition(currentSlug, body)
  if (!updated) {
    return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  }
  return NextResponse.json(updated)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { authenticated } = await verifyAuth(request)
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { slug } = await params
  const ok = await deleteProposition(slug)
  if (!ok) {
    return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
