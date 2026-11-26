import type {
  ActivityEntry,
  BadgeId,
  CalcResult,
  ChecklistTemplateId,
  EventRegistration,
  LearnerConsents,
  OnboardingAnswers,
  PartnerConsent,
  PersonaId,
  Reminder,
  ShortlistHome,
} from '@shared/types'
import { RENT_BUY_DEFAULTS, TRUE_COST_DEFAULTS } from './figures'
import { L } from './l'

/**
 * Seeded learner state (C8.1): Aisha Rahman (L01, renter) and Rohan Mehta (L02, buyer).
 * Pure data; the store copies it on reset. Saved checklist ticks are resolved against the
 * templates in src/store/db.ts (first N items).
 */

export interface SavedChecklistSeed {
  id: string
  learnerId: PersonaId
  templateId: ChecklistTemplateId
  title: ReturnType<typeof L>
  /** Number of items ticked (first N, skipping ids in `skip`). */
  tickedCount: number
  skip?: string[]
  notes?: Record<string, string>
  createdAt: string
}

export const SAVED_CHECKLIST_SEED: SavedChecklistSeed[] = [
  {
    id: 'CL-A1',
    learnerId: 'L01',
    templateId: 'viewing',
    title: L('Viewing checklist: 2BR, Al Barsha South', 'قائمة المعاينة: غرفتان، البرشاء جنوب'),
    tickedCount: 14,
    notes: { 'viewing-2': 'AC in the second bedroom is weak; ask for a service.' },
    createdAt: '2026-11-19T18:10:00+04:00',
  },
  {
    id: 'CL-A2',
    learnerId: 'L01',
    templateId: 'renewal',
    title: L('Renewal checklist', 'قائمة التجديد'),
    tickedCount: 5,
    createdAt: '2026-11-21T20:05:00+04:00',
  },
  {
    id: 'CL-A3',
    learnerId: 'L01',
    templateId: 'move-out',
    title: L('Move-out and deposit checklist', 'قائمة الخروج واسترداد التأمين'),
    tickedCount: 0,
    createdAt: '2026-11-21T20:07:00+04:00',
  },
  {
    id: 'CL-R1',
    learnerId: 'L02',
    templateId: 'due-diligence',
    title: L('Due-diligence checklist: 3BR townhouse', 'قائمة العناية الواجبة: تاون هاوس 3 غرف'),
    tickedCount: 3,
    skip: ['dd-title-deed'],
    createdAt: '2026-11-17T21:00:00+04:00',
  },
]

export const SEED_CALC_RESULTS: Omit<CalcResult, 'summary'>[] = [
  {
    id: 'CR-A1',
    learnerId: 'L01',
    tab: 'true-cost',
    name: L('Renew in Al Barsha (AED 95,000)', 'التجديد في البرشاء (95,000 درهم)'),
    inputs: { ...TRUE_COST_DEFAULTS },
    savedAt: '2026-11-19T19:00:00+04:00',
  },
  {
    id: 'CR-A2',
    learnerId: 'L01',
    tab: 'true-cost',
    name: L('2BR in JVC (AED 82,000)', 'غرفتان في قرية جميرا الدائرية (82,000 درهم)'),
    inputs: { ...TRUE_COST_DEFAULTS, annualRent: 82000, cheques: 2 },
    savedAt: '2026-11-19T19:05:00+04:00',
  },
  {
    id: 'CR-R1',
    learnerId: 'L02',
    tab: 'rent-vs-buy',
    name: L(
      'Buy ready 2BR in Dubai Hills (fictional) vs keep renting',
      'شراء شقة جاهزة بغرفتين في دبي هيلز (خيالية) مقابل الاستمرار في الإيجار',
    ),
    inputs: { ...RENT_BUY_DEFAULTS },
    savedAt: '2026-11-18T21:30:00+04:00',
  },
]

export const SEED_SHORTLIST: ShortlistHome[] = [
  {
    id: 'SH1',
    learnerId: 'L01',
    title: L('2BR Al Barsha South', 'غرفتان، البرشاء جنوب'),
    area: L('Al Barsha South', 'البرشاء جنوب'),
    bedrooms: L('2BR', 'غرفتان'),
    annualRent: 95000,
    cheques: 4,
    furnished: false,
    notes: 'Current home. Close to work, school run is 15 minutes.',
    addedAt: '2026-11-19T18:00:00+04:00',
  },
  {
    id: 'SH2',
    learnerId: 'L01',
    title: L('2BR JVC', 'غرفتان، قرية جميرا الدائرية'),
    area: L('Jumeirah Village Circle', 'قرية جميرا الدائرية'),
    bedrooms: L('2BR', 'غرفتان'),
    annualRent: 82000,
    cheques: 2,
    furnished: false,
    notes: 'Bigger balcony; commute 10 minutes longer at peak.',
    addedAt: '2026-11-19T18:20:00+04:00',
  },
  {
    id: 'SH3',
    learnerId: 'L01',
    title: L('1BR+study Sports City', 'غرفة ومكتب، مدينة دبي الرياضية'),
    area: L('Dubai Sports City', 'مدينة دبي الرياضية'),
    bedrooms: L('1BR+study', 'غرفة ومكتب'),
    annualRent: 70000,
    cheques: 1,
    furnished: false,
    notes: 'Cheapest, but one cheque means more cash up front.',
    addedAt: '2026-11-20T08:40:00+04:00',
  },
]

export const SEED_REMINDERS: Reminder[] = [
  {
    id: 'RM-A1',
    learnerId: 'L01',
    title: L('Tenancy renewal: Al Barsha', 'تجديد الإيجار: البرشاء'),
    date: '2027-02-01T09:00:00+04:00',
    channels: ['email', 'in-platform'],
    status: 'active',
    note: L(
      '90 days before contract end (2 May 2027).',
      'قبل 90 يوماً من انتهاء العقد (2 مايو 2027).',
    ),
  },
  {
    id: 'RM-A2',
    learnerId: 'L01',
    title: L('Ejari renewal after you sign', 'تجديد إيجاري بعد التوقيع'),
    date: '2027-05-03T09:00:00+04:00',
    channels: ['in-platform'],
    status: 'suggested',
  },
  {
    id: 'RM-A3',
    learnerId: 'L01',
    title: L('Move-out inspection', 'فحص الخروج من المنزل'),
    date: '2027-04-25T09:00:00+04:00',
    channels: ['in-platform'],
    status: 'suggested',
  },
  {
    id: 'RM-A4',
    learnerId: 'L01',
    title: L('Book the AC service', 'احجز صيانة المكيف'),
    date: '2026-11-15T09:00:00+04:00',
    channels: ['email'],
    status: 'done',
  },
  {
    id: 'RM-A5',
    learnerId: 'L01',
    title: L('Check the DEWA bill', 'راجع فاتورة ديوا'),
    date: '2026-11-19T09:00:00+04:00',
    channels: ['in-platform'],
    status: 'done',
  },
  {
    id: 'RM-R1',
    learnerId: 'L02',
    title: L('Mortgage pre-approval expires', 'تنتهي الموافقة المبدئية على التمويل'),
    date: '2027-01-15T09:00:00+04:00',
    channels: ['email', 'in-platform'],
    status: 'active',
  },
]

const act = (
  id: string,
  learnerId: PersonaId,
  action: ActivityEntry['action'],
  en: string,
  ar: string,
  at: string,
): ActivityEntry => ({ id, learnerId, action, label: L(en, ar), at })

/** Points ledger. Aisha = 340 points, Rohan = 160 (C11.5 points). */
export const SEED_ACTIVITY: ActivityEntry[] = [
  act(
    'AC-A01',
    'L01',
    'unit',
    'Completed A1 Your real budget',
    'أكملت أ1 ميزانيتك الحقيقية',
    '2026-11-18T20:00:00+04:00',
  ),
  act(
    'AC-A02',
    'L01',
    'unit',
    'Completed A2 Choosing the area',
    'أكملت أ2 اختيار المنطقة',
    '2026-11-19T17:30:00+04:00',
  ),
  act(
    'AC-A03',
    'L01',
    'unit',
    'Completed A3 The viewing',
    'أكملت أ3 المعاينة',
    '2026-11-19T18:00:00+04:00',
  ),
  act(
    'AC-A04',
    'L01',
    'checklist',
    'Saved Viewing checklist',
    'حفظت قائمة المعاينة',
    '2026-11-19T18:10:00+04:00',
  ),
  act(
    'AC-A05',
    'L01',
    'calculator',
    'Saved true cost: Al Barsha',
    'حفظت التكلفة الحقيقية: البرشاء',
    '2026-11-19T19:00:00+04:00',
  ),
  act(
    'AC-A06',
    'L01',
    'calculator',
    'Saved true cost: JVC',
    'حفظت التكلفة الحقيقية: قرية جميرا الدائرية',
    '2026-11-19T19:05:00+04:00',
  ),
  act(
    'AC-A07',
    'L01',
    'journey',
    'Finished Renew or move? (78/100)',
    'أنهت رحلة جدد أم انتقل؟ (78/100)',
    '2026-11-21T20:00:00+04:00',
  ),
  act(
    'AC-A08',
    'L01',
    'checklist',
    'Saved Renewal checklist',
    'حفظت قائمة التجديد',
    '2026-11-21T20:05:00+04:00',
  ),
  act(
    'AC-A09',
    'L01',
    'checklist',
    'Saved Move-out checklist',
    'حفظت قائمة الخروج',
    '2026-11-21T20:07:00+04:00',
  ),
  act(
    'AC-A10',
    'L01',
    'reminder',
    'Set reminder: AC service',
    'ضبطت تذكيراً: صيانة المكيف',
    '2026-11-12T10:00:00+04:00',
  ),
  act(
    'AC-A11',
    'L01',
    'reminder',
    'Set reminder: DEWA bill',
    'ضبطت تذكيراً: فاتورة ديوا',
    '2026-11-14T10:00:00+04:00',
  ),
  act(
    'AC-A12',
    'L01',
    'reminder',
    'Set reminder: Tenancy renewal',
    'ضبطت تذكيراً: تجديد الإيجار',
    '2026-11-21T20:10:00+04:00',
  ),
  act(
    'AC-A13',
    'L01',
    'event',
    'Attended Home Ready welcome session',
    'حضرت جلسة الترحيب في جاهز للسكن',
    '2026-11-18T19:00:00+04:00',
  ),
  act(
    'AC-R01',
    'L02',
    'unit',
    'Completed B1 Rent or buy?',
    'أكمل ب1 إيجار أم شراء؟',
    '2026-11-15T21:00:00+04:00',
  ),
  act(
    'AC-R02',
    'L02',
    'unit',
    'Completed B2 What you can afford',
    'أكمل ب2 ما يمكنك تحمله',
    '2026-11-16T21:00:00+04:00',
  ),
  act(
    'AC-R03',
    'L02',
    'journey',
    'Finished Keep renting or buy? (71/100)',
    'أنهى رحلة الاستمرار في الإيجار أم الشراء؟ (71/100)',
    '2026-11-17T20:30:00+04:00',
  ),
  act(
    'AC-R04',
    'L02',
    'checklist',
    'Saved Due-diligence checklist',
    'حفظ قائمة العناية الواجبة',
    '2026-11-17T21:00:00+04:00',
  ),
  act(
    'AC-R05',
    'L02',
    'calculator',
    'Saved rent vs buy',
    'حفظ الإيجار مقابل الشراء',
    '2026-11-18T21:30:00+04:00',
  ),
  act(
    'AC-R06',
    'L02',
    'reminder',
    'Set reminder: Mortgage pre-approval',
    'ضبط تذكيراً: الموافقة المبدئية',
    '2026-11-18T21:40:00+04:00',
  ),
]

export const SEED_BADGES: { learnerId: PersonaId; badgeId: BadgeId; at: string }[] = [
  { learnerId: 'L01', badgeId: 'first-step', at: '2026-11-19T18:10:00+04:00' },
  { learnerId: 'L01', badgeId: 'budget-builder', at: '2026-11-19T19:00:00+04:00' },
  { learnerId: 'L01', badgeId: 'viewing-pro', at: '2026-11-19T18:30:00+04:00' },
  { learnerId: 'L02', badgeId: 'first-step', at: '2026-11-17T20:30:00+04:00' },
  { learnerId: 'L02', badgeId: 'decision-maker', at: '2026-11-17T20:30:00+04:00' },
  { learnerId: 'L02', badgeId: 'smart-buyer', at: '2026-11-18T21:30:00+04:00' },
]

export const SEED_CONSENTS: LearnerConsents[] = [
  { learnerId: 'L01', termsAcceptedAt: '2026-11-18T09:30:00+04:00', marketing: false },
  { learnerId: 'L02', termsAcceptedAt: '2026-11-10T20:00:00+04:00', marketing: false },
]

export const SEED_PARTNER_CONSENTS: PartnerConsent[] = [
  {
    id: 'PC-A1',
    learnerId: 'L01',
    offerId: 'OF-SWIFT',
    sponsorId: 'SP-SWIFT',
    givenAt: '2026-11-22T12:00:00+04:00',
  },
]

export const SEED_EVENT_REGISTRATIONS: EventRegistration[] = [
  { eventId: 'EV1', learnerId: 'L01', at: '2026-11-20T08:00:00+04:00' },
]

export const SEED_ONBOARDING: Record<PersonaId, OnboardingAnswers> = {
  L01: {
    household: 'couple',
    budget: '8-12',
    workArea: 'Al Barsha',
    track: 'A',
    step: 4,
    done: true,
    preQuizScore: 40,
  },
  L02: {
    household: 'family',
    budget: '12-20',
    workArea: 'Dubai Hills',
    track: 'B',
    step: 4,
    done: true,
    preQuizScore: 40,
  },
}

/** Days until Aisha's renewal on the Home next-action card (C8.1). */
export const AISHA_RENEWAL = { home: 'Al Barsha', contractEnd: '2027-05-02', daysToRenewal: 84 }
