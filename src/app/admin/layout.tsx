'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const publicPaths = ['/admin/login', '/admin/register']

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const isPublicPage = publicPaths.includes(pathname)

  useEffect(() => {
    const token = localStorage.getItem('authToken')

    if (isPublicPage) {
      if (token) router.push('/admin')
      setLoading(false)
      return
    }

    if (!token) {
      router.push('/admin/login')
      return
    }

    setAuthenticated(true)
    setLoading(false)
  }, [router, isPublicPage])

  if (loading) return null
  if (isPublicPage) return children
  if (!authenticated) return null

  return <div className="min-h-screen bg-muted/30">{children}</div>
}
