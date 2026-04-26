import { getBrand, type BrandId } from '@/lib/brands'
import { BrandLogo } from './brand-logo'

export function PropositionShell({
  children,
  client,
  number,
  totalPages = 1,
  pageIndex = 1,
  brand = 'vbweb',
}: {
  children: React.ReactNode
  client: string
  number?: string
  totalPages?: number
  pageIndex?: number
  brand?: BrandId
}) {
  const b = getBrand(brand)

  return (
    <div data-brand={b.id} className="flex min-h-dvh flex-col bg-background">
      <main className="flex-1">{children}</main>

      {/* Bandeau marine bas — miroir stylé du header */}
      <footer
        data-pdf="footer"
        className="relative mt-20 overflow-hidden bg-brand-marine text-brand-marine-foreground"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_120%_at_15%_50%,rgba(255,255,255,0.10),transparent_60%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-[linear-gradient(70deg,transparent_43%,rgba(255,255,255,0.04)_43%,rgba(255,255,255,0.04)_45%,transparent_45%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />

        <div className="relative mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-6 sm:px-8 sm:py-7">
          <div className="flex items-center gap-3">
            <BrandLogo brand={b} className="h-10 w-auto opacity-95 sm:h-12" />
            {b.portraits && b.portraits.length > 0 ? (
              <div className="flex -space-x-2">
                {b.portraits.map((src, i) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={src}
                    src={src}
                    alt={`Portrait ${i + 1}`}
                    className="size-10 rounded-full object-cover ring-2 ring-brand-marine sm:size-12"
                    style={{ zIndex: b.portraits!.length - i }}
                  />
                ))}
              </div>
            ) : null}
            <span aria-hidden className="hidden h-8 w-px bg-white/15 sm:inline-block" />
            <p className="hidden text-[11px] tracking-wide text-brand-marine-foreground/75 sm:block">
              &copy; {new Date().getFullYear()} {b.name}
            </p>
          </div>

          <p className="hidden text-[11px] uppercase tracking-[0.18em] text-brand-marine-foreground/70 md:block">
            Document confidentiel · {client}
          </p>

          <div className="flex flex-col items-end gap-0.5 text-right">
            {number ? (
              <p className="font-display text-sm font-semibold tracking-tight">
                {number}
              </p>
            ) : null}
            <p
              data-pdf-page-counter
              className="text-[11px] uppercase tracking-[0.18em] text-brand-marine-foreground/70 tabular-nums"
            >
              Page {pageIndex} / {totalPages}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
