'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Plus, Trash2, Check, ArrowLeft, Pencil, Eye, EyeOff,
  Calendar, Settings, FileText, X, Save,
} from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageField } from '@/components/admin/field-editor'
import { cn } from '@/lib/utils'

interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  coverImage: string
  category: string
  published: boolean
  publishedAt?: string
  createdAt: string
}

interface BlogSettings {
  enabled: boolean
  title: string
  description?: string
  eyebrow?: string
  heroImage?: string
  categories?: string[]
}

type Tab = 'articles' | 'settings'

export default function AdminBlogPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('articles')
  const [settings, setSettings] = useState<BlogSettings>({ enabled: false, title: 'Nos dernières actualités', eyebrow: 'Blog', description: 'Retrouvez nos conseils, nos projets récents et les tendances du secteur.', heroImage: '', categories: [] })
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      router.push('/admin/login')
    }
  }, [router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const [settingsRes, postsRes] = await Promise.all([
          fetch('/api/blog/settings'),
          fetch('/api/blog/posts', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])
        const settingsData = await settingsRes.json()
        setSettings({ ...settingsData, categories: settingsData.categories || [] })
        setPosts(await postsRes.json())
      } catch (error) {
        console.error('Failed to load blog:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('/api/blog/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(settings),
      })
      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {
      alert('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleAddCategory = () => {
    const cat = newCategory.trim()
    if (!cat || settings.categories?.includes(cat)) return
    setSettings({ ...settings, categories: [...(settings.categories || []), cat] })
    setNewCategory('')
  }

  const handleRemoveCategory = (cat: string) => {
    setSettings({
      ...settings,
      categories: (settings.categories || []).filter((c) => c !== cat),
    })
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('Supprimer cet article ?')) return
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`/api/blog/posts/${slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) setPosts(posts.filter((p) => p.slug !== slug))
    } catch {
      alert('Erreur lors de la suppression')
    }
  }

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`/api/blog/posts/${post.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...post, published: !post.published }),
      })
      if (response.ok) {
        setPosts(posts.map((p) => p.slug === post.slug ? { ...p, published: !p.published } : p))
      }
    } catch {
      alert('Erreur')
    }
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })

  // Filtered posts
  const filteredPosts = posts.filter((p) => {
    if (filterCategory !== 'all' && p.category !== filterCategory) return false
    if (filterStatus === 'published' && !p.published) return false
    if (filterStatus === 'draft' && p.published) return false
    return true
  })

  const publishedCount = posts.filter((p) => p.published).length
  const draftCount = posts.filter((p) => !p.published).length

  if (loading) return <div className="p-6">Chargement...</div>

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 pt-8 md:pt-0">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">Blog</h1>

          {/* Toggle enable */}
          <label className="flex items-center gap-2 ml-2 cursor-pointer">
            <div
              className={cn(
                'relative w-9 h-5 rounded-full transition-colors',
                settings.enabled ? 'bg-primary' : 'bg-muted-foreground/30'
              )}
              onClick={() => {
                const newSettings = { ...settings, enabled: !settings.enabled }
                setSettings(newSettings)
                // Auto-save toggle
                const token = localStorage.getItem('authToken')
                fetch('/api/blog/settings', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                  body: JSON.stringify(newSettings),
                })
              }}
            >
              <div
                className={cn(
                  'absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform',
                  settings.enabled && 'translate-x-4'
                )}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {settings.enabled ? 'Visible sur le site' : 'Masqué'}
            </span>
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-muted/50 w-fit">
        <button
          onClick={() => setTab('articles')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
            tab === 'articles'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <FileText className="size-4" />
          Articles
          <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
            {posts.length}
          </span>
        </button>
        <button
          onClick={() => setTab('settings')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
            tab === 'settings'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Settings className="size-4" />
          Page & Catégories
        </button>
      </div>

      {/* ======= TAB: ARTICLES ======= */}
      {tab === 'articles' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* Filters + New */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status filter */}
            <div className="flex gap-1 p-0.5 rounded-md bg-muted/50">
              {[
                { value: 'all' as const, label: `Tous (${posts.length})` },
                { value: 'published' as const, label: `Publiés (${publishedCount})` },
                { value: 'draft' as const, label: `Brouillons (${draftCount})` },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilterStatus(f.value)}
                  className={cn(
                    'px-2.5 py-1 rounded text-xs font-medium transition-colors',
                    filterStatus === f.value
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Category filter */}
            {(settings.categories?.length ?? 0) > 0 && (
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="rounded-md border border-input bg-transparent px-2.5 py-1.5 text-xs outline-none"
              >
                <option value="all">Toutes les catégories</option>
                {settings.categories?.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}

            <div className="flex-1" />

            <Button size="sm" asChild>
              <Link href="/admin/blog/new">
                <Plus className="size-4" />
                Nouvel article
              </Link>
            </Button>
          </div>

          {/* Posts list */}
          {filteredPosts.length > 0 ? (
            <div className="space-y-2">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card hover:border-border transition group"
                >
                  {/* Cover thumbnail */}
                  {post.coverImage ? (
                    <div className="hidden sm:block w-16 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                      <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="hidden sm:flex w-16 h-12 rounded-lg bg-muted/50 shrink-0 items-center justify-center">
                      <FileText className="size-5 text-muted-foreground/30" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">{post.title}</p>
                      {post.published ? (
                        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          Publié
                        </span>
                      ) : (
                        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded">
                          Brouillon
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      {post.category && (
                        <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-medium">
                          {post.category}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDate(post.publishedAt || post.createdAt)}
                      </span>
                      <span className="text-muted-foreground/40 hidden sm:inline truncate">
                        /blog/{post.slug}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => handleTogglePublish(post)}
                      title={post.published ? 'Repasser en brouillon' : 'Publier'}
                    >
                      {post.published ? (
                        <EyeOff className="size-4 text-muted-foreground" />
                      ) : (
                        <Eye className="size-4 text-primary" />
                      )}
                    </Button>
                    <Button size="icon-sm" variant="ghost" asChild>
                      <Link href={`/admin/blog/${post.slug}`} title="Modifier">
                        <Pencil className="size-4 text-muted-foreground" />
                      </Link>
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => handleDelete(post.slug)}
                      title="Supprimer"
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-xl border border-dashed border-border/60">
              <FileText className="size-10 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">
                {posts.length === 0
                  ? 'Aucun article pour le moment'
                  : 'Aucun article ne correspond aux filtres'}
              </p>
              {posts.length === 0 && (
                <Button size="sm" className="mt-4" asChild>
                  <Link href="/admin/blog/new">
                    <Plus className="size-4" />
                    Créer votre premier article
                  </Link>
                </Button>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* ======= TAB: SETTINGS ======= */}
      {tab === 'settings' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-5 max-w-2xl"
        >
          {/* Page settings */}
          <div className="rounded-xl bg-card border border-border/40 overflow-hidden">
            <div className="px-5 py-3 border-b border-border/40 bg-muted/30">
              <h3 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                Section d&apos;en-tête (Hero)
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Petit texte au-dessus du titre
                </Label>
                <Input
                  value={settings.eyebrow || ''}
                  onChange={(e) => setSettings({ ...settings, eyebrow: e.target.value })}
                  placeholder="Blog"
                />
                <p className="text-[11px] text-muted-foreground/60">
                  Le mot ou la phrase courte en violet au-dessus du titre principal
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Titre principal
                </Label>
                <Input
                  value={settings.title}
                  onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                  placeholder="Nos dernières actualités"
                />
                <p className="text-[11px] text-muted-foreground/60">
                  Le grand titre affiché dans la section d&apos;en-tête
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Description
                </Label>
                <textarea
                  value={settings.description || ''}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  placeholder="Retrouvez nos conseils, nos projets récents et les tendances du secteur."
                  rows={2}
                  className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-y"
                />
                <p className="text-[11px] text-muted-foreground/60">
                  Le texte explicatif sous le titre
                </p>
              </div>

              <ImageField
                label="Image de fond du Hero"
                value={settings.heroImage || ''}
                onChange={(v) => setSettings({ ...settings, heroImage: v })}
              />
              <p className="text-[11px] text-muted-foreground/60 -mt-2">
                Image affichée en arrière-plan de la section d&apos;en-tête. Laissez vide pour un fond uni.
              </p>
            </div>
          </div>

          {/* Categories */}
          <div className="rounded-xl bg-card border border-border/40 overflow-hidden">
            <div className="px-5 py-3 border-b border-border/40 bg-muted/30">
              <h3 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                Catégories
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-muted-foreground">
                Définissez les catégories disponibles pour organiser vos articles. Elles apparaîtront
                dans le menu déroulant lors de la création d&apos;un article.
              </p>

              {/* Existing categories */}
              {(settings.categories?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-2">
                  {settings.categories?.map((cat) => (
                    <div
                      key={cat}
                      className="flex items-center gap-1.5 bg-primary/10 text-primary text-sm font-medium px-3 py-1.5 rounded-full"
                    >
                      {cat}
                      <button
                        onClick={() => handleRemoveCategory(cat)}
                        className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                        title="Supprimer"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add category */}
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                  placeholder="Nouvelle catégorie (ex : Conseils, Actualités, Tutoriels...)"
                  className="flex-1"
                />
                <Button onClick={handleAddCategory} variant="outline" size="sm" disabled={!newCategory.trim()}>
                  <Plus className="size-4" />
                  Ajouter
                </Button>
              </div>
            </div>
          </div>

          {/* Save button */}
          <Button
            onClick={handleSaveSettings}
            disabled={saving}
            className={cn('w-full gap-2', saved && 'bg-emerald-600 hover:bg-emerald-600')}
          >
            {saved ? (
              <><Check className="size-4" /> Sauvegardé</>
            ) : (
              <><Save className="size-4" /> {saving ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}</>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  )
}
