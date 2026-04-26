import { notFound } from 'next/navigation'

import { PropositionEditor } from '@/components/admin/proposition-editor'
import { getProposition } from '@/lib/propositions'

export const dynamic = 'force-dynamic'

export default async function EditPropositionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const prop = await getProposition(slug)
  if (!prop) notFound()

  return <PropositionEditor initial={prop} />
}
