'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2 } from 'lucide-react'

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
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#0a0a0b] px-5 py-12">
      {/* Grain subtil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {/* Halo doux haut-gauche */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 size-[420px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at center, oklch(0.7 0.18 230 / 0.6), transparent 70%)',
        }}
      />
      {/* Halo doux bas-droite */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-32 size-[480px] rounded-full opacity-25 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at center, oklch(0.65 0.22 285 / 0.6), transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[380px]"
      >
        {/* Logo + nom */}
        <div className="mb-12 flex items-center justify-center gap-2.5">
          <span
            className="grid size-8 place-items-center rounded-lg text-[11px] font-bold tracking-tighter text-white"
            style={{
              background:
                'linear-gradient(135deg, oklch(0.65 0.22 285), oklch(0.55 0.2 230))',
            }}
          >
            VB
          </span>
          <span className="font-display text-[15px] font-semibold tracking-tight text-white/90">
            Propositor
          </span>
        </div>

        {/* Titre */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-[28px] font-semibold tracking-tight text-white">
            Bon retour.
          </h1>
          <p className="mt-1.5 text-sm text-white/50">
            Entre ton mot de passe pour continuer.
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="space-y-3">
          <div className="relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              autoComplete="current-password"
              placeholder="Mot de passe"
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-[15px] text-white placeholder:text-white/30 outline-none transition-all focus:border-white/25 focus:bg-white/[0.07] focus:ring-4 focus:ring-white/[0.04]"
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-1 text-[13px] text-rose-400"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-white text-[14px] font-semibold text-zinc-950 transition-all hover:bg-white/95 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-white/40 disabled:text-zinc-600"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Vérification…</span>
              </>
            ) : (
              <>
                <span>Entrer</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer discret */}
        <p className="mt-10 text-center text-[11px] uppercase tracking-[0.2em] text-white/25">
          VBWEB · Espace privé
        </p>
      </motion.div>
    </div>
  )
}
