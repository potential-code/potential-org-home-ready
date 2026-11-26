import type { Block } from '@shared/types'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocalized } from '@/i18n'
import { cn } from '@/lib/utils'
import { BLOCK_ICON } from '../config'
import { ProgressLine } from './ProgressLine'

/** Step nav for a unit's learning blocks: whole selectable tabs, a done check, step count. */
export function BlockSteps({
  blocks,
  index,
  doneIds,
  onSelect,
}: {
  blocks: Block[]
  index: number
  doneIds: string[]
  onSelect: (i: number) => void
}) {
  const { t } = useTranslation('learning')
  const { l } = useLocalized()
  return (
    <nav aria-label={t('player.steps')} className="grid gap-3">
      <div className="flex items-center gap-3">
        <ProgressLine
          value={Math.round(((index + 1) / blocks.length) * 100)}
          label={t('player.steps')}
          className="flex-1"
        />
        <span className="shrink-0 text-xs font-semibold text-ink-soft tabular-nums">
          {t('player.step', { n: index + 1, total: blocks.length })}
        </span>
      </div>
      <ol className="flex flex-wrap gap-2">
        {blocks.map((b, i) => {
          const Icon = BLOCK_ICON[b.kind]
          const current = i === index
          const done = doneIds.includes(b.id)
          return (
            <li key={b.id}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={current ? 'step' : undefined}
                title={l(b.title)}
                className={cn(
                  'inline-flex h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-semibold transition-colors',
                  current
                    ? 'border-brand bg-brand text-white shadow-md'
                    : 'border-border bg-white text-ink hover:border-brand hover:text-brand',
                )}
              >
                <Icon className="size-4" aria-hidden />
                {t(`blockKinds.${b.kind}`)}
                {done && (
                  <Check
                    className={cn('size-4', current ? 'text-white' : 'text-success')}
                    strokeWidth={3}
                    aria-label={t('view.done')}
                  />
                )}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
