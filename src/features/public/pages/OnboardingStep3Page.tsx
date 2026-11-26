import { useNavigate } from '@tanstack/react-router'
import { ListChecks } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { EmptyState } from '@/components/shared/EmptyState'
import { Progress } from '@/components/ui/progress'
import { submitPreQuiz } from '@/store/actions/auth'
import { useCourse } from '@/store/hooks'
import { BackButton } from '../components/onboarding/BackButton'
import { NextButton } from '../components/onboarding/NextButton'
import { OnboardingShell } from '../components/onboarding/OnboardingShell'
import { QuizQuestion } from '../components/onboarding/QuizQuestion'
import { useOnboardingLearner } from '../components/onboarding/use-onboarding-learner'

/** Onboarding step 3 "Quick check" (C6.1): the chosen track's 5-question pre-quiz, no pass mark. */
export function OnboardingStep3Page() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { id, onboarding } = useOnboardingLearner()
  const courseId = onboarding?.track === 'B' ? 'buying' : 'renting'
  const quiz = useCourse(courseId)?.preQuiz
  const questions = quiz?.questions ?? []
  const [answers, setAnswers] = useState<Record<string, number>>(onboarding?.preQuiz ?? {})
  const [error, setError] = useState('')
  const count = questions.filter((q) => answers[q.id] !== undefined).length
  const total = questions.length

  const next = () => {
    if (!total) return void navigate({ to: '/onboarding/4' })
    if (count < total) return setError(t('errors.quiz'))
    const score = submitPreQuiz(id, courseId, answers)
    toast.success(t('onboarding.s3.toast', { score }))
    void navigate({ to: '/onboarding/4' })
  }

  return (
    <OnboardingShell
      step={3}
      body={t('onboarding.s3.body')}
      actions={
        <>
          <BackButton to="/onboarding/2" />
          <NextButton onClick={next}>
            {total ? t('onboarding.s3.submit') : t('onboarding.skip')}
          </NextButton>
        </>
      }
    >
      {total ? (
        <>
          <div className="card sticky top-2 z-10 flex items-center gap-4 px-5 py-3">
            <p className="shrink-0 text-sm font-semibold text-ink" aria-live="polite">
              {t('onboarding.s3.answered', { count, total })}
            </p>
            <Progress value={(count / total) * 100} className="h-2" aria-hidden />
          </div>
          <div className="mt-4 grid gap-4">
            {questions.map((q, i) => (
              <QuizQuestion
                key={q.id}
                q={q}
                n={i + 1}
                total={total}
                value={answers[q.id]}
                onChange={(v) => {
                  setAnswers((a) => ({ ...a, [q.id]: v }))
                  setError('')
                }}
              />
            ))}
          </div>
          {error && (
            <p role="alert" className="mt-3 text-sm font-medium text-danger">
              {error}
            </p>
          )}
        </>
      ) : (
        <EmptyState
          icon={ListChecks}
          title={t('onboarding.s3.title')}
          body={t('onboarding.s3.unavailable')}
        />
      )}
    </OnboardingShell>
  )
}
