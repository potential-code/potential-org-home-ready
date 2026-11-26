import config from '@config'
import { useLocalized } from '@/i18n'
import { asset } from '@/lib/asset'
import { cn } from '@/lib/utils'

/**
 * Home Ready lockup with the official Potential.org logo (public/brand/potential/, from Rawzaba's
 * logo set, 26 Nov 2026). Dark bands (`variant="white"`: header band, footer, sidebar, auth panel)
 * use the white logo; light surfaces (`variant="brand"`) use the coloured primary logo. Each is
 * followed by the programme wordmark. SVGs keep their aspect ratio (height-driven); never squeezed.
 */
export function Logo({
  variant = 'brand',
  compact = false,
  stacked = false,
  className,
}: {
  variant?: 'brand' | 'white'
  /** Logo image only (white) or wordmark only (brand); the name stays as accessible text. */
  compact?: boolean
  /** White lockup with the wordmark under the logo, for narrow dark slots (sidebar, menu sheet). */
  stacked?: boolean
  className?: string
}) {
  const { l } = useLocalized()
  const name = l(config.title)
  if (variant === 'white' && stacked)
    return (
      <span className={cn('inline-flex flex-col items-start gap-1.5 select-none', className)}>
        <span className="flex h-7 items-center">
          <img
            src={asset('brand/potential/potential-org-white.svg')}
            alt="Potential.org"
            className="-ms-1.5 h-[135%] w-auto max-w-none shrink-0"
          />
        </span>
        <span className="text-[1.05rem] leading-none font-bold tracking-tight whitespace-nowrap text-white">
          {name}
        </span>
      </span>
    )
  if (variant === 'white')
    return (
      <span className={cn('inline-flex h-8 items-center gap-3 select-none', className)}>
        {/* The SVG has ~18% built-in clear space top and bottom: render it taller than the row so
            the wordmark ink matches the row height; flex centring keeps it aligned. */}
        <img
          src={asset('brand/potential/potential-org-white.svg')}
          alt="Potential.org"
          className="h-[135%] w-auto max-w-none shrink-0"
        />
        <span
          className={cn('h-[62%] w-px shrink-0 bg-white/40', compact && 'hidden')}
          aria-hidden
        />
        <span
          className={cn(
            'text-[1.05rem] leading-none font-bold tracking-tight whitespace-nowrap text-white',
            compact && 'sr-only',
          )}
        >
          {name}
        </span>
      </span>
    )
  return (
    <span className={cn('inline-flex h-7 items-center gap-2.5 select-none', className)}>
      <img
        src={asset('brand/potential/potential-org-primary.svg')}
        alt="Potential.org"
        className="h-[135%] w-auto max-w-none shrink-0"
      />
      <span className={cn('h-[62%] w-px shrink-0 bg-ink/20', compact && 'hidden')} aria-hidden />
      <span
        className={cn(
          'text-[1.05rem] leading-none font-bold tracking-tight whitespace-nowrap text-brand-deep',
          compact && 'sr-only',
        )}
      >
        {name}
      </span>
    </span>
  )
}
