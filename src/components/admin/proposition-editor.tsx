'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  ExternalLink,
  Eye,
  ImagePlus,
  Loader2,
  MoreVertical,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react'

import { InlineEditor } from '@/components/admin/inline-editor'
import { PreviewModal } from '@/components/admin/preview-modal'
import { PropositionHero } from '@/components/proposition/proposition-hero'
import { PropositionShell } from '@/components/proposition/proposition-shell'
import { BRAND_LIST, DOC_TYPES } from '@/lib/brands'
import type { PropositionPayload } from '@/lib/propositions-types'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export function PropositionEditor({
  initial,
}: {
  initial: PropositionPayload & { number?: string }
}) {
  const router = useRouter()
  const [data, setData] = useState<PropositionPayload & { number?: string }>(initial)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [metaOpen, setMetaOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const lastSavedJson = useRef(JSON.stringify(initial))

  const dirty = useMemo(
    () => JSON.stringify(data) !== lastSavedJson.current,
    [data]
  )

  const save = useCallback(async (payload: PropositionPayload) => {
    setSaveState('saving')
    setErrorMsg(null)
    try {
      const token = localStorage.getItem('authToken')
      // On envoie toujours sur le slug INITIAL (l'URL courante) ; le serveur gère le rename si payload.slug a changé
      const res = await fetch(`/api/propositions/${initial.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Erreur de sauvegarde')
      }
      const updated = (await res.json()) as PropositionPayload & { number?: string }
      // Si le slug a changé côté serveur (rename), on synchronise et on redirige
      if (updated.slug !== initial.slug) {
        lastSavedJson.current = JSON.stringify(updated)
        setData(updated)
        setSaveState('saved')
        setTimeout(() => {
          router.replace(`/admin/edit/${updated.slug}`)
        }, 600)
        return
      }
      lastSavedJson.current = JSON.stringify(payload)
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 1500)
    } catch (e) {
      setSaveState('error')
      setErrorMsg(e instanceof Error ? e.message : 'Erreur')
    }
  }, [initial.slug, router])

  // Avertit l'utilisateur s'il quitte la page avec des modifs non enregistrées
  useEffect(() => {
    if (!dirty) return
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  // Raccourci clavier ⌘/Ctrl + S
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (dirty) save(data)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dirty, data, save])

  function update<K extends keyof typeof data>(key: K, value: (typeof data)[K]) {
    setData((d) => ({ ...d, [key]: value }))
  }

  async function handleDelete() {
    const token = localStorage.getItem('authToken')
    const res = await fetch(`/api/propositions/${data.slug}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) router.push('/admin')
  }

  async function copyLink() {
    const url = `${window.location.origin}/propositions/${data.slug}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  async function handleLogoUpload(file: File) {
    setUploadingLogo(true)
    setErrorMsg(null)
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
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Erreur upload')
      }
      const { url } = (await res.json()) as { url: string }
      update('clientLogoUrl', url)
    } catch (e) {
      setErrorMsg(e instanceof Error ? `Logo : ${e.message}` : 'Logo : erreur')
    } finally {
      setUploadingLogo(false)
    }
  }

  async function downloadPdf() {
    setSaveState('idle')
    setErrorMsg(null)
    try {
      const printable = document.getElementById('proposition-printable')
      if (!printable) {
        setErrorMsg('Zone à imprimer introuvable')
        return
      }

      const headerEl = printable.querySelector(
        '[data-pdf="header"]'
      ) as HTMLElement | null
      const bodyEl = printable.querySelector(
        '[data-pdf="body"]'
      ) as HTMLElement | null
      const footerEl = printable.querySelector(
        '[data-pdf="footer"]'
      ) as HTMLElement | null
      if (!headerEl || !bodyEl || !footerEl) {
        setErrorMsg('Structure PDF incomplète (header/body/footer manquant)')
        return
      }

      const html2canvas = (await import('html2canvas-pro')).default
      const { default: jsPDF } = await import('jspdf')

      const captureOpts = {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: 1024,
        logging: false,
      } as const

      // 1. Capture du header (page 1 uniquement)
      const headerCanvas = await html2canvas(headerEl, captureOpts)
      const headerImg = headerCanvas.toDataURL('image/jpeg', 0.95)

      // 2. Pré-capture de tous les blocs (avec leurs hauteurs)
      const blockSelector = 'h1, h2, h3, h4, h5, h6, p, ul, ol, table, blockquote, hr, pre'
      const blocks = Array.from(
        bodyEl.querySelectorAll<HTMLElement>(blockSelector)
      ).filter((el) => {
        let parent = el.parentElement
        while (parent && parent !== bodyEl) {
          if (
            parent.matches('li, p, blockquote, td, th, ul, ol') &&
            !parent.matches('.ProseMirror, [data-pdf="body"]')
          ) {
            return false
          }
          parent = parent.parentElement
        }
        return true
      })

      // PDF A4 portrait
      const pageWidth = 210
      const pageHeight = 297
      const sideMargin = 12
      const contentWidth = pageWidth - sideMargin * 2

      const headerH = (headerCanvas.height * pageWidth) / headerCanvas.width

      // Capture footer une fois pour mesurer sa hauteur (le compteur de page importe peu pour mesurer)
      const footerProbe = await html2canvas(footerEl, captureOpts)
      const footerH = (footerProbe.height * pageWidth) / footerProbe.width

      // Pré-capture de chaque bloc → image + hauteur en mm + tagName pour spacing
      type BlockMeta = {
        img: string
        h: number
        tagName: string
        isHeading: boolean
      }
      const blockData: BlockMeta[] = []
      for (const block of blocks) {
        const c = await html2canvas(block, captureOpts)
        const h = (c.height * contentWidth) / c.width
        blockData.push({
          img: c.toDataURL('image/jpeg', 0.95),
          h,
          tagName: block.tagName,
          isHeading: /^H[1-6]$/.test(block.tagName),
        })
      }

      // Espace AVANT un bloc selon son tag (style Google Doc : sections aérées)
      const spaceBefore = (tagName: string, prevTagName: string | null): number => {
        if (prevTagName === null) return 0 // 1er bloc d'une page
        // Avant un titre principal : grosse aération
        if (tagName === 'H1' || tagName === 'H2') return 8
        // Avant un sous-titre : aération moyenne
        if (tagName === 'H3') return 5
        // Après un titre : tassé (le contenu suit immédiatement)
        if (prevTagName === 'H1' || prevTagName === 'H2') return 1
        if (prevTagName === 'H3') return 1
        // Avant un tableau / blockquote : un peu d'air
        if (tagName === 'TABLE' || tagName === 'BLOCKQUOTE') return 4
        // Avant une liste : petit air
        if (tagName === 'UL' || tagName === 'OL') return 2.5
        // Standard entre paragraphes
        return 2
      }

      // 3. Layout virtuel pour compter le nombre total de pages
      const topPage1 = headerH + 8
      const topOtherPages = 14
      const bottomLimit = pageHeight - footerH - 8

      let virtualPages = 1
      let virtualY = topPage1
      let virtualPrevTag: string | null = null
      for (let i = 0; i < blockData.length; i++) {
        const cur = blockData[i]
        const next = cur.isHeading && i + 1 < blockData.length ? blockData[i + 1] : null
        const beforeCur = spaceBefore(cur.tagName, virtualPrevTag)
        const beforeNext = next ? spaceBefore(next.tagName, cur.tagName) : 0
        const reserve = beforeCur + cur.h + (next ? beforeNext + next.h : 0)

        if (virtualY + reserve > bottomLimit) {
          virtualPages++
          virtualY = topOtherPages
          virtualPrevTag = null
        }
        virtualY += spaceBefore(cur.tagName, virtualPrevTag) + cur.h
        virtualPrevTag = cur.tagName
        if (next) {
          if (virtualY + spaceBefore(next.tagName, virtualPrevTag) + next.h > bottomLimit) {
            virtualPages++
            virtualY = topOtherPages
            virtualPrevTag = null
          }
          virtualY += spaceBefore(next.tagName, virtualPrevTag) + next.h
          virtualPrevTag = next.tagName
          i++
        }
      }

      // 4. Capture N versions du footer avec le bon "Page X / Y"
      const pageCounter = footerEl.querySelector(
        '[data-pdf-page-counter]'
      ) as HTMLElement | null
      const originalText = pageCounter?.textContent ?? ''

      const footerImgs: string[] = []
      for (let p = 1; p <= virtualPages; p++) {
        if (pageCounter) {
          pageCounter.textContent = `Page ${p} / ${virtualPages}`
        }
        const c = await html2canvas(footerEl, captureOpts)
        footerImgs.push(c.toDataURL('image/jpeg', 0.95))
      }
      // Restaure le texte original côté DOM
      if (pageCounter) pageCounter.textContent = originalText

      // 5. Génération du PDF final
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      let currentPage = 1

      // Page 1 : header + footer[0]
      pdf.addImage(headerImg, 'JPEG', 0, 0, pageWidth, headerH)
      pdf.addImage(footerImgs[0], 'JPEG', 0, pageHeight - footerH, pageWidth, footerH)
      let cursorY = topPage1
      let prevTag: string | null = null

      function nextPage() {
        pdf.addPage()
        currentPage++
        // Pages 2+ : footer SEULEMENT (pas de header)
        pdf.addImage(
          footerImgs[currentPage - 1],
          'JPEG',
          0,
          pageHeight - footerH,
          pageWidth,
          footerH
        )
        cursorY = topOtherPages
        prevTag = null
      }

      for (let i = 0; i < blockData.length; i++) {
        const cur = blockData[i]
        const next = cur.isHeading && i + 1 < blockData.length ? blockData[i + 1] : null

        // Réserve d'espace : avant cur + cur.h (+ avant next + next.h si orphelin protégé)
        const beforeCur = spaceBefore(cur.tagName, prevTag)
        const reserve =
          beforeCur +
          cur.h +
          (next ? spaceBefore(next.tagName, cur.tagName) + next.h : 0)

        if (cursorY + reserve > bottomLimit) {
          nextPage()
        }

        cursorY += spaceBefore(cur.tagName, prevTag)
        pdf.addImage(cur.img, 'JPEG', sideMargin, cursorY, contentWidth, cur.h)
        cursorY += cur.h
        prevTag = cur.tagName

        if (next) {
          const beforeNext = spaceBefore(next.tagName, prevTag)
          if (cursorY + beforeNext + next.h > bottomLimit) {
            nextPage()
          }
          cursorY += spaceBefore(next.tagName, prevTag)
          pdf.addImage(next.img, 'JPEG', sideMargin, cursorY, contentWidth, next.h)
          cursorY += next.h
          prevTag = next.tagName
          i++
        }
      }

      const safeClient = (data.client || 'proposition')
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-+|-+$/g, '')
      const safeNumber = (data.number || '').replace(/[^a-z0-9-]+/gi, '')
      const filename = `${safeClient}${safeNumber ? '_' + safeNumber : ''}.pdf`
      pdf.save(filename)
    } catch (e) {
      setErrorMsg(
        e instanceof Error ? `Erreur PDF: ${e.message}` : 'Erreur PDF inconnue'
      )
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      {/* Barre admin (hors impression) — mobile-first */}
      <header className="no-print sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        {/* Ligne 1 : retour + titre + Enregistrer */}
        <div className="flex items-center gap-2 px-3 py-2 sm:px-4">
          <Link
            href="/admin"
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Retour"
          >
            <ArrowLeft className="size-4" />
          </Link>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              {data.number ?? 'Édition'}
            </p>
            <h1 className="truncate font-display text-sm font-semibold tracking-tight text-foreground">
              {data.client || 'Sans nom'}
            </h1>
          </div>

          <button
            type="button"
            onClick={async () => {
              if (dirty) await save(data)
              setPreviewOpen(true)
            }}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border/60 bg-card text-foreground/80 transition-colors hover:bg-muted"
            aria-label="Aperçu desktop / mobile"
            title="Aperçu desktop / mobile (enregistre puis ouvre la prévisualisation)"
          >
            <Eye className="size-4" />
          </button>

          <button
            type="button"
            onClick={() => save(data)}
            disabled={!dirty || saveState === 'saving'}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saveState === 'saving' ? (
              <Loader2 className="size-4 animate-spin" />
            ) : saveState === 'saved' ? (
              <Check className="size-4" />
            ) : (
              <Save className="size-4" />
            )}
            <span>
              {saveState === 'saving'
                ? 'Enregistrement…'
                : saveState === 'saved'
                ? 'Enregistré'
                : 'Enregistrer'}
            </span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              className="inline-flex size-9 items-center justify-center rounded-lg border border-border/60 bg-card text-foreground/80 transition-colors hover:bg-muted"
              aria-label="Plus d'actions"
              aria-expanded={moreOpen}
            >
              <MoreVertical className="size-4" />
            </button>
            {moreOpen ? (
              <div
                className="absolute right-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-xl border border-border/60 bg-popover shadow-lg"
                onMouseLeave={() => setMoreOpen(false)}
              >
                <MenuItem
                  onClick={() => {
                    setMetaOpen((v) => !v)
                    setMoreOpen(false)
                  }}
                  icon={metaOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  label={metaOpen ? 'Masquer métadonnées' : 'Métadonnées'}
                />
                <MenuItem
                  onClick={() => {
                    copyLink()
                    setMoreOpen(false)
                  }}
                  icon={<Copy className="size-4" />}
                  label={copied ? 'Lien copié !' : 'Copier le lien'}
                />
                <MenuItem
                  onClick={() => {
                    downloadPdf()
                    setMoreOpen(false)
                  }}
                  icon={<Download className="size-4" />}
                  label="Télécharger le PDF"
                />
                <a
                  href={`/propositions/${data.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
                  onClick={() => setMoreOpen(false)}
                >
                  <ExternalLink className="size-4" />
                  Ouvrir côté client
                </a>
                <div className="border-t border-border/60" />
                <button
                  type="button"
                  onClick={() => {
                    setConfirmDelete(true)
                    setMoreOpen(false)
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />
                  Supprimer
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Ligne 2 : badge état (subtil) */}
        <div className="flex items-center gap-2 px-3 pb-2 text-[11px] text-muted-foreground sm:px-4">
          <SaveBadge state={saveState} dirty={dirty} />
          <span className="ml-auto hidden sm:inline">
            ⌘/Ctrl+S pour enregistrer · clique sur le contenu pour modifier
          </span>
        </div>

        {/* Bloc métadonnées */}
        {metaOpen ? (
          <div className="border-t border-border/60 bg-muted/40 px-4 py-3">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <Field label="Client">
                <input
                  className={fieldClass}
                  value={data.client}
                  onChange={(e) => update('client', e.target.value)}
                  placeholder="Madame Maximin"
                />
              </Field>
              <Field label="Objet (baseline)" className="lg:col-span-2">
                <input
                  className={fieldClass}
                  value={data.baseline ?? ''}
                  onChange={(e) => update('baseline', e.target.value)}
                  placeholder="Plateforme digitale de formation"
                />
              </Field>
              <Field label="N° proposition">
                <input
                  className={fieldClass}
                  value={data.number ?? ''}
                  onChange={(e) => update('number', e.target.value)}
                  placeholder="N°2026-10"
                />
              </Field>
              <Field label="Date">
                <input
                  className={fieldClass}
                  value={data.date ?? ''}
                  onChange={(e) => update('date', e.target.value)}
                  placeholder="24/04/2026"
                />
              </Field>
              <Field label="Marque émettrice">
                <select
                  className={fieldClass}
                  value={data.brand}
                  onChange={(e) =>
                    update('brand', e.target.value as PropositionPayload['brand'])
                  }
                >
                  {BRAND_LIST.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Type de document">
                <select
                  className={fieldClass}
                  value={data.docType}
                  onChange={(e) =>
                    update('docType', e.target.value as PropositionPayload['docType'])
                  }
                >
                  {DOC_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Slug (URL personnalisée)" className="lg:col-span-2">
                <div className="flex items-center gap-1.5">
                  <span className="shrink-0 text-xs text-muted-foreground">/propositions/</span>
                  <input
                    className={fieldClass}
                    value={data.slug}
                    onChange={(e) =>
                      update(
                        'slug',
                        e.target.value
                          .toLowerCase()
                          .normalize('NFD')
                          .replace(/[̀-ͯ]/g, '')
                          .replace(/[^a-z0-9-]+/g, '-')
                      )
                    }
                    placeholder="nom-projet"
                  />
                </div>
                {data.slug !== initial.slug ? (
                  <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400">
                    L&apos;ancien lien <span className="font-mono">/{initial.slug}</span> ne marchera plus après enregistrement.
                  </p>
                ) : null}
              </Field>

              <Field label="Logo client (optionnel)" className="lg:col-span-3">
                {data.clientLogoUrl ? (
                  <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.clientLogoUrl}
                      alt="Logo client"
                      className="h-10 w-auto max-w-[160px] rounded object-contain"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs text-muted-foreground">
                        {data.clientLogoUrl.split('/').pop()}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Affiché dans le hero à côté du logo VBWEB.
                      </p>
                    </div>
                    <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-border/60 bg-card px-2.5 text-[11px] font-medium text-foreground/80 hover:bg-muted">
                      <Upload className="size-3.5" />
                      Remplacer
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
                      onClick={() => update('clientLogoUrl', '')}
                      className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-[11px] font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                      Retirer
                    </button>
                  </div>
                ) : (
                  <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border/70 bg-background px-3 py-3 text-sm font-medium text-foreground/80 transition-colors hover:border-primary/50 hover:bg-primary/[0.04]">
                    {uploadingLogo ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Upload en cours…
                      </>
                    ) : (
                      <>
                        <ImagePlus className="size-4" />
                        Ajouter le logo du client (PNG, JPG, SVG, WEBP)
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
              </Field>
            </div>
          </div>
        ) : null}

        {errorMsg ? (
          <div className="border-t border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {errorMsg}
          </div>
        ) : null}

        {confirmDelete ? (
          <div className="border-t border-destructive/30 bg-destructive/5 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-destructive">
                Confirmer la suppression de <strong>{data.client}</strong> ?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90"
                >
                  <Trash2 className="size-3.5" />
                  Supprimer
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-foreground/80 hover:bg-muted"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      {/* La proposition rendue exactement comme côté client */}
      <main className="flex-1" id="proposition-printable">
        <PropositionShell
          brand={data.brand}
          client={data.client || 'Client'}
          number={data.number}
        >
          <PropositionHero
            brand={data.brand}
            client={data.client || 'Client'}
            baseline={data.baseline}
            date={data.date}
            number={data.number}
            clientLogoUrl={data.clientLogoUrl}
          />

          <div data-pdf="body" className="mx-auto max-w-5xl px-4 pb-8 pt-12 sm:px-8 sm:pt-16">
            <InlineEditor
              initialMarkdown={data.content}
              onChange={(md) => update('content', md)}
            />
          </div>
        </PropositionShell>
      </main>

      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        src={`/propositions/${initial.slug}`}
        title={`Aperçu — ${data.client || 'Client'}`}
      />
    </div>
  )
}

function MenuItem({
  onClick,
  icon,
  label,
}: {
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
    >
      {icon}
      {label}
    </button>
  )
}

function Field({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={`block ${className ?? ''}`}>
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  )
}

const fieldClass =
  'w-full rounded-md border border-border/70 bg-background px-2.5 py-1.5 text-sm text-foreground outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/15'

function SaveBadge({ state, dirty }: { state: SaveState; dirty: boolean }) {
  if (state === 'saving')
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Loader2 className="size-3 animate-spin" />
        Enregistrement…
      </span>
    )
  if (state === 'saved')
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
        <Check className="size-3" />
        Enregistré
      </span>
    )
  if (state === 'error')
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-destructive">
        <X className="size-3" />
        Erreur
      </span>
    )
  if (dirty)
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400">
        <Save className="size-3" />
        Modifs en attente
      </span>
    )
  return null
}
