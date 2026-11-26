import config from '@config'
import type {
  ActivityEntry,
  Announcement,
  Approval,
  AuditEntry,
  BadgeId,
  CalcResult,
  ChatMessage,
  ContentItem,
  Course,
  DemoNotification,
  EmailTemplate,
  Enrollment,
  EventRegistration,
  JourneyRun,
  LearnerConsents,
  LearnerRecord,
  Nudge,
  OnboardingAnswers,
  PartnerConsent,
  PersonaId,
  Placement,
  PlatformSettings,
  Prefs,
  Reminder,
  ReviewItem,
  SavedChecklist,
  ShortlistHome,
} from '@shared/types'
import { useSyncExternalStore } from 'react'
import { SEED_PLACEMENTS } from '@/data/catalogue'
import { CHECKLIST_BY_ID } from '@/data/checklists'
import { JOURNEY1 } from '@/data/figures'
import { AISHA_ANSWERS, ROHAN_ANSWERS } from '@/data/journeys'
import {
  SAVED_CHECKLIST_SEED,
  SEED_ACTIVITY,
  SEED_BADGES,
  SEED_CALC_RESULTS,
  SEED_CONSENTS,
  SEED_EVENT_REGISTRATIONS,
  SEED_ONBOARDING,
  SEED_PARTNER_CONSENTS,
  SEED_REMINDERS,
  SEED_SHORTLIST,
} from '@/data/learner-seed'
import {
  EMAIL_TEMPLATES,
  SEED_ANNOUNCEMENTS,
  SEED_APPROVALS,
  SEED_AUDIT,
  SEED_CONTENT,
  SEED_LEARNERS,
  SEED_NOTIFICATIONS,
  SEED_REVIEWS,
  SEED_SETTINGS,
} from '@/data/staff-seed'
import { SEED_COURSES, SEED_ENROLLMENTS } from '@/data/tracks'
import { calcSummary } from '@/domain/calculator-summary'

/**
 * One versioned demo database in localStorage (key from mockup.config.ts). Every role reads the
 * same records with stable IDs, so a change made as one role shows when the presenter switches
 * roles. Reset restores the seeded snapshot and keeps the session and preferences.
 * Bump VERSION whenever the shape of DemoDb changes, so old saved data is discarded.
 */
const KEY = config.storageKey
const VERSION = 4

/** A demo persona registered live through /register (not in mockup.config.ts). */
export interface RegisteredPersona {
  id: PersonaId
  name: string
  email: string
  password: string
  lang: 'en' | 'ar'
  createdAt: string
}

export interface DemoDb {
  version: number
  session: { personaId: PersonaId | null }
  prefs: Prefs
  /** LMS: the two tracks as courses (Track A renting, Track B buying). */
  courses: Course[]
  enrollments: Enrollment[]
  journeyRuns: JourneyRun[]
  calcResults: CalcResult[]
  checklists: SavedChecklist[]
  shortlist: ShortlistHome[]
  reminders: Reminder[]
  activity: ActivityEntry[]
  badges: { learnerId: PersonaId; badgeId: BadgeId; at: string }[]
  consents: LearnerConsents[]
  partnerConsents: PartnerConsent[]
  eventRegistrations: EventRegistration[]
  dismissedPlacements: { learnerId: PersonaId; placementId: string }[]
  chat: ChatMessage[]
  onboarding: Record<PersonaId, OnboardingAnswers>
  registered: RegisteredPersona[]
  learners: LearnerRecord[]
  content: ContentItem[]
  reviews: ReviewItem[]
  approvals: Approval[]
  placements: Placement[]
  templates: EmailTemplate[]
  announcements: Announcement[]
  nudges: Nudge[]
  notifications: DemoNotification[]
  audit: AuditEntry[]
  settings: PlatformSettings
}

function seedChecklists(): SavedChecklist[] {
  return SAVED_CHECKLIST_SEED.map((c) => {
    const items = CHECKLIST_BY_ID[c.templateId]?.items ?? []
    const ticked = items
      .filter((i) => !c.skip?.includes(i.id))
      .slice(0, c.tickedCount)
      .map((i) => i.id)
    return {
      id: c.id,
      learnerId: c.learnerId,
      templateId: c.templateId,
      title: c.title,
      ticked,
      notes: { ...(c.notes ?? {}) },
      createdAt: c.createdAt,
      updatedAt: c.createdAt,
    }
  })
}

function seedJourneyRuns(): JourneyRun[] {
  return [
    {
      id: 'JR-A1',
      journeyId: 'renew-or-move',
      learnerId: 'L01',
      answers: { ...AISHA_ANSWERS },
      startedAt: '2026-11-21T19:40:00+04:00',
      finishedAt: '2026-11-21T20:00:00+04:00',
      score: JOURNEY1.aishaScore,
      nextAction: {
        en: 'Check the Rental Index and reply to your landlord in writing before 1 Feb 2027',
        ar: 'تحقق من مؤشر الإيجارات وردّ على المالك كتابياً قبل 1 فبراير 2027',
      },
      savedChecklistId: 'CL-A2',
      reminderId: 'RM-A1',
    },
    {
      id: 'JR-R1',
      journeyId: 'rent-or-buy',
      learnerId: 'L02',
      answers: { ...ROHAN_ANSWERS },
      startedAt: '2026-11-17T20:10:00+04:00',
      finishedAt: '2026-11-17T20:30:00+04:00',
      score: JOURNEY1.rohanScore,
      nextAction: {
        en: 'Verify the title deed on DLD Title Deed Verification',
        ar: 'تحقق من سند الملكية عبر خدمة التحقق من سند الملكية لدى دائرة الأراضي والأملاك',
      },
      savedChecklistId: 'CL-R1',
    },
  ]
}

export function seed(keep?: Pick<DemoDb, 'session' | 'prefs'>): DemoDb {
  return {
    version: VERSION,
    session: keep?.session ?? { personaId: null },
    prefs: keep?.prefs ?? { lang: config.defaultLanguage, reducedMotion: false },
    courses: structuredClone(SEED_COURSES),
    enrollments: structuredClone(SEED_ENROLLMENTS),
    journeyRuns: seedJourneyRuns(),
    calcResults: SEED_CALC_RESULTS.map((r) => ({
      ...structuredClone(r),
      summary: calcSummary(r.tab, r.inputs),
    })),
    checklists: seedChecklists(),
    shortlist: structuredClone(SEED_SHORTLIST),
    reminders: structuredClone(SEED_REMINDERS),
    activity: structuredClone(SEED_ACTIVITY),
    badges: structuredClone(SEED_BADGES),
    consents: structuredClone(SEED_CONSENTS),
    partnerConsents: structuredClone(SEED_PARTNER_CONSENTS),
    eventRegistrations: structuredClone(SEED_EVENT_REGISTRATIONS),
    dismissedPlacements: [],
    chat: [],
    onboarding: structuredClone(SEED_ONBOARDING),
    registered: [],
    learners: structuredClone(SEED_LEARNERS),
    content: structuredClone(SEED_CONTENT),
    reviews: structuredClone(SEED_REVIEWS),
    approvals: structuredClone(SEED_APPROVALS),
    placements: structuredClone(SEED_PLACEMENTS),
    templates: structuredClone(EMAIL_TEMPLATES),
    announcements: structuredClone(SEED_ANNOUNCEMENTS),
    nudges: [],
    notifications: structuredClone(SEED_NOTIFICATIONS),
    audit: structuredClone(SEED_AUDIT),
    settings: structuredClone(SEED_SETTINGS),
  }
}

/** Seed snapshot used to measure live demo deltas for the KPIs. */
let seedSnapshot: DemoDb | null = null
export function seedBaseline(): DemoDb {
  seedSnapshot ??= seed()
  return seedSnapshot
}

function load(): DemoDb {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed()
    const parsed = JSON.parse(raw) as DemoDb
    return parsed?.version === VERSION ? parsed : seed()
  } catch {
    return seed()
  }
}

let state: DemoDb = typeof localStorage === 'undefined' ? seed() : load()
const listeners = new Set<() => void>()

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Storage blocked (private mode) or absent (tests): the demo still works for this visit.
  }
}
persist()

export function getDb(): DemoDb {
  return state
}

/** Immutable update: pass a function that returns the next state. */
export function update(fn: (db: DemoDb) => DemoDb) {
  state = fn(state)
  persist()
  for (const l of listeners) l()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Select a slice. Keep selectors returning stable references (no new arrays/objects). */
export function useDb<T>(selector: (db: DemoDb) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state),
  )
}

/** Reset demo: every connected record returns to the seeded baseline. */
export function resetDemo() {
  update((db) => seed({ session: db.session, prefs: db.prefs }))
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY) return
    state = load()
    for (const l of listeners) l()
  })
}
