import type { Course, Enrollment } from '@shared/types'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Clock, Layers } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { courseMinutes, courseProgress, courseState, learnerUnits } from '@/domain/learning'
import { useLocalized } from '@/i18n'
import { STATE_TONE } from '../config'
import { CourseCover } from './CourseCover'
import { ProgressLine } from './ProgressLine'

/** Catalogue card: cover, meta, title, summary, progress and one action. */
export function CourseCard({ course, enrollment }: { course: Course; enrollment?: Enrollment }) {
  const { t } = useTranslation('learning')
  const { l, isPlaceholder } = useLocalized()
  const state = courseState(course, enrollment)
  const progress = courseProgress(course, enrollment)
  const action =
    state === 'completed'
      ? t('catalogue.review')
      : state === 'inProgress'
        ? t('catalogue.continue')
        : t('catalogue.start')
  return (
    <article className="card card-hover flex h-full flex-col overflow-hidden">
      <CourseCover course={course} className="h-36" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink-soft">
          <StatusBadge tone="brand">{t(`levels.${course.level}`)}</StatusBadge>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5 text-brand" aria-hidden />
            {t('meta.minutes', { count: courseMinutes(course) })}
          </span>
          <span className="inline-flex items-center gap-1">
            <Layers className="size-3.5 text-brand" aria-hidden />
            {t('meta.units', { count: learnerUnits(course).length })}
          </span>
        </div>
        <h2 className="text-lg leading-snug">{l(course.title)}</h2>
        <p className="line-clamp-2 text-sm text-ink-soft">{l(course.summary)}</p>
        {isPlaceholder(course.summary) && (
          <span className="text-xs text-ink-soft">{t('common:arabicPlaceholder')}</span>
        )}
        <div className="mt-auto space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs">
            <StatusBadge tone={STATE_TONE[state]}>{t(`states.${state}`)}</StatusBadge>
            <span className="font-semibold text-ink tabular-nums">
              {t('meta.percentComplete', { n: progress })}
            </span>
          </div>
          <ProgressLine value={progress} label={t('view.progressLabel')} />
        </div>
        <Button asChild className="mt-2 w-full rounded-full">
          <Link
            to="/learn/tracks/$trackId"
            params={{ trackId: course.id }}
            aria-label={t('catalogue.openCourse', { action, title: l(course.title) })}
          >
            {action}
            <ArrowRight className="rtl-mirror" aria-hidden />
          </Link>
        </Button>
      </div>
    </article>
  )
}
