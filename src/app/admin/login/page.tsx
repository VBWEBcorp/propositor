'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Shield } from 'lucide-react'

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
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Mot de passe incorrect')
      }

      const data = await response.json()
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('authUser', JSON.stringify(data.user))

      router.push('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 p-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_30%,oklch(0.55_0.2_285/0.35),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.6))]"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg ring-1 ring-primary/30">
            <span className="font-display text-sm font-bold tracking-tighter">
              VB
            </span>
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-white">
            VBWEB · Propositor
          </span>
        </div>

        <Card className="border-white/10 bg-card/95 shadow-2xl backdrop-blur-md">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-lg bg-primary/10">
                <Lock className="size-4 text-primary" />
              </div>
              <CardTitle>Accès privé</CardTitle>
            </div>
            <CardDescription>Entrez le mot de passe pour continuer.</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                    placeholder="••••••••"
                    className="pl-8"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
                >
                  {error}
                </motion.div>
              )}

              <Button type="submit" disabled={loading} className="mt-2 h-9 w-full">
                {loading ? 'Vérification…' : 'Entrer'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 flex items-center justify-center gap-2 text-white/60">
          <Shield className="size-3.5" />
          <p className="text-xs">Espace privé · accès restreint</p>
        </div>
      </motion.div>
    </div>
  )
}
