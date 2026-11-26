import type { Quiz } from '@shared/types'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useLocalized } from '@/i18n'
import { ChoiceCards } from './ChoiceCards'
import { ProgressLine } from './ProgressLine'

/** One question at a time with a progress bar; submits every answer at the end. */
export function QuizRunner({
  quiz,
  onSubmit,
}: {
  quiz: Quiz
  onSubmit: (answers: Record<string, number>) => void
}) {
  const { t } = useTranslation('learning')
  const { l } = useLocalized()
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const q = quiz.questions[index]
  if (!q) return null
  const total = quiz.questions.length
  const last = index === total - 1
  return (
    <div className="grid gap-5">
      <div className="grid gap-1.5">
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-ink">
            {t('quiz.question', { n: index + 1, total })}
          </span>
          <span className="text-ink-soft">
            {t('quiz.passMark')}: {quiz.passMark}%
          </span>
        </div>
        <ProgressLine
          value={Math.round(((index + 1) / total) * 100)}
          label={t('quiz.question', { n: index + 1, total })}
        />
      </div>
      <ChoiceCards
        key={q.id}
        legend={l(q.prompt)}
        hint={t('player.chooseAnswer')}
        options={q.options.map((o) => l(o))}
        value={answers[q.id]}
        onChange={(i) => setAnswers((a) => ({ ...a, [q.id]: i }))}
        name={q.id}
      />
      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" disabled={index === 0} onClick={() => setIndex(index - 1)}>
          <ArrowLeft className="rtl-mirror" aria-hidden /> {t('quiz.previous')}
        </Button>
        {last ? (
          <Button
            className="rounded-full"
            disabled={Object.keys(answers).length < total}
            onClick={() => onSubmit(answers)}
          >
            {t('quiz.submit')}
          </Button>
        ) : (
          <Button disabled={answers[q.id] === undefined} onClick={() => setIndex(index + 1)}>
            {t('quiz.next')} <ArrowRight className="rtl-mirror" aria-hidden />
          </Button>
        )}
      </div>
    </div>
  )
}
