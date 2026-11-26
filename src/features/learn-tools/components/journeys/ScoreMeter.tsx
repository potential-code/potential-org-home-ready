import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

/** Score meter 0-100: a bar with the value as text (never colour alone). */
export function ScoreMeter({
  score,
  label,
  className,
  onDark = false,
}: {
  score: number
  label: string
  className?: string
  onDark?: boolean
}) {
  const { t } = useTranslation('journeys')
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-2 text-sm font-semibold">
        <span className={onDark ? 'text-white/85' : 'text-ink-soft'}>{label}</span>
        <span className="tabular-nums">
          {score}{' '}
          <span className={onDark ? 'text-white/80' : 'text-ink-soft'}>{t('result.outOf')}</span>
        </span>
      </div>
      {/* biome-ignore lint/a11y/useSemanticElements: styled meter; native <meter> cannot be themed reliably */}
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
        aria-label={label}
        className={cn(
          'mt-2 h-3 overflow-hidden rounded-full',
          onDark ? 'bg-white/20' : 'bg-tint-100',
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-500',
            onDark ? 'bg-brand-highlight' : 'bg-brand',
          )}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  )
}
