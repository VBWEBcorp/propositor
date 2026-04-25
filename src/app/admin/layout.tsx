'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AdminSidebar, MobileMenuButton } from '@/components/admin/sidebar'
import { SidebarProvider, useSidebar } from '@/components/admin/sidebar-context'
import { cn } from '@/lib/utils'

const publicPaths = ['/admin/login', '/admin/register']

function AdminMain({ children }: { children: React.ReactNode }) {
  const { collapsed, isMobile } = useSidebar()
  return (
    <main className={cn(
      'flex-1 min-h-screen bg-muted/30 transition-all duration-200',
      isMobile ? 'ml-0' : collapsed ? 'ml-[60px]' : 'ml-[220px]'
    )}>
      {children}
    </main>
  )
}

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
      if (token) {
        router.push('/admin/dashboard')
      }
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <MobileMenuButton />
        <AdminMain>{children}</AdminMain>
      </div>
    </SidebarProvider>
  )
}
