'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Save, Check, ArrowLeft, Eye, X, ExternalLink, Monitor, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PageEditorProps {
  pageId: string
  title: string
  defaultContent: Record<string, any>
  children: (
    content: Record<string, any>,
    updateField: (path: string, value: any) => void
  ) => React.ReactNode
}

const previewPaths: Record<string, string> = {
  home: '/',
  about: '/a-propos',
  services: '/services',
  contact: '/contact',
  testimonials: '/#temoignages',
}

export function PageEditor({ pageId, title, defaultContent, children }: PageEditorProps) {
  const [content, setContent] = useState(defaultContent)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [previewReady, setPreviewReady] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const previewPath = previewPaths[pageId]
  const previewSrc = previewPath
    ? (() => {
        const [path, hash] = previewPath.split('#')
        const sep = path.includes('?') ? '&' : '?'
        return `${path}${sep}preview=${encodeURIComponent(pageId)}${hash ? `#${hash}` : ''}`
      })()
    : ''

  useEffect(() => {
    if (!previewOpen) {
      setPreviewReady(false)
      return
    }
    const handler = (event: MessageEvent) => {
      const msg = event.data
      if (msg && msg.type === 'preview-ready' && msg.pageId === pageId) {
        setPreviewReady(true)
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'preview-content', pageId, content },
          '*'
        )
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [previewOpen, pageId, content])

  useEffect(() => {
    if (previewOpen && previewReady) {
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'preview-content', pageId, content },
        '*'
      )
    }
  }, [content, previewOpen, previewReady, pageId])

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/content/${pageId}`)
        const result = await response.json()

        if (result.content && Object.keys(result.content).length > 0) {
          setContent({ ...defaultContent, ...result.content })
        }
      } catch (error) {
        console.error('Failed to load content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId])

  const updateField = useCallback((path: string, value: any) => {
    setSaved(false)
    setContent((prev) => {
      const keys = path.split('.')
      const newContent = JSON.parse(JSON.stringify(prev))
      let obj = newContent
      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in obj)) obj[keys[i]] = {}
        obj = obj[keys[i]]
      }
      obj[keys[keys.length - 1]] = value
      return newContent
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`/api/content/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      alert('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header sticky */}
      <div className="sticky top-0 z-10 -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 lg:-mx-8 lg:-mt-8 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-4 bg-muted/30 backdrop-blur-sm border-b border-border/30 mb-6">
        <div className="flex items-center justify-between max-w-4xl pt-8 md:pt-0">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {previewPaths[pageId] && (
              <Button
                onClick={() => setPreviewOpen(true)}
                variant="outline"
                size="sm"
              >
                <Eye className="size-3.5" />
                <span className="hidden sm:inline">Aperçu</span>
              </Button>
            )}
          <Button
            onClick={handleSave}
            disabled={saving}
            size="sm"
            className={saved ? 'bg-emerald-600 hover:bg-emerald-600' : ''}
          >
            {saved ? (
              <>
                <Check className="size-3.5" />
                Sauvegardé
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </>
            )}
          </Button>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5 max-w-4xl"
      >
        {children(content, updateField)}
      </motion.div>

      {previewOpen && previewPath && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex flex-col p-3 sm:p-4"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="relative w-full h-full bg-zinc-100 rounded-xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-border/40 bg-white">
              <div className="flex items-center gap-2 text-xs text-muted-foreground truncate min-w-0">
                <Eye className="size-3.5 shrink-0" />
                <span className="font-medium">Aperçu</span>
                <span className="truncate hidden sm:inline">— {previewPath}</span>
              </div>

              <div className="flex items-center gap-1 rounded-lg bg-muted/60 p-0.5">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  title="Ordinateur"
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                    previewDevice === 'desktop'
                      ? 'bg-white text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Monitor className="size-3.5" />
                  <span className="hidden sm:inline">Ordinateur</span>
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  title="Mobile"
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                    previewDevice === 'mobile'
                      ? 'bg-white text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Smartphone className="size-3.5" />
                  <span className="hidden sm:inline">Mobile</span>
                </button>
              </div>

              <div className="flex items-center gap-1">
                <a
                  href={previewPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Ouvrir dans un onglet"
                  className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <ExternalLink className="size-4" />
                </a>
                <button
                  onClick={() => setPreviewOpen(false)}
                  title="Fermer"
                  className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto flex items-start justify-center p-4 sm:p-6">
              <div
                className={cn(
                  'bg-white shadow-lg transition-all duration-300 overflow-hidden',
                  previewDevice === 'mobile'
                    ? 'w-[390px] h-[780px] max-w-full max-h-full rounded-[28px] border-[10px] border-zinc-900'
                    : 'w-full h-full rounded-md'
                )}
              >
                <iframe
                  ref={iframeRef}
                  src={previewSrc}
                  className="w-full h-full bg-white"
                  title="Aperçu de la page"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
