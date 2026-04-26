import { PropositionShell } from './proposition-shell'
import { PropositionHero } from './proposition-hero'
import { Markdown } from './markdown'
import type { PropositionPayload } from '@/lib/propositions-types'

export function PropositionView({
  data,
  embedded = false,
}: {
  data: PropositionPayload & { number?: string }
  embedded?: boolean
}) {
  const inner = (
    <>
      <PropositionHero
        brand={data.brand}
        client={data.client || 'Client'}
        baseline={data.baseline}
        date={data.date}
        number={data.number}
        clientLogoUrl={data.clientLogoUrl}
      />
      <div className="mx-auto max-w-5xl px-4 pb-8 pt-12 sm:px-8 sm:pt-16">
        {data.content?.trim() ? (
          <Markdown>{data.content}</Markdown>
        ) : (
          <p className="text-sm italic text-muted-foreground">
            (Le contenu de la proposition apparaîtra ici dès que tu auras généré ou édité.)
          </p>
        )}
      </div>
    </>
  )

  if (embedded) return <div className="bg-background">{inner}</div>

  return (
    <PropositionShell
      brand={data.brand}
      client={data.client || 'Client'}
      number={data.number}
    >
      {inner}
    </PropositionShell>
  )
}
