import type {
  Announcement,
  Approval,
  AuditEntry,
  ContentItem,
  DemoNotification,
  EmailTemplate,
  LearnerRecord,
  Localized,
  PlatformSettings,
  ReviewItem,
} from '@shared/types'
import { L } from './l'
import { CHECKED_ON } from './sources'

/** Staff-side seed (C8.2, C8.3, C14, C15). Staff content is bilingual (en + ar). Fictional. */

// ---------------------------------------------------------------- 12 named learners (C15)

const lr = (
  id: string,
  name: string,
  email: string,
  rest: Partial<LearnerRecord> &
    Pick<LearnerRecord, 'emirate' | 'track' | 'progress' | 'joined' | 'lastActive'>,
): LearnerRecord => ({
  id,
  name,
  email,
  situation: rest.track === 'A' ? 'renewing' : 'buying',
  household: 'single',
  budget: '8-12',
  source: 'social',
  language: 'en',
  returned30: false,
  reminders: 0,
  partnerConsents: 0,
  marketing: false,
  journeys: [],
  ...rest,
})

export const SEED_LEARNERS: LearnerRecord[] = [
  lr('LR01', 'Aisha Rahman', 'aisha.rahman@example.com', {
    personaId: 'L01',
    emirate: 'dubai',
    track: 'A',
    situation: 'renewing',
    household: 'couple',
    budget: '8-12',
    source: 'social',
    progress: 60,
    joined: '2026-11-18',
    firstUsefulActionAt: '2026-11-19',
    lastActive: '2026-11-22',
    returned30: true,
    reminders: 1,
    partnerConsents: 1,
    journeys: [{ journeyId: 'renew-or-move', score: 78, at: '2026-11-21' }],
  }),
  lr('LR02', 'Rohan Mehta', 'rohan.mehta@example.com', {
    personaId: 'L02',
    emirate: 'dubai',
    track: 'B',
    situation: 'thinking-buy',
    household: 'family',
    budget: '12-20',
    source: 'search',
    progress: 40,
    joined: '2026-11-10',
    firstUsefulActionAt: '2026-11-17',
    lastActive: '2026-11-18',
    returned30: true,
    reminders: 1,
    journeys: [{ journeyId: 'rent-or-buy', score: 71, at: '2026-11-17' }],
  }),
  lr('LR03', 'Fatima Al Hashimi', 'fatima.alhashimi@example.com', {
    emirate: 'dubai',
    track: 'A',
    language: 'ar',
    household: 'family',
    source: 'employer',
    progress: 100,
    joined: '2026-09-14',
    firstUsefulActionAt: '2026-09-15',
    lastActive: '2026-11-19',
    returned30: true,
    reminders: 2,
    journeys: [{ journeyId: 'renew-or-move', score: 92, at: '2026-09-15' }],
  }),
  lr('LR04', 'Daniel Okafor', 'daniel.okafor@example.com', {
    emirate: 'dubai',
    track: 'A',
    situation: 'moving',
    source: 'search',
    progress: 20,
    joined: '2026-11-08',
    lastActive: '2026-11-08',
  }),
  lr('LR05', 'Mariam Saeed', 'mariam.saeed@example.com', {
    emirate: 'sharjah',
    track: 'A',
    language: 'ar',
    household: 'couple',
    source: 'friend',
    progress: 80,
    joined: '2026-10-02',
    firstUsefulActionAt: '2026-10-04',
    lastActive: '2026-11-16',
    returned30: true,
    reminders: 1,
    journeys: [{ journeyId: 'renew-or-move', score: 66, at: '2026-10-04' }],
  }),
  lr('LR06', 'Arjun Nair', 'arjun.nair@example.com', {
    emirate: 'dubai',
    track: 'B',
    household: 'family',
    budget: '12-20',
    source: 'social',
    progress: 60,
    joined: '2026-09-28',
    firstUsefulActionAt: '2026-10-01',
    lastActive: '2026-11-12',
    returned30: true,
    journeys: [{ journeyId: 'rent-or-buy', score: 84, at: '2026-10-01' }],
  }),
  lr('LR07', 'Layla Haddad', 'layla.haddad@example.com', {
    emirate: 'abu-dhabi',
    track: 'A',
    language: 'ar',
    source: 'event',
    progress: 0,
    joined: '2026-11-11',
    lastActive: '2026-11-11',
  }),
  lr('LR08', 'Yousef Al Marzouqi', 'yousef.almarzouqi@example.com', {
    emirate: 'dubai',
    track: 'B',
    language: 'ar',
    household: 'family',
    budget: 'o20',
    source: 'partner',
    progress: 40,
    joined: '2026-10-20',
    firstUsefulActionAt: '2026-10-22',
    lastActive: '2026-11-02',
    partnerConsents: 1,
    journeys: [{ journeyId: 'rent-or-buy', score: 58, at: '2026-10-22' }],
  }),
  lr('LR09', 'Grace Thompson', 'grace.thompson@example.com', {
    emirate: 'dubai',
    track: 'A',
    situation: 'moving',
    source: 'social',
    progress: 40,
    joined: '2026-11-03',
    firstUsefulActionAt: '2026-11-05',
    lastActive: '2026-11-21',
    returned30: true,
    reminders: 1,
  }),
  lr('LR10', 'Omar Khalil', 'omar.khalil@example.com', {
    emirate: 'sharjah',
    track: 'A',
    household: 'couple',
    budget: '5-8',
    source: 'friend',
    progress: 0,
    joined: '2026-11-06',
    lastActive: '2026-11-06',
  }),
  lr('LR11', 'Priya Menon', 'priya.menon@example.com', {
    emirate: 'dubai',
    track: 'B',
    household: 'couple',
    budget: '12-20',
    source: 'employer',
    progress: 100,
    joined: '2026-09-07',
    firstUsefulActionAt: '2026-09-09',
    lastActive: '2026-11-20',
    returned30: true,
    reminders: 1,
    marketing: true,
    journeys: [{ journeyId: 'rent-or-buy', score: 88, at: '2026-09-09' }],
  }),
  lr('LR12', 'Hamad Al Ketbi', 'hamad.alketbi@example.com', {
    emirate: 'dubai',
    track: 'A',
    language: 'ar',
    source: 'search',
    progress: 0,
    joined: '2026-11-04',
    lastActive: '2026-11-04',
  }),
]

// ---------------------------------------------------------------- content (C8.2): 10 published, 4 in review, 6 draft (+1 approved)

const ci = (
  id: string,
  kind: ContentItem['kind'],
  title: Localized,
  status: ContentItem['status'],
  en: ContentItem['en'],
  ar: ContentItem['ar'],
  sourceIds: string[],
  extra: Partial<ContentItem> = {},
): ContentItem => ({
  id,
  kind,
  title,
  status,
  en,
  ar,
  sourceIds,
  checkedOn: CHECKED_ON,
  updatedAt: '2026-11-24T10:00:00+04:00',
  arDraft: ar !== 'published',
  ...extra,
})

export const SEED_CONTENT: ContentItem[] = [
  ci(
    'CT-A1',
    'unit',
    L('A1 Your real budget', 'A1 ميزانيتك الحقيقية'),
    'published',
    'published',
    'published',
    ['dld-ejari', 'dewa-move-in', 'market-practice'],
    { code: 'A1', track: 'A' },
  ),
  ci(
    'CT-A2',
    'unit',
    L('A2 Choosing the area', 'A2 اختيار المنطقة'),
    'published',
    'published',
    'published',
    ['dld-rental-index'],
    { code: 'A2', track: 'A' },
  ),
  ci(
    'CT-A3',
    'unit',
    L('A3 The viewing', 'A3 المعاينة'),
    'published',
    'published',
    'published',
    ['rera-brokers'],
    {
      code: 'A3',
      track: 'A',
    },
  ),
  ci(
    'CT-A5',
    'unit',
    L('A5 Moving in and moving out', 'A5 الانتقال إلى المسكن والخروج منه'),
    'published',
    'published',
    'published',
    ['dld-ejari'],
    { code: 'A5', track: 'A' },
  ),
  ci(
    'CT-VA1',
    'video',
    L('Video A1 Your real budget (3:00)', 'فيديو A1 ميزانيتك الحقيقية (3:00)'),
    'published',
    'published',
    'published',
    [],
    { code: 'A1', track: 'A' },
  ),
  ci(
    'CT-J1',
    'journey',
    L('Journey: Renew or move?', 'رحلة: تجدّد أم تنتقل؟'),
    'published',
    'published',
    'published',
    ['dld-rental-index', 'decree-43-2013'],
    { track: 'A' },
  ),
  ci(
    'CT-J2',
    'journey',
    L('Journey: Keep renting or buy?', 'رحلة: تستمر في الإيجار أم تشتري؟'),
    'published',
    'published',
    'published',
    ['dld-fees', 'cbuae-mortgage'],
    { track: 'B' },
  ),
  ci(
    'CT-CD1',
    'calc-default',
    L(
      'Calculator default: Ejari AED 177.75 (AED 220 trustee centre)',
      'قيمة افتراضية في الحاسبة: إيجاري 177.75 درهماً (220 درهماً في مركز أمين)',
    ),
    'published',
    'published',
    'published',
    ['dld-ejari'],
  ),
  ci(
    'CT-CD2',
    'calc-default',
    L(
      'Calculator default: DEWA move-in deposit AED 2,000 / 4,000 (refundable)',
      'قيمة افتراضية في الحاسبة: تأمين ديوا عند الانتقال 2,000 / 4,000 درهم (مسترد)',
    ),
    'published',
    'published',
    'published',
    ['dewa-move-in'],
  ),
  ci(
    'CT-CL1',
    'checklist',
    L('Viewing checklist (18 items)', 'قائمة المعاينة (18 بنداً)'),
    'published',
    'published',
    'published',
    ['rera-brokers'],
    { track: 'A' },
  ),
  ci(
    'CT-A4',
    'unit',
    L('A4 The contract and renewal', 'A4 العقد والتجديد'),
    'in-review',
    'in-review',
    'in-review',
    ['law-26-2007', 'law-33-2008', 'decree-43-2013', 'dld-ejari'],
    { code: 'A4', track: 'A' },
  ),
  ci(
    'CT-B3',
    'unit',
    L('B3 Ready or off-plan', 'B3 جاهز أم على الخارطة'),
    'in-review',
    'in-review',
    'draft',
    ['dld-fees'],
    {
      code: 'B3',
      track: 'B',
    },
  ),
  ci(
    'CT-CD3',
    'calc-default',
    L(
      'Calculator default: Mortgage registration fee 0.25% + AED 290 admin',
      'قيمة افتراضية في الحاسبة: رسوم تسجيل الرهن 0.25% + 290 درهماً رسوماً إدارية',
    ),
    'in-review',
    'in-review',
    'in-review',
    ['dld-fees'],
  ),
  ci(
    'CT-CL2',
    'checklist',
    L('Renewal checklist (9 items)', 'قائمة التجديد (9 بنود)'),
    'in-review',
    'in-review',
    'in-review',
    ['dld-rental-index', 'dld-ejari'],
    { track: 'A' },
  ),
  ci(
    'CT-B1',
    'unit',
    L('B1 Rent or buy?', 'B1 أستأجر أم أشتري؟'),
    'draft',
    'draft',
    'draft',
    ['dld-fees'],
    {
      code: 'B1',
      track: 'B',
    },
  ),
  ci(
    'CT-B2',
    'unit',
    L('B2 What you can afford', 'B2 ما الذي تستطيع تحمله'),
    'draft',
    'draft',
    'draft',
    ['cbuae-mortgage'],
    {
      code: 'B2',
      track: 'B',
    },
  ),
  ci(
    'CT-B4',
    'unit',
    L('B4 Due diligence', 'B4 العناية الواجبة'),
    'draft',
    'draft',
    'draft',
    ['dld-title-deed'],
    {
      code: 'B4',
      track: 'B',
    },
  ),
  ci(
    'CT-B5',
    'unit',
    L('B5 The transaction and after', 'B5 المعاملة وما بعدها'),
    'draft',
    'draft',
    'draft',
    ['dld-fees'],
    {
      code: 'B5',
      track: 'B',
    },
  ),
  ci(
    'CT-CL3',
    'checklist',
    L('Buying due-diligence checklist (12 items)', 'قائمة العناية الواجبة عند الشراء (12 بنداً)'),
    'draft',
    'draft',
    'draft',
    ['dld-title-deed'],
    { track: 'B' },
  ),
  ci(
    'CT-CL4',
    'checklist',
    L('Move-out and deposit checklist (10 items)', 'قائمة المغادرة واسترداد التأمين (10 بنود)'),
    'draft',
    'draft',
    'draft',
    ['dewa-move-in'],
    { track: 'A' },
  ),
  ci(
    'CT-CD4',
    'calc-default',
    L(
      'Calculator default: DLD transfer fee 4%',
      'قيمة افتراضية في الحاسبة: رسوم نقل الملكية لدى دائرة الأراضي والأملاك 4%',
    ),
    'approved',
    'approved',
    'approved',
    ['dld-fees'],
  ),
]

// ---------------------------------------------------------------- reviewer queue (C8.3)

export const SEED_REVIEWS: ReviewItem[] = [
  {
    id: 'RV1',
    contentId: 'CT-A4',
    title: L('Unit A4 "The contract and renewal"', 'الوحدة A4 «العقد والتجديد»'),
    languages: ['en', 'ar'],
    enText:
      'At renewal, either side that wants to change the terms, including the rent, must give the other written notice at least 90 days before the contract ends. Rent increases are linked to the RERA Rental Index.',
    arText:
      'عند التجديد، يجب على أي طرف يرغب في تغيير الشروط، بما في ذلك الإيجار، إخطار الطرف الآخر كتابياً قبل 90 يوماً على الأقل من انتهاء العقد. ترتبط زيادات الإيجار بمؤشر الإيجارات لدى ريرا.',
    claims: [
      {
        id: 'RV1-c1',
        text: L(
          '90 days written notice to change terms at renewal',
          'إخطار كتابي قبل 90 يوماً لتغيير الشروط عند التجديد',
        ),
        sourceId: 'law-33-2008',
        checkedOn: CHECKED_ON,
      },
      {
        id: 'RV1-c2',
        text: L(
          'Rent increases linked to the RERA Rental Index',
          'زيادات الإيجار مرتبطة بمؤشر الإيجارات لدى ريرا',
        ),
        sourceId: 'decree-43-2013',
        checkedOn: CHECKED_ON,
      },
      {
        id: 'RV1-c3',
        text: L(
          '12 months notice for personal use or sale, via notary or registered mail',
          'إخطار قبل 12 شهراً للاستخدام الشخصي أو البيع، عبر الكاتب العدل أو البريد المسجل',
        ),
        sourceId: 'law-33-2008',
        checkedOn: CHECKED_ON,
      },
      {
        id: 'RV1-c4',
        text: L('Tenancy contracts registered in Ejari', 'تسجيل عقود الإيجار في إيجاري'),
        sourceId: 'dld-ejari',
        checkedOn: CHECKED_ON,
      },
    ],
    submittedAt: '2026-11-23T10:00:00+04:00',
    dueAt: '2026-11-27T18:00:00+04:00',
    status: 'pending',
  },
  {
    id: 'RV2',
    contentId: 'CT-B3',
    title: L('Unit B3 "Ready or off-plan"', 'الوحدة B3 «جاهز أم على الخارطة»'),
    languages: ['en'],
    enText:
      'Off-plan payments go into a project escrow account. Check the project status and escrow in the DLD records before you pay.',
    arText: '',
    claims: [
      {
        id: 'RV2-c1',
        text: L(
          'Off-plan payments are made into a project escrow account',
          'تُدفع مبالغ الشراء على الخارطة في حساب ضمان خاص بالمشروع',
        ),
        sourceId: 'dld-fees',
        checkedOn: CHECKED_ON,
      },
      {
        id: 'RV2-c2',
        text: L(
          'Developer and project registration can be checked with DLD and RERA',
          'يمكن التحقق من تسجيل المطوّر والمشروع لدى دائرة الأراضي والأملاك وريرا',
        ),
        sourceId: 'rera-brokers',
        checkedOn: CHECKED_ON,
      },
    ],
    submittedAt: '2026-11-22T15:00:00+04:00',
    dueAt: '2026-11-26T18:00:00+04:00',
    status: 'pending',
  },
  {
    id: 'RV3',
    contentId: 'CT-CD3',
    title: L(
      'Calculator default "Mortgage registration fee 0.25% + AED 290 admin"',
      'قيمة افتراضية في الحاسبة «رسوم تسجيل الرهن 0.25% + 290 درهماً رسوماً إدارية»',
    ),
    languages: ['en', 'ar'],
    enText: 'Mortgage registration: 0.25% of the loan amount plus an AED 290 admin fee (Dubai).',
    arText: 'تسجيل الرهن: 0.25% من قيمة القرض بالإضافة إلى رسوم إدارية قدرها 290 درهماً (دبي).',
    claims: [
      {
        id: 'RV3-c1',
        text: L(
          'Mortgage registration fee 0.25% of loan amount',
          'رسوم تسجيل الرهن 0.25% من قيمة القرض',
        ),
        sourceId: 'dld-fees',
        checkedOn: CHECKED_ON,
      },
      {
        id: 'RV3-c2',
        text: L('AED 290 admin fee', 'رسوم إدارية قدرها 290 درهماً'),
        sourceId: 'dld-fees',
        checkedOn: CHECKED_ON,
      },
    ],
    submittedAt: '2026-11-24T09:00:00+04:00',
    dueAt: '2026-11-28T18:00:00+04:00',
    status: 'pending',
  },
  {
    id: 'RV4',
    contentId: 'CT-CL2',
    title: L('Renewal checklist (9 items)', 'قائمة التجديد (9 بنود)'),
    languages: ['en', 'ar'],
    enText:
      'Check the notice date (90 days), run the DLD Rental Index for your area, reply in writing, renew Ejari after you sign.',
    arText:
      'تحقق من تاريخ الإخطار (90 يوماً)، واستخدم مؤشر الإيجارات لمنطقتك، وردّ كتابياً، وجدّد إيجاري بعد التوقيع.',
    claims: [
      {
        id: 'RV4-c1',
        text: L(
          'Ejari registration AED 177.75 online (AED 220 at a trustee centre)',
          'تسجيل إيجاري 177.75 درهماً عبر الإنترنت (220 درهماً في مركز أمين)',
        ),
        sourceId: 'dld-ejari',
        checkedOn: CHECKED_ON,
      },
      {
        id: 'RV4-c2',
        text: L(
          'Rental Index sets the allowed increase',
          'يحدد مؤشر الإيجارات نسبة الزيادة المسموح بها',
        ),
        sourceId: 'dld-rental-index',
        checkedOn: CHECKED_ON,
      },
    ],
    submittedAt: '2026-11-24T12:00:00+04:00',
    dueAt: '2026-11-29T18:00:00+04:00',
    status: 'pending',
  },
]

// ---------------------------------------------------------------- approvals (C8.2)

const A4_AR = L('Unit A4 The contract: AR version', 'الوحدة A4 العقد: النسخة العربية')
const CD4 = L(
  'Calculator default: DLD transfer fee 4%',
  'قيمة افتراضية في الحاسبة: رسوم نقل الملكية لدى دائرة الأراضي والأملاك 4%',
)
const B3 = L('Unit B3 Ready or off-plan', 'الوحدة B3 جاهز أم على الخارطة')

export const SEED_APPROVALS: Approval[] = [
  {
    id: 'AP1',
    contentId: 'CT-A4',
    title: A4_AR,
    outcome: 'approved',
    note: L('Arabic version approved.', 'تمت الموافقة على النسخة العربية.'),
    reviewer: 'Khalid Al Mansoori',
    at: '2026-11-24T16:00:00+04:00',
    published: false,
  },
  {
    id: 'AP2',
    contentId: 'CT-CD4',
    title: CD4,
    outcome: 'approved',
    note: L('Matches DLD fee schedule.', 'مطابقة لجدول رسوم دائرة الأراضي والأملاك.'),
    reviewer: 'Khalid Al Mansoori',
    at: '2026-11-24T16:20:00+04:00',
    published: false,
  },
  {
    id: 'AP3',
    contentId: 'CT-B3',
    title: B3,
    outcome: 'changes',
    note: L('Changes requested: add escrow source.', 'طُلبت تعديلات: أضف مصدر حساب الضمان.'),
    reviewer: 'Khalid Al Mansoori',
    at: '2026-11-24T16:40:00+04:00',
    published: false,
  },
]

// ---------------------------------------------------------------- email templates (C14)

const EMAIL = L('Email', 'البريد الإلكتروني')
const EMAIL_IN = L('Email + in-platform', 'البريد الإلكتروني + داخل المنصة')

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'ET-welcome',
    trigger: L('Registration', 'التسجيل'),
    channel: EMAIL,
    subject: L('Welcome to Home Ready, {first name}', 'مرحباً بك في جاهز للسكن، {الاسم الأول}'),
    body: L(
      "Hi {first name}, welcome to Home Ready, Potential.org's free programme on renting and buying a home in the UAE. Your first step takes about 10 minutes: {Run the Renew-or-move journey | Try the rent-vs-buy calculator}. You'll get a personal 'what to check' list you can save and come back to. Remember: Home Ready is education, not legal or financial advice. The Home Ready team, Potential.org",
      'مرحباً {الاسم الأول}، أهلاً بك في جاهز للسكن، برنامج Potential.org المجاني عن استئجار المسكن وشرائه في الإمارات. خطوتك الأولى تستغرق نحو 10 دقائق: {ابدأ رحلة التجديد أو الانتقال | جرّب حاسبة الإيجار مقابل الشراء}. ستحصل على قائمة شخصية بما يجب التحقق منه، يمكنك حفظها والعودة إليها. تذكّر: جاهز للسكن برنامج تعليمي، وليس استشارة قانونية أو مالية. فريق جاهز للسكن، Potential.org',
    ),
  },
  {
    id: 'ET-nudge',
    trigger: L('No useful action after 7 days', 'لا خطوة مفيدة بعد 7 أيام'),
    channel: EMAIL_IN,
    subject: L('Your 10-minute first step is waiting', 'خطوتك الأولى ذات الدقائق العشر بانتظارك'),
    body: L(
      'Hi {first name}, run the {journey} and get your personal "what to check" list. It takes about 10 minutes.',
      'مرحباً {الاسم الأول}، ابدأ {الرحلة} واحصل على قائمتك الشخصية بما يجب التحقق منه. تستغرق نحو 10 دقائق.',
    ),
  },
  {
    id: 'ET-renewal',
    trigger: L(
      'Renewal reminder (90 days before contract end, opt-in)',
      'تذكير التجديد (قبل 90 يوماً من انتهاء العقد، باختيار المستخدم)',
    ),
    channel: EMAIL_IN,
    subject: L(
      'Your tenancy renews in 90 days: what to check',
      'يتجدد عقد إيجارك خلال 90 يوماً: ما الذي يجب التحقق منه',
    ),
    body: L(
      "Hi {first name}, your contract for {home} ends on {date}. Any change to the rent needs 90 days' notice in Dubai. Check the Rental Index and open your renewal checklist.",
      'مرحباً {الاسم الأول}، ينتهي عقدك لـ {المسكن} في {التاريخ}. أي تغيير في الإيجار يحتاج إلى إخطار قبل 90 يوماً في دبي. راجع مؤشر الإيجارات وافتح قائمة التجديد.',
    ),
  },
  {
    id: 'ET-certificate',
    trigger: L('Certificate issued', 'إصدار الشهادة'),
    channel: EMAIL,
    subject: L("You're Home Ready: your certificate", 'أنت جاهز للسكن: شهادتك'),
    body: L(
      'Congratulations {first name}, you completed {track}. Download your certificate from Potential.courses.',
      'تهانينا {الاسم الأول}، أكملت {المسار}. نزّل شهادتك من Potential.courses.',
    ),
  },
  {
    id: 'ET-event',
    trigger: L('Event reminder (24 h before)', 'تذكير بالفعالية (قبل 24 ساعة)'),
    channel: EMAIL_IN,
    subject: L('Tomorrow: {event}', 'غداً: {الفعالية}'),
    body: L(
      'Hi {first name}, {event} starts tomorrow at {time}. Join link: {link}.',
      'مرحباً {الاسم الأول}، تبدأ {الفعالية} غداً الساعة {الوقت}. رابط الانضمام: {الرابط}.',
    ),
  },
  {
    id: 'ET-approved',
    trigger: L('Content approved (staff)', 'الموافقة على المحتوى (للموظفين)'),
    channel: L('In-platform', 'داخل المنصة'),
    subject: L('Approved: {item}', 'تمت الموافقة: {العنصر}'),
    body: L(
      '{reviewer} approved {item} ({language}). Ready to publish.',
      'وافق {المراجع} على {العنصر} ({اللغة}). جاهز للنشر.',
    ),
  },
  {
    id: 'ET-partner',
    trigger: L('Partner request confirmed (opt-in)', 'تأكيد طلب الشريك (باختيار المستخدم)'),
    channel: EMAIL,
    subject: L("We've passed your request to {partner}", 'أرسلنا طلبك إلى {الشريك}'),
    body: L(
      'You asked {partner} to contact you about {offer}. We shared only your name, email and phone, for this request. Withdraw any time in Profile.',
      'طلبت من {الشريك} التواصل معك بشأن {العرض}. شاركنا اسمك وبريدك الإلكتروني وهاتفك فقط، لهذا الطلب. يمكنك السحب في أي وقت من الملف الشخصي.',
    ),
  },
]

export const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'AN1',
    title: L('New: Dubai rent increase rules explained', 'جديد: شرح قواعد زيادة الإيجار في دبي'),
    body: L(
      'Unit A4 now explains the 90-day notice rule and how the Rental Index sets the allowed increase.',
      'تشرح الوحدة A4 الآن قاعدة الإخطار قبل 90 يوماً وكيف يحدد مؤشر الإيجارات الزيادة المسموح بها.',
    ),
    scheduledFor: '2026-12-01T10:00:00+04:00',
    status: 'scheduled',
  },
]

export const SEED_SETTINGS: PlatformSettings = {
  languages: ['en', 'ar'],
  emirates: { dubai: 'on', 'abu-dhabi': 'coming-soon', sharjah: 'coming-soon' },
  reviewerId: 'R01',
  checkExpiryDays: 90,
}

const APPROVED = L('Approved', 'تمت الموافقة')

export const SEED_AUDIT: AuditEntry[] = [
  {
    id: 'AU1',
    at: '2026-11-22T12:00:00+04:00',
    actor: 'Aisha Rahman',
    action: L('Partner consent given', 'منح موافقة الشريك'),
    target: L('SwiftMove (request a call)', 'SwiftMove (طلب اتصال)'),
  },
  {
    id: 'AU2',
    at: '2026-11-24T16:00:00+04:00',
    actor: 'Khalid Al Mansoori',
    action: APPROVED,
    target: A4_AR,
  },
  {
    id: 'AU3',
    at: '2026-11-24T16:20:00+04:00',
    actor: 'Khalid Al Mansoori',
    action: APPROVED,
    target: CD4,
  },
  {
    id: 'AU4',
    at: '2026-11-24T16:40:00+04:00',
    actor: 'Khalid Al Mansoori',
    action: L('Changes requested', 'طُلبت تعديلات'),
    target: B3,
  },
  {
    id: 'AU5',
    at: '2026-11-25T09:00:00+04:00',
    actor: 'Maya',
    action: L('Published', 'تم النشر'),
    target: L(
      'Calculator default: Ejari AED 177.75',
      'قيمة افتراضية في الحاسبة: إيجاري 177.75 درهماً',
    ),
  },
]

export const SEED_NOTIFICATIONS: DemoNotification[] = [
  {
    id: 'NT1',
    to: 'L01',
    title: L('Renewal reminder set', 'تم ضبط تذكير التجديد'),
    body: L(
      'We will remind you on 1 Feb 2027, 90 days before your contract ends.',
      'سنذكّرك في 1 فبراير 2027، قبل 90 يوماً من انتهاء عقدك.',
    ),
    to_route: '/learn/reminders',
    at: '2026-11-21T20:10:00+04:00',
    read: false,
  },
  {
    id: 'NT2',
    to: 'L01',
    title: L('Tomorrow is close: Live Q&A on renewing', 'قريباً: جلسة أسئلة مباشرة عن التجديد'),
    body: L(
      'You are registered for 10 Dec 2026, 19:00.',
      'أنت مسجلة في 10 ديسمبر 2026، الساعة 19:00.',
    ),
    to_route: '/learn/events',
    at: '2026-11-20T08:00:00+04:00',
    read: true,
  },
  {
    id: 'NT3',
    to: 'L02',
    title: L('Pre-approval expires 15 Jan 2027', 'تنتهي الموافقة المبدئية في 15 يناير 2027'),
    body: L('Your reminder is set.', 'تم ضبط التذكير.'),
    to_route: '/learn/reminders',
    at: '2026-11-18T21:40:00+04:00',
    read: false,
  },
  {
    id: 'NT4',
    to: 'owner',
    title: L('Approved: Unit A4 The contract (AR)', 'تمت الموافقة: الوحدة A4 العقد (عربي)'),
    body: L(
      'Khalid Al Mansoori approved Unit A4 The contract (Arabic). Ready to publish.',
      'وافق خالد المنصوري على الوحدة A4 العقد (عربي). جاهز للنشر.',
    ),
    to_route: '/admin/approvals',
    at: '2026-11-24T16:00:00+04:00',
    read: false,
  },
  {
    id: 'NT5',
    to: 'reviewer',
    title: L('4 items in your review queue', '4 عناصر في قائمة المراجعة'),
    body: L('Due between 26 and 29 Nov 2026.', 'مستحقة بين 26 و29 نوفمبر 2026.'),
    to_route: '/review/queue',
    at: '2026-11-24T12:00:00+04:00',
    read: false,
  },
]
