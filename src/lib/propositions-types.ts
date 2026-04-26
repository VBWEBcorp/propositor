import type { BrandId, DocType } from '@/lib/brands'

export type PropositionPayload = {
  slug: string
  brand: BrandId
  docType: DocType
  client: string
  title?: string
  baseline?: string
  date?: string
  number?: string
  content: string
  clientLogoUrl?: string
}

export type PropositionWithMeta = PropositionPayload & {
  createdAt: string
  updatedAt: string
}

export type { BrandId, DocType }
