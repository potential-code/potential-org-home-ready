import { useTranslation } from 'react-i18next'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

const DELAYS = ['[animation-delay:0ms]', '[animation-delay:150ms]', '[animation-delay:300ms]']

/** Three dots while Dalil "types"; static dots with reduced motion. */
export function TypingIndicator() {
  const { t } = useTranslation('dalil')
  const reduced = useReducedMotion()
  return (
    <div className="flex items-center gap-2 text-sm text-ink-soft" role="status">
      <span className="inline-flex items-center gap-1 rounded-2xl rounded-ss-sm bg-tint-50 px-4 py-3 shadow-sm ring-1 ring-border/70">
        {DELAYS.map((d) => (
          <span
            key={d}
            className={cn('size-2 rounded-full bg-brand', !reduced && ['animate-bounce', d])}
            aria-hidden
          />
        ))}
      </span>
      <span className="sr-only">{t('chat.typing')}</span>
    </div>
  )
}
