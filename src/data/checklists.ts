import type { ChecklistItemDef, ChecklistTemplate, ChecklistTemplateId } from '@shared/types'
import { L } from './l'

/**
 * Checklist templates (brief C11.6). Learners save copies to their account and tick items.
 * Every item links to the related unit or to an official source. Pure data, never mutated.
 */

const URL = {
  ejari: 'https://dubailand.gov.ae/en/eservices/register-renew-tenancy-contract/',
  rentalIndex: 'https://dubailand.gov.ae/en/eservices/rental-index/',
  rera: 'https://dubailand.gov.ae/en/eservices/broker-search/',
  dewa: 'https://dewa.gov.ae/en/consumer/supply-management/activation-of-electricity-water-move-in',
  rdsc: 'https://rdc.gov.ae/',
  cbuae: 'https://www.centralbank.ae/en/',
  titleDeed: 'https://dubailand.gov.ae/en/eservices/title-deed-verification/',
  dldServices: 'https://dubailand.gov.ae/en/eservices/',
}

type Link = ChecklistItemDef['link']

const unit = (to: string, en: string, ar: string): Link => ({ kind: 'unit', to, label: L(en, ar) })
const src = (to: string, en: string, ar: string): Link => ({ kind: 'source', to, label: L(en, ar) })

const A1 = unit(
  '/learn/tracks/renting/A1',
  'Unit A1 Your real budget',
  'الوحدة A1 ميزانيتك الحقيقية',
)
const A2 = unit('/learn/tracks/renting/A2', 'Unit A2 Choosing the area', 'الوحدة A2 اختيار المنطقة')
const A3 = unit('/learn/tracks/renting/A3', 'Unit A3 The viewing', 'الوحدة A3 المعاينة')
const A4 = unit(
  '/learn/tracks/renting/A4',
  'Unit A4 The contract and renewal',
  'الوحدة A4 العقد والتجديد',
)
const A5 = unit(
  '/learn/tracks/renting/A5',
  'Unit A5 Moving in and moving out',
  'الوحدة A5 الانتقال إلى السكن ومغادرته',
)
const B2 = unit(
  '/learn/tracks/buying/B2',
  'Unit B2 What you can afford',
  'الوحدة B2 ما يمكنك تحمّله',
)
const B3 = unit(
  '/learn/tracks/buying/B3',
  'Unit B3 Ready or off-plan',
  'الوحدة B3 جاهز أم على الخارطة',
)
const B4 = unit('/learn/tracks/buying/B4', 'Unit B4 Due diligence', 'الوحدة B4 العناية الواجبة')
const B5 = unit(
  '/learn/tracks/buying/B5',
  'Unit B5 The transaction and after',
  'الوحدة B5 إتمام الصفقة وما بعدها',
)
const EJARI = src(URL.ejari, 'DLD Ejari', 'إيجاري، دائرة الأراضي والأملاك')
const INDEX = src(URL.rentalIndex, 'DLD Rental Index', 'مؤشر الإيجارات، دائرة الأراضي والأملاك')
const RERA = src(URL.rera, 'RERA broker registry', 'سجل الوسطاء العقاريين (ريرا)')
const DEWA = src(URL.dewa, 'DEWA move-in', 'ديوا: تفعيل الخدمات عند الانتقال')
const RDSC = src(URL.rdsc, 'Rental Disputes Settlement Centre', 'مركز فض المنازعات الإيجارية')
const CBUAE = src(URL.cbuae, 'Central Bank of the UAE', 'مصرف الإمارات العربية المتحدة المركزي')
const DEED = src(
  URL.titleDeed,
  'DLD Title Deed Verification',
  'التحقق من سند الملكية، دائرة الأراضي والأملاك',
)
const DLD = src(URL.dldServices, 'DLD e-services', 'الخدمات الإلكترونية لدائرة الأراضي والأملاك')

function items(prefix: string, list: [string, string, Link][]): ChecklistItemDef[] {
  return list.map(([en, ar, link], i) => ({ id: `${prefix}-${i + 1}`, text: L(en, ar), link }))
}

const viewing = items('viewing', [
  ['Open every tap and check water pressure', 'افتح كل صنبور وتحقق من ضغط المياه', A3],
  [
    'Check that hot water works in kitchen and bathrooms',
    'تأكد من عمل المياه الساخنة في المطبخ والحمامات',
    A3,
  ],
  ['Run the air conditioning in every room', 'شغّل التكييف في كل غرفة', A3],
  ['Ask when the air conditioning was last serviced', 'اسأل عن آخر صيانة للتكييف', A3],
  [
    'Look for damp, mould or stains on ceilings and around windows',
    'ابحث عن الرطوبة أو العفن أو البقع على الأسقف وحول النوافذ',
    A3,
  ],
  ['Test windows, doors and locks', 'اختبر النوافذ والأبواب والأقفال', A3],
  ['Write down the kitchen appliances that are included', 'دوّن أجهزة المطبخ المشمولة', A3],
  [
    'Ask who pays for maintenance and how fast repairs are handled',
    'اسأل من يتحمل الصيانة وما سرعة تنفيذ الإصلاحات',
    A3,
  ],
  [
    'Ask whether cooling is included or billed separately, and by whom',
    'اسأل هل التبريد مشمول أم يُحتسب منفصلاً ومن الجهة المصدرة للفاتورة',
    A1,
  ],
  ['Ask how many cheques the landlord accepts', 'اسأل عن عدد الشيكات التي يقبلها المالك', A1],
  [
    'Ask whether the rent changes with fewer cheques',
    'اسأل هل يتغير الإيجار مع عدد أقل من الشيكات',
    A1,
  ],
  [
    'Ask to see the title deed or proof of the right to rent the home',
    'اطلب الاطلاع على سند الملكية أو ما يثبت الحق في تأجير السكن',
    A3,
  ],
  ["Check the agent's RERA registration", 'تحقق من تسجيل الوسيط لدى ريرا', RERA],
  [
    'Count the parking spaces and check visitor parking',
    'تحقق من عدد مواقف السيارات ووجود مواقف للزوار',
    A2,
  ],
  ['Check noise and construction nearby', 'تحقق من الضوضاء وأعمال البناء القريبة', A2],
  [
    'Time the commute at the hour you would really travel',
    'احسب وقت التنقل في الساعة التي ستتنقل فيها فعلاً',
    A2,
  ],
  ['Take dated photos and notes of each room', 'التقط صوراً مؤرخة ودوّن ملاحظات عن كل غرفة', A3],
  [
    'Compare this home with others on true yearly cost',
    'قارن هذا السكن بغيره على أساس التكلفة السنوية الفعلية',
    A1,
  ],
])

const renewal = items('renewal', [
  [
    'Find your contract end date and mark 90 days before it',
    'حدد تاريخ انتهاء عقدك وضع علامة قبل 90 يوماً منه',
    A4,
  ],
  [
    'Check that any rent change was notified in writing at least 90 days before the end',
    'تحقق من أن أي تغيير في الإيجار أُبلغ كتابياً قبل 90 يوماً على الأقل من الانتهاء',
    A4,
  ],
  [
    'Run the DLD Rental Index for your area and home type',
    'استخدم مؤشر الإيجارات لمنطقتك ونوع سكنك',
    INDEX,
  ],
  [
    'Compare the asked increase with the allowed increase',
    'قارن الزيادة المطلوبة بالزيادة المسموح بها',
    INDEX,
  ],
  [
    'Compare renewing with moving on true first-year cost',
    'قارن التجديد بالانتقال على أساس التكلفة الفعلية للسنة الأولى',
    A1,
  ],
  ['Reply to your landlord in writing and keep a copy', 'رد على المالك كتابياً واحتفظ بنسخة', A4],
  ['Read the new contract terms before you sign', 'اقرأ شروط العقد الجديد قبل التوقيع', A4],
  ['Renew the Ejari registration after you sign', 'جدّد تسجيل إيجاري بعد التوقيع', EJARI],
  [
    'If you cannot agree, check the Rental Disputes Settlement Centre',
    'إذا لم تتفقا، راجع مركز فض المنازعات الإيجارية',
    RDSC,
  ],
])

const moveIn = items('move-in', [
  [
    'Walk through the home with the landlord or agent on key day',
    'تجوّل في السكن مع المالك أو الوسيط يوم استلام المفاتيح',
    A5,
  ],
  ['Record the condition room by room', 'سجّل الحالة غرفة غرفة', A5],
  ['Take dated photos of every room, wall and floor', 'التقط صوراً مؤرخة لكل غرفة وجدار وأرضية', A5],
  ['Note anything broken or worn, even if small', 'دوّن أي شيء معطل أو مستهلك ولو كان بسيطاً', A5],
  ['Test every appliance and record its condition', 'اختبر كل جهاز وسجّل حالته', A5],
  ['Read the meters and note the numbers', 'اقرأ العدادات ودوّن الأرقام', DEWA],
  [
    'Sign the condition report with the landlord and keep a copy',
    'وقّع تقرير الحالة مع المالك واحتفظ بنسخة',
    A5,
  ],
  ['Keep a copy of the signed tenancy contract', 'احتفظ بنسخة من عقد الإيجار الموقّع', A4],
  [
    'Register the contract in Ejari and keep the certificate',
    'سجّل العقد في إيجاري واحتفظ بالشهادة',
    EJARI,
  ],
  [
    'Open your DEWA account and pay the refundable deposit',
    'افتح حساب ديوا وادفع التأمين المسترد',
    DEWA,
  ],
  ['Keep receipts for cheques, deposit and fees', 'احتفظ بإيصالات الشيكات والتأمين والرسوم', A5],
  ['Send repair requests in writing and keep them', 'أرسل طلبات الإصلاح كتابياً واحتفظ بها', A5],
])

const moveOut = items('move-out', [
  ['Give notice as your contract requires', 'قدّم الإشعار كما ينص عقدك', A5],
  [
    'Book a final inspection with the landlord or agent',
    'احجز موعداً للمعاينة النهائية مع المالك أو الوسيط',
    A5,
  ],
  [
    'Compare the home with your move-in condition report',
    'قارن حالة السكن بتقرير الحالة عند الانتقال',
    A5,
  ],
  ['Repair damage beyond normal wear and tear', 'أصلح الأضرار التي تتجاوز الاستهلاك العادي', A5],
  ['Clean the home and take dated photos', 'نظّف السكن والتقط صوراً مؤرخة', A5],
  ['Settle the final DEWA bill', 'سدّد فاتورة ديوا النهائية', DEWA],
  ['Close the DEWA account to recover its deposit', 'أغلق حساب ديوا لاسترداد التأمين', DEWA],
  [
    'Settle and close the cooling account to recover its deposit',
    'سدّد حساب التبريد وأغلقه لاسترداد تأمينه',
    A5,
  ],
  [
    'Ask for the security deposit back in writing, with deductions explained',
    'اطلب استرداد تأمين الإيجار كتابياً مع توضيح أي خصومات',
    A5,
  ],
  [
    'If deductions seem unfair, check the Rental Disputes Settlement Centre',
    'إذا بدت الخصومات غير عادلة، راجع مركز فض المنازعات الإيجارية',
    RDSC,
  ],
])

const dd = items('due-diligence', [
  [
    'Check the developer registration in DLD and RERA records',
    'تحقق من تسجيل المطوّر في سجلات دائرة الأراضي وريرا',
    B4,
  ],
  [
    'For off-plan, confirm the project has an escrow account',
    'للعقارات على الخارطة، تأكد من وجود حساب ضمان للمشروع',
    B3,
  ],
  ['Read the service-charge history of the building', 'اطّلع على سجل رسوم الخدمات في المبنى', B4],
  [
    'Get a mortgage pre-approval before you make an offer',
    'احصل على موافقة مبدئية على التمويل قبل تقديم العرض',
    CBUAE,
  ],
  [
    'Check the 50% debt-burden cap against your income',
    'تحقق من حد عبء الدين البالغ 50% مقارنة بدخلك',
    B2,
  ],
  [
    'Budget the 4% DLD transfer fee and mortgage registration fee',
    'خصص ميزانية لرسوم النقل 4% ورسوم تسجيل الرهن',
    DLD,
  ],
  ["Check the agent's RERA registration", 'تحقق من تسجيل الوسيط لدى ريرا', RERA],
  [
    'Check for mortgages or other claims on the property',
    'تحقق من وجود رهون أو التزامات أخرى على العقار',
    DEED,
  ],
  ['Read the sale agreement before you pay a deposit', 'اقرأ اتفاقية البيع قبل دفع أي عربون', B5],
  ['Book a snagging inspection at handover', 'احجز فحصاً للعيوب عند التسليم', B5],
  [
    'Register the transfer and keep the new title deed',
    'سجّل نقل الملكية واحتفظ بسند الملكية الجديد',
    B5,
  ],
])
dd.unshift({
  id: 'dd-title-deed',
  text: L('Verify the title deed on DLD', 'تحقق من سند الملكية لدى دائرة الأراضي والأملاك'),
  link: DEED,
})

export const CHECKLIST_TEMPLATES: ChecklistTemplate[] = [
  {
    id: 'viewing',
    track: 'A',
    title: L('Viewing checklist', 'قائمة المعاينة'),
    summary: L(
      'Treat a viewing like an inspection: what to test and what to ask.',
      'تعامل مع المعاينة كأنها فحص: ما الذي تختبره وما الذي تسأل عنه.',
    ),
    items: viewing,
  },
  {
    id: 'renewal',
    track: 'A',
    title: L('Renewal checklist', 'قائمة التجديد'),
    summary: L(
      'Notice periods, the Rental Index and Ejari before and after you renew.',
      'مدد الإشعار ومؤشر الإيجارات وإيجاري قبل التجديد وبعده.',
    ),
    items: renewal,
  },
  {
    id: 'move-in',
    track: 'A',
    title: L('Move-in condition checklist', 'قائمة حالة السكن عند الانتقال'),
    summary: L(
      'Record the condition of the home on key day to protect your deposit.',
      'سجّل حالة السكن يوم استلام المفاتيح لحماية التأمين.',
    ),
    items: moveIn,
  },
  {
    id: 'move-out',
    track: 'A',
    title: L('Move-out and deposit checklist', 'قائمة المغادرة واسترداد التأمين'),
    summary: L(
      'Leave well, close your accounts and get your deposits back.',
      'غادر بشكل سليم وأغلق حساباتك واسترد مبالغ التأمين.',
    ),
    items: moveOut,
  },
  {
    id: 'due-diligence',
    track: 'B',
    title: L('Buying due-diligence checklist', 'قائمة العناية الواجبة عند الشراء'),
    summary: L(
      'The checks before you pay for a home: title, developer, escrow and costs.',
      'الفحوص قبل الدفع: سند الملكية والمطوّر وحساب الضمان والتكاليف.',
    ),
    items: dd,
  },
]

export const CHECKLIST_BY_ID = Object.fromEntries(
  CHECKLIST_TEMPLATES.map((c) => [c.id, c]),
) as Record<ChecklistTemplateId, ChecklistTemplate>
