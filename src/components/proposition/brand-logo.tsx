'use client'

import { useState } from 'react'

import type { Brand } from '@/lib/brands'

type Props = {
  brand: Brand
  className?: string
}

/**
 * Affiche le logo officiel de la marque (CDN) si défini, sinon un fallback texte stylisé
 * dans la couleur primary de la marque.
 */
export function BrandLogo({ brand, className }: Props) {
  const [failed, setFailed] = useState(false)

  if (brand.logoUrl && !failed) {
    return (
      <img
        src={brand.logoUrl}
        alt={brand.name}
        className={className}
        onError={() => setFailed(true)}
      />
    )
  }

  // Fallback texte
  return (
    <span
      className={`inline-flex items-baseline gap-0 font-display font-bold tracking-tight ${className ?? ''}`}
      style={{ color: '#fff' }}
    >
      <span style={{ color: brand.primary }}>{brand.shortName}</span>
      <span className="opacity-90">{brand.name.slice(brand.shortName.length)}</span>
    </span>
  )
}
