import type { Course, Enrollment, Unit } from '@shared/types'
import { pct } from './progress'

/** Home Ready track rules: lesson progress (5 units) and the certificate rule (C9.1). */

export const CERTIFICATE_PASS_MARK = 70

export function lessonUnits(course: Course): Unit[] {
  return course.modules.flatMap((m) => m.units.filter((u) => u.published && u.kind === 'lesson'))
}

export function postQuizUnit(course: Course): Unit | undefined {
  return course.modules.flatMap((m) => m.units).find((u) => u.kind === 'quiz')
}

export function trackProgress(course: Course, enr: Enrollment | undefined) {
  const units = lessonUnits(course)
  const done = units.filter((u) => enr?.completedUnitIds.includes(u.id)).length
  return { done, total: units.length, pct: pct(done, units.length) }
}

export function bestPostQuizScore(course: Course, enr: Enrollment | undefined): number | null {
  const quiz = postQuizUnit(course)
  const scores = (enr?.attempts ?? []).filter((a) => a.unitId === quiz?.id).map((a) => a.score)
  return scores.length ? Math.max(...scores) : null
}

/** Certificate: all lesson units complete and post-quiz 70% or more. */
export function certificateEarned(course: Course, enr: Enrollment | undefined): boolean {
  const p = trackProgress(course, enr)
  const best = bestPostQuizScore(course, enr)
  return p.total > 0 && p.done === p.total && best !== null && best >= CERTIFICATE_PASS_MARK
}

/** Certificate id shown on the certificate and its QR verification link. */
export function certificateId(courseId: string, learnerId: string): string {
  return `HR-${courseId.slice(0, 3).toUpperCase()}-${learnerId}-2026`
}
