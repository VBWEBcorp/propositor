'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Eye, Loader2, Sparkles } from 'lucide-react'

import { PreviewModal } from '@/components/admin/preview-modal'
import { BrandLogo } from '@/components/proposition/brand-logo'
import { BRAND_LIST, DOC_TYPES } from '@/lib/brands'
import type { BrandId, DocType } from '@/lib/propositions-types'

const PLACEHOLDER = `Colle ici tout ce que tu as sur ce client.

Une conversation Claude/ChatGPT entière, des notes, un brief, un pavé en vrac. L'IA va lire, structurer et reposer le contenu dans le template choisi en gardant tes mots.`

const STEPS = [
  'Analyse du contenu…',
  'Extraction du contexte client…',
  'Mise en forme dans le template…',
  'Sauvegarde…',
]

export default function NewDocPage() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [brand, setBrand] = useState<BrandId>('vbweb')
  const [docType, setDocType] = useState<DocType>('proposition')
  const [loading, setLoading] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  async function generate() {
    setError(null)
    setLoading(true)
    setStepIndex(0)

    const stepInterval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
    }, 1800)

    try {
      const token = localStorage.getItem('authToken')

      // 1) IA via Edge runtime (pas de timeout 10s côté Netlify)
      const aiRes = await fetch('/api/ai/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ conversation: text, brand, docType }),
      })
      if (!aiRes.ok) {
        let detail = ''
        try {
          const j = await aiRes.json()
          detail = (j as { error?: string }).error ?? ''
        } catch {
          /* pas du JSON */
        }
        if (aiRes.status === 401) {
          throw new Error('Session expirée. Reconnecte-toi.')
        }
        if (aiRes.status === 504 || aiRes.status === 408) {
          throw new Error(
            `Délai IA dépassé (HTTP ${aiRes.status}). Réessaie ou réduis le texte collé.`
          )
        }
        if (aiRes.status === 502 || aiRes.status === 503) {
          throw new Error(
            `DeepSeek momentanément indisponible (HTTP ${aiRes.status}). Réessaie dans quelques secondes.`
          )
        }
        if (aiRes.status === 500) {
          throw new Error(
            detail
              ? `Erreur IA : ${detail}`
              : 'Erreur IA. Vérifie que DEEPSEEK_API_KEY est défini dans Netlify.'
          )
        }
        throw new Error(
          detail || `Erreur IA HTTP ${aiRes.status} ${aiRes.statusText || ''}`.trim()
        )
      }
      const ai = (await aiRes.json()) as {
        client: string
        baseline: string
        date: string
        content: string
        brand: string
        docType: string
      }

      // 2) Création du doc en DB (route Node, rapide, < 1s)
      const dbRes = await fetch('/api/propositions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ai),
      })
      if (!dbRes.ok) {
        const j = await dbRes.json().catch(() => ({}))
        throw new Error(
          (j as { error?: string }).error ??
            `Erreur création doc HTTP ${dbRes.status}`
        )
      }
      const { slug } = (await dbRes.json()) as { slug: string }
      router.push(`/admin/edit/${slug}`)
    } catch (e) {
      // Erreurs réseau (offline, CORS, abort, etc.)
      if (e instanceof TypeError && e.message.includes('fetch')) {
        setError(
          'Connexion impossible avec le serveur. Vérifie ta connexion internet.'
        )
      } else {
        setError(e instanceof Error ? e.message : 'Erreur inconnue')
      }
      setLoading(false)
    } finally {
      clearInterval(stepInterval)
    }
  }

  const charCount = text.length
  const canGenerate = !loading && charCount >= 30

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
              Coller &amp; générer
            </h1>
          </div>

          <button
            type="button"
            onClick={generate}
            disabled={!canGenerate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span className="hidden sm:inline">Génération…</span>
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                <span>Générer</span>
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
          className="w-full max-w-3xl"
        >
          {/* Étape 1 : marque */}
          <section className="mb-7">
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
                        <span
                          className="size-3 rounded-full"
                          style={{ background: b.primary }}
                        />
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

          {/* Étape 2 : type de document */}
          <section className="mb-7">
            <div className="mb-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                2. Type de document
              </p>
              <h2 className="mt-1 font-display text-base font-semibold text-foreground">
                Tu rédiges quoi ?
              </h2>
            </div>

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
                    <p className="text-[12px] text-muted-foreground">
                      {t.description}
                    </p>
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

          {/* Étape 3 : contenu */}
          <section className="mb-6">
            <div className="mb-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                3. Contenu
              </p>
              <h2 className="mt-1 font-display text-base font-semibold text-foreground">
                Colle tes notes / la conversation
              </h2>
            </div>

            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={loading}
                placeholder={PLACEHOLDER}
                className="min-h-[55vh] w-full resize-y rounded-2xl border border-border/70 bg-background p-4 font-mono text-[13px] leading-[1.6] text-foreground outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/15 disabled:opacity-60 sm:min-h-[420px] sm:p-5"
              />
              <div className="pointer-events-none absolute bottom-3 right-4 text-[11px] text-muted-foreground">
                {charCount.toLocaleString('fr-FR')} caractères
                {charCount > 0 && charCount < 30 ? ' · trop court' : ''}
              </div>
            </div>
          </section>

          {loading ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl border border-border/60 bg-card p-4"
            >
              <ul className="space-y-2.5 text-sm">
                {STEPS.map((s, i) => (
                  <li key={s} className="flex items-center gap-2.5">
                    {i < stepIndex ? (
                      <span className="grid size-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        ✓
                      </span>
                    ) : i === stepIndex ? (
                      <Loader2 className="size-4 animate-spin text-primary" />
                    ) : (
                      <span className="size-4 rounded-full border border-border" />
                    )}
                    <span
                      className={
                        i <= stepIndex ? 'text-foreground' : 'text-muted-foreground'
                      }
                    >
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : null}

          {error ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
            >
              {error}
            </motion.div>
          ) : null}

          <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center text-xs text-muted-foreground sm:text-left">
              IA : DeepSeek V4 Flash · ~5–10 secondes en moyenne
            </p>
            <button
              type="button"
              onClick={generate}
              disabled={!canGenerate}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Génération en cours…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Générer le document
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
        title={`Exemple — Template ${BRAND_LIST.find((b) => b.id === brand)?.name ?? ''}`}
      />
    </div>
  )
}
