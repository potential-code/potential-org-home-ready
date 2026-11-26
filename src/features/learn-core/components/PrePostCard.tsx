import type { Course, Enrollment } from '@shared/types'
import { ClipboardList } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { bestPostQuizScore, CERTIFICATE_PASS_MARK } from '@/domain/tracks'
import { submitPreQuiz } from '@/store/actions'
import { useMe, useOnboarding } from '@/store/hooks'
import { QuizRunner } from './QuizRunner'

/** Pre-quiz vs final quiz (C9): the score before the track, the best final score and the pass mark. */
export function PrePostCard({ course, enrollment }: { course: Course; enrollment?: Enrollment }) {
  const { t } = useTranslation('learning')
  const me = useMe()
  const onboarding = useOnboarding()
  const [open, setOpen] = useState(false)
  const [run, setRun] = useState(0)
  const pre = onboarding?.preQuizScore
  const post = bestPostQuizScore(course, enrollment)
  const cells = [
    { k: 'pre', v: pre === undefined ? '–' : `${pre}%` },
    { k: 'post', v: post === null ? '–' : `${post}%` },
    { k: 'pass', v: `${CERTIFICATE_PASS_MARK}%` },
  ]
  return (
    <section aria-labelledby="prepost-title" className="card grid gap-3 p-5">
      <h2 id="prepost-title" className="flex items-center gap-2 text-base">
        <ClipboardList className="size-5 text-brand" aria-hidden /> {t('prepost.title')}
      </h2>
      <dl className="grid grid-cols-3 gap-2 text-center">
        {cells.map((c) => (
          <div key={c.k} className="rounded-xl bg-tint-50 px-2 py-2.5">
            <dt className="text-xs font-semibold text-ink-soft">{t(`prepost.${c.k}`)}</dt>
            <dd className="text-lg font-bold text-ink">{c.v}</dd>
          </div>
        ))}
      </dl>
      <p className="text-sm text-ink-soft">
        {post !== null && pre !== undefined
          ? t('prepost.gain', { n: post - pre })
          : t('prepost.hint')}
      </p>
      {course.preQuiz && (
        <Button
          variant="outline"
          size="sm"
          className="justify-self-start"
          onClick={() => {
            setRun(run + 1)
            setOpen(true)
          }}
        >
          {pre === undefined ? t('prepost.take') : t('prepost.retake')}
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('prepost.dialogTitle')}</DialogTitle>
            <DialogDescription>{t('prepost.dialogBody')}</DialogDescription>
          </DialogHeader>
          {course.preQuiz && (
            <QuizRunner
              key={run}
              quiz={course.preQuiz}
              onSubmit={(answers) => {
                const score = submitPreQuiz(me.id, course.id, answers)
                setOpen(false)
                toast.success(t('prepost.saved', { score }))
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
