/**
 * Shared entity types for Home Ready (MKP-2026-002, Potential.org). All data is fictional
 * demonstration material. Keep Lang, Localized, Role, Persona and Prefs (the demo shell needs them).
 */

export type Lang = 'en' | 'ar'
/** Translatable text. Seed content is authored in both languages (Arabic may be a placeholder). */
export interface Localized {
  en: string
  ar: string
}

// ---------------------------------------------------------------- roles and personas

export type Role = 'learner' | 'owner' | 'reviewer' | 'leadership' | 'sponsor'

export type PersonaId = string

export interface Persona {
  id: PersonaId
  role: Role
  name: Localized
  title: Localized
  /** Route the persona lands on after sign-in. */
  home: string
  image?: string
  /** Demo username (brief C16). */
  username?: string
  /** Demo email (fictional). Sign-in accepts username or email. */
  email?: string
}

// ---------------------------------------------------------------- shared reference data

export type TrackKey = 'A' | 'B'
/** Route slug of a track: /learn/tracks/renting | /learn/tracks/buying. Also the course id. */
export type TrackSlug = 'renting' | 'buying'
export type Emirate =
  | 'dubai'
  | 'abu-dhabi'
  | 'sharjah'
  | 'ajman'
  | 'rak'
  | 'fujairah'
  | 'uaq'
  | 'moving'
export type Household = 'single' | 'couple' | 'family'
export type BudgetBand = 'u5' | '5-8' | '8-12' | '12-20' | 'o20'
export type SignupSource =
  | 'social'
  | 'search'
  | 'friend'
  | 'employer'
  | 'event'
  | 'partner'
  | 'other'
export type Situation = 'moving' | 'renewing' | 'thinking-buy' | 'buying'

/** Official source in the register (C8.3). */
export interface Source {
  id: string
  name: Localized
  /** Owner organisation, e.g. Dubai Land Department. */
  org: Localized
  url: string
  emirate: Localized
  /** ISO date last checked. */
  checkedOn: string
}

/** One figure in the fee register: every screen reads it from src/data/figures.ts. */
export interface Figure {
  id: string
  label: Localized
  value: number
  unit: 'AED' | '%' | 'AED/month' | 'AED/year' | 'AED/sqft/year' | 'years'
  sourceLabel: Localized
  sourceUrl?: string
  checkedOn: string
  note?: Localized
}

// ---------------------------------------------------------------- journeys (C11.1)

export type JourneyId = 'renew-or-move' | 'rent-or-buy'

export interface JourneyOption {
  id: string
  label: Localized
  feedback: Localized
  points: number
  /** Best answer for this step (shown after choosing). */
  best?: boolean
}

export interface JourneyStep {
  id: string
  title: Localized
  prompt: Localized
  /** Optional info panel (figures, comparison) shown above the options. */
  info?: Localized[]
  options: JourneyOption[]
}

export interface Journey {
  id: JourneyId
  track: TrackKey
  title: Localized
  summary: Localized
  /** Profile panel lines (fictional scenario). */
  profile: Localized[]
  steps: JourneyStep[]
  /** Personal "what to check" list on the result page. */
  checkList: Localized[]
  /** Suggested next action (saved with "Save next action"). */
  nextAction: Localized
  /** Checklist template saved by "Save checklist". */
  checklistTemplateId: ChecklistTemplateId
  resultNote: Localized
  cover?: string
}

export interface JourneyRun {
  id: string
  journeyId: JourneyId
  learnerId: PersonaId
  /** stepId -> optionId */
  answers: Record<string, string>
  startedAt: string
  finishedAt?: string
  score?: number
  nextAction?: Localized
  savedChecklistId?: string
  reminderId?: string
}

// ---------------------------------------------------------------- calculator (C11.2)

export type CalcTab = 'true-cost' | 'rent-vs-buy' | 'afford'

export interface CalcResult {
  id: string
  learnerId: PersonaId
  tab: CalcTab
  name: Localized
  /** Raw inputs used (numbers and booleans). */
  inputs: Record<string, number | boolean>
  /** Headline line, e.g. "First-year cash out AED 120,465". */
  summary: Localized
  savedAt: string
}

// ---------------------------------------------------------------- checklists (C11.6)

export type ChecklistTemplateId = 'viewing' | 'renewal' | 'move-in' | 'move-out' | 'due-diligence'

export interface ChecklistItemDef {
  id: string
  text: Localized
  /** Related unit route (/learn/tracks/renting/A3) or official source URL. */
  link: { kind: 'unit' | 'source'; to: string; label: Localized }
}

export interface ChecklistTemplate {
  id: ChecklistTemplateId
  track: TrackKey
  title: Localized
  summary: Localized
  items: ChecklistItemDef[]
}

export interface SavedChecklist {
  id: string
  learnerId: PersonaId
  templateId: ChecklistTemplateId
  title: Localized
  /** Ticked item ids. */
  ticked: string[]
  /** itemId -> note */
  notes: Record<string, string>
  createdAt: string
  updatedAt: string
}

// ---------------------------------------------------------------- shortlist, reminders

export interface ShortlistHome {
  id: string
  learnerId: PersonaId
  title: Localized
  area: Localized
  bedrooms: Localized
  annualRent: number
  cheques: number
  furnished: boolean
  notes: string
  addedAt: string
}

export type ReminderChannel = 'email' | 'in-platform' | 'sms'

export interface Reminder {
  id: string
  learnerId: PersonaId
  title: Localized
  /** ISO date the reminder fires. */
  date: string
  channels: ReminderChannel[]
  status: 'active' | 'suggested' | 'done'
  note?: Localized
}

// ---------------------------------------------------------------- offers, consents, events

export interface Sponsor {
  id: string
  name: Localized
  kind: Localized
  /** Always "Sample – not contracted" in the demo. */
  status: 'sample'
  personaId?: PersonaId
}

export type PlacementSlot =
  | 'track'
  | 'video'
  | 'calculator'
  | 'offers'
  | 'event'
  | 'partner-requests'
  | 'home-card'

export interface Placement {
  id: string
  sponsorId: string
  slot: PlacementSlot
  /** Label preview, e.g. "Sponsored · Calculator partner: Oasis Home Finance (fictional sample)". */
  label: Localized
  /** Where it shows (track A, calculator, offer id, event id). */
  target?: string
  status: 'live' | 'paused'
  createdAt: string
}

export interface Offer {
  id: string
  sponsorId: string
  placementId: string
  title: Localized
  body: Localized
  category: Localized
  cover?: string
}

export interface PartnerConsent {
  id: string
  learnerId: PersonaId
  offerId: string
  sponsorId: string
  givenAt: string
  withdrawnAt?: string
}

export interface LearnerConsents {
  learnerId: PersonaId
  termsAcceptedAt: string
  marketing: boolean
}

export interface DemoEvent {
  id: string
  title: Localized
  /** ISO start. */
  start: string
  format: Localized
  languages: Localized
  speaker: Localized
  placementId?: string
  status: 'open' | 'full' | 'past'
}

export interface EventRegistration {
  eventId: string
  learnerId: PersonaId
  at: string
}

// ---------------------------------------------------------------- gamification (C11.5)

export type BadgeId =
  | 'first-step'
  | 'budget-builder'
  | 'viewing-pro'
  | 'contract-ready'
  | 'decision-maker'
  | 'smart-buyer'
  | 'due-diligence'
  | 'graduate'

export interface BadgeDef {
  id: BadgeId
  title: Localized
  criteria: Localized
}

export type PointsAction = 'unit' | 'journey' | 'checklist' | 'calculator' | 'reminder' | 'event'

/** One points-earning action in a learner's ledger. */
export interface ActivityEntry {
  id: string
  learnerId: PersonaId
  action: PointsAction
  label: Localized
  at: string
}

// ---------------------------------------------------------------- Dalil (C10)

export interface DalilAnswer {
  id: string
  prompt: Localized
  /** Lower-case keywords (EN and AR) that select this answer. */
  keywords: string[]
  answer: Localized
  sourceIds: string[]
  /** Optional link to a tool or unit. */
  link?: { to: string; label: Localized }
}

export interface ChatMessage {
  id: string
  learnerId: PersonaId
  from: 'user' | 'dalil'
  text: Localized
  answerId?: string
  at: string
}

// ---------------------------------------------------------------- learners and onboarding

export interface OnboardingAnswers {
  household?: Household
  budget?: BudgetBand
  workArea?: string
  track?: TrackKey
  /** Pre-quiz answers questionId -> option index, and score in percent. */
  preQuiz?: Record<string, number>
  preQuizScore?: number
  step: number
  done: boolean
}

/** Learner directory record (Maya's table, profile drawer). 12 named + live registrations. */
export interface LearnerRecord {
  id: string
  /** Persona id when the learner is a demo persona or a registered learner. */
  personaId?: PersonaId
  name: string
  email: string
  emirate: Emirate
  track: TrackKey
  situation: Situation
  household: Household
  budget: BudgetBand
  source: SignupSource
  language: Lang
  /** Track progress percent. */
  progress: number
  joined: string
  firstUsefulActionAt?: string
  lastActive: string
  returned30: boolean
  reminders: number
  partnerConsents: number
  marketing: boolean
  /** Journey history lines for the profile drawer. */
  journeys: { journeyId: JourneyId; score: number; at: string }[]
  onboarding?: OnboardingAnswers
}

// ---------------------------------------------------------------- staff: content, review, approvals

export type ContentStatus = 'draft' | 'in-review' | 'approved' | 'changes' | 'published'
export type ContentKind = 'unit' | 'video' | 'journey' | 'calc-default' | 'checklist'

export interface ContentItem {
  id: string
  kind: ContentKind
  code?: string
  title: Localized
  track?: TrackKey
  /** Status per language version. */
  en: ContentStatus
  ar: ContentStatus
  /** "Arabic draft for review" flag (Iris translation). */
  arDraft?: boolean
  sourceIds: string[]
  checkedOn: string
  /** Overall status (worst of the two languages unless published). */
  status: ContentStatus
  updatedAt: string
}

export interface Claim {
  id: string
  text: string
  sourceId: string
  checkedOn: string
}

export interface ReviewItem {
  id: string
  contentId: string
  title: string
  languages: Lang[]
  enText: string
  arText: string
  claims: Claim[]
  submittedAt: string
  dueAt: string
  status: 'pending' | 'approved' | 'changes'
  comment?: string
  decidedAt?: string
}

/** Item returned by the reviewer, waiting in Maya's Approvals queue. */
export interface Approval {
  id: string
  contentId: string
  title: string
  outcome: 'approved' | 'changes'
  note: string
  reviewer: string
  at: string
  published: boolean
}

// ---------------------------------------------------------------- comms, notifications, audit

export interface EmailTemplate {
  id: string
  trigger: string
  channel: string
  subject: string
  body: string
}

export interface DemoNotification {
  id: string
  /** Persona id, or a role to notify everyone with that role. */
  to: PersonaId | Role
  title: Localized
  body: Localized
  to_route?: string
  at: string
  read: boolean
}

export interface Announcement {
  id: string
  title: string
  body: string
  scheduledFor: string
  status: 'scheduled' | 'sent' | 'draft'
}

export interface Nudge {
  id: string
  templateId: string
  audience: string
  count: number
  at: string
}

export interface AuditEntry {
  id: string
  at: string
  actor: string
  action: string
  target: string
}

export interface PlatformSettings {
  languages: Lang[]
  emirates: Record<'dubai' | 'abu-dhabi' | 'sharjah', 'on' | 'coming-soon'>
  reviewerId: PersonaId
  checkExpiryDays: number
}

// ---------------------------------------------------------------- LMS module (courses)

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'
export type CourseStatus = 'draft' | 'published'
/** Learning block kinds inside a lesson unit (video, read, summary, question, practice). */
export type BlockKind = 'video' | 'read' | 'summary' | 'question' | 'practice'
/** A lesson unit plays its blocks; a quiz unit runs a scored quiz. */
export type UnitKind = 'lesson' | 'quiz'

/** Single-choice question (question blocks and quizzes). */
export interface Question {
  id: string
  prompt: Localized
  options: Localized[]
  /** Index of the correct option. */
  correct: number
  explanation?: Localized
}

export interface Quiz {
  /** Pass mark in percent. */
  passMark: number
  questions: Question[]
}

export interface Block {
  id: string
  kind: BlockKind
  title: Localized
  /** Body text. Summary blocks: one key point per line. Practice: the task. */
  body: Localized
  minutes: number
  /** Video blocks: display duration, e.g. "3:00" (placeholder player "Video coming soon"). */
  duration?: string
  /** Question blocks only. */
  question?: Question
}

export interface Unit {
  id: string
  kind: UnitKind
  title: Localized
  summary: Localized
  minutes: number
  /** Draft units are hidden from learners. */
  published: boolean
  blocks: Block[]
  /** Quiz units only. */
  quiz?: Quiz
  /** Short code shown in menus and the review queue, e.g. "A4". */
  code?: string
  /** "Your action" button at the end of the unit (calculator, journey, checklist, activity). */
  action?: UnitAction
  /** Units with fees or rules carry a "Checked on" tag (ISO date) and source ids. */
  checkedOn?: string
  sourceIds?: string[]
}

export interface UnitAction {
  kind: 'calculator' | 'journey' | 'checklist' | 'activity' | 'source'
  label: Localized
  /** In-app route (e.g. /learn/calculator?tab=true-cost) or an official URL for kind "source". */
  to: string
}

export interface Module {
  id: string
  title: Localized
  summary: Localized
  units: Unit[]
}

export interface Course {
  id: string
  title: Localized
  summary: Localized
  description: Localized
  level: CourseLevel
  tags: string[]
  status: CourseStatus
  /** Optional cover relative to public/ (falls back to the branded cover). */
  cover?: string
  /** Fictional cohort size shown to admins (plus live demo enrolments). */
  seedLearners: number
  modules: Module[]
  /** ISO date of the last authoring change. */
  updatedAt: string
  /** Home Ready track key: A renting, B buying. */
  track?: TrackKey
  /** Pre-quiz (no pass mark, used for the pre/post comparison). */
  preQuiz?: Quiz
  /** Certificate title when the track is completed (all units + post-quiz pass). */
  certificateTitle?: Localized
  /** Duration label, e.g. "About 45 minutes". */
  duration?: Localized
  outcomes?: Localized[]
}

export interface QuizAttempt {
  unitId: string
  score: number
  passed: boolean
  at: string
}

/** One learner's enrolment and progress in one course. */
export interface Enrollment {
  courseId: string
  learnerId: PersonaId
  enrolledAt: string
  completedUnitIds: string[]
  completedBlockIds: string[]
  attempts: QuizAttempt[]
  lastUnitId?: string
}

export interface Prefs {
  lang: Lang
  reducedMotion: boolean
  /** Presenter demo guide panel visibility and current step (optional for older saved data). */
  demoGuide?: boolean
  guideStep?: number
}
