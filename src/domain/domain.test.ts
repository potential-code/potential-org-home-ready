import { describe, expect, test } from 'bun:test'
import type { ActivityEntry, Course, Enrollment, Journey } from '@shared/types'
import { KPI } from '@/data/figures'
import { POINTS, qualifyingBadges, totalPoints } from './gamification'
import { journeyScore, maxJourneyScore } from './journeys'
import { liveKpis, ZERO_DELTA } from './kpi'
import { pct } from './progress'
import { certificateEarned, trackProgress } from './tracks'

const Lz = (en: string) => ({ en, ar: en })

describe('progress', () => {
  test('pct', () => {
    expect(pct(3, 5)).toBe(60)
    expect(pct(1, 0)).toBe(0)
  })
})

describe('KPI helpers match C13/C15 exactly', () => {
  const k = liveKpis()
  test('pilot values', () => {
    expect(k.joined).toBe(1240)
    expect(k.firstUsefulAction).toBe(672)
    expect(k.k3Pct).toBe(54)
    expect(k.k4Pct).toBe(27)
    expect(k.k1Pct).toBe(85)
    expect(k.totalSaves).toBe(3915)
    expect(k.certificatesA + k.certificatesB).toBe(k.certificates)
    expect(k.k2ClaimsPct).toBe(100)
    expect(KPI.sponsor.impressions).toBe(18420)
  })
  test('live demo actions add on top', () => {
    const d = liveKpis({ ...ZERO_DELTA, joined: 1, checklistsSaved: 2 })
    expect(d.joined).toBe(1241)
    expect(d.totalSaves).toBe(3917)
  })
})

describe('points and badges', () => {
  test('ledger sums with C11.5 points', () => {
    const e = (action: ActivityEntry['action']): ActivityEntry => ({
      id: action,
      learnerId: 'L01',
      action,
      label: Lz(action),
      at: '2026-11-20',
    })
    expect(totalPoints([e('unit'), e('journey'), e('reminder')])).toBe(
      POINTS.unit + POINTS.journey + POINTS.reminder,
    )
  })
  test('badge rules', () => {
    const b = qualifyingBadges({
      usefulActions: 1,
      trueCostSaved: true,
      rentBuySaved: false,
      checklistPct: { viewing: 80 },
      hasChecklist: (id) => id === 'renewal',
      completedUnits: ['A4'],
      bestJourneyScore: 78,
      certificates: 0,
    })
    expect(b).toEqual([
      'first-step',
      'budget-builder',
      'viewing-pro',
      'contract-ready',
      'decision-maker',
    ])
  })
})

describe('journey scoring', () => {
  const j = {
    steps: [
      {
        id: 's1',
        options: [
          { id: 'a', points: 20 },
          { id: 'b', points: 5 },
        ],
      },
      {
        id: 's2',
        options: [
          { id: 'c', points: 30 },
          { id: 'd', points: 0 },
        ],
      },
    ],
  } as unknown as Journey
  test('sum of chosen points; max = best path', () => {
    expect(journeyScore(j, { s1: 'b', s2: 'c' })).toBe(35)
    expect(maxJourneyScore(j)).toBe(50)
  })
})

describe('track progress and certificate', () => {
  const units = ['A1', 'A2', 'A3', 'A4', 'A5'].map((id) => ({
    id,
    kind: 'lesson',
    published: true,
  }))
  const course = {
    id: 'renting',
    modules: [{ units: [...units, { id: 'AQ', kind: 'quiz', published: true }] }],
  } as unknown as Course
  const enr = (done: string[], score?: number): Enrollment => ({
    courseId: 'renting',
    learnerId: 'L01',
    enrolledAt: '',
    completedUnitIds: done,
    completedBlockIds: [],
    attempts: score === undefined ? [] : [{ unitId: 'AQ', score, passed: score >= 70, at: '' }],
  })
  test('3 of 5 = 60%', () => {
    expect(trackProgress(course, enr(['A1', 'A2', 'A3']))).toEqual({ done: 3, total: 5, pct: 60 })
  })
  test('certificate needs 5/5 and post-quiz >= 70', () => {
    const all = ['A1', 'A2', 'A3', 'A4', 'A5']
    expect(certificateEarned(course, enr(all, 70))).toBe(true)
    expect(certificateEarned(course, enr(all, 60))).toBe(false)
    expect(certificateEarned(course, enr(['A1'], 100))).toBe(false)
  })
})
