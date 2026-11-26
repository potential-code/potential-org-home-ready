import type { Enrollment, PersonaId, Unit } from '@shared/types'
import {
  CheckCircle2,
  ClipboardCheck,
  HelpCircle,
  Play,
  RotateCcw,
  Target,
  Trophy,
  XCircle,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { STAT_TONES, StatCard } from '@/components/shared/StatCard'
import { Button } from '@/components/ui/button'
import { bestScore, isUnitDone, type QuizResult as Result } from '@/domain/learning'
import { submitQuiz } from '@/store/actions'
import { QuizResult } from './QuizResult'
import { QuizRunner } from './QuizRunner'
import { UnitHeader } from './UnitHeader'

type Mode =
  | { kind: 'intro' }
  | { kind: 'run'; n: number }
  | { kind: 'result'; result: Result; answers: Record<string, number> }

/** Quiz unit: attempts, best score, pass mark, questions; then the runner and the scored result. */
export function QuizPanel({
  courseId,
  unit,
  enrollment,
  learnerId,
}: {
  courseId: string
  unit: Unit
  enrollment?: Enrollment
  learnerId: PersonaId
}) {
  const { t } = useTranslation('learning')
  const [mode, setMode] = useState<Mode>({ kind: 'intro' })
  const quiz = unit.quiz
  if (!quiz) return null
  const attempts = (enrollment?.attempts ?? []).filter((a) => a.unitId === unit.id).length
  const best = bestScore(enrollment, unit.id)
  const passed = isUnitDone(enrollment, unit.id)
  const stats = [
    { key: 'attempts', icon: RotateCcw, value: attempts },
    { key: 'best', icon: Trophy, value: best === undefined ? '0%' : `${best}%` },
    { key: 'passMark', icon: Target, value: `${quiz.passMark}%` },
    { key: 'questions', icon: HelpCircle, value: quiz.questions.length },
  ]
  const submit = (answers: Record<string, number>) => {
    const result = submitQuiz(learnerId, courseId, unit.id, answers)
    if (!result) return
    if (result.passed) toast.success(t('quiz.passedToast'))
    setMode({ kind: 'result', result, answers })
  }
  const start = () => setMode({ kind: 'run', n: mode.kind === 'run' ? mode.n + 1 : 1 })
  return (
    <section aria-labelledby="unit-title" className="card grid min-w-0 gap-6 p-5 sm:p-7">
      <UnitHeader unit={unit} />
      {mode.kind === 'run' ? (
        <QuizRunner key={mode.n} quiz={quiz} onSubmit={submit} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {stats.map((s, i) => (
              <StatCard
                key={s.key}
                tone={STAT_TONES[i % STAT_TONES.length]}
                icon={s.icon}
                label={t(`quiz.${s.key}`)}
                value={s.value}
                hint={t(`quiz.${s.key}Hint`)}
                className="h-full"
              />
            ))}
          </div>
          {mode.kind === 'result' ? (
            <QuizResult quiz={quiz} result={mode.result} answers={mode.answers} />
          ) : attempts > 0 ? (
            <p
              role="status"
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${passed ? 'border-success/30 bg-success-soft text-success' : 'border-notice/30 bg-notice-soft text-notice'}`}
            >
              {passed ? (
                <CheckCircle2 className="size-4" aria-hidden />
              ) : (
                <XCircle className="size-4" aria-hidden />
              )}
              {passed ? t('quiz.passedStatus', { best }) : t('quiz.failedStatus', { best })}
            </p>
          ) : null}
          {quiz.questions.length ? (
            <Button className="justify-self-start rounded-full" onClick={start}>
              {attempts > 0 ? <RotateCcw aria-hidden /> : <Play aria-hidden />}
              {attempts > 0 ? t('quiz.retake') : t('quiz.start')}
            </Button>
          ) : (
            <p className="flex items-center gap-2 text-ink-soft">
              <ClipboardCheck className="size-4 text-brand" aria-hidden /> {t('quiz.noQuestions')}
            </p>
          )}
        </>
      )}
    </section>
  )
}
