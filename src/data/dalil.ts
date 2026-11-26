import type { DalilAnswer, Localized } from '@shared/types'
import { L } from './l'

/**
 * Dalil, the Home Ready guide (brief C10). Scripted answers only, no network: a keyword matcher
 * picks the answer, otherwise the fallback shows. Fee figures follow the figures register
 * (Ejari AED 177.75, DEWA move-in deposit AED 2,000 / 4,000 refundable).
 */

export const DALIL_GREETING: Localized = L(
  "Hi {{name}}, I'm Dalil, your Home Ready guide. Ask me anything about renting or buying a home in the UAE, and I'll point you to the official source. What are you working on today?",
  'مرحباً {{name}}، أنا دليل، مرشدك في جاهز للسكن. اسألني أي شيء عن استئجار مسكن أو شرائه في الإمارات، وسأدلّك على المصدر الرسمي. على ماذا تعمل اليوم؟',
)

export const DALIL_DISCLAIMER: Localized = L(
  'This is education, not legal or financial advice.',
  'هذه معلومات تعليمية وليست استشارة قانونية أو مالية.',
)

export const DALIL_FALLBACK: Localized = L(
  'Sorry, I can\'t answer that one yet. I can help with rent increases at renewal, upfront costs, renting or buying, title checks and how to judge an agent or building. Try one of the suggested questions, or use "Talk to a person" to send your question to the Home Ready team.',
  'عذراً، لا أستطيع الإجابة عن هذا السؤال بعد. يمكنني المساعدة في زيادة الإيجار عند التجديد، والتكاليف المقدمة، والاختيار بين الإيجار والشراء، والتحقق من سند الملكية، وكيفية تقييم وسيط أو مبنى. جرّب أحد الأسئلة المقترحة، أو استخدم "تحدث إلى شخص" لإرسال سؤالك إلى فريق جاهز للسكن.',
)

export const DALIL_ANSWERS: DalilAnswer[] = [
  {
    id: 'rent-increase',
    prompt: L(
      'Can my landlord raise my rent at renewal?',
      'هل يمكن للمالك رفع الإيجار عند التجديد؟',
    ),
    keywords: [
      'raise',
      'increase',
      'renewal',
      'renew',
      'landlord',
      'rent index',
      'rental index',
      'زيادة',
      'يرفع',
      'رفع',
      'التجديد',
      'تجديد',
      'المالك',
      'مؤشر',
    ],
    answer: L(
      'In Dubai, rent increases are linked to the RERA Rental Index for similar homes in your area, and any change to the terms needs written notice at least 90 days before your contract ends. Check your area on the DLD Rental Index calculator, then run the Renew-or-move journey. Source: Dubai Land Department; Decree No. 43 of 2013 · checked 25 Nov 2026. This is education, not legal advice.',
      'في دبي، ترتبط زيادة الإيجار بمؤشر الإيجارات الصادر عن ريرا للمساكن المماثلة في منطقتك، وأي تغيير في الشروط يحتاج إلى إشعار كتابي قبل 90 يوماً على الأقل من انتهاء عقدك. تحقق من منطقتك عبر حاسبة مؤشر الإيجارات لدى دائرة الأراضي والأملاك، ثم جرّب رحلة "تجدّد أم تنتقل؟". المصدر: دائرة الأراضي والأملاك في دبي؛ المرسوم رقم 43 لسنة 2013 · تم التحقق في 25 نوفمبر 2026. هذه معلومات تعليمية وليست استشارة قانونية.',
    ),
    sourceIds: ['dld-rental-index', 'decree-43-2013'],
    link: {
      to: '/learn/journeys/renew-or-move',
      label: L('Run the Renew-or-move journey', 'ابدأ رحلة تجدّد أم تنتقل'),
    },
  },
  {
    id: 'upfront-cost',
    prompt: L(
      'What will I pay up front for a AED 90,000 apartment?',
      'كم سأدفع مقدماً لشقة بإيجار 90,000 درهم؟',
    ),
    keywords: [
      'up front',
      'upfront',
      'pay',
      'deposit',
      'ejari',
      'cost',
      'costs',
      '90,000',
      'apartment',
      'agency',
      'مقدماً',
      'مقدما',
      'أدفع',
      'تأمين',
      'إيجاري',
      'تكلفة',
      'التكاليف',
      'شقة',
      'عمولة',
    ],
    answer: L(
      'Typically: the first cheque (depends on 1–4 cheques), a security deposit of about 5% (AED 4,500) if unfurnished, an agency fee of about 5% (AED 4,500) if an agent is used, Ejari registration of AED 177.75 online (AED 220 at a trustee centre), and a refundable DEWA move-in deposit of AED 2,000 for an apartment (AED 4,000 for a villa), paid up front and returned when you close the account. Open the True cost tab of the calculator to see your full first-year figure. Typical percentages are market practice · checked 25 Nov 2026.',
      'عادةً: الشيك الأول (حسب عدد الشيكات من 1 إلى 4)، وتأمين بنحو 5% (4,500 درهم) إذا كانت الشقة غير مفروشة، وعمولة وسيط بنحو 5% (4,500 درهم) إذا استعنت بوسيط، ورسوم تسجيل إيجاري 177.75 درهماً عبر الإنترنت (220 درهماً في مراكز أمين)، وتأمين ديوا المسترد عند الانتقال بقيمة 2,000 درهم للشقة (4,000 درهم للفيلا)، يُدفع مقدماً ويُسترد عند إغلاق الحساب. افتح تبويب "التكلفة الفعلية" في الحاسبة لترى رقم السنة الأولى كاملاً. النسب الشائعة من ممارسات السوق · تم التحقق في 25 نوفمبر 2026.',
    ),
    sourceIds: ['dld-ejari', 'dewa-move-in', 'market-practice'],
    link: {
      to: '/learn/calculator?tab=true-cost',
      label: L('Open the True cost tab', 'افتح تبويب التكلفة الفعلية'),
    },
  },
  {
    id: 'rent-or-buy',
    prompt: L('Should I buy or keep renting?', 'هل أشتري أم أستمر في الإيجار؟'),
    keywords: [
      'buy',
      'buying',
      'keep renting',
      'mortgage',
      'own',
      'أشتري',
      'الشراء',
      'شراء',
      'تمويل',
      'أستمر',
    ],
    answer: L(
      "It depends on how long you'll stay, your down payment and the full costs of buying (transfer fee, mortgage costs, service charges). The Rent vs buy calculator shows the year when buying becomes cheaper at your numbers. I can't tell you what to do with your money, but I can walk you through the Keep-renting-or-buy journey. Shall we start?",
      'يعتمد ذلك على مدة إقامتك، ودفعتك الأولى، والتكاليف الكاملة للشراء (رسوم النقل، تكاليف التمويل، رسوم الخدمات). تُظهر حاسبة الإيجار مقابل الشراء السنة التي يصبح فيها الشراء أقل تكلفة وفق أرقامك. لا أستطيع أن أخبرك بما تفعله بأموالك، لكن يمكنني مرافقتك في رحلة "تستمر في الإيجار أم تشتري؟". هل نبدأ؟',
    ),
    sourceIds: ['dld-fees', 'cbuae-mortgage'],
    link: {
      to: '/learn/journeys/rent-or-buy',
      label: L('Start the Keep-renting-or-buy journey', 'ابدأ رحلة تستمر في الإيجار أم تشتري'),
    },
  },
  {
    id: 'title-check',
    prompt: L('How do I check a property title in Dubai?', 'كيف أتحقق من سند ملكية عقار في دبي؟'),
    keywords: [
      'title',
      'deed',
      'verify',
      'verification',
      'property title',
      'escrow',
      'developer',
      'سند',
      'الملكية',
      'ملكية',
      'أتحقق',
      'التحقق',
      'ضمان',
      'المطور',
    ],
    answer: L(
      'Use Dubai Land Department\'s Title Deed Verification service with the title deed number, and check the developer and project in the DLD and RERA records. For off-plan, confirm the project has an escrow account. I\'ve added "Verify title deed" to your due-diligence checklist. Source: Dubai Land Department · checked 25 Nov 2026.',
      'استخدم خدمة التحقق من سند الملكية لدى دائرة الأراضي والأملاك في دبي برقم السند، وتحقق من المطوّر والمشروع في سجلات الدائرة وريرا. وللعقارات على الخارطة، تأكد من وجود حساب ضمان للمشروع. أضفت "التحقق من سند الملكية" إلى قائمة العناية الواجبة لديك. المصدر: دائرة الأراضي والأملاك في دبي · تم التحقق في 25 نوفمبر 2026.',
    ),
    sourceIds: ['dld-title-deed'],
    link: { to: '/learn/checklists', label: L('Open my checklists', 'افتح قوائمي') },
  },
  {
    id: 'recommend',
    prompt: L('Which agent or building do you recommend?', 'أي وسيط أو مبنى تنصح به؟'),
    keywords: [
      'recommend',
      'recommendation',
      'which agent',
      'agent',
      'building',
      'best',
      'تنصح',
      'وسيط',
      'مبنى',
      'أفضل',
      'ترشح',
    ],
    answer: L(
      "I don't recommend specific agents, buildings or developers; Home Ready stays independent. I can help you judge any option: check the agent's RERA registration, use the viewing checklist and compare homes on true yearly cost in My homes.",
      'لا أرشّح وسطاء أو مباني أو مطوّرين بعينهم؛ جاهز للسكن يبقى مستقلاً. يمكنني مساعدتك على تقييم أي خيار: تحقق من تسجيل الوسيط لدى ريرا، واستخدم قائمة المعاينة، وقارن المساكن على أساس التكلفة السنوية الفعلية في "مساكني".',
    ),
    sourceIds: ['rera-brokers'],
    link: { to: '/learn/shortlist', label: L('Open My homes', 'افتح مساكني') },
  },
]

/** Pick the scripted answer with the most keyword hits; null when nothing matches. */
export function matchDalil(text: string): DalilAnswer | null {
  const q = text.toLowerCase()
  let best: DalilAnswer | null = null
  let bestHits = 0
  for (const a of DALIL_ANSWERS) {
    const hits = a.keywords.reduce((n, k) => (q.includes(k) ? n + 1 : n), 0)
    if (hits > bestHits) {
      best = a
      bestHits = hits
    }
  }
  return best
}
