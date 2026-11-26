import type { Journey, JourneyId, JourneyOption, JourneyStep, Localized } from '@shared/types'
import { L } from './l'

/**
 * Decision journeys (brief C11.1). Five screens, three options each, instant feedback.
 * Score = sum of the chosen options' points; the best path scores 100. Every decision in the
 * last step is valid: points reflect how informed it was. Fictional scenarios and numbers.
 */

type Opt = [id: string, en: string, ar: string, fbEn: string, fbAr: string, points: number]

function step(
  id: string,
  title: Localized,
  prompt: Localized,
  options: Opt[],
  info?: Localized[],
): JourneyStep {
  const max = Math.max(...options.map((o) => o[5]))
  const opts: JourneyOption[] = options.map(([oid, en, ar, fbEn, fbAr, points]) => ({
    id: oid,
    label: L(en, ar),
    feedback: L(fbEn, fbAr),
    points,
    ...(points === max ? { best: true } : {}),
  }))
  return { id, title, prompt, options: opts, ...(info ? { info } : {}) }
}

const renewOrMove: Journey = {
  id: 'renew-or-move',
  track: 'A',
  cover: 'images/generated/journey-renew.jpg',
  title: L('Renew or move?', 'تجدّد أم تنتقل؟'),
  summary: L(
    'Your landlord wants more rent. Check the rules, compare the true cost and decide with confidence.',
    'المالك يطلب إيجاراً أعلى. تحقق من القواعد وقارن التكلفة الفعلية وقرّر بثقة.',
  ),
  profile: [
    L('Couple renting a 2BR in Al Barsha, Dubai', 'زوجان يستأجران شقة بغرفتي نوم في البرشاء، دبي'),
    L('Current rent AED 95,000 a year', 'الإيجار الحالي 95,000 درهم سنوياً'),
    L('Contract ends 2 May 2027', 'ينتهي العقد في 2 مايو 2027'),
    L('Landlord asks for AED 104,500 at renewal', 'المالك يطلب 104,500 درهم عند التجديد'),
  ],
  steps: [
    step(
      'rm1',
      L('The notice', 'الإشعار'),
      L(
        "Your landlord's notice arrived 70 days before the end. What do you do?",
        'وصل إشعار المالك قبل 70 يوماً من انتهاء العقد. ماذا تفعل؟',
      ),
      [
        [
          'rm1-a',
          'Check the 90-day notice rule and the Rental Index first',
          'أتحقق أولاً من قاعدة الإشعار قبل 90 يوماً ومن مؤشر الإيجارات',
          'Well done. Any change to the rent needs written notice at least 90 days before the end, and the Rental Index sets the allowed increase.',
          'أحسنت. أي تغيير في الإيجار يحتاج إلى إشعار كتابي قبل 90 يوماً على الأقل من الانتهاء، ومؤشر الإيجارات يحدد الزيادة المسموح بها.',
          20,
        ],
        [
          'rm1-b',
          'Accept the new rent to keep things simple',
          'أقبل الإيجار الجديد لتجنب التعقيد',
          'You may pay more than the rules allow. The notice came late, and the increase may be above what the Rental Index allows.',
          'قد تدفع أكثر مما تسمح به القواعد. وصل الإشعار متأخراً وقد تكون الزيادة أعلى مما يسمح به المؤشر.',
          5,
        ],
        [
          'rm1-c',
          'Start looking for a new home straight away',
          'أبدأ البحث عن سكن جديد فوراً',
          'Moving is an option, but check your rights first. You may be able to renew at a lower rent.',
          'الانتقال خيار وارد، لكن تحقق من حقوقك أولاً. قد تتمكن من التجديد بإيجار أقل.',
          10,
        ],
      ],
    ),
    step(
      'rm2',
      L('The Rental Index', 'مؤشر الإيجارات'),
      L(
        'Run the Rental Index for your area. What does it tell you?',
        'استخدم مؤشر الإيجارات لمنطقتك. ماذا يخبرك؟',
      ),
      [
        [
          'rm2-a',
          'The allowed increase is 5%: AED 99,750, not AED 104,500',
          'الزيادة المسموح بها 5%: أي 99,750 درهماً وليس 104,500 درهم',
          'Correct. Your rent is below the area average, so the allowed increase for this demo is 5%, not 10%.',
          'صحيح. إيجارك أقل من متوسط المنطقة، لذا فالزيادة المسموح بها في هذا المثال 5% وليست 10%.',
          20,
        ],
        [
          'rm2-b',
          'The landlord can ask any amount',
          'يحق للمالك طلب أي مبلغ',
          'Not in Dubai. Increases are linked to the Rental Index for similar homes in your area.',
          'ليس في دبي. الزيادات مرتبطة بمؤشر الإيجارات للمساكن المماثلة في منطقتك.',
          0,
        ],
        [
          'rm2-c',
          'The allowed increase is 10%',
          'الزيادة المسموح بها 10%',
          'Close, but the index puts your home in a lower band. The allowed increase is 5% (AED 99,750).',
          'قريب، لكن المؤشر يضع سكنك في شريحة أدنى. الزيادة المسموح بها 5% (99,750 درهماً).',
          8,
        ],
      ],
      [
        L('Current rent: AED 95,000 a year', 'الإيجار الحالي: 95,000 درهم سنوياً'),
        L('Landlord asks: AED 104,500 (10% more)', 'طلب المالك: 104,500 درهم (زيادة 10%)'),
        L(
          'Allowed by the Rental Index: 5% = AED 99,750',
          'المسموح وفق مؤشر الإيجارات: 5% = 99,750 درهماً',
        ),
      ],
    ),
    step(
      'rm3',
      L('Renew or move to JVC?', 'التجديد أم الانتقال إلى قرية جميرا الدائرية؟'),
      L(
        'A 2BR in JVC rents for AED 82,000. How do you compare it with renewing?',
        'شقة بغرفتي نوم في قرية جميرا الدائرية بإيجار 82,000 درهم. كيف تقارنها بالتجديد؟',
      ),
      [
        [
          'rm3-a',
          'Compare the true first-year cost of both homes',
          'أقارن التكلفة الفعلية للسنة الأولى للسكنين',
          'Good choice. With agency fee, deposit, moving and Ejari, JVC costs AED 93,377.75 in the first year against AED 99,750 to renew.',
          'اختيار موفق. مع عمولة الوسيط والتأمين والنقل وإيجاري، تبلغ تكلفة قرية جميرا الدائرية 93,377.75 درهماً في السنة الأولى مقابل 99,750 درهماً للتجديد.',
          20,
        ],
        [
          'rm3-b',
          'Compare the advertised rents only',
          'أقارن الإيجارات المعلنة فقط',
          'The advert hides the one-off costs. The gap is AED 6,372.25, not AED 17,750.',
          'الإعلان لا يُظهر التكاليف لمرة واحدة. الفرق 6,372.25 درهماً وليس 17,750 درهماً.',
          8,
        ],
        [
          'rm3-c',
          'Skip the comparison and decide on location',
          'أتجاوز المقارنة وأقرر حسب الموقع',
          'Location matters, but so does cost. Compare both before you decide.',
          'الموقع مهم، والتكلفة كذلك. قارن الاثنين قبل أن تقرر.',
          0,
        ],
      ],
      [
        L(
          'JVC 2BR, first year: AED 93,377.75 = AED 82,000 rent + AED 4,100 agency fee + AED 4,100 security deposit + AED 3,000 moving + AED 177.75 Ejari',
          'قرية جميرا الدائرية، غرفتا نوم، السنة الأولى: 93,377.75 درهماً = 82,000 إيجار + 4,100 عمولة وسيط + 4,100 تأمين + 3,000 نقل + 177.75 إيجاري',
        ),
        L('Renew in Al Barsha: AED 99,750', 'التجديد في البرشاء: 99,750 درهماً'),
        L(
          'One-off and rent costs only; utilities similar in both homes.',
          'تشمل الإيجار والتكاليف لمرة واحدة فقط؛ تكاليف الخدمات متقاربة في السكنين.',
        ),
      ],
    ),
    step(
      'rm4',
      L('Commute and school check', 'التنقل والمدرسة'),
      L(
        'Using the priorities you ranked in unit A2, how do you check the move?',
        'باستخدام الأولويات التي رتّبتها في الوحدة A2، كيف تتحقق من الانتقال؟',
      ),
      [
        [
          'rm4-a',
          'Time the commute at rush hour and check services nearby',
          'أقيس وقت التنقل في ساعة الذروة وأتحقق من الخدمات القريبة',
          'Great. Your top priority is commute, and you tested it at the time you really travel.',
          'ممتاز. أولويتك الأولى هي التنقل، واختبرتها في الوقت الذي تتنقل فيه فعلاً.',
          20,
        ],
        [
          'rm4-b',
          'Check the distance on a map',
          'أتحقق من المسافة على الخريطة',
          'A map helps, but rush-hour traffic can double the time. Try the real commute.',
          'الخريطة مفيدة، لكن زحام ساعة الذروة قد يضاعف الوقت. جرّب التنقل الفعلي.',
          10,
        ],
        [
          'rm4-c',
          'Ask the agent if it is a good area',
          'أسأل الوسيط إن كانت المنطقة جيدة',
          'The agent may be helpful, but check against your own priorities.',
          'قد يكون الوسيط مفيداً، لكن تحقق وفق أولوياتك أنت.',
          5,
        ],
      ],
    ),
    step(
      'rm5',
      L('Your decision', 'قرارك'),
      L(
        'Any decision is valid. Which one fits you, and how sure are you?',
        'كل القرارات صحيحة. أيها يناسبك، وما مدى ثقتك؟',
      ),
      [
        [
          'rm5-a',
          'Renew at AED 99,750, reply in writing and set a reminder',
          'أجدّد بمبلغ 99,750 درهماً وأرد كتابياً وأضبط تذكيراً',
          'An informed decision: you used the rules, the true cost and your priorities.',
          'قرار مدروس: استخدمت القواعد والتكلفة الفعلية وأولوياتك.',
          20,
        ],
        [
          'rm5-b',
          'Move to JVC and book a viewing with the checklist',
          'أنتقل إلى قرية جميرا الدائرية وأحجز معاينة مع قائمة التحقق',
          'A valid choice. Take the viewing checklist so the cheaper home has no hidden costs.',
          'خيار صحيح. خذ قائمة المعاينة معك حتى لا يخفي السكن الأرخص تكاليف إضافية.',
          8,
        ],
        [
          'rm5-c',
          'Wait and decide later',
          'أنتظر وأقرر لاحقاً',
          'Waiting is risky close to the end date. Set a reminder so you decide in time.',
          'الانتظار محفوف بالمخاطر قرب تاريخ الانتهاء. اضبط تذكيراً لتقرر في الوقت المناسب.',
          0,
        ],
      ],
    ),
  ],
  checkList: [
    L(
      'Check the 90-day notice date for your contract',
      'تحقق من موعد الإشعار قبل 90 يوماً من انتهاء عقدك',
    ),
    L('Run the DLD Rental Index for your area', 'استخدم مؤشر الإيجارات لمنطقتك'),
    L(
      'Compare true first-year costs, not advertised rents',
      'قارن التكلفة الفعلية للسنة الأولى لا الإيجارات المعلنة',
    ),
    L('Reply to your landlord in writing and keep a copy', 'رد على المالك كتابياً واحتفظ بنسخة'),
    L('Renew Ejari after you sign the new contract', 'جدّد إيجاري بعد توقيع العقد الجديد'),
  ],
  nextAction: L(
    'Check the Rental Index and reply to your landlord in writing before 1 Feb 2027',
    'تحقق من مؤشر الإيجارات ورد على المالك كتابياً قبل 1 فبراير 2027',
  ),
  checklistTemplateId: 'renewal',
  resultNote: L('Educational scenario with fictional numbers.', 'سيناريو تعليمي بأرقام افتراضية.'),
}

const rentOrBuy: Journey = {
  id: 'rent-or-buy',
  track: 'B',
  cover: 'images/generated/journey-buy.jpg',
  title: L('Keep renting or buy?', 'تستمر في الإيجار أم تشتري؟'),
  summary: L(
    'See when buying makes sense, what it really costs and what to check before you pay.',
    'اعرف متى يكون الشراء منطقياً، وكم يكلّف فعلاً، وما الذي تتحقق منه قبل الدفع.',
  ),
  profile: [
    L('Family with two children in Dubai', 'عائلة لديها طفلان في دبي'),
    L('Rent AED 140,000 a year', 'الإيجار 140,000 درهم سنوياً'),
    L('Savings AED 450,000', 'المدخرات 450,000 درهم'),
    L(
      'Considering a ready 3BR townhouse at AED 2,300,000 (fictional)',
      'يفكرون في تاون هاوس جاهز بثلاث غرف بسعر 2,300,000 درهم (افتراضي)',
    ),
  ],
  steps: [
    step(
      'rb1',
      L('How long will you stay?', 'كم ستبقى؟'),
      L('How many years do you expect to live in this home?', 'كم سنة تتوقع أن تعيش في هذا السكن؟'),
      [
        [
          'rb1-a',
          '3 years',
          '3 سنوات',
          'Short stays make buying harder to justify: fees are paid up front and selling costs come at the end.',
          'الإقامة القصيرة تجعل الشراء أصعب تبريراً: الرسوم تُدفع مقدماً وتكاليف البيع تأتي في النهاية.',
          10,
        ],
        [
          'rb1-b',
          '5 years',
          '5 سنوات',
          'A middle case. Check the break-even year in the calculator.',
          'حالة متوسطة. تحقق من سنة التعادل في الحاسبة.',
          15,
        ],
        [
          'rb1-c',
          '8 years or more',
          '8 سنوات أو أكثر',
          'A longer stay spreads the one-off costs. At the calculator defaults, buying costs less from year 3.',
          'الإقامة الأطول توزّع التكاليف لمرة واحدة. وفق القيم الافتراضية للحاسبة، يصبح الشراء أقل تكلفة من السنة الثالثة.',
          20,
        ],
      ],
      [
        L(
          'At the calculator defaults, buying costs less from year 3.',
          'وفق القيم الافتراضية للحاسبة، يصبح الشراء أقل تكلفة من السنة الثالثة.',
        ),
      ],
    ),
    step(
      'rb2',
      L('Down payment and fees', 'الدفعة الأولى والرسوم'),
      L(
        'How much cash do you need before you get the keys?',
        'كم تحتاج من النقد قبل استلام المفاتيح؟',
      ),
      [
        [
          'rb2-a',
          'Down payment plus transfer, mortgage and agency fees',
          'الدفعة الأولى مع رسوم النقل والرهن والوساطة',
          'Right. On AED 2,300,000: 20% down payment AED 460,000, 4% transfer fee AED 92,000, mortgage registration 0.25% plus admin fee, 2% agency fee AED 46,000.',
          'صحيح. على 2,300,000 درهم: دفعة أولى 20% أي 460,000 درهم، ورسوم نقل 4% أي 92,000 درهم، وتسجيل رهن 0.25% مع رسوم إدارية، وعمولة وسيط 2% أي 46,000 درهم.',
          20,
        ],
        [
          'rb2-b',
          'Only the 20% down payment',
          'الدفعة الأولى 20% فقط',
          'The fees add about AED 142,000 more. Your savings of AED 450,000 would not cover it all.',
          'الرسوم تضيف نحو 142,000 درهم أخرى. مدخراتك البالغة 450,000 درهم لن تغطي المبلغ كله.',
          8,
        ],
        [
          'rb2-c',
          'Nothing, the bank pays it all',
          'لا شيء، البنك يدفع كل شيء',
          'Not for most buyers. A minimum down payment applies; check the rule with your bank.',
          'ليس لمعظم المشترين. هناك حد أدنى للدفعة الأولى؛ تحقق من القاعدة مع بنكك.',
          0,
        ],
      ],
      [
        L(
          'Down payment: 20% minimum for a first home under AED 5m for non-nationals (default to check with your bank)',
          'الدفعة الأولى: 20% حداً أدنى لأول مسكن بأقل من 5 ملايين درهم لغير المواطنين (قيمة افتراضية تحقق منها مع بنكك)',
        ),
        L('DLD transfer fee: 4%', 'رسوم النقل لدى دائرة الأراضي والأملاك: 4%'),
        L('Mortgage registration: 0.25% + admin fee', 'تسجيل الرهن: 0.25% + رسوم إدارية'),
        L('Agency fee: 2%', 'عمولة الوسيط: 2%'),
      ],
    ),
    step(
      'rb3',
      L('Running costs', 'تكاليف التشغيل'),
      L(
        'Which yearly costs do owners pay that renters usually do not?',
        'ما التكاليف السنوية التي يدفعها المالك ولا يدفعها المستأجر عادةً؟',
      ),
      [
        [
          'rb3-a',
          'Service charge, maintenance and insurance',
          'رسوم الخدمات والصيانة والتأمين',
          'Correct. A service charge of AED 14 per sq ft a year (demo) is about AED 30,800 for this home, plus maintenance and insurance.',
          'صحيح. رسوم خدمات بقيمة 14 درهماً للقدم المربعة سنوياً (مثال) تعادل نحو 30,800 درهم لهذا السكن، إضافة إلى الصيانة والتأمين.',
          20,
        ],
        [
          'rb3-b',
          'Only the mortgage payment',
          'قسط التمويل فقط',
          'Owners also pay service charges, maintenance and insurance every year.',
          'يدفع المالك أيضاً رسوم الخدمات والصيانة والتأمين كل عام.',
          5,
        ],
        [
          'rb3-c',
          'The same as renting',
          'التكاليف نفسها كما في الإيجار',
          'Not quite. Ownership brings costs the landlord used to pay.',
          'ليس تماماً. الملكية تأتي بتكاليف كان المالك يدفعها.',
          0,
        ],
      ],
    ),
    step(
      'rb4',
      L('Due diligence', 'العناية الواجبة'),
      L('What do you check before you pay a deposit?', 'ما الذي تتحقق منه قبل دفع العربون؟'),
      [
        [
          'rb4-a',
          'Verify the title deed, the developer and the service-charge history',
          'أتحقق من سند الملكية والمطوّر وسجل رسوم الخدمات',
          'Well done. Use DLD Title Deed Verification and read the service-charge history before you commit.',
          'أحسنت. استخدم خدمة التحقق من سند الملكية لدى دائرة الأراضي واطّلع على سجل رسوم الخدمات قبل الالتزام.',
          20,
        ],
        [
          'rb4-b',
          'Trust the seller and the agent',
          'أثق بالبائع والوسيط',
          'Always verify yourself: the title deed check takes a few minutes on DLD.',
          'تحقق دائماً بنفسك: فحص سند الملكية يستغرق دقائق لدى دائرة الأراضي.',
          0,
        ],
        [
          'rb4-c',
          'Check the photos and the floor plan',
          'أراجع الصور والمخطط',
          'Useful, but not enough. Verify the title deed and the service-charge history too.',
          'مفيد لكنه غير كافٍ. تحقق أيضاً من سند الملكية وسجل رسوم الخدمات.',
          8,
        ],
      ],
    ),
    step(
      'rb5',
      L('Your decision', 'قرارك'),
      L(
        'Any decision is valid. Which one fits your family, and how sure are you?',
        'كل القرارات صحيحة. أيها يناسب عائلتك، وما مدى ثقتك؟',
      ),
      [
        [
          'rb5-a',
          'Get a mortgage pre-approval and run the due-diligence checklist',
          'أحصل على موافقة مبدئية على التمويل وأتبع قائمة العناية الواجبة',
          'An informed next step: you know your numbers and what to check.',
          'خطوة تالية مدروسة: تعرف أرقامك وما الذي يجب التحقق منه.',
          20,
        ],
        [
          'rb5-b',
          'Keep renting and save for a larger down payment',
          'أستمر في الإيجار وأدخر لدفعة أولى أكبر',
          'A valid choice. Set a yearly reminder to rerun the calculator.',
          'خيار صحيح. اضبط تذكيراً سنوياً لإعادة استخدام الحاسبة.',
          8,
        ],
        [
          'rb5-c',
          'Buy now without more checks',
          'أشتري الآن دون مزيد من الفحوص',
          'Buying may suit you, but skipping checks is risky. Run the due-diligence checklist first.',
          'قد يناسبك الشراء، لكن تجاوز الفحوص محفوف بالمخاطر. اتبع قائمة العناية الواجبة أولاً.',
          0,
        ],
      ],
    ),
  ],
  checkList: [
    L(
      'Verify the title deed on DLD Title Deed Verification',
      'تحقق من سند الملكية عبر خدمة التحقق لدى دائرة الأراضي والأملاك',
    ),
    L('Check the developer and service-charge history', 'تحقق من المطوّر وسجل رسوم الخدمات'),
    L(
      'Budget the 4% transfer fee, mortgage registration and agency fee',
      'خصص ميزانية لرسوم النقل 4% وتسجيل الرهن وعمولة الوسيط',
    ),
    L('Confirm your down payment rule with your bank', 'تأكد من قاعدة الدفعة الأولى مع بنكك'),
    L(
      'Rerun the rent-vs-buy calculator with your own numbers',
      'أعد استخدام حاسبة الإيجار مقابل الشراء بأرقامك',
    ),
  ],
  nextAction: L(
    'Verify the title deed on DLD Title Deed Verification',
    'تحقق من سند الملكية عبر خدمة التحقق لدى دائرة الأراضي والأملاك',
  ),
  checklistTemplateId: 'due-diligence',
  resultNote: L('Educational scenario with fictional numbers.', 'سيناريو تعليمي بأرقام افتراضية.'),
}

export const JOURNEYS: Journey[] = [renewOrMove, rentOrBuy]

export const JOURNEY_BY_ID = Object.fromEntries(JOURNEYS.map((j) => [j.id, j])) as Record<
  JourneyId,
  Journey
>

/** Aisha's saved Renew-or-move answers: score 78/100. */
export const AISHA_ANSWERS: Record<string, string> = {
  rm1: 'rm1-a',
  rm2: 'rm2-a',
  rm3: 'rm3-a',
  rm4: 'rm4-b',
  rm5: 'rm5-b',
}

/** Rohan's saved Keep-renting-or-buy answers: score 71/100. */
export const ROHAN_ANSWERS: Record<string, string> = {
  rb1: 'rb1-b',
  rb2: 'rb2-a',
  rb3: 'rb3-a',
  rb4: 'rb4-c',
  rb5: 'rb5-b',
}
