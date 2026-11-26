import type { Figure } from '@shared/types'
import { L } from './l'
import { CHECKED_ON } from './sources'

/**
 * FIGURES REGISTER: the single source for every fee, default and KPI on every screen
 * (docs/ASSUMPTIONS.md). Screens, Dalil, journeys, the golden path and tests read from here;
 * never retype a number. All values are demo values, checked on 25 Nov 2026.
 */

const EJARI_URL = 'https://dubailand.gov.ae/en/eservices/register-renew-tenancy-contract/'
const DEWA_URL =
  'https://dewa.gov.ae/en/consumer/supply-management/activation-of-electricity-water-move-in'
const MARKET = L('Market practice, not a fixed rule', 'ممارسات السوق، وليست قاعدة ثابتة')
const DLD = L('Dubai Land Department', 'دائرة الأراضي والأملاك في دبي')
const CBUAE = L(
  'Central Bank of the UAE (check with your bank)',
  'مصرف الإمارات المركزي (تحقق مع بنكك)',
)
const DEMO = L('Demo value for this example', 'قيمة تجريبية لهذا المثال')

const f = (
  id: string,
  label: Figure['label'],
  value: number,
  unit: Figure['unit'],
  sourceLabel: Figure['sourceLabel'],
  sourceUrl?: string,
  note?: Figure['note'],
): Figure => ({ id, label, value, unit, sourceLabel, sourceUrl, checkedOn: CHECKED_ON, note })

// ---------------------------------------------------------------- fees (fee register)

export const FEES = {
  ejari: f(
    'ejari',
    L('Ejari registration (online)', 'تسجيل إيجاري (عبر الإنترنت)'),
    177.75,
    'AED',
    DLD,
    EJARI_URL,
    L('AED 220 at a trustee centre', '220 درهماً في مراكز أمين'),
  ),
  ejariTrustee: f(
    'ejariTrustee',
    L('Ejari registration (trustee centre)', 'تسجيل إيجاري (مركز أمين)'),
    220,
    'AED',
    DLD,
    EJARI_URL,
  ),
  dewaDepositApartment: f(
    'dewaDepositApartment',
    L('DEWA move-in deposit, apartment (refundable)', 'تأمين ديوا عند الانتقال، شقة (مسترد)'),
    2000,
    'AED',
    L('DEWA', 'ديوا'),
    DEWA_URL,
    L(
      'Refundable, paid up front, outside the cost comparison',
      'مسترد، يُدفع مقدماً، خارج مقارنة التكلفة',
    ),
  ),
  dewaDepositVilla: f(
    'dewaDepositVilla',
    L('DEWA move-in deposit, villa (refundable)', 'تأمين ديوا عند الانتقال، فيلا (مسترد)'),
    4000,
    'AED',
    L('DEWA', 'ديوا'),
    DEWA_URL,
    L(
      'Refundable, paid up front, outside the cost comparison',
      'مسترد، يُدفع مقدماً، خارج مقارنة التكلفة',
    ),
  ),
  depositUnfurnishedPct: f(
    'depositUnfurnishedPct',
    L('Security deposit, unfurnished', 'التأمين، غير مفروش'),
    5,
    '%',
    MARKET,
  ),
  depositFurnishedPct: f(
    'depositFurnishedPct',
    L('Security deposit, furnished', 'التأمين، مفروش'),
    10,
    '%',
    MARKET,
  ),
  agencyRentPct: f(
    'agencyRentPct',
    L('Agency fee (renting)', 'عمولة الوسيط (إيجار)'),
    5,
    '%',
    MARKET,
  ),
  housingFeePct: f(
    'housingFeePct',
    L('Dubai Municipality housing fee (via DEWA)', 'رسوم السكن لبلدية دبي (عبر ديوا)'),
    5,
    '%',
    L('Dubai Municipality', 'بلدية دبي'),
    'https://www.dm.gov.ae/',
  ),
  transferFeePct: f(
    'transferFeePct',
    L('DLD transfer fee', 'رسوم نقل الملكية'),
    4,
    '%',
    DLD,
    'https://dubailand.gov.ae/en/eservices/',
  ),
  mortgageRegPct: f(
    'mortgageRegPct',
    L('Mortgage registration fee', 'رسوم تسجيل الرهن'),
    0.25,
    '%',
    DLD,
    'https://dubailand.gov.ae/en/eservices/',
    L('Plus AED 290 admin fee', 'بالإضافة إلى 290 درهماً رسوماً إدارية'),
  ),
  mortgageAdmin: f(
    'mortgageAdmin',
    L('Mortgage registration admin fee', 'الرسوم الإدارية لتسجيل الرهن'),
    290,
    'AED',
    DLD,
    'https://dubailand.gov.ae/en/eservices/',
  ),
  agencyBuyPct: f('agencyBuyPct', L('Agency fee (buying)', 'عمولة الوسيط (شراء)'), 2, '%', MARKET),
  minDownPaymentPct: f(
    'minDownPaymentPct',
    L(
      'Minimum down payment (first home under AED 5m, non-nationals)',
      'الحد الأدنى للدفعة الأولى (أول منزل بأقل من 5 ملايين درهم، لغير المواطنين)',
    ),
    20,
    '%',
    CBUAE,
    'https://www.centralbank.ae/en/',
  ),
  debtBurdenPct: f(
    'debtBurdenPct',
    L('Debt-burden cap (share of income)', 'الحد الأقصى لعبء الدين (من الدخل)'),
    50,
    '%',
    CBUAE,
    'https://www.centralbank.ae/en/',
  ),
  serviceChargeSqft: f(
    'serviceChargeSqft',
    L('Service charge (demo)', 'رسوم الخدمات (تجريبية)'),
    14,
    'AED/sqft/year',
    DEMO,
  ),
  allowedIncreasePct: f(
    'allowedIncreasePct',
    L('Allowed rent increase (Journey 1 demo)', 'الزيادة المسموحة في الإيجار (مثال الرحلة 1)'),
    5,
    '%',
    L('DLD Rental Index, Decree No. 43 of 2013', 'مؤشر الإيجارات، المرسوم رقم 43 لسنة 2013'),
    'https://dubailand.gov.ae/en/eservices/rental-index/',
  ),
} as const

// ---------------------------------------------------------------- calculator defaults (C11.2)

export const TRUE_COST_DEFAULTS = {
  annualRent: 95000,
  cheques: 4,
  furnished: false,
  agentUsed: true,
  coolingSeparate: true,
  coolingMonthly: 450,
  dewaMonthly: 600,
  internetMonthly: 389,
  movingCost: 3000,
  villa: false,
}

export const RENT_BUY_DEFAULTS = {
  price: 2300000,
  downPaymentPct: 20,
  ratePct: 4.49,
  termYears: 25,
  horizonYears: 8,
  rentNow: 140000,
  rentGrowthPct: 3,
  serviceChargeYear: 30800,
  maintenancePct: 0.5,
  priceGrowthPct: 2,
  transferFeePct: FEES.transferFeePct.value,
  mortgageRegPct: FEES.mortgageRegPct.value,
  agencyFeePct: FEES.agencyBuyPct.value,
  sellingCostsPct: 2,
}

export const AFFORD_DEFAULTS = {
  monthlyIncome: 45000,
  monthlyDebts: 3000,
  savings: 450000,
  ratePct: 4.49,
  termYears: 25,
  downPaymentPct: FEES.minDownPaymentPct.value,
  debtBurdenPct: FEES.debtBurdenPct.value,
}

export type TrueCostInputs = typeof TRUE_COST_DEFAULTS
export type RentBuyInputs = typeof RENT_BUY_DEFAULTS
export type AffordInputs = typeof AFFORD_DEFAULTS

/** Source label per calculator input (shown next to every default with "Checked on"). */
export const CALC_SOURCES: Record<string, Figure> = {
  annualRent: f('annualRent', L('Annual rent', 'الإيجار السنوي'), 95000, 'AED/year', DEMO),
  coolingMonthly: f(
    'coolingMonthly',
    L('District cooling', 'التبريد المركزي'),
    450,
    'AED/month',
    DEMO,
  ),
  dewaMonthly: f('dewaMonthly', L('DEWA bills', 'فواتير ديوا'), 600, 'AED/month', DEMO, DEWA_URL),
  internetMonthly: f('internetMonthly', L('Internet', 'الإنترنت'), 389, 'AED/month', DEMO),
  movingCost: f('movingCost', L('Moving cost', 'تكلفة الانتقال'), 3000, 'AED', DEMO),
  ratePct: f('ratePct', L('Mortgage rate (demo)', 'سعر الفائدة (تجريبي)'), 4.49, '%', DEMO),
  rentGrowthPct: f('rentGrowthPct', L('Rent growth', 'نمو الإيجار'), 3, '%', DEMO),
  priceGrowthPct: f('priceGrowthPct', L('Price growth', 'نمو السعر'), 2, '%', DEMO),
  maintenancePct: f('maintenancePct', L('Maintenance', 'الصيانة'), 0.5, '%', MARKET),
  sellingCostsPct: f('sellingCostsPct', L('Selling costs', 'تكاليف البيع'), 2, '%', MARKET),
  serviceChargeYear: f(
    'serviceChargeYear',
    L(
      'Service charge per year (2,200 sq ft x AED 14)',
      'رسوم الخدمات السنوية (2,200 قدم مربع × 14 درهماً)',
    ),
    30800,
    'AED/year',
    DEMO,
  ),
}

// ---------------------------------------------------------------- Journey 1 figures (C11.1 + Vera 16:01)

export const JOURNEY1 = {
  currentRent: 95000,
  landlordAsk: 104500,
  renewAllowed: 99750,
  jvcRent: 82000,
  jvcAgency: 4100,
  jvcDeposit: 4100,
  jvcMoving: 3000,
  jvcEjari: FEES.ejari.value,
  /** 82,000 + 4,100 + 4,100 + 3,000 + 177.75 */
  jvcFirstYear: 93377.75,
  note: L(
    'One-off and rent costs only; utilities similar in both homes.',
    'التكاليف لمرة واحدة والإيجار فقط؛ المرافق متقاربة في المنزلين.',
  ),
  aishaScore: 78,
  rohanScore: 71,
} as const

// ---------------------------------------------------------------- KPI aggregates (C13 / C15)

/** Pilot aggregates. Live demo actions add on top through src/domain/kpi.ts. */
export const KPI = {
  joined: 1240,
  onboarded: 1105,
  firstUsefulAction: 672,
  firstUsefulActionPct: 54,
  returnedEligible: 922,
  returned30: 251,
  returned30Pct: 27,
  reminderOptIns: 412,
  journeysCompleted: 486,
  journeysWithNextAction: 412,
  journeysNextActionPct: 85,
  journeysBuilt: 2,
  journeysWorking: 2,
  calculatorsWorking: 1,
  checklistsSaved: 2310,
  calculatorSaves: 1605,
  totalSaves: 3915,
  certificates: 214,
  certificatesA: 152,
  certificatesB: 62,
  consentedRequests: 37,
  unconsentedShares: 0,
  claimsSourced: 64,
  claimsTotal: 64,
  confidencePre: 2.4,
  confidencePost: 4.1,
  signupsLast30: 318,
  noUsefulAction7d: 214,
  trackACompletionPct: 38,
  trackBCompletionPct: 24,
  content: { published: 10, inReview: 4, draftArabic: 6 },
  feesExpiringSoon: 2,
  targets: { k3Pct: 50, k4Pct: 25 },
  sponsor: { impressions: 18420, calculatorRuns: 1106, offerViews: 642, consentedRequests: 37 },
} as const

/** C15 mix (percent). */
export const MIX = {
  track: { A: 58, B: 42 },
  emirate: { dubai: 81, sharjah: 9, 'abu-dhabi': 7, other: 3 },
  language: { en: 66, ar: 34 },
  source: { social: 41, search: 23, employer: 14, friend: 12, partner: 6, event: 4 },
} as const

/** Funnel (C13): joined, onboarded, first useful action, returned within 30 days, reminder opt-ins. */
export const FUNNEL = [
  { id: 'joined', label: L('Joined', 'انضموا'), value: KPI.joined },
  { id: 'onboarded', label: L('Onboarded', 'أكملوا الإعداد'), value: KPI.onboarded },
  { id: 'useful', label: L('First useful action', 'أول خطوة مفيدة'), value: KPI.firstUsefulAction },
  {
    id: 'returned',
    label: L('Returned within 30 days', 'عادوا خلال 30 يوماً'),
    value: KPI.returned30,
  },
  { id: 'reminders', label: L('Reminder opt-ins', 'فعّلوا التذكيرات'), value: KPI.reminderOptIns },
] as const

/** Weekly sign-ups, last 12 weeks, by source (sums to KPI.joined). */
export const WEEKLY_SIGNUPS: {
  week: string
  social: number
  search: number
  employer: number
  friend: number
  partner: number
  event: number
}[] = [
  { week: '2026-09-07', social: 30, search: 17, employer: 10, friend: 9, partner: 4, event: 3 },
  { week: '2026-09-14', social: 34, search: 19, employer: 11, friend: 10, partner: 5, event: 3 },
  { week: '2026-09-21', social: 38, search: 21, employer: 13, friend: 11, partner: 5, event: 4 },
  { week: '2026-09-28', social: 40, search: 22, employer: 14, friend: 12, partner: 6, event: 4 },
  { week: '2026-10-05', social: 42, search: 24, employer: 14, friend: 12, partner: 6, event: 4 },
  { week: '2026-10-12', social: 44, search: 25, employer: 15, friend: 13, partner: 6, event: 4 },
  { week: '2026-10-19', social: 43, search: 24, employer: 15, friend: 12, partner: 6, event: 5 },
  { week: '2026-10-26', social: 45, search: 25, employer: 15, friend: 13, partner: 7, event: 5 },
  { week: '2026-11-02', social: 46, search: 26, employer: 16, friend: 14, partner: 7, event: 5 },
  { week: '2026-11-09', social: 48, search: 27, employer: 16, friend: 14, partner: 7, event: 5 },
  { week: '2026-11-16', social: 49, search: 28, employer: 17, friend: 15, partner: 8, event: 5 },
  { week: '2026-11-23', social: 49, search: 27, employer: 17, friend: 14, partner: 8, event: 3 },
]

/** Journey score distribution (completed journeys, 486). */
export const SCORE_DISTRIBUTION = [
  { band: '0-39', count: 31 },
  { band: '40-59', count: 88 },
  { band: '60-79', count: 214 },
  { band: '80-100', count: 153 },
]
