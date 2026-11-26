import { describe, expect, test } from 'bun:test'
import { SEED_COURSES, SEED_ENROLLMENTS } from '@/data/tracks'
import { courseProgress, learnerUnits, nextUnit, scoreQuiz } from './learning'
import { certificateEarned, trackProgress } from './tracks'

const renting = SEED_COURSES.find((c) => c.id === 'renting')
const buying = SEED_COURSES.find((c) => c.id === 'buying')
const enr = (learnerId: string, courseId: string) =>
  SEED_ENROLLMENTS.find((e) => e.learnerId === learnerId && e.courseId === courseId)

describe('Home Ready tracks seed', () => {
  test('two tracks, 5 lessons + final quiz each; pre 5 and post 10 questions', () => {
    for (const c of [renting, buying]) {
      if (!c) throw new Error('track missing')
      const units = learnerUnits(c)
      expect(units.filter((u) => u.kind === 'lesson')).toHaveLength(5)
      expect(units.find((u) => u.kind === 'quiz')?.quiz?.questions).toHaveLength(10)
      expect(units.find((u) => u.kind === 'quiz')?.quiz?.passMark).toBe(70)
      expect(c.preQuiz?.questions).toHaveLength(5)
    }
  })
  test('Aisha: Renting 3 of 5 (60%), Rohan: Buying 2 of 5 (40%)', () => {
    if (!renting || !buying) throw new Error('track missing')
    expect(trackProgress(renting, enr('L01', 'renting'))).toEqual({ done: 3, total: 5, pct: 60 })
    expect(courseProgress(renting, enr('L01', 'renting'))).toBe(60)
    expect(trackProgress(buying, enr('L02', 'buying')).pct).toBe(40)
    expect(nextUnit(renting, enr('L01', 'renting'))?.id).toBe('A4')
    expect(certificateEarned(renting, enr('L01', 'renting'))).toBe(false)
  })
  test('every lesson unit carries a check date, sources and a "Your action"', () => {
    for (const c of SEED_COURSES)
      for (const u of learnerUnits(c).filter((x) => x.kind === 'lesson')) {
        expect(u.checkedOn).toBe('2026-11-25')
        expect(u.sourceIds?.length).toBeGreaterThan(0)
        expect(u.action).toBeDefined()
        expect(u.blocks.find((b) => b.kind === 'video')?.duration).toMatch(/^\d:\d\d$/)
      }
  })
  test('quiz scoring: all correct passes', () => {
    const quiz = renting && learnerUnits(renting).find((u) => u.kind === 'quiz')?.quiz
    if (!quiz) throw new Error('quiz missing')
    const all = Object.fromEntries(quiz.questions.map((q) => [q.id, q.correct]))
    expect(scoreQuiz(quiz, all)).toMatchObject({ score: 100, passed: true })
  })
})
