'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface SidebarContextType {
  collapsed: boolean
  mobileOpen: boolean
  isMobile: boolean
  setCollapsed: (v: boolean) => void
  setMobileOpen: (v: boolean) => void
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  mobileOpen: false,
  isMobile: false,
  setCollapsed: () => {},
  setMobileOpen: () => {},
  toggle: () => {},
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const toggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen)
    } else {
      setCollapsed(!collapsed)
    }
  }

  return (
    <SidebarContext.Provider value={{ collapsed, mobileOpen, isMobile, setCollapsed, setMobileOpen, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  return useContext(SidebarContext)
}
