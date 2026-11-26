import type { Course, Enrollment, Module, Quiz, Unit } from '@shared/types'
import { pct } from './progress'

/**
 * LMS rules: what a learner sees, progress and completion, the next unit, quiz scoring.
 * Pure functions over Course and Enrollment; components never re-implement these.
 */

/** Units a learner can open: published units only, in module order. */
export function learnerUnits(course: Course): Unit[] {
  return course.modules.flatMap((m) => m.units.filter((u) => u.published))
}

/** Every unit, drafts included (authoring counts). */
export function allUnits(course: Course): Unit[] {
  return course.modules.flatMap((m) => m.units)
}

export function blockCount(course: Course): number {
  return allUnits(course).reduce((a, u) => a + u.blocks.length, 0)
}

/** Estimated minutes of the published units. */
export function courseMinutes(course: Course): number {
  return learnerUnits(course).reduce((a, u) => a + u.minutes, 0)
}

export function isUnitDone(enr: Enrollment | undefined, unitId: string): boolean {
  return !!enr?.completedUnitIds.includes(unitId)
}

export function isBlockDone(enr: Enrollment | undefined, blockId: string): boolean {
  return !!enr?.completedBlockIds.includes(blockId)
}

/**
 * Course progress: completed published lesson units over all published lesson units, in percent
 * (Home Ready: "Renting 3 of 5 units (60%)"; the final quiz is tracked for the certificate).
 */
export function courseProgress(course: Course, enr: Enrollment | undefined): number {
  const units = learnerUnits(course).filter((u) => u.kind === 'lesson')
  return pct(units.filter((u) => isUnitDone(enr, u.id)).length, units.length)
}

/** Module progress over its published units; `complete` needs at least one unit. */
export function moduleProgress(mod: Module, enr: Enrollment | undefined) {
  const units = mod.units.filter((u) => u.published)
  const done = units.filter((u) => isUnitDone(enr, u.id)).length
  return { done, total: units.length, complete: units.length > 0 && done === units.length }
}

export type CourseState = 'notStarted' | 'inProgress' | 'completed'

export function courseState(course: Course, enr: Enrollment | undefined): CourseState {
  const p = courseProgress(course, enr)
  if (p === 100) return 'completed'
  return enr && (p > 0 || enr.completedBlockIds.length > 0) ? 'inProgress' : 'notStarted'
}

/** The unit to open: first unfinished published unit, else the first unit. */
export function nextUnit(course: Course, enr: Enrollment | undefined): Unit | undefined {
  const units = learnerUnits(course)
  return units.find((u) => !isUnitDone(enr, u.id)) ?? units[0]
}

/** Previous and next published units around `unitId`. */
export function adjacentUnits(course: Course, unitId: string) {
  const units = learnerUnits(course)
  const i = units.findIndex((u) => u.id === unitId)
  return { prev: i > 0 ? units[i - 1] : undefined, next: i >= 0 ? units[i + 1] : undefined }
}

export interface QuizResult {
  correct: number
  total: number
  /** Percent, rounded. */
  score: number
  passed: boolean
}

/** Score answers (question id to option index) against the quiz and its pass mark. */
export function scoreQuiz(quiz: Quiz, answers: Record<string, number>): QuizResult {
  const total = quiz.questions.length
  const correct = quiz.questions.filter((q) => answers[q.id] === q.correct).length
  const score = pct(correct, total)
  return { correct, total, score, passed: total > 0 && score >= quiz.passMark }
}

/** Best quiz score for a unit, or undefined before the first attempt. */
export function bestScore(enr: Enrollment | undefined, unitId: string): number | undefined {
  const scores = (enr?.attempts ?? []).filter((a) => a.unitId === unitId).map((a) => a.score)
  return scores.length ? Math.max(...scores) : undefined
}
