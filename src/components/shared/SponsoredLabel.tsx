import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

/**
 * "Sponsored" / "مُموَّل" label (brief C3): amber-cream background, brown text, always at the
 * top-start of a sponsored slot. Kept visible on every sponsored card by design (Gate 1 answer 5).
 */
export function SponsoredLabel({ className }: { className?: string }) {
  const { t } = useTranslation()
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-sponsor-soft px-2.5 py-1 text-xs leading-none font-bold tracking-wide text-sponsor-ink ring-1 ring-sponsor-ink/15',
        className,
      )}
    >
      {t('sponsored')}
    </span>
  )
}
