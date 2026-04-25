'use client'

import { useEffect, useState } from 'react'

interface BannerData {
  enabled: boolean
  text: string
  link?: string
  bgColor: string
  textColor: string
}

export function MarketingBanner() {
  const [banner, setBanner] = useState<BannerData | null>(null)

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch('/api/marketing')
        const data = await res.json()
        if (data?.banner?.enabled && data.banner.text) {
          setBanner(data.banner)
        }
      } catch {
        // silently fail
      }
    }
    fetchBanner()
  }, [])

  if (!banner) return null

  const content = (
    <div
      className="w-full px-4 py-2 text-center text-sm font-medium"
      style={{ backgroundColor: banner.bgColor, color: banner.textColor }}
    >
      {banner.text}
    </div>
  )

  if (banner.link) {
    return (
      <a href={banner.link} className="block hover:opacity-90 transition-opacity">
        {content}
      </a>
    )
  }

  return content
}
