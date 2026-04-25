'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Images,
  LogOut,
  Home,
  Users,
  Briefcase,
  Phone,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  ExternalLink,
  FileText,
  Menu,
  X,
  Megaphone,
  FilePen,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/components/admin/sidebar-context'

const navItems = [
  { href: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
]

const pageEditItems = [
  { href: '/admin/pages/accueil', label: 'Accueil', icon: Home },
  { href: '/admin/pages/a-propos', label: 'À propos', icon: Users },
  { href: '/admin/pages/services', label: 'Services', icon: Briefcase },
  { href: '/admin/pages/contact', label: 'Contact', icon: Phone },
  { href: '/admin/pages/temoignages', label: 'Témoignages', icon: MessageSquare },
]

const moduleItems = [
  { href: '/admin/gallery', label: 'Galerie', icon: Images },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/marketing', label: 'Marketing', icon: Megaphone },
]

function NavLink({
  href, label, icon: Icon, pathname, collapsed, onClick,
}: {
  href: string; label: string; icon: any; pathname: string; collapsed: boolean; onClick?: () => void
}) {
  const isActive = pathname === href
  return (
    <Link href={href} title={collapsed ? label : undefined} onClick={onClick}>
      <div
        className={cn(
          'relative flex items-center gap-3 rounded-lg text-[13px] font-medium transition-all',
          collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
          isActive
            ? 'bg-primary text-white shadow-sm'
            : 'text-zinc-400 hover:bg-white/10 hover:text-white'
        )}
      >
        <Icon className="size-[18px] shrink-0" />
        {!collapsed && <span>{label}</span>}
      </div>
    </Link>
  )
}

export function MobileMenuButton() {
  const { toggle, mobileOpen } = useSidebar()
  return (
    <button
      onClick={toggle}
      className="md:hidden fixed top-3 left-3 z-[60] p-2 rounded-lg bg-zinc-900 text-white shadow-lg"
    >
      {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
    </button>
  )
}

export function AdminSidebar() {
  const { collapsed, mobileOpen, isMobile, toggle, setMobileOpen } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()
  const pagesSectionActive = pageEditItems.some((i) => pathname === i.href)
  const [pagesOpen, setPagesOpen] = useState(pagesSectionActive)
  useEffect(() => {
    if (pagesSectionActive) setPagesOpen(true)
  }, [pagesSectionActive])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    router.push('/admin/login')
  }

  const closeMobile = () => {
    if (isMobile) setMobileOpen(false)
  }

  const sidebarContent = (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-zinc-900 border-r border-white/10 flex flex-col z-50 transition-all duration-200',
        isMobile ? 'w-[260px]' : collapsed ? 'w-[60px]' : 'w-[220px]'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'h-[60px] flex items-center border-b border-white/10',
        isMobile ? 'justify-between px-4' : collapsed ? 'justify-center px-2' : 'justify-between px-4'
      )}>
        {(!collapsed || isMobile) && (
          <div>
            <p className="text-sm font-bold text-white leading-tight">Admin</p>
            <p className="text-[10px] text-zinc-400">Gestion du site</p>
          </div>
        )}
        {isMobile ? (
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="size-4" />
          </button>
        ) : (
          <button
            onClick={toggle}
            className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            title={collapsed ? 'Ouvrir le menu' : 'Réduire le menu'}
          >
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        'flex-1 py-5 space-y-5 overflow-y-auto',
        isMobile ? 'px-3' : collapsed ? 'px-2' : 'px-3'
      )}>
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} pathname={pathname} collapsed={isMobile ? false : collapsed} onClick={closeMobile} />
          ))}
        </div>

        <div className="space-y-1">
          {(!collapsed || isMobile) && (
            <p className="px-3 pb-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Contenus
            </p>
          )}
          {(collapsed && !isMobile) && <div className="border-t border-white/10 mb-1" />}

          {/* Collapsible "Modification des pages" group */}
          {(!collapsed || isMobile) ? (
            <>
              <button
                type="button"
                onClick={() => setPagesOpen((v) => !v)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all',
                  pagesSectionActive
                    ? 'text-white'
                    : 'text-zinc-400 hover:bg-white/10 hover:text-white'
                )}
                aria-expanded={pagesOpen}
              >
                <FilePen className="size-[18px] shrink-0" />
                <span className="flex-1 text-left">Modification des pages</span>
                <ChevronDown
                  className={cn(
                    'size-4 shrink-0 transition-transform',
                    pagesOpen ? 'rotate-0' : '-rotate-90'
                  )}
                />
              </button>
              {pagesOpen && (
                <div className="ml-3 pl-3 border-l border-white/10 space-y-1">
                  {pageEditItems.map((item) => (
                    <NavLink
                      key={item.href}
                      {...item}
                      pathname={pathname}
                      collapsed={false}
                      onClick={closeMobile}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            pageEditItems.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                pathname={pathname}
                collapsed
                onClick={closeMobile}
              />
            ))
          )}

          {moduleItems.map((item) => (
            <NavLink key={item.href} {...item} pathname={pathname} collapsed={isMobile ? false : collapsed} onClick={closeMobile} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className={cn(
        'border-t border-white/10 space-y-0.5',
        isMobile ? 'p-3' : collapsed ? 'p-2' : 'p-3'
      )}>
        <Link href="/" target="_blank" title={collapsed && !isMobile ? 'Voir le site' : undefined} onClick={closeMobile}>
          <div className={cn(
            'flex items-center gap-3 rounded-lg text-[13px] font-medium text-zinc-400 hover:bg-white/10 hover:text-white transition-colors',
            !isMobile && collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'
          )}>
            <ExternalLink className="size-[18px]" />
            {(!collapsed || isMobile) && 'Voir le site'}
          </div>
        </Link>
        <button
          onClick={handleLogout}
          title={collapsed && !isMobile ? 'Déconnexion' : undefined}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg text-[13px] font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors',
            !isMobile && collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'
          )}
        >
          <LogOut className="size-[18px]" />
          {(!collapsed || isMobile) && 'Déconnexion'}
        </button>
      </div>
    </aside>
  )

  // Mobile: overlay
  if (isMobile) {
    return (
      <>
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileOpen(false)}
            />
            {sidebarContent}
          </>
        )}
      </>
    )
  }

  // Desktop
  return sidebarContent
}
