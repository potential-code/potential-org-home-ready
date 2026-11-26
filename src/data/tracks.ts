import type {
  Block,
  Course,
  Enrollment,
  Localized,
  Question,
  Quiz,
  TrackKey,
  TrackSlug,
  Unit,
  UnitAction,
} from '@shared/types'
import { L } from './l'
import { CHECKED_ON } from './sources'

/**
 * Home Ready tracks as LMS courses (brief C9). Track A "Renting in the UAE" is built in full with
 * the brief's readings verbatim; Track B "Buying your first home" readings, the extra quiz
 * questions and all Arabic text are Iris drafts ("Arabic draft for review" in Maya's Content view).
 * Pure data, never mutated (the store copies it).
 */

export const TRACK_SLUG: Record<TrackKey, TrackSlug> = { A: 'renting', B: 'buying' }
export const LESSON_COUNT = 5

const VIDEO_NOTE = L('Video coming soon – animated explainer', 'الفيديو قريباً – شرح متحرك')

function video(unitId: string, title: Localized, duration: string): Block {
  return {
    id: `${unitId}-video`,
    kind: 'video',
    title,
    body: VIDEO_NOTE,
    minutes: Number.parseInt(duration, 10),
    duration,
  }
}

function read(unitId: string, body: Localized, minutes: number): Block {
  return {
    id: `${unitId}-read`,
    kind: 'read',
    title: L('Reading', 'القراءة'),
    body,
    minutes,
  }
}

function summary(unitId: string, points: [string, string][]): Block {
  return {
    id: `${unitId}-summary`,
    kind: 'summary',
    title: L('Key points', 'النقاط الرئيسية'),
    body: L(points.map((p) => p[0]).join('\n'), points.map((p) => p[1]).join('\n')),
    minutes: 1,
  }
}

function lesson(
  id: string,
  title: Localized,
  summaryText: Localized,
  blocks: Block[],
  action: UnitAction,
  sourceIds: string[],
): Unit {
  return {
    id,
    code: id,
    kind: 'lesson',
    title,
    summary: summaryText,
    minutes: blocks.reduce((a, b) => a + b.minutes, 0),
    published: true,
    blocks,
    action,
    checkedOn: CHECKED_ON,
    sourceIds,
  }
}

function quizUnit(id: string, quiz: Quiz): Unit {
  return {
    id,
    code: id,
    kind: 'quiz',
    title: L('Final quiz', 'الاختبار النهائي'),
    summary: L(
      '10 questions. Score 70% or more to complete the track.',
      '10 أسئلة. احصل على 70% أو أكثر لإكمال المسار.',
    ),
    minutes: 5,
    published: true,
    blocks: [],
    quiz,
  }
}

/** Single-choice question: [en, ar] pairs for prompt, options and explanation. */
function q(
  id: string,
  prompt: [string, string],
  options: [string, string][],
  correct: number,
  why: [string, string],
): Question {
  return {
    id,
    prompt: L(prompt[0], prompt[1]),
    options: options.map((o) => L(o[0], o[1])),
    correct,
    explanation: L(why[0], why[1]),
  }
}

// ---------------------------------------------------------------- Track A questions

const QA_NOTICE = (id: string) =>
  q(
    id,
    [
      'In Dubai, how much notice must be given before the contract ends to change the rent at renewal?',
      'في دبي، ما مدة الإشعار المطلوبة قبل انتهاء العقد لتغيير الإيجار عند التجديد؟',
    ],
    [
      ['30 days', '30 يوماً'],
      ['60 days', '60 يوماً'],
      ['90 days', '90 يوماً'],
      ['12 months', '12 شهراً'],
    ],
    2,
    [
      'Either side that wants to change the terms, including the rent, must give written notice at least 90 days before the contract ends.',
      'على أي طرف يرغب في تغيير الشروط، بما فيها الإيجار، تقديم إشعار كتابي قبل 90 يوماً على الأقل من انتهاء العقد.',
    ],
  )

const QA_INDEX = (id: string) =>
  q(
    id,
    [
      'What links the maximum allowed rent increase in Dubai?',
      'بماذا ترتبط الزيادة القصوى المسموح بها في الإيجار في دبي؟',
    ],
    [
      ["The landlord's costs", 'تكاليف المالك'],
      [
        'The RERA Rental Index for similar homes in the area',
        'مؤشر الإيجارات من ريرا للمساكن المماثلة في المنطقة',
      ],
      ['Inflation', 'التضخم'],
      ["The agent's advice", 'نصيحة الوسيط'],
    ],
    1,
    [
      'Rent increases are linked to the RERA Rental Index for similar homes in your area (Decree No. 43 of 2013).',
      'ترتبط زيادات الإيجار بمؤشر الإيجارات من ريرا للمساكن المماثلة في منطقتك (المرسوم رقم 43 لسنة 2013).',
    ],
  )

const QA_REFUND = (id: string) =>
  q(
    id,
    ['Which of these is usually refundable?', 'أيٌّ مما يلي يُسترد عادةً؟'],
    [
      ['Agency fee', 'عمولة الوسيط'],
      ['Security deposit', 'مبلغ التأمين'],
      ['Ejari registration fee', 'رسوم تسجيل إيجاري'],
      ['Monthly DEWA bills', 'فواتير ديوا الشهرية'],
    ],
    1,
    [
      'The security deposit is refundable if you leave the home in good condition. Fees and bills are not.',
      'يُسترد مبلغ التأمين إذا تركت المسكن بحالة جيدة. أما الرسوم والفواتير فلا تُسترد.',
    ],
  )

const QA_EVIDENCE = (id: string) =>
  q(
    id,
    ['What is the best evidence to protect your deposit?', 'ما أفضل دليل لحماية مبلغ التأمين؟'],
    [
      ['A verbal agreement', 'اتفاق شفهي'],
      [
        'A dated, signed condition report with photos at move-in',
        'تقرير حالة مؤرخ وموقّع مع صور عند الانتقال',
      ],
      ['The advert', 'الإعلان'],
      ['A text to the agent at move-out', 'رسالة نصية إلى الوسيط عند الخروج'],
    ],
    1,
    [
      'A dated, signed condition report with photos lets you compare the home at move-out with how you received it.',
      'يتيح لك تقرير الحالة المؤرخ والموقّع مع الصور مقارنة المسكن عند الخروج بالحالة التي استلمته بها.',
    ],
  )

const QA_TRUECOST = (id: string) =>
  q(
    id,
    ['Why compare homes on true yearly cost?', 'لماذا تقارن المساكن بالتكلفة السنوية الحقيقية؟'],
    [
      ['Adverts include all costs', 'الإعلانات تشمل جميع التكاليف'],
      [
        'Deposits, fees, cooling and utilities can change which home is cheaper',
        'التأمين والرسوم والتبريد والخدمات قد تغيّر أي المساكن أرخص',
      ],
      ['It is required by law', 'يشترطه القانون'],
      ['It reduces the rent', 'يخفض الإيجار'],
    ],
    1,
    [
      'The advertised rent is only part of the first-year cost. One-off and running costs can change the ranking.',
      'الإيجار المعلن جزء فقط من تكلفة السنة الأولى. التكاليف لمرة واحدة والتكاليف الجارية قد تغيّر الترتيب.',
    ],
  )

const QA_EJARI = (id: string) =>
  q(
    id,
    ['Where must a Dubai tenancy contract be registered?', 'أين يجب تسجيل عقد الإيجار في دبي؟'],
    [
      ['Ejari', 'إيجاري'],
      ['DEWA', 'ديوا'],
      ['The bank', 'البنك'],
      ['The building management', 'إدارة المبنى'],
    ],
    0,
    [
      'Tenancy contracts in Dubai are registered in Ejari, run by the Dubai Land Department.',
      'تُسجَّل عقود الإيجار في دبي في نظام إيجاري التابع لدائرة الأراضي والأملاك.',
    ],
  )

const QA_CHEQUES = (id: string) =>
  q(
    id,
    [
      'What usually happens if you pay the rent in fewer cheques?',
      'ماذا يحدث عادةً إذا دفعت الإيجار بعدد أقل من الشيكات؟',
    ],
    [
      ['The deposit is waived', 'يُلغى مبلغ التأمين'],
      ['Ejari is free', 'يصبح تسجيل إيجاري مجانياً'],
      ['The agency fee doubles', 'تتضاعف عمولة الوسيط'],
      [
        'The rent can be lower, but you need more cash up front',
        'قد ينخفض الإيجار، لكنك تحتاج إلى مبلغ نقدي أكبر مقدماً',
      ],
    ],
    3,
    [
      'Landlords often accept 1 to 4 cheques; fewer cheques can lower the rent but need more cash up front.',
      'يقبل الملاك غالباً من 1 إلى 4 شيكات؛ قد يخفض عدد أقل من الشيكات الإيجار لكنه يتطلب نقداً أكبر مقدماً.',
    ],
  )

const QA_LANDLORD_BACK = (id: string) =>
  q(
    id,
    [
      'A landlord in Dubai wants the home back to sell it. How much notice must they give?',
      'يريد مالك في دبي استعادة المسكن لبيعه. ما مدة الإشعار التي يجب أن يقدمها؟',
    ],
    [
      ['30 days by text message', '30 يوماً برسالة نصية'],
      [
        '12 months through a notary public or registered mail',
        '12 شهراً عن طريق الكاتب العدل أو البريد المسجل',
      ],
      ['90 days by phone', '90 يوماً بالهاتف'],
      ['No notice is needed', 'لا حاجة إلى إشعار'],
    ],
    1,
    [
      "A landlord who wants the home back for personal use or sale must give 12 months' notice through a notary public or registered mail.",
      'على المالك الذي يريد استعادة المسكن للاستخدام الشخصي أو البيع تقديم إشعار مدته 12 شهراً عن طريق الكاتب العدل أو البريد المسجل.',
    ],
  )

const QA_VIEWING = (id: string) =>
  q(
    id,
    [
      'Which check belongs on a viewing, before you sign?',
      'أي فحص يجب أن تقوم به أثناء المعاينة قبل التوقيع؟',
    ],
    [
      [
        "Check the agent's RERA registration and who has the right to rent the home",
        'التحقق من تسجيل الوسيط لدى ريرا ومن يملك حق تأجير المسكن',
      ],
      ['Ask the neighbours for their rent', 'سؤال الجيران عن إيجارهم'],
      ['Pay the deposit to reserve it', 'دفع التأمين لحجز المسكن'],
      ['Skip the air conditioning in winter', 'تجاهل فحص التكييف في الشتاء'],
    ],
    0,
    [
      "Ask to see the title deed or proof of the right to rent, and check the agent's RERA registration.",
      'اطلب رؤية سند الملكية أو ما يثبت حق التأجير، وتحقق من تسجيل الوسيط لدى ريرا.',
    ],
  )

const QA_DISPUTE = (id: string) =>
  q(
    id,
    ['Who handles tenancy disputes in Dubai?', 'من يتولى المنازعات الإيجارية في دبي؟'],
    [
      ['DEWA', 'ديوا'],
      ['The building management', 'إدارة المبنى'],
      ['The Rental Disputes Settlement Centre', 'مركز فض المنازعات الإيجارية'],
      ['The real estate agent', 'الوسيط العقاري'],
    ],
    2,
    [
      'The Rental Disputes Settlement Centre handles tenancy disputes in Dubai.',
      'يتولى مركز فض المنازعات الإيجارية النظر في المنازعات الإيجارية في دبي.',
    ],
  )

const QA_WEAR = (id: string) =>
  q(
    id,
    [
      'At move-out, what should not be deducted from your deposit?',
      'عند الخروج، ما الذي لا يجوز خصمه من مبلغ التأمين؟',
    ],
    [
      ['Damage beyond normal use', 'الأضرار التي تتجاوز الاستخدام العادي'],
      ['Unpaid rent', 'الإيجار غير المدفوع'],
      ['Broken appliances you caused', 'الأجهزة التي كسرتها'],
      ['Normal wear and tear', 'الاستهلاك العادي'],
    ],
    3,
    [
      'Normal wear and tear should not be deducted from your deposit; damage beyond that may be.',
      'لا يجوز خصم الاستهلاك العادي من مبلغ التأمين؛ أما الأضرار التي تتجاوزه فقد تُخصم.',
    ],
  )

const A_PRE: Quiz = {
  passMark: 0,
  questions: [
    QA_NOTICE('A-pre-1'),
    QA_REFUND('A-pre-2'),
    QA_TRUECOST('A-pre-3'),
    QA_EJARI('A-pre-4'),
    QA_CHEQUES('A-pre-5'),
  ],
}

const A_POST: Quiz = {
  passMark: 70,
  questions: [
    QA_NOTICE('A-post-1'),
    QA_INDEX('A-post-2'),
    QA_REFUND('A-post-3'),
    QA_EVIDENCE('A-post-4'),
    QA_TRUECOST('A-post-5'),
    QA_EJARI('A-post-6'),
    QA_CHEQUES('A-post-7'),
    QA_LANDLORD_BACK('A-post-8'),
    QA_VIEWING('A-post-9'),
    QA_WEAR('A-post-10'),
  ],
}

// Spare question kept for authoring (not in a quiz): avoids an unused-function lint warning.
export const EXTRA_QUESTIONS: Question[] = [QA_DISPUTE('A-extra-1')]

// ---------------------------------------------------------------- Track B questions

const QB_DOWN = (id: string) =>
  q(
    id,
    [
      'For a non-national buying a first home under AED 5 million, what minimum down payment should you plan to check with your bank?',
      'لغير المواطن الذي يشتري أول مسكن بأقل من 5 ملايين درهم، ما الحد الأدنى للدفعة الأولى الذي يجب التحقق منه مع البنك؟',
    ],
    [
      ['5%', '5%'],
      ['10%', '10%'],
      ['20%', '20%'],
      ['50%', '50%'],
    ],
    2,
    [
      'The Central Bank rules set a 20% minimum down payment in this case. Always check the current rule with your bank.',
      'تحدد أنظمة المصرف المركزي دفعة أولى بحد أدنى 20% في هذه الحالة. تحقق دائماً من القاعدة الحالية مع البنك.',
    ],
  )

const QB_TRANSFER = (id: string) =>
  q(
    id,
    [
      'What is the DLD transfer fee on a purchase in Dubai?',
      'ما رسوم نقل الملكية لدى دائرة الأراضي والأملاك عند الشراء في دبي؟',
    ],
    [
      ['4% of the price', '4% من السعر'],
      ['0.25% of the price', '0.25% من السعر'],
      ['2% of the loan', '2% من القرض'],
      ['A flat AED 290', 'مبلغ ثابت قدره 290 درهماً'],
    ],
    0,
    [
      'The Dubai Land Department transfer fee is 4% of the property price.',
      'رسوم نقل الملكية لدى دائرة الأراضي والأملاك في دبي هي 4% من سعر العقار.',
    ],
  )

const QB_DEBT = (id: string) =>
  q(
    id,
    [
      'What share of your monthly income can all your loan repayments usually take under the debt-burden cap?',
      'ما النسبة من دخلك الشهري التي يمكن أن تشكلها جميع أقساط قروضك عادةً وفق حد عبء الدين؟',
    ],
    [
      ['25%', '25%'],
      ['50%', '50%'],
      ['75%', '75%'],
      ['There is no cap', 'لا يوجد حد'],
    ],
    1,
    [
      'The UAE Central Bank caps total debt repayments at 50% of income. Check with your bank.',
      'يحدد المصرف المركزي الإماراتي سقف أقساط الديون بنسبة 50% من الدخل. تحقق مع البنك.',
    ],
  )

const QB_ESCROW = (id: string) =>
  q(
    id,
    [
      'Before paying for an off-plan home, what should you confirm?',
      'قبل الدفع مقابل مسكن على الخارطة، ما الذي يجب التأكد منه؟',
    ],
    [
      ['That the show flat is furnished', 'أن الشقة النموذجية مفروشة'],
      ['That the agent offers a discount', 'أن الوسيط يقدم خصماً'],
      ['That the neighbours have bought', 'أن الجيران اشتروا'],
      ['That the project is registered and has an escrow account', 'أن المشروع مسجل وله حساب ضمان'],
    ],
    3,
    [
      'Off-plan payments should go into the project escrow account; check the project in DLD and RERA records.',
      'يجب أن تذهب دفعات المشاريع على الخارطة إلى حساب ضمان المشروع؛ تحقق من المشروع في سجلات دائرة الأراضي والأملاك وريرا.',
    ],
  )

const QB_TITLE = (id: string) =>
  q(
    id,
    ['Which service checks a title deed in Dubai?', 'ما الخدمة التي تتحقق من سند الملكية في دبي؟'],
    [
      ['DEWA move-in', 'خدمة الانتقال من ديوا'],
      ['DLD Title Deed Verification', 'خدمة التحقق من سند الملكية من دائرة الأراضي والأملاك'],
      ['Ejari', 'إيجاري'],
      ['The developer brochure', 'كتيب المطور'],
    ],
    1,
    [
      'Use the Dubai Land Department Title Deed Verification service with the title deed number.',
      'استخدم خدمة التحقق من سند الملكية لدى دائرة الأراضي والأملاك باستخدام رقم السند.',
    ],
  )

const QB_SERVICE = (id: string) =>
  q(
    id,
    [
      'A 1,500 sq ft home has a service charge of AED 14 per sq ft per year. What is the yearly charge?',
      'مسكن مساحته 1,500 قدم مربعة ورسوم خدماته 14 درهماً للقدم المربعة سنوياً. كم الرسوم السنوية؟',
    ],
    [
      ['AED 1,400', '1,400 درهم'],
      ['AED 14,000', '14,000 درهم'],
      ['AED 21,000', '21,000 درهم'],
      ['AED 30,800', '30,800 درهم'],
    ],
    2,
    [
      '1,500 × 14 = AED 21,000 a year. Service charges are a running cost of owning, on top of the mortgage.',
      '1,500 × 14 = 21,000 درهم سنوياً. رسوم الخدمات تكلفة جارية للملكية تضاف إلى قسط الرهن.',
    ],
  )

const QB_STAY = (id: string) =>
  q(
    id,
    [
      'Why does how long you will stay matter when you compare renting and buying?',
      'لماذا تهم مدة بقائك عند المقارنة بين الإيجار والشراء؟',
    ],
    [
      [
        'Buying has large one-off costs that take years to balance out',
        'للشراء تكاليف كبيرة لمرة واحدة تحتاج إلى سنوات لتعويضها',
      ],
      ['Rent never changes', 'الإيجار لا يتغير أبداً'],
      ['Mortgages end after one year', 'تنتهي الرهون العقارية بعد سنة'],
      ['It does not matter', 'لا يهم ذلك'],
    ],
    0,
    [
      'Transfer fees, agency fees and mortgage costs are paid up front, so buying usually needs time before it costs less than renting.',
      'تُدفع رسوم النقل والعمولة وتكاليف الرهن مقدماً، لذا يحتاج الشراء عادةً إلى وقت قبل أن يصبح أقل تكلفة من الإيجار.',
    ],
  )

const QB_SNAG = (id: string) =>
  q(
    id,
    ['What is a snagging inspection?', 'ما هو فحص العيوب (السناغنغ)؟'],
    [
      ['A bank valuation', 'تقييم البنك'],
      [
        'A check of the home for defects before or at handover',
        'فحص المسكن بحثاً عن العيوب قبل التسليم أو عنده',
      ],
      ['A credit check', 'فحص الائتمان'],
      ['A DEWA meter reading', 'قراءة عداد ديوا'],
    ],
    1,
    [
      'A snagging inspection lists defects so the developer or seller fixes them before or soon after handover.',
      'يحصر فحص العيوب المشكلات ليصلحها المطور أو البائع قبل التسليم أو بعده بفترة قصيرة.',
    ],
  )

const QB_MORTREG = (id: string) =>
  q(
    id,
    [
      'How is the mortgage registration fee in Dubai usually worked out?',
      'كيف تُحسب عادةً رسوم تسجيل الرهن العقاري في دبي؟',
    ],
    [
      ['4% of the price', '4% من السعر'],
      ['2% of the price', '2% من السعر'],
      ['One month of rent', 'إيجار شهر واحد'],
      ['0.25% of the loan plus an admin fee', '0.25% من قيمة القرض مضافاً إليها رسوم إدارية'],
    ],
    3,
    [
      'Mortgage registration is 0.25% of the loan amount plus an admin fee (AED 290 in the demo default).',
      'تسجيل الرهن 0.25% من قيمة القرض مضافاً إليها رسوم إدارية (290 درهماً في القيمة الافتراضية للعرض).',
    ],
  )

const QB_RECOMMEND = (id: string) =>
  q(
    id,
    ['How should you choose between developers or banks?', 'كيف تختار بين المطورين أو البنوك؟'],
    [
      ['Pick the one with the most adverts', 'اختر صاحب أكثر الإعلانات'],
      ['Follow a sponsor offer without checking', 'اتبع عرض الراعي دون تحقق'],
      [
        'Compare full costs and check official records yourself',
        'قارن التكاليف الكاملة وتحقق من السجلات الرسمية بنفسك',
      ],
      ['Choose the first one you meet', 'اختر أول من تقابله'],
    ],
    2,
    [
      'Home Ready never recommends developers or banks. Compare full costs and check DLD, RERA and Central Bank information.',
      'لا يوصي جاهز للسكن بأي مطور أو بنك. قارن التكاليف الكاملة وتحقق من معلومات دائرة الأراضي والأملاك وريرا والمصرف المركزي.',
    ],
  )

const B_PRE: Quiz = {
  passMark: 0,
  questions: [
    QB_DOWN('B-pre-1'),
    QB_TRANSFER('B-pre-2'),
    QB_DEBT('B-pre-3'),
    QB_TITLE('B-pre-4'),
    QB_STAY('B-pre-5'),
  ],
}

const B_POST: Quiz = {
  passMark: 70,
  questions: [
    QB_DOWN('B-post-1'),
    QB_TRANSFER('B-post-2'),
    QB_DEBT('B-post-3'),
    QB_ESCROW('B-post-4'),
    QB_TITLE('B-post-5'),
    QB_SERVICE('B-post-6'),
    QB_STAY('B-post-7'),
    QB_SNAG('B-post-8'),
    QB_MORTREG('B-post-9'),
    QB_RECOMMEND('B-post-10'),
  ],
}

// ---------------------------------------------------------------- Track A readings (brief C9.1, verbatim EN)

const A1_READ = L(
  'Your real budget (Dubai). The rent in an advert is only part of what you will pay in your first year. Before you commit, add up five things. First, the annual rent and how you will pay it: landlords often accept 1 to 4 cheques; fewer cheques can lower the rent but need more cash up front. Second, the security deposit, commonly about 5% of the annual rent for an unfurnished home and 10% for a furnished one; it is refundable if you leave the home in good condition. Third, the agency fee if an agent is involved, commonly around 5% of the annual rent. Fourth, registration and connection costs: the tenancy contract must be registered in Ejari, and you will open a DEWA account for electricity and water, which needs a refundable deposit. Fifth, running costs: DEWA bills, district cooling (chiller) charges in some buildings, internet, and the Dubai Municipality housing fee that appears on your DEWA bill. Put these into the true-cost calculator and compare homes on their full yearly cost, not on the advertised rent. Checked on 25 Nov 2026 · Sources: Dubai Land Department (Ejari), DEWA. Typical percentages are market practice, not fixed rules. Education, not legal or financial advice.',
  'ميزانيتك الحقيقية (دبي). الإيجار المذكور في الإعلان جزء فقط مما ستدفعه في سنتك الأولى. قبل أن تلتزم، اجمع خمسة أمور. أولاً، الإيجار السنوي وطريقة دفعه: يقبل الملاك غالباً من 1 إلى 4 شيكات؛ قد يخفض عدد أقل من الشيكات الإيجار لكنه يتطلب نقداً أكبر مقدماً. ثانياً، مبلغ التأمين، ويبلغ عادةً نحو 5% من الإيجار السنوي للمسكن غير المفروش و10% للمفروش؛ ويُسترد إذا تركت المسكن بحالة جيدة. ثالثاً، عمولة الوسيط إن وُجد وسيط، وتبلغ عادةً نحو 5% من الإيجار السنوي. رابعاً، تكاليف التسجيل والتوصيل: يجب تسجيل عقد الإيجار في إيجاري، وستفتح حساباً لدى ديوا للكهرباء والمياه يتطلب مبلغ تأمين مسترداً. خامساً، التكاليف الجارية: فواتير ديوا، ورسوم التبريد المركزي في بعض المباني، والإنترنت، ورسوم السكن لبلدية دبي التي تظهر على فاتورة ديوا. أدخل هذه الأرقام في حاسبة التكلفة الحقيقية وقارن المساكن على أساس تكلفتها السنوية الكاملة لا الإيجار المعلن. تم التحقق في 25 نوفمبر 2026 · المصادر: دائرة الأراضي والأملاك في دبي (إيجاري)، ديوا. النسب الشائعة ممارسات سوق وليست قواعد ثابتة. هذا محتوى تعليمي وليس استشارة قانونية أو مالية.',
)

const A2_READ = L(
  'Choosing the area. Start with the things you cannot change easily: where you work and, if you have children, where they will study. Measure the commute at the time you would really travel, by car and by metro if it is an option. Then list the services you use every week: supermarkets, clinics, gyms, mosques or places of worship, parks. Check parking: how many spaces come with the home and whether visitor parking exists. Think about noise and construction nearby; a quiet street today may be next to a building site next year. Finally, compare rents in two or three areas that meet your needs using the DLD Rental Index, so you know the typical range before you negotiate. Activity: drag your priorities (commute, schools, budget, lifestyle, space) into order; Home Ready saves them to your profile and uses them in the decision journey. Checked on 25 Nov 2026 · Source: Dubai Land Department Rental Index. Education, not advice.',
  'اختيار المنطقة. ابدأ بما لا يمكنك تغييره بسهولة: مكان عملك، وإن كان لديك أطفال، مكان دراستهم. قِس مدة التنقل في الوقت الذي ستسافر فيه فعلاً، بالسيارة وبالمترو إن كان خياراً متاحاً. ثم دوّن الخدمات التي تستخدمها كل أسبوع: المتاجر الكبرى، والعيادات، والنوادي الرياضية، والمساجد أو دور العبادة، والحدائق. تحقق من المواقف: كم موقفاً يأتي مع المسكن وهل توجد مواقف للزوار. فكّر في الضوضاء والإنشاءات القريبة؛ فالشارع الهادئ اليوم قد يجاور موقع بناء العام المقبل. وأخيراً، قارن الإيجارات في منطقتين أو ثلاث تلبي احتياجاتك باستخدام مؤشر الإيجارات من دائرة الأراضي والأملاك، لتعرف النطاق المعتاد قبل التفاوض. النشاط: رتّب أولوياتك (التنقل، المدارس، الميزانية، نمط الحياة، المساحة) بالسحب؛ يحفظها جاهز للسكن في ملفك ويستخدمها في رحلة القرار. تم التحقق في 25 نوفمبر 2026 · المصدر: مؤشر الإيجارات من دائرة الأراضي والأملاك في دبي. محتوى تعليمي وليس استشارة.',
)

const A3_READ = L(
  "The viewing. Treat a viewing like an inspection. Open every tap and check water pressure and hot water. Run the air conditioning in every room and ask when it was last serviced. Look for damp, mould or stains on ceilings and around windows. Test windows, doors and locks. Check the kitchen appliances that are included and write them down. Ask who pays for maintenance and how quickly repairs are handled. Ask whether cooling is included or billed separately, and by whom. Ask how many cheques the landlord accepts and whether the rent changes with fewer cheques. Ask to see the title deed or proof that the person renting the home has the right to do so, and check the agent's RERA registration. Take photos and notes, and save them in your viewing checklist so you can compare homes later. Checked on 25 Nov 2026 · Source: RERA broker registry (Dubai Land Department). Education, not advice.",
  'المعاينة. تعامل مع المعاينة كأنها فحص. افتح كل صنبور وتحقق من ضغط المياه والماء الساخن. شغّل التكييف في كل غرفة واسأل متى تمت صيانته آخر مرة. ابحث عن الرطوبة أو العفن أو البقع في الأسقف وحول النوافذ. اختبر النوافذ والأبواب والأقفال. تحقق من أجهزة المطبخ المشمولة ودوّنها. اسأل من يتحمل الصيانة وما سرعة تنفيذ الإصلاحات. اسأل هل التبريد مشمول أم يُحتسب منفصلاً، ومن يُصدر فاتورته. اسأل كم شيكاً يقبل المالك وهل يتغير الإيجار مع عدد أقل من الشيكات. اطلب رؤية سند الملكية أو ما يثبت أن من يؤجر المسكن يملك هذا الحق، وتحقق من تسجيل الوسيط لدى ريرا. التقط الصور ودوّن الملاحظات واحفظها في قائمة المعاينة لتقارن بين المساكن لاحقاً. تم التحقق في 25 نوفمبر 2026 · المصدر: سجل الوسطاء لدى ريرا (دائرة الأراضي والأملاك في دبي). محتوى تعليمي وليس استشارة.',
)

const A4_READ = L(
  "The contract and renewal (Dubai). In Dubai the tenancy contract must be registered in Ejari; you need it for DEWA, residence matters and any dispute. Read the contract before you sign: the rent, payment dates, deposit, maintenance responsibilities and any additional terms. At renewal, either side that wants to change the terms, including the rent, must give the other written notice at least 90 days before the contract ends. Rent increases are linked to the RERA Rental Index: if your rent is already close to the average for similar homes in your area, the landlord cannot increase it, and the allowed increase rises in steps the further below the average your rent is. A landlord who wants the home back for personal use or sale must give 12 months' notice through a notary public or registered mail. If you disagree, the Rental Disputes Settlement Centre handles tenancy disputes. Before your renewal, run the Rental Index check and the Renew-or-move journey. Checked on 25 Nov 2026 · Sources: Dubai Law No. 26 of 2007 and No. 33 of 2008; Decree No. 43 of 2013; Dubai Land Department. Education, not legal advice.",
  'العقد والتجديد (دبي). في دبي يجب تسجيل عقد الإيجار في إيجاري؛ فأنت تحتاجه لديوا ولشؤون الإقامة ولأي نزاع. اقرأ العقد قبل التوقيع: الإيجار، ومواعيد الدفع، ومبلغ التأمين، ومسؤوليات الصيانة، وأي شروط إضافية. عند التجديد، على أي طرف يرغب في تغيير الشروط، بما فيها الإيجار، أن يقدّم للطرف الآخر إشعاراً كتابياً قبل 90 يوماً على الأقل من انتهاء العقد. ترتبط زيادات الإيجار بمؤشر الإيجارات من ريرا: إذا كان إيجارك قريباً من متوسط المساكن المماثلة في منطقتك، فلا يجوز للمالك زيادته، وترتفع الزيادة المسموح بها تدريجياً كلما كان إيجارك أدنى من المتوسط. على المالك الذي يريد استعادة المسكن للاستخدام الشخصي أو البيع أن يقدّم إشعاراً مدته 12 شهراً عن طريق الكاتب العدل أو البريد المسجل. إذا لم توافق، يتولى مركز فض المنازعات الإيجارية النظر في المنازعات. قبل التجديد، استخدم مؤشر الإيجارات وشغّل رحلة "أجدد أم أنتقل". تم التحقق في 25 نوفمبر 2026 · المصادر: قانون دبي رقم 26 لسنة 2007 ورقم 33 لسنة 2008؛ المرسوم رقم 43 لسنة 2013؛ دائرة الأراضي والأملاك في دبي. محتوى تعليمي وليس استشارة قانونية.',
)

const A5_READ = L(
  'Moving in and moving out. On the day you get the keys, walk through the home with the landlord or agent and record its condition room by room, with dated photos and a signed condition report. Note anything that is broken or worn, even if it seems small. Keep copies of the contract, Ejari certificate, cheque receipts and any repair requests. When you plan to leave, give notice as your contract requires, arrange a final inspection, and compare the home with your move-in report. Normal wear and tear should not be deducted from your deposit; damage beyond that may be. Settle final DEWA and cooling bills and close the accounts to recover their deposits. Ask for your security deposit to be returned in writing with any deductions explained. Checked on 25 Nov 2026 · Source: Dubai Land Department. Education, not advice.',
  'الانتقال إلى المسكن والخروج منه. في يوم استلام المفاتيح، تجوّل في المسكن مع المالك أو الوسيط وسجّل حالته غرفة غرفة، مع صور مؤرخة وتقرير حالة موقّع. دوّن أي شيء مكسور أو مستهلك ولو بدا صغيراً. احتفظ بنسخ من العقد وشهادة إيجاري وإيصالات الشيكات وأي طلبات إصلاح. عندما تخطط للمغادرة، قدّم الإشعار كما يشترط عقدك، ورتّب فحصاً نهائياً، وقارن المسكن بتقرير الانتقال. لا يجوز خصم الاستهلاك العادي من مبلغ التأمين؛ أما الأضرار التي تتجاوزه فقد تُخصم. سدّد فواتير ديوا والتبريد النهائية وأغلق الحسابات لاسترداد مبالغ التأمين الخاصة بها. اطلب إعادة مبلغ التأمين كتابياً مع توضيح أي خصومات. تم التحقق في 25 نوفمبر 2026 · المصدر: دائرة الأراضي والأملاك في دبي. محتوى تعليمي وليس استشارة.',
)

// ---------------------------------------------------------------- Track B readings (Iris drafts)

const B1_READ = L(
  'Rent or buy? (Dubai). Buying is not automatically better than renting. The answer depends mostly on how long you will stay. When you buy, you pay large one-off costs at the start: the down payment, the 4% Dubai Land Department transfer fee, mortgage registration and often a 2% agency fee. Those costs take years to balance out against the rent you no longer pay. You also take on running costs that tenants do not pay, such as service charges, maintenance and insurance. On the other side, each mortgage payment builds equity, and the home may rise or fall in value. If you expect to move within a few years, renting is often cheaper; if you will stay longer, buying can cost less. Run the Keep-renting-or-buy journey and the Rent vs buy calculator with your own numbers. Checked on 25 Nov 2026 · Sources: Dubai Land Department; Central Bank of the UAE. Education, not legal or financial advice.',
  'أستأجر أم أشتري؟ (دبي). الشراء ليس أفضل من الإيجار تلقائياً. تعتمد الإجابة أساساً على المدة التي ستبقى فيها. عند الشراء تدفع تكاليف كبيرة لمرة واحدة في البداية: الدفعة الأولى، ورسوم نقل الملكية لدى دائرة الأراضي والأملاك بنسبة 4%، وتسجيل الرهن، وغالباً عمولة وسيط بنسبة 2%. تحتاج هذه التكاليف إلى سنوات لتعويضها مقابل الإيجار الذي لم تعد تدفعه. كما تتحمل تكاليف جارية لا يدفعها المستأجر، مثل رسوم الخدمات والصيانة والتأمين. في المقابل، يبني كل قسط رهن حصتك في العقار، وقد ترتفع قيمة المسكن أو تنخفض. إذا كنت تتوقع الانتقال خلال سنوات قليلة، فالإيجار غالباً أرخص؛ وإذا كنت ستبقى مدة أطول، فقد يكلف الشراء أقل. شغّل رحلة "أستمر في الإيجار أم أشتري" وحاسبة الإيجار مقابل الشراء بأرقامك. تم التحقق في 25 نوفمبر 2026 · المصادر: دائرة الأراضي والأملاك في دبي؛ مصرف الإمارات العربية المتحدة المركزي. محتوى تعليمي وليس استشارة قانونية أو مالية.',
)

const B2_READ = L(
  'What you can afford. Start with cash, not with the price. For a first home under AED 5 million, a non-national usually needs a down payment of at least 20% of the price; check the current rule with your bank. On top of that, keep cash for the 4% DLD transfer fee, mortgage registration (0.25% of the loan plus an admin fee, AED 290 in our demo), a 2% agency fee if an agent is used, and moving costs. Then look at the monthly side. Under the Central Bank debt-burden rule, all your loan repayments together should not exceed 50% of your monthly income. Count car loans, credit cards and personal loans too. Leave room for service charges, maintenance and an emergency fund, because a home you can just afford on paper can feel tight in real life. Use the What can I afford tab to see a price range from your income, debts and savings. Checked on 25 Nov 2026 · Sources: Central Bank of the UAE; Dubai Land Department. Education, not legal or financial advice.',
  'ما الذي تستطيع تحمله. ابدأ بالنقد لا بالسعر. لأول مسكن بأقل من 5 ملايين درهم، يحتاج غير المواطن عادةً إلى دفعة أولى لا تقل عن 20% من السعر؛ تحقق من القاعدة الحالية مع البنك. إضافة إلى ذلك، احتفظ بنقد لرسوم نقل الملكية لدى دائرة الأراضي والأملاك بنسبة 4%، وتسجيل الرهن (0.25% من القرض مضافاً إليها رسوم إدارية، 290 درهماً في مثالنا)، وعمولة وسيط بنسبة 2% إن وُجد وسيط، وتكاليف الانتقال. ثم انظر إلى الجانب الشهري. وفق قاعدة عبء الدين من المصرف المركزي، يجب ألا تتجاوز جميع أقساط قروضك معاً 50% من دخلك الشهري. احسب قروض السيارة وبطاقات الائتمان والقروض الشخصية أيضاً. اترك مجالاً لرسوم الخدمات والصيانة وصندوق للطوارئ، فالمسكن الذي تستطيع تحمله على الورق بالكاد قد يكون مرهقاً في الواقع. استخدم تبويب "ما الذي أستطيع تحمله" لترى نطاق سعر بناءً على دخلك وديونك ومدخراتك. تم التحقق في 25 نوفمبر 2026 · المصادر: مصرف الإمارات العربية المتحدة المركزي؛ دائرة الأراضي والأملاك في دبي. محتوى تعليمي وليس استشارة قانونية أو مالية.',
)

const B3_READ = L(
  'Ready or off-plan. A ready home exists today: you can view it, check its condition, see the service-charge history and move in soon after transfer. An off-plan home is bought before it is finished, often with a payment plan, and you pay in stages while it is built. Off-plan can mean a lower entry price, but it adds risks: delays, changes to the design, and a finished home that differs from the brochure. In Dubai, off-plan projects must be registered, and your payments should go into the project escrow account, not to a personal account. Check the developer and the project status in Dubai Land Department and RERA records before you pay anything. Read the sale agreement for the completion date, what happens if it is late, and the service charges you will pay after handover. For both types, compare the full cost, not only the price. Checked on 25 Nov 2026 · Sources: Dubai Land Department; RERA. Education, not legal or financial advice.',
  'جاهز أم على الخارطة. المسكن الجاهز موجود اليوم: يمكنك معاينته والتحقق من حالته والاطلاع على سجل رسوم الخدمات والانتقال إليه بعد النقل بفترة قصيرة. أما المسكن على الخارطة فيُشترى قبل اكتماله، غالباً بخطة سداد، وتدفع على مراحل أثناء البناء. قد يعني الشراء على الخارطة سعر دخول أقل، لكنه يضيف مخاطر: التأخير، وتغييرات التصميم، ومسكناً مكتملاً يختلف عن الكتيب. في دبي يجب تسجيل المشاريع على الخارطة، ويجب أن تذهب دفعاتك إلى حساب ضمان المشروع لا إلى حساب شخصي. تحقق من المطور وحالة المشروع في سجلات دائرة الأراضي والأملاك وريرا قبل دفع أي مبلغ. اقرأ اتفاقية البيع لمعرفة موعد الإنجاز، وما يحدث عند التأخير، ورسوم الخدمات التي ستدفعها بعد التسليم. في الحالتين قارن التكلفة الكاملة لا السعر فقط. تم التحقق في 25 نوفمبر 2026 · المصادر: دائرة الأراضي والأملاك في دبي؛ ريرا. محتوى تعليمي وليس استشارة قانونية أو مالية.',
)

const B4_READ = L(
  'Due diligence. Before you pay a deposit, check that the home and the people selling it are what they say. Verify the title deed with the Dubai Land Department Title Deed Verification service, using the title deed number. Check that the agent is registered with RERA and that the developer is registered for the project. For off-plan, confirm the escrow account. Ask for the service-charge history for the last two or three years and check what it covers. Ask whether there are unpaid service charges, open mortgages or disputes on the home. Get your mortgage pre-approval in writing before you sign a sale agreement, and note when it expires. For a new home, book a snagging inspection before or at handover, so defects are fixed by the developer. Keep every document and receipt in one place. Save these steps in your due-diligence checklist and tick them off as you go. Checked on 25 Nov 2026 · Sources: Dubai Land Department (Title Deed Verification); RERA. Education, not legal or financial advice.',
  'العناية الواجبة. قبل دفع أي عربون، تحقق من أن المسكن ومن يبيعه كما يقولون. تحقق من سند الملكية عبر خدمة التحقق من سند الملكية لدى دائرة الأراضي والأملاك في دبي باستخدام رقم السند. تأكد من أن الوسيط مسجل لدى ريرا وأن المطور مسجل للمشروع. وفي حالة الشراء على الخارطة، تأكد من حساب الضمان. اطلب سجل رسوم الخدمات لآخر سنتين أو ثلاث وتحقق مما تشمله. اسأل هل توجد رسوم خدمات غير مدفوعة أو رهون قائمة أو نزاعات على المسكن. احصل على موافقة مبدئية مكتوبة على الرهن قبل توقيع اتفاقية البيع، ودوّن تاريخ انتهائها. وللمسكن الجديد، احجز فحصاً للعيوب قبل التسليم أو عنده ليصلح المطور العيوب. احتفظ بكل المستندات والإيصالات في مكان واحد. احفظ هذه الخطوات في قائمة العناية الواجبة وأشّر عليها أثناء التنفيذ. تم التحقق في 25 نوفمبر 2026 · المصادر: دائرة الأراضي والأملاك في دبي (التحقق من سند الملكية)؛ ريرا. محتوى تعليمي وليس استشارة قانونية أو مالية.',
)

const B5_READ = L(
  'The transaction and after. When you and the seller agree a price, you usually sign a sale agreement and pay a deposit, commonly held by the agent or a trustee. Your bank then values the home and issues the final mortgage offer. The transfer happens at a Dubai Land Department trustee office, where the 4% transfer fee and mortgage registration are paid and the new title deed is issued in your name. After the keys, set up your DEWA account, register for cooling if the building uses it, and add the service charges to your yearly budget. Keep the title deed, mortgage documents and receipts safe. Review your mortgage each year: rates change, and early repayment can carry a fee. Plan for maintenance and home insurance from the first year. Finally, run the Rent vs buy calculator again with your real numbers to see your own break-even year. Checked on 25 Nov 2026 · Sources: Dubai Land Department; Central Bank of the UAE; DEWA. Education, not legal or financial advice.',
  'المعاملة وما بعدها. عندما تتفق مع البائع على السعر، توقّع عادةً اتفاقية بيع وتدفع عربوناً يحتفظ به غالباً الوسيط أو أمين. بعد ذلك يقيّم البنك المسكن ويصدر عرض الرهن النهائي. يتم النقل في مكتب أمين تابع لدائرة الأراضي والأملاك في دبي، حيث تُدفع رسوم النقل بنسبة 4% ورسوم تسجيل الرهن ويصدر سند الملكية الجديد باسمك. بعد استلام المفاتيح، افتح حسابك لدى ديوا، وسجّل في خدمة التبريد إن كان المبنى يستخدمها، وأضف رسوم الخدمات إلى ميزانيتك السنوية. احفظ سند الملكية ومستندات الرهن والإيصالات في مكان آمن. راجع رهنك كل عام: فالأسعار تتغير وقد يترتب على السداد المبكر رسوم. خطط للصيانة والتأمين على المسكن من السنة الأولى. وأخيراً، شغّل حاسبة الإيجار مقابل الشراء مجدداً بأرقامك الفعلية لترى سنة التعادل الخاصة بك. تم التحقق في 25 نوفمبر 2026 · المصادر: دائرة الأراضي والأملاك في دبي؛ مصرف الإمارات العربية المتحدة المركزي؛ ديوا. محتوى تعليمي وليس استشارة قانونية أو مالية.',
)

// ---------------------------------------------------------------- units

const act = (kind: UnitAction['kind'], en: string, ar: string, to: string): UnitAction => ({
  kind,
  label: L(en, ar),
  to,
})

const A_UNITS: Unit[] = [
  lesson(
    'A1',
    L('Your real budget', 'ميزانيتك الحقيقية'),
    L(
      'Rent plus the one-off and running costs, and how cheques change the picture.',
      'الإيجار مع التكاليف لمرة واحدة والتكاليف الجارية، وكيف يغيّر عدد الشيكات الصورة.',
    ),
    [
      video('A1', L('Your real budget', 'ميزانيتك الحقيقية'), '3:00'),
      read('A1', A1_READ, 4),
      summary('A1', [
        [
          'The advertised rent is only part of the first-year cost.',
          'الإيجار المعلن جزء فقط من تكلفة السنة الأولى.',
        ],
        [
          'Deposits are refundable; agency and Ejari fees are not.',
          'مبالغ التأمين مستردة؛ أما عمولة الوسيط ورسوم إيجاري فلا.',
        ],
        ['Compare homes on full yearly cost.', 'قارن المساكن على أساس التكلفة السنوية الكاملة.'],
      ]),
    ],
    act(
      'calculator',
      'Run the true-cost calculator',
      'شغّل حاسبة التكلفة الحقيقية',
      '/learn/calculator?tab=true-cost',
    ),
    ['dld-ejari', 'dewa-move-in', 'dm-housing-fee', 'market-practice'],
  ),
  lesson(
    'A2',
    L('Choosing the area', 'اختيار المنطقة'),
    L(
      'Weigh commute, schools, services and lifestyle before price.',
      'وازن بين التنقل والمدارس والخدمات ونمط الحياة قبل السعر.',
    ),
    [
      video('A2', L('Choosing the area', 'اختيار المنطقة'), '3:00'),
      read('A2', A2_READ, 3),
      summary('A2', [
        ['Start with work and school locations.', 'ابدأ بمواقع العمل والمدارس.'],
        ['Measure the commute at real travel times.', 'قِس التنقل في أوقات السفر الفعلية.'],
        [
          'Check typical rents on the DLD Rental Index.',
          'تحقق من الإيجارات المعتادة في مؤشر الإيجارات.',
        ],
      ]),
    ],
    act('activity', 'Rank your priorities', 'رتّب أولوياتك', '/learn/tracks/renting/A2'),
    ['dld-rental-index'],
  ),
  lesson(
    'A3',
    L('The viewing', 'المعاينة'),
    L('What to inspect and what to ask.', 'ما الذي تفحصه وما الذي تسأل عنه.'),
    [
      video('A3', L('The viewing', 'المعاينة'), '3:00'),
      read('A3', A3_READ, 4),
      summary('A3', [
        [
          'Test water, air conditioning, windows and locks.',
          'اختبر المياه والتكييف والنوافذ والأقفال.',
        ],
        ['Ask about cooling, maintenance and cheques.', 'اسأل عن التبريد والصيانة والشيكات.'],
        ["Check the agent's RERA registration.", 'تحقق من تسجيل الوسيط لدى ريرا.'],
      ]),
    ],
    act(
      'checklist',
      'Open the viewing checklist',
      'افتح قائمة المعاينة',
      '/learn/checklists/new?template=viewing',
    ),
    ['rera-brokers'],
  ),
  lesson(
    'A4',
    L('The contract and renewal', 'العقد والتجديد'),
    L(
      'Ejari registration, notice periods, rent increases and your rights.',
      'تسجيل إيجاري ومدد الإشعار وزيادات الإيجار وحقوقك.',
    ),
    [
      video('A4', L('The contract and renewal', 'العقد والتجديد'), '4:00'),
      read('A4', A4_READ, 5),
      summary('A4', [
        ['Register the contract in Ejari.', 'سجّل العقد في إيجاري.'],
        [
          'Changes to the rent need 90 days written notice.',
          'يتطلب تغيير الإيجار إشعاراً كتابياً قبل 90 يوماً.',
        ],
        ['Increases follow the RERA Rental Index.', 'تتبع الزيادات مؤشر الإيجارات من ريرا.'],
      ]),
    ],
    act(
      'journey',
      'Run the Renew-or-move journey',
      'شغّل رحلة أجدد أم أنتقل',
      '/learn/journeys/renew-or-move',
    ),
    ['dld-ejari', 'dld-rental-index', 'law-26-2007', 'law-33-2008', 'decree-43-2013', 'rdsc'],
  ),
  lesson(
    'A5',
    L('Moving in and moving out', 'الانتقال إلى المسكن والخروج منه'),
    L('Condition reports and getting your deposit back.', 'تقارير الحالة واسترداد مبلغ التأمين.'),
    [
      video('A5', L('Moving in and moving out', 'الانتقال إلى المسكن والخروج منه'), '3:00'),
      read('A5', A5_READ, 3),
      summary('A5', [
        ['Record the condition with dated photos.', 'سجّل الحالة بصور مؤرخة.'],
        ['Normal wear and tear is not deducted.', 'لا يُخصم الاستهلاك العادي.'],
        [
          'Close DEWA and cooling accounts to recover deposits.',
          'أغلق حسابات ديوا والتبريد لاسترداد التأمين.',
        ],
      ]),
    ],
    act(
      'checklist',
      'Open the move-out checklist',
      'افتح قائمة الخروج',
      '/learn/checklists/new?template=move-out',
    ),
    ['dld-ejari', 'dewa-move-in'],
  ),
  quizUnit('AQ', A_POST),
]

const B_UNITS: Unit[] = [
  lesson(
    'B1',
    L('Rent or buy?', 'أستأجر أم أشتري؟'),
    L(
      'When buying makes sense, and why how long you stay matters.',
      'متى يكون الشراء منطقياً، ولماذا تهم مدة بقائك.',
    ),
    [
      video('B1', L('Rent or buy?', 'أستأجر أم أشتري؟'), '3:00'),
      read('B1', B1_READ, 3),
      summary('B1', [
        ['Buying has large one-off costs.', 'للشراء تكاليف كبيرة لمرة واحدة.'],
        ['How long you stay decides the answer.', 'مدة بقائك تحدد الإجابة.'],
        ['Run the numbers with your own inputs.', 'احسب الأرقام بمدخلاتك.'],
      ]),
    ],
    act(
      'journey',
      'Run the Keep-renting-or-buy journey',
      'شغّل رحلة أستمر في الإيجار أم أشتري',
      '/learn/journeys/rent-or-buy',
    ),
    ['dld-fees', 'cbuae-mortgage'],
  ),
  lesson(
    'B2',
    L('What you can afford', 'ما الذي تستطيع تحمله'),
    L(
      'Down payment, fees and the 50% debt-burden cap.',
      'الدفعة الأولى والرسوم وحد عبء الدين البالغ 50%.',
    ),
    [
      video('B2', L('What you can afford', 'ما الذي تستطيع تحمله'), '4:00'),
      read('B2', B2_READ, 3),
      summary('B2', [
        ['Plan for at least 20% down plus fees.', 'خطط لدفعة أولى 20% على الأقل مع الرسوم.'],
        ['All repayments stay under 50% of income.', 'تبقى جميع الأقساط دون 50% من الدخل.'],
        ['Keep an emergency fund.', 'احتفظ بصندوق للطوارئ.'],
      ]),
    ],
    act(
      'calculator',
      'Open What can I afford',
      'افتح ما الذي أستطيع تحمله',
      '/learn/calculator?tab=afford',
    ),
    ['cbuae-mortgage', 'dld-fees'],
  ),
  lesson(
    'B3',
    L('Ready or off-plan', 'جاهز أم على الخارطة'),
    L(
      'The trade-offs and risks of ready and off-plan homes.',
      'المفاضلات والمخاطر بين المساكن الجاهزة وعلى الخارطة.',
    ),
    [
      video('B3', L('Ready or off-plan', 'جاهز أم على الخارطة'), '4:00'),
      read('B3', B3_READ, 3),
      summary('B3', [
        [
          'Off-plan adds delay and design risks.',
          'يضيف الشراء على الخارطة مخاطر التأخير والتصميم.',
        ],
        ['Payments go to the project escrow account.', 'تذهب الدفعات إلى حساب ضمان المشروع.'],
        ['Check the developer in DLD and RERA records.', 'تحقق من المطور في سجلات الدائرة وريرا.'],
      ]),
    ],
    act(
      'source',
      'Check a project on DLD',
      'تحقق من مشروع لدى دائرة الأراضي والأملاك',
      'https://dubailand.gov.ae/en/eservices/',
    ),
    ['dld-fees', 'rera-brokers'],
  ),
  lesson(
    'B4',
    L('Due diligence', 'العناية الواجبة'),
    L(
      'The checks before you pay, starting with DLD Title Deed Verification.',
      'الفحوص قبل الدفع، بدءاً بخدمة التحقق من سند الملكية.',
    ),
    [
      video('B4', L('Due diligence', 'العناية الواجبة'), '4:00'),
      read('B4', B4_READ, 3),
      summary('B4', [
        ['Verify the title deed on DLD.', 'تحقق من سند الملكية لدى الدائرة.'],
        ['Read the service-charge history.', 'اقرأ سجل رسوم الخدمات.'],
        ['Get mortgage pre-approval in writing.', 'احصل على موافقة مبدئية مكتوبة على الرهن.'],
      ]),
    ],
    act(
      'checklist',
      'Open the due-diligence checklist',
      'افتح قائمة العناية الواجبة',
      '/learn/checklists/new?template=due-diligence',
    ),
    ['dld-title-deed', 'rera-brokers'],
  ),
  lesson(
    'B5',
    L('The transaction and after', 'المعاملة وما بعدها'),
    L(
      'Transfer day, fees, and running the home after the keys.',
      'يوم النقل والرسوم وإدارة المسكن بعد استلام المفاتيح.',
    ),
    [
      video('B5', L('The transaction and after', 'المعاملة وما بعدها'), '3:00'),
      read('B5', B5_READ, 3),
      summary('B5', [
        ['Transfer happens at a DLD trustee office.', 'يتم النقل في مكتب أمين تابع للدائرة.'],
        ['Budget for service charges and maintenance.', 'خصص ميزانية لرسوم الخدمات والصيانة.'],
        [
          'Re-run Rent vs buy with real numbers.',
          'أعد حساب الإيجار مقابل الشراء بالأرقام الفعلية.',
        ],
      ]),
    ],
    act(
      'calculator',
      'Run Rent vs buy',
      'شغّل الإيجار مقابل الشراء',
      '/learn/calculator?tab=rent-vs-buy',
    ),
    ['dld-fees', 'cbuae-mortgage', 'dewa-move-in'],
  ),
  quizUnit('BQ', B_POST),
]

// ---------------------------------------------------------------- courses

const UPDATED = '2026-11-25T09:00:00+04:00'

export const SEED_COURSES: Course[] = [
  {
    id: 'renting',
    track: 'A',
    title: L('Renting in the UAE', 'الإيجار في الإمارات'),
    summary: L(
      'Know what renting really costs, what to check before you sign and your rights at renewal and move-out.',
      'اعرف التكلفة الحقيقية للإيجار، وما تتحقق منه قبل التوقيع، وحقوقك عند التجديد والخروج.',
    ),
    description: L(
      'Know what renting really costs, what to check before you sign and your rights at renewal and move-out. Dubai rules first; each lesson says which emirate it applies to.',
      'اعرف التكلفة الحقيقية للإيجار، وما تتحقق منه قبل التوقيع، وحقوقك عند التجديد والخروج. قواعد دبي أولاً؛ وكل درس يوضح الإمارة التي ينطبق عليها.',
    ),
    level: 'beginner',
    tags: ['renting', 'dubai', 'track-a'],
    status: 'published',
    cover: 'images/generated/track-renting.jpg',
    seedLearners: 719,
    updatedAt: UPDATED,
    duration: L('About 45 minutes', 'نحو 45 دقيقة'),
    outcomes: [
      L(
        'Calculate the true first-year cost of a rental.',
        'احسب التكلفة الحقيقية للسنة الأولى من الإيجار.',
      ),
      L(
        'Choose an area against your commute, schools and lifestyle.',
        'اختر منطقة وفق تنقلك والمدارس ونمط حياتك.',
      ),
      L('Run a viewing with a checklist.', 'أجرِ معاينة باستخدام قائمة تحقق.'),
      L(
        'Understand registration, renewal notice and rent-increase rules in Dubai.',
        'افهم قواعد التسجيل وإشعار التجديد وزيادة الإيجار في دبي.',
      ),
      L('Protect your deposit at move-in and move-out.', 'احمِ مبلغ التأمين عند الانتقال والخروج.'),
    ],
    certificateTitle: L(
      'Home Ready: Renting in the UAE, Certificate of Completion',
      'جاهز للسكن: الإيجار في الإمارات، شهادة إتمام',
    ),
    preQuiz: A_PRE,
    modules: [
      {
        id: 'renting-m1',
        title: L('Renting in the UAE', 'الإيجار في الإمارات'),
        summary: L('Five units and a final quiz.', 'خمس وحدات واختبار نهائي.'),
        units: A_UNITS,
      },
    ],
  },
  {
    id: 'buying',
    track: 'B',
    title: L('Buying your first home', 'شراء مسكنك الأول'),
    summary: L(
      'See when buying makes sense for you, what you can afford, the risks of ready and off-plan homes, and the checks before you pay.',
      'اعرف متى يكون الشراء منطقياً لك، وما تستطيع تحمله، ومخاطر المساكن الجاهزة وعلى الخارطة، والفحوص قبل الدفع.',
    ),
    description: L(
      'See when buying makes sense for you, what you can afford, the risks of ready and off-plan homes, and the checks before you pay. Dubai rules first.',
      'اعرف متى يكون الشراء منطقياً لك، وما تستطيع تحمله، ومخاطر المساكن الجاهزة وعلى الخارطة، والفحوص قبل الدفع. قواعد دبي أولاً.',
    ),
    level: 'beginner',
    tags: ['buying', 'dubai', 'track-b'],
    status: 'published',
    cover: 'images/generated/track-buying.jpg',
    seedLearners: 521,
    updatedAt: UPDATED,
    duration: L('About 50 minutes', 'نحو 50 دقيقة'),
    outcomes: [
      L(
        'Judge when buying costs less than renting for how long you will stay.',
        'قدّر متى يكلف الشراء أقل من الإيجار وفق مدة بقائك.',
      ),
      L(
        'Work out the cash and monthly payments you can afford.',
        'احسب النقد والأقساط الشهرية التي تستطيع تحملها.',
      ),
      L(
        'Compare the risks of ready and off-plan homes.',
        'قارن مخاطر المساكن الجاهزة وعلى الخارطة.',
      ),
      L('Run the due-diligence checks before you pay.', 'نفّذ فحوص العناية الواجبة قبل الدفع.'),
    ],
    certificateTitle: L(
      'Home Ready: Buying your first home, Certificate of Completion',
      'جاهز للسكن: شراء مسكنك الأول، شهادة إتمام',
    ),
    preQuiz: B_PRE,
    modules: [
      {
        id: 'buying-m1',
        title: L('Buying your first home', 'شراء مسكنك الأول'),
        summary: L('Five units and a final quiz.', 'خمس وحدات واختبار نهائي.'),
        units: B_UNITS,
      },
    ],
  },
]

// ---------------------------------------------------------------- enrolments (C8.1)

const blockIds = (units: Unit[], ids: string[]) =>
  units.filter((u) => ids.includes(u.id)).flatMap((u) => u.blocks.map((b) => b.id))

export const SEED_ENROLLMENTS: Enrollment[] = [
  {
    courseId: 'renting',
    learnerId: 'L01',
    enrolledAt: '2026-11-18T10:00:00+04:00',
    completedUnitIds: ['A1', 'A2', 'A3'],
    completedBlockIds: blockIds(A_UNITS, ['A1', 'A2', 'A3']),
    attempts: [],
    lastUnitId: 'A4',
  },
  {
    courseId: 'buying',
    learnerId: 'L02',
    enrolledAt: '2026-11-16T10:00:00+04:00',
    completedUnitIds: ['B1', 'B2'],
    completedBlockIds: blockIds(B_UNITS, ['B1', 'B2']),
    attempts: [],
    lastUnitId: 'B3',
  },
]
