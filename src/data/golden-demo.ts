import type { Localized, PersonaId } from '@shared/types'
import { aed } from '@/domain/calculator-summary'
import { JOURNEY1, RENT_BUY_DEFAULTS } from './figures'
import { L } from './l'

export interface GuideStep {
  persona: PersonaId | null
  to: string
  title: Localized
  hint: Localized
  /** Reset the demo before this step (the start of the story). */
  reset?: boolean
}

const jvc = aed(JOURNEY1.jvcFirstYear)
const renew = aed(JOURNEY1.renewAllowed)
const jvcAr = jvc.replace('AED', 'درهم')
const renewAr = renew.replace('AED', 'درهم')
const h = RENT_BUY_DEFAULTS.horizonYears

/** Golden path = brief C16 click-path (11 steps), with Vera's 25 Nov updates. Figures from figures.ts. */
export const GOLDEN_DEMO: GuideStep[] = [
  {
    persona: null,
    to: '/',
    reset: true,
    title: L('Landing page', 'الصفحة الرئيسية'),
    hint: L(
      'Show the hero, the two tracks, the Dalil card and the labelled partner tile. Switch to Arabic and back.',
      'اعرض الواجهة والمسارين وبطاقة دليل وبطاقة الشريك الموسومة. بدّل إلى العربية ثم عد.',
    ),
  },
  {
    persona: null,
    to: '/register',
    title: L('Join free', 'انضم مجاناً'),
    hint: L(
      'Show the form: marketing emails are unticked. Then log in as aisha.renter.',
      'اعرض النموذج: رسائل التسويق غير محددة. ثم سجّل الدخول باسم aisha.renter.',
    ),
  },
  {
    persona: 'L01',
    to: '/learn/home',
    title: L("Aisha's Home", 'الصفحة الرئيسية لعائشة'),
    hint: L(
      'Next action: "Your tenancy in Al Barsha renews in 84 days."',
      'الخطوة التالية: "يتجدد عقد إيجارك في البرشاء بعد 84 يوماً."',
    ),
  },
  {
    persona: 'L01',
    to: '/learn/tracks/renting/A4',
    title: L('Track A, unit A4', 'المسار أ، الوحدة أ4'),
    hint: L(
      'Video placeholder, then the reading with its sources and "Checked on 25 Nov 2026".',
      'عنصر الفيديو، ثم القراءة مع مصادرها و"تم التحقق في 25 نوفمبر 2026".',
    ),
  },
  {
    persona: 'L01',
    to: '/learn/journeys/renew-or-move',
    title: L('Renew or move?', 'جدد أم انتقل؟'),
    hint: L(
      `Rental Index step (5%, ${renew}), true-cost comparison: JVC ${jvc} vs renewing at ${renew}. Result ${JOURNEY1.aishaScore}/100: save the checklist, set the reminder.`,
      `خطوة مؤشر الإيجارات (5%، ${renewAr})، ومقارنة التكلفة الحقيقية: قرية جميرا الدائرية ${jvcAr} مقابل التجديد بـ ${renewAr}. النتيجة ${JOURNEY1.aishaScore}/100: احفظ القائمة واضبط التذكير.`,
    ),
  },
  {
    persona: 'L01',
    to: '/learn/assistant',
    title: L('Ask Dalil', 'اسأل دليل'),
    hint: L(
      'Ask "Can my landlord raise my rent at renewal?"',
      'اسأل "هل يمكن للمالك رفع الإيجار عند التجديد؟"',
    ),
  },
  {
    persona: 'L01',
    to: '/learn/offers',
    title: L('Offers and consent', 'العروض والموافقة'),
    hint: L(
      'Open the sponsored offer and the separate consent dialog. Do not tick.',
      'افتح العرض المموّل ونافذة الموافقة المنفصلة. لا تحدد المربع.',
    ),
  },
  {
    persona: 'L02',
    to: '/learn/calculator?tab=rent-vs-buy',
    title: L("Rohan's rent vs buy", 'الإيجار مقابل الشراء لروهان'),
    hint: L(
      `Change the horizon ${h} to 4 years: totals and chart change; break-even stays year 3. Save, then open the due-diligence step and the DLD Title Deed Verification link.`,
      `غيّر المدة من ${h} إلى 4 سنوات: تتغير المجاميع والرسم؛ وتبقى نقطة التعادل في السنة 3. احفظ، ثم افتح خطوة العناية الواجبة ورابط التحقق من سند الملكية.`,
    ),
  },
  {
    persona: 'O01',
    to: '/admin/content',
    title: L("Maya's programme view", 'عرض البرنامج لمايا'),
    hint: L(
      'Content (EN/AR, check dates), then Approvals, Sponsors and placements, Reports.',
      'المحتوى (الإنجليزية والعربية وتواريخ التحقق)، ثم الموافقات والرعاة والمساحات والتقارير.',
    ),
  },
  {
    persona: 'S01',
    to: '/sponsor/performance',
    title: L('Sponsor performance', 'أداء الراعي'),
    hint: L('Aggregate performance only, no personal data.', 'أداء إجمالي فقط، دون بيانات شخصية.'),
  },
  {
    persona: 'H01',
    to: '/leadership/impact',
    title: L('Leadership impact', 'أثر البرنامج للقيادة'),
    hint: L(
      'K1 to K4, the funnel and the impact story.',
      'المؤشرات من K1 إلى K4 ومسار التحويل وقصة الأثر.',
    ),
  },
]
