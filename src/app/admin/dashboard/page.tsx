'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Home,
  Users,
  Briefcase,
  Phone,
  MessageSquare,
  Images,
  ArrowRight,
  FileText,
  Database,
} from 'lucide-react'

interface AdminUser {
  email: string
  name?: string
}

const modules = [
  { href: '/admin/pages/accueil', label: 'Accueil', desc: 'Hero, histoire, CTA, bandeau', icon: Home },
  { href: '/admin/pages/a-propos', label: 'À propos', desc: 'Présentation, valeurs, galerie', icon: Users },
  { href: '/admin/pages/services', label: 'Services', desc: 'Liste des services', icon: Briefcase },
  { href: '/admin/pages/contact', label: 'Contact', desc: 'Formulaire, coordonnées', icon: Phone },
  { href: '/admin/pages/temoignages', label: 'Témoignages', desc: 'Avis clients', icon: MessageSquare },
  { href: '/admin/gallery', label: 'Galerie', desc: 'Photos du site', icon: Images },
  { href: '/admin/blog', label: 'Blog', desc: 'Articles et actualités', icon: FileText },
]

const ease = [0.22, 1, 0.36, 1] as const

export default function AdminDashboardPage() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [seedDone, setSeedDone] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userStr = localStorage.getItem('authUser')

    if (!token || !userStr) {
      router.push('/admin/login')
      return
    }

    try {
      setUser(JSON.parse(userStr))
    } catch {
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  if (loading || !user) return null

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="rounded-2xl bg-primary/10 p-8 lg:p-10"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Bonjour !
        </h1>
        <p className="text-muted-foreground mt-1">
          Gérez le contenu de votre site depuis cet espace.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.08 }}
      >
        <h2 className="text-sm font-bold text-muted-foreground/60 uppercase tracking-widest mb-4">
          Éditer les pages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-8 md:pt-0">
          {modules.map((mod) => {
            const Icon = mod.icon
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="group flex items-center gap-4 p-4 rounded-xl border border-border/40 bg-card hover:border-primary/20 hover:shadow-sm transition-all"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/8 group-hover:bg-primary/15 transition-colors">
                  <Icon className="size-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{mod.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{mod.desc}</p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </Link>
            )
          })}
        </div>
      </motion.div>

      {/* Seed */}
      {!seedDone && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.16 }}
          className="rounded-xl border border-dashed border-border/60 p-5 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Database className="size-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Données d&apos;exemple</p>
              <p className="text-xs text-muted-foreground">Ajouter des photos galerie et articles blog pour tester le template</p>
            </div>
          </div>
          <button
            onClick={async () => {
              setSeeding(true)
              try {
                const token = localStorage.getItem('authToken')
                const res = await fetch('/api/seed', {
                  method: 'POST',
                  headers: { Authorization: `Bearer ${token}` },
                })
                if (res.ok) {
                  setSeedDone(true)
                } else {
                  alert('Erreur lors du seed')
                }
              } catch {
                alert('Erreur réseau')
              } finally {
                setSeeding(false)
              }
            }}
            disabled={seeding}
            className="shrink-0 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {seeding ? 'Chargement...' : 'Charger les données'}
          </button>
        </motion.div>
      )}
    </div>
  )
}
