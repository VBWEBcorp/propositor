'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, Mail, Shield } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Identifiants invalides')
      }

      const data = await response.json()
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('authUser', JSON.stringify(data.user))

      router.push('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-white/10 bg-card/95 backdrop-blur-md shadow-2xl">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10">
                <Lock className="size-4 text-primary" />
              </div>
              <CardTitle>Connexion Admin</CardTitle>
            </div>
            <CardDescription>
              Accédez à votre espace d'administration sécurisé
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@example.com"
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="pl-8"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-9 mt-2"
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
            </form>

            {/* TODO: Retirer avant mise en production */}
            <div className="mt-4">
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => {
                  localStorage.setItem('authToken', 'demo-token')
                  localStorage.setItem('authUser', JSON.stringify({ email: 'demo@template.com', name: 'Demo', role: 'admin' }))
                  router.push('/admin/dashboard')
                }}
              >
                Accès démo
              </Button>
            </div>

            <div className="mt-6 pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground text-center mb-4">
                Vous n'avez pas de compte?
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full"
              >
                <Link href="/admin/register">
                  Créer un compte
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer sécurité + RGPD */}
        <div className="mt-6 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-white/70">
            <Shield className="size-4" />
            <p className="text-xs">
              Connexion sécurisée. Données respectant la RGPD, stockées en Europe
            </p>
          </div>
          <Button
            asChild
            variant="link"
            className="text-white/50 hover:text-white/80 text-xs h-auto p-0"
          >
            <Link href="/politique-de-confidentialite">
              Politique de confidentialité
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
