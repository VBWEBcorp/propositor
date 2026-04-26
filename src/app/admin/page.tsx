'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Copy,
  ExternalLink,
  FileText,
  LogOut,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react'

import { BRAND_LIST, DOC_TYPES, getBrand } from '@/lib/brands'
import type { BrandId, DocType, PropositionWithMeta } from '@/lib/propositions-types'

const ease = [0.22, 1, 0.36, 1] as const

const TYPE_FILTERS: Array<{ value: 'all' | DocType; label: string }> = [
  { value: 'all', label: 'Tous' },
  { value: 'proposition', label: 'Propositions' },
  { value: 'synthese', label: 'Synthèses SEO' },
]

export default function AdminHome() {
  const router = useRouter()
  const [items, setItems] = useState<PropositionWithMeta[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [brandFilter, setBrandFilter] = useState<'all' | BrandId>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | DocType>('all')

  // Persiste les filtres en localStorage pour que le user retrouve son contexte
  useEffect(() => {
    const savedBrand = localStorage.getItem('propositor.brandFilter')
    const savedType = localStorage.getItem('propositor.typeFilter')
    if (savedBrand) setBrandFilter(savedBrand as 'all' | BrandId)
    if (savedType) setTypeFilter(savedType as 'all' | DocType)
  }, [])

  useEffect(() => {
    localStorage.setItem('propositor.brandFilter', brandFilter)
  }, [brandFilter])
  useEffect(() => {
    localStorage.setItem('propositor.typeFilter', typeFilter)
  }, [typeFilter])

  async function load() {
    try {
      const res = await fetch('/api/propositions', { cache: 'no-store' })
      if (!res.ok) throw new Error('Erreur ' + res.status)
      const data = (await res.json()) as PropositionWithMeta[]
      setItems(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur')
    }
  }

  useEffect(() => {
    load()
  }, [])

  function logout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    router.push('/admin/login')
  }

  async function copyLink(slug: string) {
    const url = `${window.location.origin}/propositions/${slug}`
    await navigator.clipboard.writeText(url)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 1800)
  }

  async function handleDelete(slug: string) {
    setDeleting(slug)
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch(`/api/propositions/${slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setConfirmSlug(null)
        await load()
      }
    } finally {
      setDeleting(null)
    }
  }

  const filtered = useMemo(() => {
    if (!items) return null
    const q = search.trim().toLowerCase()
    return items.filter((p) => {
      if (brandFilter !== 'all' && p.brand !== brandFilter) return false
      if (typeFilter !== 'all' && p.docType !== typeFilter) return false
      if (!q) return true
      return (
        p.client.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.baseline ?? '').toLowerCase().includes(q) ||
        (p.number ?? '').toLowerCase().includes(q) ||
        (p.title ?? '').toLowerCase().includes(q)
      )
    })
  }, [items, search, brandFilter, typeFilter])

  const totalCount = items?.length ?? 0
  const filteredCount = filtered?.length ?? 0

  return (
    <div
      data-brand={brandFilter !== 'all' ? brandFilter : 'vbweb'}
      className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8"
    >
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease }}
        className="space-y-5"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Propositor
            </p>
            <h1 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Mes documents
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/admin/new"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <Plus className="size-4" />
              <span>Nouveau</span>
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex size-10 items-center justify-center rounded-lg border border-border/60 bg-card text-foreground/80 transition-colors hover:bg-muted"
              aria-label="Déconnexion"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>

        {/* Filtre marque (premier filtre principal) */}
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Marque émettrice
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <BrandPill
              active={brandFilter === 'all'}
              onClick={() => setBrandFilter('all')}
              label="Toutes"
              swatches={BRAND_LIST.map((b) => b.primary)}
            />
            {BRAND_LIST.map((b) => (
              <BrandPill
                key={b.id}
                active={brandFilter === b.id}
                onClick={() => setBrandFilter(b.id)}
                label={b.name}
                color={b.primary}
              />
            ))}
          </div>
        </div>

        {/* Filtre type de doc */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par client, n°, titre…"
              className="h-10 w-full rounded-lg border border-border/70 bg-background pl-9 pr-9 text-sm text-foreground outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Effacer la recherche"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>

          <div className="flex gap-1 overflow-x-auto rounded-lg bg-muted/60 p-1">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setTypeFilter(f.value)}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  typeFilter === f.value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {items ? (
          <p className="text-xs text-muted-foreground">
            {filteredCount === totalCount
              ? `${totalCount} document${totalCount > 1 ? 's' : ''}`
              : `${filteredCount} sur ${totalCount}`}
          </p>
        ) : null}
      </motion.header>

      {error ? (
        <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Impossible de charger : {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-2.5">
        {items === null && !error ? (
          <div className="h-24 animate-pulse rounded-xl bg-muted/40" />
        ) : filtered && filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 bg-card p-10 text-center">
            <p className="text-sm font-medium text-foreground">
              {totalCount === 0
                ? 'Aucun document pour le moment.'
                : 'Aucun résultat.'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {totalCount === 0
                ? 'Crée ton premier doc en cliquant sur Nouveau.'
                : 'Essaie un autre filtre ou retire la recherche.'}
            </p>
          </div>
        ) : (
          filtered?.map((p, i) => {
            const b = getBrand(p.brand)
            const docType = DOC_TYPES.find((t) => t.id === p.docType)
            return (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease, delay: 0.025 * i }}
                className="group flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-card p-3 transition-all hover:shadow-sm sm:p-4"
                style={{
                  // Petit accent visuel : trait gauche de la couleur de la marque
                  boxShadow: `inset 4px 0 0 0 ${b.primary}`,
                }}
              >
                <Link
                  href={`/admin/edit/${p.slug}`}
                  className="flex min-w-0 flex-1 items-center gap-3 pl-2"
                >
                  <div
                    className="grid size-10 shrink-0 place-items-center rounded-xl text-white sm:size-11"
                    style={{ background: b.primary }}
                  >
                    <FileText className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-display text-[15px] font-semibold text-foreground sm:text-base">
                        {p.client}
                      </p>
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
                        style={{ background: b.primary }}
                      >
                        {b.name}
                      </span>
                      {docType ? (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {p.docType === 'synthese' ? 'Synthèse' : 'Propal'}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {p.number ? `${p.number} · ` : ''}
                      {p.date ?? '—'}
                    </p>
                  </div>
                </Link>

                {confirmSlug === p.slug ? (
                  <div className="flex w-full items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-1.5 sm:w-auto">
                    <span className="flex-1 text-xs text-destructive sm:flex-none">
                      Supprimer ?
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.slug)}
                      disabled={deleting === p.slug}
                      className="rounded-md bg-destructive px-2 py-1 text-[11px] font-semibold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                    >
                      {deleting === p.slug ? '…' : 'Confirmer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmSlug(null)}
                      className="rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => copyLink(p.slug)}
                      className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label="Copier le lien"
                      title="Copier le lien"
                    >
                      <Copy className="size-4" />
                    </button>
                    <Link
                      href={`/admin/edit/${p.slug}`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3 text-xs font-semibold text-foreground/85 transition-colors hover:bg-muted"
                    >
                      <Pencil className="size-3.5" />
                      <span className="hidden sm:inline">Éditer</span>
                    </Link>
                    <Link
                      href={`/propositions/${p.slug}`}
                      target="_blank"
                      className="inline-flex size-9 items-center justify-center rounded-lg text-white transition-colors hover:opacity-90"
                      style={{ background: b.primary }}
                      aria-label="Ouvrir"
                      title="Ouvrir côté client"
                    >
                      <ExternalLink className="size-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setConfirmSlug(p.slug)}
                      className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Supprimer"
                      title="Supprimer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                )}

                {copiedSlug === p.slug ? (
                  <span className="ml-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    Lien copié !
                  </span>
                ) : null}
              </motion.div>
            )
          })
        )}
      </div>

      <p className="mt-10 text-center text-xs text-muted-foreground">Propositor</p>
    </div>
  )
}

function BrandPill({
  active,
  onClick,
  label,
  color,
  swatches,
}: {
  active: boolean
  onClick: () => void
  label: string
  color?: string
  swatches?: string[]
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative inline-flex h-10 items-center gap-2.5 rounded-lg border px-4 text-sm font-medium transition-all ${
        active
          ? 'border-foreground/15 bg-foreground/5 text-foreground shadow-sm'
          : 'border-border/60 bg-card text-foreground/70 hover:bg-muted'
      }`}
    >
      {color ? (
        <span
          className="size-3 rounded-full ring-2 ring-white/40"
          style={{ background: color }}
        />
      ) : swatches ? (
        <span className="flex -space-x-1">
          {swatches.map((c) => (
            <span
              key={c}
              className="size-3 rounded-full ring-2 ring-background"
              style={{ background: c }}
            />
          ))}
        </span>
      ) : null}
      <span>{label}</span>
    </button>
  )
}
