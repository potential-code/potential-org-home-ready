import type { Question } from '@shared/types'
import { useTranslation } from 'react-i18next'
import { useLocalized } from '@/i18n'
import { ChoiceCard } from './ChoiceCard'

const LETTERS = ['A', 'B', 'C', 'D', 'E']

/** One pre-quiz question: prompt and its options as selectable cards with a quiet letter. */
export function QuizQuestion({
  q,
  n,
  total,
  value,
  onChange,
}: {
  q: Question
  n: number
  total: number
  value: number | undefined
  onChange: (i: number) => void
}) {
  const { t } = useTranslation('auth')
  const { l, isPlaceholder } = useLocalized()
  const id = `pq-${q.id}`
  return (
    <fieldset className="card p-5 sm:p-6">
      <legend className="sr-only">{l(q.prompt)}</legend>
      <p className="text-xs font-bold tracking-widest text-brand uppercase">
        {t('onboarding.s3.question', { n, total })}
      </p>
      <h2 id={`${id}-label`} className="mt-1.5 text-lg leading-snug">
        {l(q.prompt)}
      </h2>
      {isPlaceholder(q.prompt) && (
        <p className="mt-1 text-xs text-ink-soft">{t('common:arabicPlaceholder')}</p>
      )}
      <div role="radiogroup" aria-labelledby={`${id}-label`} className="mt-4 grid gap-2.5">
        {q.options.map((o, i) => (
          <ChoiceCard key={l(o)} selected={value === i} onSelect={() => onChange(i)}>
            <span className="flex items-start gap-3">
              <span
                className={value === i ? 'font-bold text-white/80' : 'font-bold text-brand'}
                aria-hidden
              >
                {LETTERS[i]}
              </span>
              <span className="font-medium">{l(o)}</span>
            </span>
          </ChoiceCard>
        ))}
      </div>
    </fieldset>
  )
}
