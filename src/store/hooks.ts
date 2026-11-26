import type { DemoNotification, Persona, PersonaId } from '@shared/types'
import { useMemo } from 'react'
import { BADGES, EVENTS, OFFERS } from '@/data/catalogue'
import { totalPoints } from '@/domain/gamification'
import { type KpiDelta, liveKpis } from '@/domain/kpi'
import { usePersona } from './actions/session'
import { type DemoDb, seedBaseline, useDb } from './db'

/**
 * Read hooks: one per collection. Selectors return stable references from the db; filtering by
 * learner happens in useMemo so components re-render only when the collection changes.
 */

/** The signed-in persona, non-null inside guarded layouts. */
export function useMe(): Persona {
  const p = usePersona()
  if (!p) throw new Error('No signed-in persona')
  return p
}

function useMine<T extends { learnerId: PersonaId }>(
  pick: (db: DemoDb) => T[],
  learnerId?: PersonaId,
) {
  const me = usePersona()
  const id = learnerId ?? me?.id
  const all = useDb(pick)
  return useMemo(() => all.filter((x) => x.learnerId === id), [all, id])
}

// ---------------------------------------------------------------- LMS
export const useCourses = () => useDb((db) => db.courses)
export const useEnrollments = () => useDb((db) => db.enrollments)
export const useCourse = (id: string) => useDb((db) => db.courses.find((c) => c.id === id))
/** The signed-in learner's enrolment in one course (undefined before they start). */
export function useEnrollment(courseId: string) {
  const me = usePersona()
  return useDb((db) =>
    db.enrollments.find((e) => e.courseId === courseId && e.learnerId === me?.id),
  )
}

// ---------------------------------------------------------------- learner collections (signed-in learner by default)
export const useJourneyRuns = (learnerId?: PersonaId) => useMine((db) => db.journeyRuns, learnerId)
export const useJourneyRun = (runId: string | undefined) =>
  useDb((db) => db.journeyRuns.find((r) => r.id === runId))
export const useCalcResults = (learnerId?: PersonaId) => useMine((db) => db.calcResults, learnerId)
export const useChecklists = (learnerId?: PersonaId) => useMine((db) => db.checklists, learnerId)
export const useChecklist = (id: string) => useDb((db) => db.checklists.find((c) => c.id === id))
export const useShortlist = (learnerId?: PersonaId) => useMine((db) => db.shortlist, learnerId)
export const useReminders = (learnerId?: PersonaId) => useMine((db) => db.reminders, learnerId)
export const useActivity = (learnerId?: PersonaId) => useMine((db) => db.activity, learnerId)
export const useEarnedBadges = (learnerId?: PersonaId) => useMine((db) => db.badges, learnerId)
export const usePartnerConsents = (learnerId?: PersonaId) =>
  useMine((db) => db.partnerConsents, learnerId)
export const useEventRegistrations = (learnerId?: PersonaId) =>
  useMine((db) => db.eventRegistrations, learnerId)
export const useChat = (learnerId?: PersonaId) => useMine((db) => db.chat, learnerId)
export function useConsents(learnerId?: PersonaId) {
  const me = usePersona()
  const id = learnerId ?? me?.id
  return useDb((db) => db.consents.find((c) => c.learnerId === id))
}
export function useOnboarding(learnerId?: PersonaId) {
  const me = usePersona()
  const id = learnerId ?? me?.id ?? ''
  return useDb((db) => db.onboarding[id])
}
export function usePoints(learnerId?: PersonaId) {
  const entries = useActivity(learnerId)
  return useMemo(() => totalPoints(entries), [entries])
}
/** Badge definitions with earned state for the learner. */
export function useBadges(learnerId?: PersonaId) {
  const earned = useEarnedBadges(learnerId)
  return useMemo(
    () => BADGES.map((b) => ({ ...b, earnedAt: earned.find((e) => e.badgeId === b.id)?.at })),
    [earned],
  )
}

// ---------------------------------------------------------------- sponsors, placements, offers, events
export const usePlacements = () => useDb((db) => db.placements)
/** Live placements a learner can see (not paused, not dismissed by them). */
export function useVisiblePlacements() {
  const me = usePersona()
  const placements = useDb((db) => db.placements)
  const dismissed = useDb((db) => db.dismissedPlacements)
  return useMemo(
    () =>
      placements.filter(
        (p) =>
          p.status === 'live' &&
          !dismissed.some((d) => d.placementId === p.id && d.learnerId === me?.id),
      ),
    [placements, dismissed, me?.id],
  )
}
/** Offers whose placement is live (paused placements hide the offer). */
export function useVisibleOffers() {
  const placements = useDb((db) => db.placements)
  return useMemo(
    () => OFFERS.filter((o) => placements.find((p) => p.id === o.placementId)?.status === 'live'),
    [placements],
  )
}
/** Events with the event-sponsor label only while its placement is live. */
export function useEvents() {
  const placements = useDb((db) => db.placements)
  return useMemo(
    () =>
      EVENTS.map((e) => ({
        ...e,
        placement: placements.find((p) => p.id === e.placementId && p.status === 'live'),
      })),
    [placements],
  )
}
/** A sponsor's own placements; paused ones are hidden from the sponsor view (C8.5 live status). */
export function useSponsorPlacements(sponsorId: string, includePaused = false) {
  const placements = useDb((db) => db.placements)
  return useMemo(
    () =>
      placements.filter((p) => p.sponsorId === sponsorId && (includePaused || p.status === 'live')),
    [placements, sponsorId, includePaused],
  )
}

// ---------------------------------------------------------------- staff collections
export const useLearners = () => useDb((db) => db.learners)
export const useContent = () => useDb((db) => db.content)
export const useReviews = () => useDb((db) => db.reviews)
export const useReview = (id: string) => useDb((db) => db.reviews.find((r) => r.id === id))
export const useApprovals = () => useDb((db) => db.approvals)
export const useTemplates = () => useDb((db) => db.templates)
export const useAnnouncements = () => useDb((db) => db.announcements)
export const useNudges = () => useDb((db) => db.nudges)
export const useAudit = () => useDb((db) => db.audit)
export const useSettings = () => useDb((db) => db.settings)
export const useAllPartnerConsents = () => useDb((db) => db.partnerConsents)

/** Content status counts (Overview: published, in review, draft). */
export function useContentCounts() {
  const content = useContent()
  return useMemo(
    () => ({
      published: content.filter((c) => c.status === 'published').length,
      inReview: content.filter((c) => c.status === 'in-review').length,
      draft: content.filter((c) => c.status === 'draft').length,
      approved: content.filter((c) => c.status === 'approved').length,
    }),
    [content],
  )
}

/** In-platform notifications for the signed-in persona (by id or by role), newest first. */
export function useNotifications(): DemoNotification[] {
  const me = usePersona()
  const all = useDb((db) => db.notifications)
  return useMemo(
    () => all.filter((n) => n.to === me?.id || n.to === me?.role),
    [all, me?.id, me?.role],
  )
}

// ---------------------------------------------------------------- KPIs (one source for landing, owner, leadership)
function delta(db: DemoDb, base: DemoDb): KpiDelta {
  const d = (a: number, b: number) => Math.max(0, a - b)
  const finished = (x: DemoDb) => x.journeyRuns.filter((r) => r.finishedAt)
  const useful = (x: DemoDb) => x.learners.filter((l) => l.firstUsefulActionAt).length
  const consents = (x: DemoDb) => x.partnerConsents.filter((c) => !c.withdrawnAt).length
  const active = (x: DemoDb) => x.reminders.filter((r) => r.status === 'active').length
  return {
    joined: d(db.registered.length, base.registered.length),
    onboarded: d(
      Object.values(db.onboarding).filter((o) => o.done).length,
      Object.values(base.onboarding).filter((o) => o.done).length,
    ),
    firstUsefulAction: d(useful(db), useful(base)),
    journeysCompleted: d(finished(db).length, finished(base).length),
    journeysWithNextAction: d(
      finished(db).filter((r) => r.nextAction).length,
      finished(base).filter((r) => r.nextAction).length,
    ),
    checklistsSaved: d(db.checklists.length, base.checklists.length),
    calculatorSaves: d(db.calcResults.length, base.calcResults.length),
    reminderOptIns: d(active(db), active(base)),
    consentedRequests: d(consents(db), consents(base)),
    certificates: 0,
  }
}

/** Live KPIs: pilot aggregates (src/data/figures.ts) plus demo actions since the seed. */
export function useKpis() {
  const db = useDb((x) => x)
  return useMemo(() => liveKpis(delta(db, seedBaseline())), [db])
}
