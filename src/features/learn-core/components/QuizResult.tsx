import type { Quiz } from '@shared/types'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { QuizResult as Result } from '@/domain/learning'
import { useLocalized } from '@/i18n'
import { cn } from '@/lib/utils'

/** Score banner plus a per-question review with the correct answer and explanation. */
export function QuizResult({
  quiz,
  result,
  answers,
}: {
  quiz: Quiz
  result: Result
  answers: Record<string, number>
}) {
  const { t } = useTranslation('learning')
  const { l } = useLocalized()
  return (
    <div className="grid gap-5">
      <div
        role="status"
        className={cn(
          'rounded-2xl border p-5',
          result.passed ? 'border-success/30 bg-success-soft' : 'border-notice/30 bg-notice-soft',
        )}
      >
        <p className={cn('text-xl font-bold', result.passed ? 'text-success' : 'text-notice')}>
          {result.passed
            ? t('quiz.passed', { score: result.score })
            : t('quiz.failed', { score: result.score })}
        </p>
        <p className="text-sm text-ink">
          {t('quiz.resultBody', {
            correct: result.correct,
            total: result.total,
            pass: quiz.passMark,
          })}
        </p>
      </div>
      <h3 className="text-lg">{t('quiz.review')}</h3>
      <ol className="grid gap-3">
        {quiz.questions.map((q, i) => {
          const picked = answers[q.id]
          const right = picked === q.correct
          return (
            <li key={q.id} className="card p-4">
              <p className="flex items-start gap-2 font-semibold text-ink">
                {right ? (
                  <CheckCircle2
                    className="mt-0.5 size-5 shrink-0 text-success"
                    aria-label={t('player.correct')}
                  />
                ) : (
                  <XCircle
                    className="mt-0.5 size-5 shrink-0 text-danger"
                    aria-label={t('quiz.noAnswer')}
                  />
                )}
                <span>
                  {i + 1}. {l(q.prompt)}
                </span>
              </p>
              <p className="mt-2 ps-7 text-sm text-ink">
                {t('quiz.yourAnswer', {
                  answer: picked === undefined ? t('quiz.noAnswer') : l(q.options[picked]),
                })}
              </p>
              {!right && (
                <p className="ps-7 text-sm text-ink">
                  {t('quiz.correctAnswer', { answer: l(q.options[q.correct]) })}
                </p>
              )}
              {q.explanation && (
                <p className="mt-1 ps-7 text-sm text-ink-soft">{l(q.explanation)}</p>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
