import config from '@config'
import { useTranslation } from 'react-i18next'
import { useLocalized } from '@/i18n'
import { asset } from '@/lib/asset'
import { cn } from '@/lib/utils'

/**
 * Home Ready lockup. Only a WHITE Potential.org logo exists (public/brand/potential-org-white.svg),
 * so the logo image appears on dark bands only (`variant="white"`: header band, footer, sidebar,
 * auth panel), followed by the programme wordmark in Plus Jakarta Sans Bold. On light surfaces
 * (`variant="brand"`) the lockup is the wordmark plus "by Potential.org" set in text, never the image.
 * The SVG keeps its own aspect ratio (height-driven, width auto); it is never squeezed.
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
  const { t } = useTranslation()
  const { l } = useLocalized()
  const name = l(config.title)
  if (variant === 'white' && stacked)
    return (
      <span className={cn('inline-flex flex-col items-start gap-1.5 select-none', className)}>
        <span className="flex h-7 items-center">
          <img
            src={asset('brand/potential-org-white.svg')}
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
          src={asset('brand/potential-org-white.svg')}
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
    <span className={cn('inline-flex h-7 items-baseline gap-1.5 select-none', className)}>
      <span className="text-lg leading-none font-bold tracking-tight whitespace-nowrap text-brand-deep">
        {name}
      </span>
      <span
        className={cn(
          'text-xs leading-none font-bold whitespace-nowrap text-ink-soft',
          compact && 'sr-only',
        )}
      >
        {t('byPotential')}
      </span>
    </span>
  )
}
