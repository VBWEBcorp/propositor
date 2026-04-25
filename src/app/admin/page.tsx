'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    router.replace(token ? '/admin/dashboard' : '/admin/login')
  }, [router])

  return null
}
