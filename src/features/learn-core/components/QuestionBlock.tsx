import type { Question } from '@shared/types'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useLocalized } from '@/i18n'
import { cn } from '@/lib/utils'
import { ChoiceCards } from './ChoiceCards'

/** Practice question inside a unit: choose, check, see feedback. Not scored. */
export function QuestionBlock({
  question,
  onAnswered,
}: {
  question: Question
  onAnswered: () => void
}) {
  const { t } = useTranslation('learning')
  const { l } = useLocalized()
  const [choice, setChoice] = useState<number | undefined>()
  const [checked, setChecked] = useState(false)
  const right = choice === question.correct
  return (
    <div className="grid gap-4">
      <ChoiceCards
        legend={l(question.prompt)}
        hint={t('player.chooseAnswer')}
        options={question.options.map((o) => l(o))}
        value={choice}
        onChange={(i) => {
          setChoice(i)
          setChecked(false)
        }}
        name={question.id}
      />
      {checked ? (
        <div
          role="status"
          className={cn(
            'flex items-start gap-2 rounded-xl border px-4 py-3 text-sm',
            right
              ? 'border-success/30 bg-success-soft text-success'
              : 'border-notice/30 bg-notice-soft text-notice',
          )}
        >
          {right ? (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
          ) : (
            <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          )}
          <span>
            {right
              ? t('player.correct')
              : t('player.incorrect', { answer: l(question.options[question.correct]) })}{' '}
            {question.explanation ? l(question.explanation) : null}
          </span>
        </div>
      ) : null}
      <Button
        className="justify-self-start rounded-full"
        disabled={choice === undefined}
        onClick={() => {
          setChecked(true)
          onAnswered()
        }}
      >
        {checked && !right ? t('player.tryAgain') : t('player.check')}
      </Button>
    </div>
  )
}
