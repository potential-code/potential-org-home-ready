import { describe, expect, test } from 'bun:test'
import type { Journey } from '@shared/types'
import { CHECKLIST_TEMPLATES } from './checklists'
import { AISHA_ANSWERS, JOURNEY_BY_ID, JOURNEYS, ROHAN_ANSWERS } from './journeys'

const score = (j: Journey, answers: Record<string, string>) =>
  j.steps.reduce((sum, s) => sum + (s.options.find((o) => o.id === answers[s.id])?.points ?? 0), 0)

describe('journeys', () => {
  test('best path scores 100', () => {
    for (const j of JOURNEYS) {
      expect(j.steps).toHaveLength(5)
      const best = j.steps.reduce((sum, s) => sum + Math.max(...s.options.map((o) => o.points)), 0)
      expect(best).toBe(100)
    }
  })
  test('seeded answers give 78 and 71', () => {
    expect(score(JOURNEY_BY_ID['renew-or-move'], AISHA_ANSWERS)).toBe(78)
    expect(score(JOURNEY_BY_ID['rent-or-buy'], ROHAN_ANSWERS)).toBe(71)
  })
  test('journey 1 step 3 uses the register figures', () => {
    const info = JOURNEY_BY_ID['renew-or-move'].steps[2]?.info?.map((x) => x.en).join(' ') ?? ''
    expect(info).toContain('93,377.75')
    expect(info).toContain('99,750')
  })
})

describe('checklist templates', () => {
  test('item counts per C11.6 and unique ids', () => {
    const counts = Object.fromEntries(CHECKLIST_TEMPLATES.map((c) => [c.id, c.items.length]))
    expect(counts).toEqual({
      viewing: 18,
      renewal: 9,
      'move-in': 12,
      'move-out': 10,
      'due-diligence': 12,
    })
    const ids = CHECKLIST_TEMPLATES.flatMap((c) => c.items.map((i) => i.id))
    expect(new Set(ids).size).toBe(ids.length)
  })
})
