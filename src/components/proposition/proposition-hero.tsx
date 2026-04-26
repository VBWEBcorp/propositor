import { getBrand, type BrandId } from '@/lib/brands'
import { BrandLogo } from './brand-logo'

type Props = {
  brand?: BrandId
  client: string
  baseline?: string
  date?: string
  number?: string
  clientLogoUrl?: string
}

export function PropositionHero({
  brand = 'vbweb',
  client,
  baseline,
  date,
  number,
  clientLogoUrl,
}: Props) {
  const b = getBrand(brand)

  return (
    <>
      {/* Bandeau marine — version premium */}
      <div
        data-pdf="header"
        className="relative overflow-hidden bg-brand-marine text-brand-marine-foreground"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_120%_at_85%_50%,rgba(255,255,255,0.16),transparent_60%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[linear-gradient(110deg,transparent_55%,rgba(255,255,255,0.04)_55%,rgba(255,255,255,0.04)_57%,transparent_57%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />

        <div className="relative mx-auto flex max-w-5xl items-center justify-between gap-6 px-4 py-6 sm:px-8 sm:py-7">
          <div className="flex items-center gap-4 sm:gap-5">
            <BrandLogo brand={b} className="h-10 w-auto sm:h-12" />
            {clientLogoUrl ? (
              <>
                <span aria-hidden className="h-10 w-px bg-white/25 sm:h-12" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={clientLogoUrl}
                  alt={`Logo ${client}`}
                  className="h-9 w-auto max-w-[160px] object-contain sm:h-11"
                />
              </>
            ) : null}
          </div>

          {(number || date) ? (
            <div className="flex items-center gap-4 sm:gap-5">
              <span aria-hidden className="h-10 w-px bg-white/25 sm:h-12" />
              <div className="flex flex-col items-end gap-0.5 text-right">
                {number ? (
                  <p className="font-display text-base font-semibold tracking-tight sm:text-lg">
                    {number}
                  </p>
                ) : null}
                {date ? (
                  <p className="text-[11px] uppercase tracking-[0.18em] text-brand-marine-foreground/70 sm:text-xs">
                    Date de création · {date}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Objet de la proposition */}
      <header className="relative bg-background">
        <div className="mx-auto max-w-5xl px-4 pt-12 sm:px-8 sm:pt-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            Objet du document
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem]">
            {baseline || `Document pour ${client}`}
            <br />
            <span className="text-foreground/55">pour </span>
            <span className="text-heading">{client}</span>
          </h1>
          <div className="mt-6 h-[2px] w-12 rounded-full bg-primary" />
        </div>
      </header>
    </>
  )
}
