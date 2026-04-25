'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ThemeToggleProps = {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('mymag-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn('rounded-full', className)}
      aria-label={dark ? 'Passer en thème clair' : 'Passer en thème sombre'}
      aria-pressed={dark}
      onClick={() => setDark((d) => !d)}
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}
