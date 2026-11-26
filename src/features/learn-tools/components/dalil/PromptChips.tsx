import { useTranslation } from 'react-i18next'
import { DALIL_ANSWERS } from '@/data/dalil'
import { useLocalized } from '@/i18n'
import { cn } from '@/lib/utils'

interface PromptChipsProps {
  onPick: (text: string) => void
  disabled?: boolean
  compact?: boolean
}

/** The five suggested questions, one per scripted answer. */
export function PromptChips({ onPick, disabled, compact }: PromptChipsProps) {
  const { t } = useTranslation('dalil')
  const { l } = useLocalized()
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-ink-soft">{t('chat.suggested')}</p>
      <ul className={cn('flex gap-2', compact ? '-mx-1 overflow-x-auto px-1 pb-1' : 'flex-wrap')}>
        {DALIL_ANSWERS.map((a) => (
          <li key={a.id} className={cn(compact ? 'shrink-0' : 'max-w-full')}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onPick(l(a.prompt))}
              className={cn(
                'rounded-full border border-brand/25 bg-white px-3.5 py-2 text-start text-sm font-medium text-brand-deep shadow-sm transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md focus-visible:ring-4 focus-visible:ring-brand-highlight/60 focus-visible:outline-none disabled:opacity-50',
                compact && 'whitespace-nowrap',
              )}
            >
              {l(a.prompt)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
