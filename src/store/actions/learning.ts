import type { Enrollment, PersonaId } from '@shared/types'
import { type QuizResult, scoreQuiz } from '@/domain/learning'
import { certificateEarned, trackProgress } from '@/domain/tracks'
import { now } from '@/lib/clock'
import { type DemoDb, getDb, update } from '../db'
import { withBadges, withNotification, withPoints } from './helpers'

/** Apply a change to one learner's enrolment, creating it on first use (opening a course enrols). */
function withEnrollment(
  db: DemoDb,
  learnerId: PersonaId,
  courseId: string,
  fn: (e: Enrollment) => Enrollment,
): DemoDb {
  const found = db.enrollments.find((e) => e.courseId === courseId && e.learnerId === learnerId)
  const base: Enrollment = found ?? {
    courseId,
    learnerId,
    enrolledAt: now(),
    completedUnitIds: [],
    completedBlockIds: [],
    attempts: [],
  }
  const next = fn(base)
  return {
    ...db,
    enrollments: found
      ? db.enrollments.map((e) => (e === found ? next : e))
      : [...db.enrollments, next],
  }
}

const add = (list: string[], ids: string[]) => [...new Set([...list, ...ids])]

export function enroll(learnerId: PersonaId, courseId: string) {
  update((db) => withEnrollment(db, learnerId, courseId, (e) => e))
}

/** Remember the unit the learner is on (the course view reopens there). */
export function setLastUnit(learnerId: PersonaId, courseId: string, unitId: string) {
  const e = getDb().enrollments.find((x) => x.courseId === courseId && x.learnerId === learnerId)
  if (e?.lastUnitId === unitId) return
  update((db) => withEnrollment(db, learnerId, courseId, (x) => ({ ...x, lastUnitId: unitId })))
}

export function completeBlock(learnerId: PersonaId, courseId: string, blockId: string) {
  update((db) =>
    withEnrollment(db, learnerId, courseId, (e) => ({
      ...e,
      completedBlockIds: add(e.completedBlockIds, [blockId]),
    })),
  )
}

/** Mark a lesson unit complete (and all its blocks). */
export function completeUnit(learnerId: PersonaId, courseId: string, unitId: string) {
  const unit = getDb()
    .courses.find((c) => c.id === courseId)
    ?.modules.flatMap((m) => m.units)
    .find((u) => u.id === unitId)
  const already = getDb().enrollments.some(
    (e) =>
      e.courseId === courseId && e.learnerId === learnerId && e.completedUnitIds.includes(unitId),
  )
  update((db) => {
    const next = withEnrollment(db, learnerId, courseId, (e) => ({
      ...e,
      completedUnitIds: add(e.completedUnitIds, [unitId]),
      completedBlockIds: add(
        e.completedBlockIds,
        (unit?.blocks ?? []).map((b) => b.id),
      ),
    }))
    if (already || !unit) return next
    return afterProgress(
      withPoints(next, learnerId, 'unit', {
        en: `Completed ${unit.code ?? ''} ${unit.title.en}`.trim(),
        ar: `أكملت ${unit.title.ar || unit.title.en}`,
      }),
      learnerId,
      courseId,
      db,
    )
  })
}

/** Sync the directory progress and issue the certificate notice when it is newly earned. */
function afterProgress(db: DemoDb, learnerId: PersonaId, courseId: string, before: DemoDb): DemoDb {
  const course = db.courses.find((c) => c.id === courseId)
  if (!course) return db
  const enr = db.enrollments.find((e) => e.courseId === courseId && e.learnerId === learnerId)
  const prevEnr = before.enrollments.find(
    (e) => e.courseId === courseId && e.learnerId === learnerId,
  )
  const progress = trackProgress(course, enr).pct
  let next: DemoDb = {
    ...db,
    learners: db.learners.map((l) => (l.personaId === learnerId ? { ...l, progress } : l)),
  }
  if (certificateEarned(course, enr) && !certificateEarned(course, prevEnr)) {
    next = {
      ...next,
      notifications: withNotification(
        next,
        learnerId,
        { en: "You're Home Ready: your certificate", ar: 'أنت جاهز للسكن: شهادتك' },
        course.certificateTitle ?? course.title,
        '/learn/achievements',
      ),
    }
  }
  return withBadges(next, learnerId)
}

/** Score a quiz attempt, record it, and complete the unit when it passes. */
export function submitQuiz(
  learnerId: PersonaId,
  courseId: string,
  unitId: string,
  answers: Record<string, number>,
): QuizResult | null {
  const quiz = getDb()
    .courses.find((c) => c.id === courseId)
    ?.modules.flatMap((m) => m.units)
    .find((u) => u.id === unitId)?.quiz
  if (!quiz) return null
  const result = scoreQuiz(quiz, answers)
  update((db) =>
    afterProgress(
      withEnrollment(db, learnerId, courseId, (e) => ({
        ...e,
        attempts: [
          ...e.attempts,
          { unitId, score: result.score, passed: result.passed, at: now() },
        ],
        completedUnitIds: result.passed ? add(e.completedUnitIds, [unitId]) : e.completedUnitIds,
      })),
      learnerId,
      courseId,
      db,
    ),
  )
  return result
}
