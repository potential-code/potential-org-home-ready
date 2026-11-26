import type { BadgeDef, DemoEvent, Offer, Placement, Sponsor } from '@shared/types'
import { L } from './l'

/** Sponsors, placements, offers (C11.3), events (C11.4), badges (C11.5). All fictional samples. */

export const SPONSOR_STATUS_LABEL = L('Sample – not contracted', 'نموذج، غير متعاقد')

export const SPONSORS: Sponsor[] = [
  {
    id: 'SP-OASIS',
    name: L('Oasis Home Finance', 'أويسس للتمويل السكني'),
    kind: L('Home finance (fictional sample)', 'تمويل سكني (نموذج خيالي)'),
    status: 'sample',
    personaId: 'S01',
  },
  {
    id: 'SP-SWIFT',
    name: L('SwiftMove', 'سويفت موف'),
    kind: L('Movers (fictional sample)', 'شركة نقل (نموذج خيالي)'),
    status: 'sample',
  },
  {
    id: 'SP-SAFE',
    name: L('SafeNest', 'سيف نست'),
    kind: L('Contents insurance (fictional sample)', 'تأمين المحتويات (نموذج خيالي)'),
    status: 'sample',
  },
]

const p = (
  id: string,
  sponsorId: string,
  slot: Placement['slot'],
  en: string,
  ar: string,
  target?: string,
): Placement => ({
  id,
  sponsorId,
  slot,
  label: L(en, ar),
  target,
  status: 'live',
  createdAt: '2026-11-10T09:00:00+04:00',
})

export const SEED_PLACEMENTS: Placement[] = [
  p(
    'PL-OASIS-TRACK',
    'SP-OASIS',
    'track',
    'Sponsored · Track A partner: Oasis Home Finance (fictional sample)',
    'مُموَّل · شريك المسار أ: أويسس للتمويل السكني (نموذج خيالي)',
    'renting',
  ),
  p(
    'PL-OASIS-CALC',
    'SP-OASIS',
    'calculator',
    'Sponsored · Calculator partner: Oasis Home Finance (fictional sample)',
    'مُموَّل · شريك الحاسبة: أويسس للتمويل السكني (نموذج خيالي)',
    'calculator',
  ),
  p(
    'PL-OASIS-OFFER',
    'SP-OASIS',
    'offers',
    'Sponsored · Oasis Home Finance (fictional sample)',
    'مُموَّل · أويسس للتمويل السكني (نموذج خيالي)',
    'OF-OASIS',
  ),
  p(
    'PL-OASIS-EVENT',
    'SP-OASIS',
    'event',
    'Sponsored · Event partner: Oasis Home Finance (fictional sample)',
    'مُموَّل · شريك الفعالية: أويسس للتمويل السكني (نموذج خيالي)',
    'EV2',
  ),
  p(
    'PL-SWIFT-HOME',
    'SP-SWIFT',
    'home-card',
    'Sponsored · Moving day offer from SwiftMove (fictional sample): 10% off packing',
    'مُموَّل · عرض يوم الانتقال من سويفت موف (نموذج خيالي): خصم 10% على التغليف',
    'home',
  ),
  p(
    'PL-SWIFT-OFFER',
    'SP-SWIFT',
    'offers',
    'Sponsored · SwiftMove (fictional sample)',
    'مُموَّل · سويفت موف (نموذج خيالي)',
    'OF-SWIFT',
  ),
  p(
    'PL-SWIFT-REQ',
    'SP-SWIFT',
    'partner-requests',
    'Sponsored · Partner requests: SwiftMove (fictional sample)',
    'مُموَّل · طلبات الشركاء: سويفت موف (نموذج خيالي)',
    'OF-SWIFT',
  ),
  p(
    'PL-SAFE-OFFER',
    'SP-SAFE',
    'offers',
    'Sponsored · SafeNest (fictional sample)',
    'مُموَّل · سيف نست (نموذج خيالي)',
    'OF-SAFE',
  ),
  p(
    'PL-SAFE-VIDEO',
    'SP-SAFE',
    'video',
    'Sponsored · Video partner: SafeNest (fictional sample)',
    'مُموَّل · شريك الفيديو: سيف نست (نموذج خيالي)',
    'A5',
  ),
]

/** The placement rule shown with every placement. */
export const PLACEMENT_RULE = L(
  'No personal data, label always visible.',
  'لا بيانات شخصية، والوسم ظاهر دائماً.',
)

export const OFFERS: Offer[] = [
  {
    id: 'OF-SWIFT',
    sponsorId: 'SP-SWIFT',
    placementId: 'PL-SWIFT-OFFER',
    title: L('SwiftMove: 10% off packing and moving', 'سويفت موف: خصم 10% على التغليف والنقل'),
    body: L(
      'A fictional sample offer for Home Ready learners moving home this season. Packing materials, packing and the move itself, with 10% off.',
      'عرض نموذجي خيالي لمتعلمي جاهز للسكن الذين ينتقلون هذا الموسم: مواد التغليف والتغليف والنقل، بخصم 10%.',
    ),
    category: L('Movers', 'النقل'),
  },
  {
    id: 'OF-OASIS',
    sponsorId: 'SP-OASIS',
    placementId: 'PL-OASIS-OFFER',
    title: L(
      'Oasis Home Finance: free mortgage pre-approval check',
      'أويسس للتمويل السكني: فحص مجاني للموافقة المبدئية على التمويل',
    ),
    body: L(
      'A fictional sample offer: a free, no-obligation check of what a lender may pre-approve, before you start viewing homes to buy.',
      'عرض نموذجي خيالي: فحص مجاني ومن دون التزام لما قد يوافق عليه المموّل مبدئياً، قبل أن تبدأ معاينة المنازل للشراء.',
    ),
    category: L('Home finance', 'التمويل السكني'),
  },
  {
    id: 'OF-SAFE',
    sponsorId: 'SP-SAFE',
    placementId: 'PL-SAFE-OFFER',
    title: L(
      'SafeNest: first month free on contents insurance',
      'سيف نست: الشهر الأول مجاناً على تأمين المحتويات',
    ),
    body: L(
      'A fictional sample offer: contents insurance for renters and owners, with the first month free.',
      'عرض نموذجي خيالي: تأمين المحتويات للمستأجرين والملاك، مع الشهر الأول مجاناً.',
    ),
    category: L('Insurance', 'التأمين'),
  },
]

export const EVENTS: DemoEvent[] = [
  {
    id: 'EV1',
    title: L(
      'Live Q&A: Renewing your tenancy in Dubai',
      'جلسة أسئلة مباشرة: تجديد عقد الإيجار في دبي',
    ),
    start: '2026-12-10T19:00:00+04:00',
    format: L('Online webinar', 'ندوة عبر الإنترنت'),
    languages: L('EN', 'الإنجليزية'),
    speaker: L(
      'Home Ready tenancy expert (fictional: Sara Haddad)',
      'خبيرة الإيجار في جاهز للسكن (خيالية: سارة حداد)',
    ),
    status: 'open',
  },
  {
    id: 'EV2',
    title: L(
      'Live Q&A: Buying your first home: ready or off-plan?',
      'جلسة أسئلة مباشرة: شراء منزلك الأول: جاهز أم على الخريطة؟',
    ),
    start: '2026-12-17T19:00:00+04:00',
    format: L('Online webinar', 'ندوة عبر الإنترنت'),
    languages: L('EN/AR', 'الإنجليزية والعربية'),
    speaker: L(
      'Fictional: Omar Al Nuaimi, property finance educator',
      'خيالي: عمر النعيمي، مثقف في التمويل العقاري',
    ),
    placementId: 'PL-OASIS-EVENT',
    status: 'open',
  },
  {
    id: 'EV3',
    title: L(
      'Moving season clinic: true cost workshop',
      'عيادة موسم الانتقال: ورشة التكلفة الحقيقية',
    ),
    start: '2027-01-14T18:30:00+04:00',
    format: L('Online', 'عبر الإنترنت'),
    languages: L('AR', 'العربية'),
    speaker: L('Home Ready team', 'فريق جاهز للسكن'),
    status: 'open',
  },
]

export const BADGES: BadgeDef[] = [
  {
    id: 'first-step',
    title: L('First Step', 'الخطوة الأولى'),
    criteria: L(
      'Take your first useful action: finish a journey or save a checklist or calculator result.',
      'اتخذ أول خطوة مفيدة: أكمل رحلة أو احفظ قائمة تحقق أو نتيجة حاسبة.',
    ),
  },
  {
    id: 'budget-builder',
    title: L('Budget Builder', 'مخطط الميزانية'),
    criteria: L(
      'Save a true-cost result in the calculator.',
      'احفظ نتيجة التكلفة الحقيقية في الحاسبة.',
    ),
  },
  {
    id: 'viewing-pro',
    title: L('Viewing Pro', 'محترف المعاينة'),
    criteria: L('Tick 80% or more of a viewing checklist.', 'أنجز 80% أو أكثر من قائمة المعاينة.'),
  },
  {
    id: 'contract-ready',
    title: L('Contract Ready', 'جاهز للعقد'),
    criteria: L(
      'Complete unit A4 and save a renewal checklist.',
      'أكمل الوحدة أ4 واحفظ قائمة التجديد.',
    ),
  },
  {
    id: 'decision-maker',
    title: L('Decision Maker', 'صانع القرار'),
    criteria: L(
      'Score 70 or more in any decision journey.',
      'احصل على 70 أو أكثر في أي رحلة قرار.',
    ),
  },
  {
    id: 'smart-buyer',
    title: L('Smart Buyer', 'المشتري الذكي'),
    criteria: L('Save a rent-vs-buy result.', 'احفظ نتيجة الإيجار مقابل الشراء.'),
  },
  {
    id: 'due-diligence',
    title: L('Due Diligence', 'العناية الواجبة'),
    criteria: L(
      'Tick 80% or more of the buying due-diligence checklist.',
      'أنجز 80% أو أكثر من قائمة العناية الواجبة للشراء.',
    ),
  },
  {
    id: 'graduate',
    title: L('Home Ready Graduate', 'خريج جاهز للسكن'),
    criteria: L('Earn a track certificate.', 'احصل على شهادة مسار.'),
  },
]
