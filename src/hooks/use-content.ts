'use client'

import { useEffect, useState } from 'react'

export function useContent<T extends Record<string, any>>(
  pageId: string,
  defaults: T
): { data: T; loading: boolean } {
  const [data, setData] = useState<T>(defaults)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
    const previewId = params?.get('preview')
    const isPreview = previewId === pageId

    if (isPreview) {
      setLoading(false)
      const handler = (event: MessageEvent) => {
        const msg = event.data
        if (msg && msg.type === 'preview-content' && msg.pageId === pageId && msg.content) {
          setData({ ...defaults, ...msg.content })
        }
      }
      window.addEventListener('message', handler)
      window.parent?.postMessage({ type: 'preview-ready', pageId }, '*')
      return () => window.removeEventListener('message', handler)
    }

    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/content/${pageId}`)
        const result = await response.json()

        if (result.content && Object.keys(result.content).length > 0) {
          setData({ ...defaults, ...result.content })
        }
      } catch (error) {
        console.error(`Failed to load content for ${pageId}:`, error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId])

  return { data, loading }
}
