import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { ArrowLeft, BookX } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { adjacentUnits, courseProgress, learnerUnits, nextUnit } from '@/domain/learning'
import { usePageTitle } from '@/hooks/use-page-title'
import { useLocalized } from '@/i18n'
import { setLastUnit } from '@/store/actions'
import { useCourse, useEnrollment, useMe } from '@/store/hooks'
import { CertificateBanner } from '../components/CertificateBanner'
import { CourseMenu } from '../components/CourseMenu'
import { CourseMenuSheet } from '../components/CourseMenuSheet'
import { CourseTopCard } from '../components/CourseTopCard'
import { LessonPanel } from '../components/LessonPanel'
import { PrePostCard } from '../components/PrePostCard'
import { QuizPanel } from '../components/QuizPanel'

/**
 * Course view (playbook D2): opening a course lands here directly. Top card with details and the
 * progress bar, the course menu at the start side (a sheet below lg), the current unit in the main
 * area. The unit lives in the `unit` search param; without it the learner resumes where they were.
 */
export function CourseViewPage() {
  const { t } = useTranslation('learning')
  const { l } = useLocalized()
  // Serves /learn/tracks/$trackId and /learn/tracks/$trackId/$unitId (track slug = course id).
  const params = useParams({ strict: false }) as { trackId?: string; unitId?: string }
  const courseId = params.trackId ?? ''
  const search = { unit: params.unitId }
  const navigate = useNavigate()
  const me = useMe()
  const course = useCourse(courseId)
  const enrollment = useEnrollment(courseId)
  usePageTitle(course ? l(course.title) : t('view.notFoundTitle'))

  const units = course ? learnerUnits(course) : []
  const byId = (id?: string) => units.find((u) => u.id === id)
  const unit =
    byId(search.unit) ??
    byId(enrollment?.lastUnitId) ??
    (course ? nextUnit(course, enrollment) : undefined)
  const visible = course?.status === 'published'

  useEffect(() => {
    if (visible && unit) setLastUnit(me.id, courseId, unit.id)
  }, [visible, unit, me.id, courseId])

  const back = (
    <Link
      to="/learn/tracks"
      className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
    >
      <ArrowLeft className="size-4 rtl-mirror" aria-hidden /> {t('view.back')}
    </Link>
  )

  if (!course || !visible) {
    return (
      <div className="grid gap-6">
        {back}
        <h1 className="sr-only">{t('view.notFoundTitle')}</h1>
        <EmptyState
          icon={BookX}
          title={t('view.notFoundTitle')}
          body={t('view.notFoundBody')}
          action={
            <Button asChild variant="outline" size="sm">
              <Link to="/learn/tracks">{t('view.back')}</Link>
            </Button>
          }
        />
      </div>
    )
  }

  const go = (unitId?: string) =>
    unitId &&
    navigate({ to: '/learn/tracks/$trackId/$unitId', params: { trackId: courseId, unitId } })
  const { prev, next } = unit ? adjacentUnits(course, unit.id) : {}
  const position = unit
    ? t('view.position', { n: units.indexOf(unit) + 1, total: units.length })
    : ''
  const menu = (close?: () => void) => (
    <CourseMenu
      course={course}
      enrollment={enrollment}
      currentUnitId={unit?.id}
      onSelect={(id) => {
        close?.()
        go(id)
      }}
    />
  )

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6">
      {back}
      <CourseTopCard
        course={course}
        now={unit ? l(unit.title) : ''}
        percent={courseProgress(course, enrollment)}
      />
      <CertificateBanner courseId={courseId} />
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="hidden gap-4 lg:sticky lg:top-20 lg:grid">
          {menu()}
          <PrePostCard course={course} enrollment={enrollment} />
        </aside>
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4">
          <CourseMenuSheet position={position}>{(close) => menu(close)}</CourseMenuSheet>
          {!unit ? (
            <EmptyState icon={BookX} title={t('view.emptyTitle')} body={t('view.emptyBody')} />
          ) : unit.kind === 'quiz' ? (
            <QuizPanel
              key={unit.id}
              courseId={courseId}
              unit={unit}
              enrollment={enrollment}
              learnerId={me.id}
            />
          ) : (
            <LessonPanel
              key={unit.id}
              courseId={courseId}
              cover={course.cover}
              unit={unit}
              enrollment={enrollment}
              learnerId={me.id}
              onPrevUnit={prev ? () => go(prev.id) : undefined}
              onNextUnit={next ? () => go(next.id) : undefined}
            />
          )}
          <div className="lg:hidden">
            <PrePostCard course={course} enrollment={enrollment} />
          </div>
        </div>
      </div>
    </div>
  )
}
