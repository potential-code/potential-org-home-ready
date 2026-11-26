import type { Course } from '@shared/types'
import { Clock, Layers, ListTree } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Motif } from '@/components/brand'
import { courseMinutes, learnerUnits } from '@/domain/learning'
import { useLocalized } from '@/i18n'
import { CourseCover } from './CourseCover'
import { ProgressLine } from './ProgressLine'

/** Course view top card (playbook D2): cover, level, title, summary, meta, current unit, progress. */
export function CourseTopCard({
  course,
  now,
  percent,
}: {
  course: Course
  now: string
  percent: number
}) {
  const { t } = useTranslation('learning')
  const { l } = useLocalized()
  return (
    <section
      aria-labelledby="course-title"
      className="relative overflow-hidden rounded-3xl bg-grad-brand p-5 text-white shadow-lg sm:p-7"
    >
      <Motif variant="banner" className="text-white/[0.12]" />
      <div className="relative grid items-center gap-5 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-7">
        <CourseCover
          course={course}
          className="hidden aspect-video w-full rounded-2xl shadow-md ring-1 ring-white/20 md:block"
        />
        <div className="grid min-w-0 gap-2.5">
          <span className="w-fit rounded-full border border-white/40 px-3 py-0.5 text-xs font-bold tracking-widest uppercase">
            {t(`levels.${course.level}`)}
          </span>
          <h1 id="course-title" className="text-2xl leading-tight text-white sm:text-3xl">
            {l(course.title)}
          </h1>
          <p className="max-w-2xl text-sm text-white/85">{l(course.summary)}</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/85">
            <li className="inline-flex items-center gap-1.5">
              <ListTree className="size-4" aria-hidden />
              {t('meta.modules', { count: course.modules.length })}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Layers className="size-4" aria-hidden />
              {t('meta.units', { count: learnerUnits(course).length })}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden />
              {t('meta.minutes', { count: courseMinutes(course) })}
            </li>
          </ul>
          <p className="truncate text-sm text-white/85">
            {t('view.now')} <span className="font-semibold text-white">{now}</span>
          </p>
          <div className="mt-1 grid gap-1.5">
            <div className="flex items-center justify-between text-xs font-bold tracking-widest uppercase">
              <span className="text-white/85">{t('view.progress')}</span>
              <span className="text-sm tabular-nums" data-testid="course-percent">
                {percent}%
              </span>
            </div>
            <ProgressLine value={percent} label={t('view.progressLabel')} onDark />
          </div>
        </div>
      </div>
    </section>
  )
}
