import type { Course } from '@shared/types'
import { Link } from '@tanstack/react-router'
import { CheckCircle2, Circle, Flag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { trackProgress } from '@/domain/tracks'
import { useLocalized } from '@/i18n'
import { useEnrollment } from '@/store/hooks'
import { MILESTONES } from '../../home-config'
import { ProgressLine } from '../ProgressLine'

/** Milestones at 20, 60 and 100% of one track's lessons (C11.5). */
export function TrackMilestones({ course }: { course: Course }) {
  const { t } = useTranslation('learn')
  const { l } = useLocalized()
  const enr = useEnrollment(course.id)
  const p = trackProgress(course, enr)
  return (
    <article className="card grid gap-4 p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="flex items-center gap-2 text-base">
          <Flag className="size-5 text-brand" aria-hidden /> {l(course.title)}
        </h3>
        <Link
          to="/learn/tracks/$trackId"
          params={{ trackId: course.id }}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-brand hover:underline"
        >
          {t('ach.milestones.open')}
        </Link>
      </div>
      <ProgressLine
        value={p.pct}
        label={t('ach.milestones.progress', { title: l(course.title), pct: p.pct })}
      />
      <p className="text-sm text-ink-soft">
        {t('ach.milestones.units', { done: p.done, total: p.total, pct: p.pct })}
      </p>
      <ol className="grid grid-cols-3 gap-2">
        {MILESTONES.map((m) => {
          const hit = p.pct >= m
          return (
            <li
              key={m}
              className={`flex flex-col items-center gap-1 rounded-xl p-3 text-center text-sm ${hit ? 'bg-brand text-white' : 'bg-tint-50 text-ink'}`}
            >
              {hit ? (
                <CheckCircle2 className="size-5" aria-hidden />
              ) : (
                <Circle className="size-5 text-ink-soft" aria-hidden />
              )}
              <span className="text-lg font-bold">{m}%</span>
              <span className={hit ? 'text-white/85' : 'text-ink-soft'}>
                {hit ? t('ach.milestones.reached') : t('ach.milestones.notYet')}
              </span>
            </li>
          )
        })}
      </ol>
    </article>
  )
}
