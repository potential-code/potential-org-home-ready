import { describe, expect, test } from 'bun:test'
import config from '@config'
import { KPI } from '@/data/figures'
import { totalPoints } from '@/domain/gamification'
import { liveKpis } from '@/domain/kpi'
import {
  addReminder,
  answerJourney,
  approveReview,
  completeUnit,
  createChecklist,
  finishJourney,
  givePartnerConsent,
  publishContent,
  registerLearner,
  saveCalcResult,
  saveJourneyChecklist,
  setPlacementStatus,
  signInWithCredentials,
  startJourney,
  submitQuiz,
  toggleChecklistItem,
  withdrawPartnerConsent,
} from './actions'
import { getDb, resetDemo } from './db'

const pointsOf = (id: string) => totalPoints(getDb().activity.filter((a) => a.learnerId === id))

describe('seed matches the brief (C8.1)', () => {
  test('Aisha and Rohan', () => {
    resetDemo()
    const db = getDb()
    const aisha = db.checklists.filter((c) => c.learnerId === 'L01')
    expect(aisha.map((c) => c.ticked.length)).toEqual([14, 5, 0])
    expect(db.calcResults.filter((r) => r.learnerId === 'L01')).toHaveLength(2)
    expect(pointsOf('L01')).toBe(340)
    expect(db.badges.filter((b) => b.learnerId === 'L01')).toHaveLength(3)
    expect(db.journeyRuns.find((r) => r.learnerId === 'L01')?.score).toBe(78)
    expect(db.journeyRuns.find((r) => r.learnerId === 'L02')?.score).toBe(71)
    expect(db.checklists.find((c) => c.id === 'CL-R1')?.ticked).toHaveLength(3)
    expect(db.calcResults.find((r) => r.id === 'CR-R1')?.summary.en).toContain('year 3')
    expect(db.shortlist).toHaveLength(3)
    expect(db.learners).toHaveLength(12)
    expect(db.reviews).toHaveLength(4)
  })
})

describe('sign-in', () => {
  test('username or email, password "password"', () => {
    for (const p of config.personas) {
      const a = signInWithCredentials(p.username, 'password')
      const b = signInWithCredentials(p.email.toUpperCase(), 'password')
      expect('persona' in a && a.persona.home).toBe(p.home)
      expect('persona' in b && b.persona.id).toBe(p.id)
    }
    expect(signInWithCredentials('aisha.renter', 'nope')).toEqual({ error: 'password' })
    expect(signInWithCredentials('nobody', 'password')).toEqual({ error: 'unknown' })
  })
})

describe('learner actions', () => {
  test('journey finish scores, saves checklist, awards points', () => {
    resetDemo()
    const before = pointsOf('L01')
    const run = startJourney('L01', 'renew-or-move')
    for (const [step, opt] of Object.entries(
      getDb().journeyRuns.find((r) => r.id === 'JR-A1')?.answers ?? {},
    ))
      answerJourney(run, step, opt)
    expect(finishJourney(run)).toBe(78)
    const cl = saveJourneyChecklist(run)
    expect(getDb().checklists.find((c) => c.id === cl)?.templateId).toBe('renewal')
    expect(pointsOf('L01')).toBe(before + 50 + 20)
    expect(
      getDb().badges.some((b) => b.learnerId === 'L01' && b.badgeId === 'decision-maker'),
    ).toBe(true)
  })
  test('calculator, checklist, reminder, unit, certificate', () => {
    resetDemo()
    saveCalcResult('L02', 'rent-vs-buy', { horizonYears: 4 }, { en: 'Test', ar: 'تجربة' })
    const id = createChecklist('L01', 'move-in')
    toggleChecklistItem(id, 'move-in-1')
    expect(getDb().checklists.find((c) => c.id === id)?.ticked).toEqual(['move-in-1'])
    addReminder('L01', { title: { en: 'x', ar: 'x' }, date: '2027-01-01', channels: ['email'] })
    for (const u of ['A4', 'A5']) completeUnit('L01', 'renting', u)
    const quiz = getDb().courses[0]?.modules[0]?.units.find((u) => u.id === 'AQ')?.quiz
    const answers = Object.fromEntries((quiz?.questions ?? []).map((q) => [q.id, q.correct]))
    expect(submitQuiz('L01', 'renting', 'AQ', answers)?.passed).toBe(true)
    expect(getDb().badges.some((b) => b.learnerId === 'L01' && b.badgeId === 'graduate')).toBe(true)
    expect(
      getDb().badges.some((b) => b.learnerId === 'L01' && b.badgeId === 'contract-ready'),
    ).toBe(true)
  })
  test('partner request only with explicit tick; withdraw', () => {
    resetDemo()
    const n = getDb().partnerConsents.length
    expect(givePartnerConsent('L01', 'OF-OASIS', false)).toBeNull()
    expect(getDb().partnerConsents).toHaveLength(n)
    const id = givePartnerConsent('L01', 'OF-OASIS', true)
    expect(getDb().partnerConsents).toHaveLength(n + 1)
    if (id) withdrawPartnerConsent(id)
    expect(getDb().partnerConsents.find((c) => c.id === id)?.withdrawnAt).toBeDefined()
  })
  test('register a learner', () => {
    resetDemo()
    const id = registerLearner({
      name: 'Test Person',
      email: 't@example.com',
      password: 'secret12',
      emirate: 'dubai',
      situation: 'renewing',
      language: 'en',
      marketing: false,
    })
    expect(getDb().session.personaId).toBe(id)
    expect(getDb().learners[0]?.name).toBe('Test Person')
    expect(signInWithCredentials('t@example.com', 'secret12')).toMatchObject({ persona: { id } })
  })
})

describe('staff actions', () => {
  test('reviewer approves, owner publishes (approved only)', () => {
    resetDemo()
    expect(publishContent('CT-B1')).toBe(false)
    approveReview('RV1', 'Looks right')
    expect(getDb().content.find((c) => c.id === 'CT-A4')?.status).toBe('approved')
    expect(
      getDb().notifications.some((n) => n.to === 'owner' && n.title.en.includes('Unit A4')),
    ).toBe(true)
    expect(publishContent('CT-A4')).toBe(true)
    expect(getDb().content.find((c) => c.id === 'CT-A4')?.status).toBe('published')
  })
  test('pausing a placement records it', () => {
    resetDemo()
    setPlacementStatus('PL-OASIS-CALC', 'paused')
    expect(getDb().placements.find((p) => p.id === 'PL-OASIS-CALC')?.status).toBe('paused')
  })
  test('KPI base equals the register', () => {
    expect(liveKpis().joined).toBe(KPI.joined)
  })
})
