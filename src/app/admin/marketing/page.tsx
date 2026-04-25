'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Eye, X, Megaphone, AlignCenter } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageField } from '@/components/admin/field-editor'
import { cn } from '@/lib/utils'

interface BannerSettings {
  enabled: boolean
  text: string
  link: string
  bgColor: string
  textColor: string
}

interface PopupSettings {
  enabled: boolean
  title: string
  description: string
  buttonText: string
  buttonLink: string
  imageUrl: string
  bgColor: string
  textColor: string
  buttonColor: string
  delay: number
  banner: BannerSettings
}

const defaultSettings: PopupSettings = {
  enabled: false,
  title: 'Offre spéciale',
  description: 'Profitez de nos offres exclusives dès maintenant !',
  buttonText: 'En savoir plus',
  buttonLink: '#',
  imageUrl: '',
  bgColor: '#ffffff',
  textColor: '#111827',
  buttonColor: '#2563eb',
  delay: 5,
  banner: {
    enabled: false,
    text: '',
    link: '',
    bgColor: '#111827',
    textColor: '#ffffff',
  },
}

type Tab = 'popup' | 'banner'

export default function AdminMarketingPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<PopupSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [tab, setTab] = useState<Tab>('popup')

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      router.push('/admin/login')
    }
  }, [router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/marketing')
        const data = await res.json()
        setSettings({
          ...defaultSettings,
          ...data,
          banner: { ...defaultSettings.banner, ...(data?.banner ?? {}) },
        })
      } catch (error) {
        console.error('Failed to load marketing settings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const updateBanner = (patch: Partial<BannerSettings>) => {
    setSettings((s) => ({ ...s, banner: { ...s.banner, ...patch } }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch('/api/marketing', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        alert('Paramètres sauvegardés')
      }
    } catch (error) {
      alert('Erreur: ' + (error instanceof Error ? error.message : 'Erreur inconnue'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6">Chargement...</div>
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-8 md:pt-0">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-foreground">Marketing</h1>
            <p className="text-xs text-muted-foreground">
              {tab === 'popup'
                ? 'Popup promotionnelle affichée aux visiteurs'
                : 'Bannière affichée au-dessus du header'}
            </p>
          </div>
        </div>
        {tab === 'popup' && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="size-4" />
            Aperçu
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="inline-flex items-center gap-1 rounded-lg bg-muted/60 p-1">
        <button
          onClick={() => setTab('popup')}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            tab === 'popup'
              ? 'bg-white text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Megaphone className="size-4" />
          Popup Marketing
        </button>
        <button
          onClick={() => setTab('banner')}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            tab === 'banner'
              ? 'bg-white text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <AlignCenter className="size-4" />
          Bannière
        </button>
      </div>

      {tab === 'popup' && (
      <div className="rounded-xl bg-card border border-border/40 overflow-hidden max-w-2xl">
        {/* Enable toggle */}
        <div className="px-5 py-3 border-b border-border/40 bg-muted/30 flex items-center justify-between">
          <h3 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
            Popup Marketing
          </h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              className={`relative w-9 h-5 rounded-full transition-colors ${settings.enabled ? 'bg-primary' : 'bg-muted-foreground/30'}`}
              onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
            >
              <div className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform ${settings.enabled ? 'translate-x-4' : ''}`} />
            </div>
            <span className="text-xs text-muted-foreground">{settings.enabled ? 'Activée' : 'Désactivée'}</span>
          </label>
        </div>

        <div className="p-5 space-y-5">
          {/* Content section */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Contenu</p>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Titre
              </Label>
              <Input
                value={settings.title}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                placeholder="Offre spéciale"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Description
              </Label>
              <textarea
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                placeholder="Profitez de nos offres exclusives..."
                rows={3}
                className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-y"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Texte du bouton
                </Label>
                <Input
                  value={settings.buttonText}
                  onChange={(e) => setSettings({ ...settings, buttonText: e.target.value })}
                  placeholder="En savoir plus"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Lien du bouton
                </Label>
                <Input
                  value={settings.buttonLink}
                  onChange={(e) => setSettings({ ...settings, buttonLink: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <ImageField
              label="Image (optionnelle)"
              value={settings.imageUrl}
              onChange={(v) => setSettings({ ...settings, imageUrl: v })}
            />
          </div>

          {/* Design section */}
          <div className="space-y-4 pt-2 border-t border-border/40">
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Design</p>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Fond
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.bgColor}
                    onChange={(e) => setSettings({ ...settings, bgColor: e.target.value })}
                    className="size-9 rounded-lg border border-input cursor-pointer bg-transparent"
                  />
                  <Input
                    value={settings.bgColor}
                    onChange={(e) => setSettings({ ...settings, bgColor: e.target.value })}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Texte
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.textColor}
                    onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                    className="size-9 rounded-lg border border-input cursor-pointer bg-transparent"
                  />
                  <Input
                    value={settings.textColor}
                    onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Bouton
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.buttonColor}
                    onChange={(e) => setSettings({ ...settings, buttonColor: e.target.value })}
                    className="size-9 rounded-lg border border-input cursor-pointer bg-transparent"
                  />
                  <Input
                    value={settings.buttonColor}
                    onChange={(e) => setSettings({ ...settings, buttonColor: e.target.value })}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Délai d&apos;apparition (secondes)
              </Label>
              <Input
                type="number"
                min={1}
                max={60}
                value={settings.delay}
                onChange={(e) => setSettings({ ...settings, delay: parseInt(e.target.value) || 5 })}
              />
              <p className="text-[11px] text-muted-foreground/60">
                La popup s&apos;affiche après ce délai quand un visiteur ouvre le site.
              </p>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full gap-2"
          >
            <Check className="size-4" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>
      )}

      {tab === 'banner' && (
      <div className="rounded-xl bg-card border border-border/40 overflow-hidden max-w-2xl">
        <div className="px-5 py-3 border-b border-border/40 bg-muted/30 flex items-center justify-between">
          <h3 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
            Bannière au-dessus du header
          </h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              className={`relative w-9 h-5 rounded-full transition-colors ${settings.banner.enabled ? 'bg-primary' : 'bg-muted-foreground/30'}`}
              onClick={() => updateBanner({ enabled: !settings.banner.enabled })}
            >
              <div className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform ${settings.banner.enabled ? 'translate-x-4' : ''}`} />
            </div>
            <span className="text-xs text-muted-foreground">{settings.banner.enabled ? 'Activée' : 'Désactivée'}</span>
          </label>
        </div>

        <div className="p-5 space-y-5">
          {/* Live preview */}
          <div className="rounded-lg border border-border/40 overflow-hidden">
            <div className="px-3 py-1.5 bg-muted/40 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest border-b border-border/40">
              Aperçu
            </div>
            <div
              className="px-4 py-2 text-center text-sm font-medium"
              style={{ backgroundColor: settings.banner.bgColor, color: settings.banner.textColor }}
            >
              {settings.banner.text || 'Votre texte de bannière…'}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Contenu</p>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Texte
              </Label>
              <Input
                value={settings.banner.text}
                onChange={(e) => updateBanner({ text: e.target.value })}
                placeholder="Livraison gratuite jusqu'au 30 avril !"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Lien (optionnel)
              </Label>
              <Input
                value={settings.banner.link}
                onChange={(e) => updateBanner({ link: e.target.value })}
                placeholder="/contact ou https://..."
              />
              <p className="text-[11px] text-muted-foreground/60">
                Laissez vide pour que la bannière ne soit pas cliquable.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-border/40">
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Design</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Fond
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.banner.bgColor}
                    onChange={(e) => updateBanner({ bgColor: e.target.value })}
                    className="size-9 rounded-lg border border-input cursor-pointer bg-transparent"
                  />
                  <Input
                    value={settings.banner.bgColor}
                    onChange={(e) => updateBanner({ bgColor: e.target.value })}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Texte
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.banner.textColor}
                    onChange={(e) => updateBanner({ textColor: e.target.value })}
                    className="size-9 rounded-lg border border-input cursor-pointer bg-transparent"
                  />
                  <Input
                    value={settings.banner.textColor}
                    onChange={(e) => updateBanner({ textColor: e.target.value })}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full gap-2"
          >
            <Check className="size-4" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>
      )}

      {/* Preview modal (popup only) */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={() => setShowPreview(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative mx-4 w-full max-w-[420px] overflow-hidden rounded-3xl shadow-[0_25px_60px_-12px_rgba(0,0,0,0.4)]"
            style={{ backgroundColor: settings.bgColor, color: settings.textColor }}
          >
            <div
              className="pointer-events-none absolute -top-20 -right-20 size-40 rounded-full opacity-20 blur-3xl"
              style={{ backgroundColor: settings.buttonColor }}
            />
            <div
              className="pointer-events-none absolute -bottom-16 -left-16 size-32 rounded-full opacity-15 blur-3xl"
              style={{ backgroundColor: settings.buttonColor }}
            />

            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 z-20 flex size-9 items-center justify-center rounded-full bg-black/5 backdrop-blur-sm border border-black/5 hover:bg-black/10 transition-all duration-200 hover:scale-110 cursor-pointer"
              style={{ color: settings.textColor }}
            >
              <X className="size-4" strokeWidth={2.5} />
            </motion.button>

            {settings.imageUrl && (
              <div className="relative w-full h-52 overflow-hidden">
                <img
                  src={settings.imageUrl}
                  alt={settings.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-20"
                  style={{
                    background: `linear-gradient(to top, ${settings.bgColor}, transparent)`,
                  }}
                />
              </div>
            )}

            <div className={`relative px-7 ${settings.imageUrl ? 'pt-1 pb-7' : 'py-8'}`}>
              {!settings.imageUrl && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 48 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="h-1 rounded-full mb-5"
                  style={{ backgroundColor: settings.buttonColor }}
                />
              )}

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-2xl font-extrabold tracking-tight leading-tight pr-10"
              >
                {settings.title || 'Titre'}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-3 text-sm leading-relaxed opacity-70"
              >
                {settings.description || 'Description...'}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-6"
              >
                <a
                  href={settings.buttonLink || '#'}
                  onClick={(e) => e.preventDefault()}
                  className="group inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: settings.buttonColor,
                    boxShadow: `0 4px 14px -3px ${settings.buttonColor}80`,
                  }}
                >
                  {settings.buttonText || 'En savoir plus'}
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
