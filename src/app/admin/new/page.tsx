'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Check,
  Eye,
  ImagePlus,
  Loader2,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react'

import { PreviewModal } from '@/components/admin/preview-modal'
import { BrandLogo } from '@/components/proposition/brand-logo'
import { BRAND_LIST, DOC_TYPES } from '@/lib/brands'
import type { BrandId, DocType } from '@/lib/propositions-types'

const STARTER_TEMPLATE_PROP = `## Introduction

Présente le projet en quelques lignes.

## 1. Contexte

Décris le contexte du client.

## 2. Problématique

Liste les problèmes à résoudre.

## 3. Proposition

Explique ce que tu proposes.

## 4. Tarifs

| Prestation | Montant |
| --- | --- |
| Prestation 1 | **0 € HT** |
| Prestation 2 | **0 € HT** |
| **Total** | **0 € HT** |
`

const STARTER_TEMPLATE_SYNTHESE = `## Synthèse exécutive

Résumé en 3-4 lignes des points-clés.

## État des lieux

Constats et chiffres-clés.

## Recommandations

Liste priorisée des actions à mener.

## Plan d'action

| Action | Priorité | Délai |
| --- | --- | --- |
| Action 1 | Haute | Q1 |
| Action 2 | Moyenne | Q2 |
`

export default function NewDocPage() {
  const router = useRouter()
  const [brand, setBrand] = useState<BrandId>('vbweb')
  const [docType, setDocType] = useState<DocType>('proposition')
  const [client, setClient] = useState('')
  const [baseline, setBaseline] = useState('')
  const [clientLogoUrl, setClientLogoUrl] = useState('')
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  async function handleLogoUpload(file: File) {
    setUploadingLogo(true)
    setError(null)
    try {
      const token = localStorage.getItem('authToken')
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error((j as { error?: string }).error ?? 'Erreur upload')
      }
      const { url } = (await res.json()) as { url: string }
      setClientLogoUrl(url)
    } catch (e) {
      setError(e instanceof Error ? `Logo : ${e.message}` : 'Erreur upload logo')
    } finally {
      setUploadingLogo(false)
    }
  }

  async function create() {
    setError(null)
    setCreating(true)
    try {
      const token = localStorage.getItem('authToken')
      const content =
        docType === 'synthese' ? STARTER_TEMPLATE_SYNTHESE : STARTER_TEMPLATE_PROP
      const res = await fetch('/api/propositions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          brand,
          docType,
          client: client.trim() || 'Nouveau client',
          baseline: baseline.trim(),
          content,
          clientLogoUrl,
        }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error((j as { error?: string }).error ?? `Erreur HTTP ${res.status}`)
      }
      const { slug } = (await res.json()) as { slug: string }
      router.push(`/admin/edit/${slug}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur')
      setCreating(false)
    }
  }

  const canCreate = !creating && client.trim().length > 0

  return (
    <div data-brand={brand} className="flex min-h-screen flex-col bg-muted/30">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Retour</span>
          </Link>

          <div className="ml-1 min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Nouveau document
            </p>
            <h1 className="font-display text-lg font-semibold tracking-tight text-foreground">
              Créer un document
            </h1>
          </div>

          <button
            type="button"
            onClick={create}
            disabled={!canCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {creating ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Création…</span>
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                <span>Créer</span>
              </>
            )}
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-3xl space-y-7"
        >
          {/* Étape 1 : marque */}
          <section>
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                  1. Marque émettrice
                </p>
                <h2 className="mt-1 font-display text-base font-semibold text-foreground">
                  Au nom de quelle entreprise ?
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
              >
                <Eye className="size-3.5" />
                Voir l&apos;exemple
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {BRAND_LIST.map((b) => {
                const selected = brand === b.id
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBrand(b.id)}
                    className={`group relative flex flex-col gap-3 overflow-hidden rounded-xl border p-4 text-left transition-all ${
                      selected
                        ? 'border-foreground/15 shadow-md'
                        : 'border-border/60 hover:shadow-sm'
                    }`}
                    style={{
                      background: selected ? b.marine : undefined,
                      color: selected ? '#fff' : undefined,
                    }}
                  >
                    <div className="flex h-10 items-center">
                      <BrandLogo brand={b} className="h-9 w-auto" />
                    </div>
                    <div>
                      <p
                        className={`font-display text-sm font-semibold ${selected ? 'text-white' : 'text-foreground'}`}
                      >
                        {b.name}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="size-3 rounded-full" style={{ background: b.primary }} />
                        <p
                          className={`text-[11px] ${selected ? 'text-white/70' : 'text-muted-foreground'}`}
                        >
                          {b.email}
                        </p>
                      </div>
                    </div>
                    {selected ? (
                      <span className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-white text-[#000]">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Étape 2 : type */}
          <section>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              2. Type de document
            </p>
            <h2 className="mt-1 mb-3 font-display text-base font-semibold text-foreground">
              Tu rédiges quoi ?
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              {DOC_TYPES.map((t) => {
                const selected = docType === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setDocType(t.id)}
                    className={`relative flex flex-col gap-1 overflow-hidden rounded-xl border p-4 text-left transition-all ${
                      selected
                        ? 'border-primary bg-primary/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)]'
                        : 'border-border/60 bg-card hover:border-primary/40 hover:bg-primary/[0.03]'
                    }`}
                  >
                    <p className="font-display text-sm font-semibold text-foreground">
                      {t.label}
                    </p>
                    <p className="text-[12px] text-muted-foreground">{t.description}</p>
                    {selected ? (
                      <span className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Étape 3 : nom du client + objet */}
          <section>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              3. Informations
            </p>
            <h2 className="mt-1 mb-3 font-display text-base font-semibold text-foreground">
              Pour qui ?
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  Nom du client *
                </label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="Ex: Madame Maximin, Atelier Lumière, Shi Shi…"
                  className="h-10 w-full rounded-lg border border-border/70 bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  Objet (optionnel)
                </label>
                <input
                  type="text"
                  value={baseline}
                  onChange={(e) => setBaseline(e.target.value)}
                  placeholder="Ex: Plateforme digitale de formation"
                  className="h-10 w-full rounded-lg border border-border/70 bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                />
              </div>
            </div>
          </section>

          {/* Étape 4 : logo client (optionnel) */}
          <section>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              4. Logo du client (optionnel)
            </p>
            <h2 className="mt-1 mb-3 font-display text-base font-semibold text-foreground">
              Affiché à côté de ton logo dans le hero
            </h2>

            {clientLogoUrl ? (
              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={clientLogoUrl}
                  alt="Logo client"
                  className="h-12 w-auto max-w-[180px] rounded object-contain"
                />
                <p className="min-w-0 flex-1 truncate text-[11px] text-muted-foreground">
                  {clientLogoUrl}
                </p>
                <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-md border border-border/60 bg-background px-3 text-xs font-medium text-foreground/80 hover:bg-muted">
                  <Upload className="size-3.5" />
                  Changer
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/svg+xml"
                    className="hidden"
                    disabled={uploadingLogo}
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleLogoUpload(f)
                      e.currentTarget.value = ''
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setClientLogoUrl('')}
                  className="inline-flex h-9 items-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                  Retirer
                </button>
              </div>
            ) : (
              <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 bg-card px-3 py-5 text-sm font-medium text-foreground/80 transition-colors hover:border-primary/50 hover:bg-primary/[0.04]">
                {uploadingLogo ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Upload en cours…
                  </>
                ) : (
                  <>
                    <ImagePlus className="size-4" />
                    Ajouter le logo du client
                  </>
                )}
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  className="hidden"
                  disabled={uploadingLogo}
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleLogoUpload(f)
                    e.currentTarget.value = ''
                  }}
                />
              </label>
            )}
          </section>

          {error ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center text-xs text-muted-foreground sm:text-left">
              Le document sera créé avec un squelette. Tu rédiges et stylises ensuite dans l&apos;éditeur.
            </p>
            <button
              type="button"
              onClick={create}
              disabled={!canCreate}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {creating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Création…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Créer le document
                </>
              )}
            </button>
          </div>
        </motion.div>
      </main>

      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        src={`/propositions/exemple?brand=${brand}`}
        title={`Exemple, template ${BRAND_LIST.find((b) => b.id === brand)?.name ?? ''}`}
      />
    </div>
  )
}
