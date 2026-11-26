import type {
  BudgetBand,
  Emirate,
  Household,
  Lang,
  SignupSource,
  Situation,
  TrackKey,
} from '@shared/types'
import { L } from '@/data/l'
import { scoreQuiz } from '@/domain/learning'
import { now } from '@/lib/clock'
import { getDb, update } from '../db'
import { uid, withAudit, withNotification } from './helpers'

export interface RegisterInput {
  name: string
  email: string
  password: string
  mobile?: string
  emirate: Emirate
  situation: Situation
  language: Lang
  source?: SignupSource
  marketing: boolean
}

/** C6.1: create a learner account, sign in, and start onboarding. Returns the new persona id. */
export function registerLearner(input: RegisterInput): string {
  const id = uid('LN')
  const at = now()
  const track: TrackKey =
    input.situation === 'buying' || input.situation === 'thinking-buy' ? 'B' : 'A'
  update((db) => {
    const next = {
      ...db,
      session: { personaId: id },
      prefs: { ...db.prefs, lang: input.language },
      registered: [
        ...db.registered,
        {
          id,
          name: input.name,
          email: input.email,
          password: input.password,
          lang: input.language,
          createdAt: at,
        },
      ],
      consents: [
        ...db.consents,
        { learnerId: id, termsAcceptedAt: at, marketing: input.marketing },
      ],
      onboarding: { ...db.onboarding, [id]: { track, step: 1, done: false } },
      learners: [
        {
          id: uid('LR'),
          personaId: id,
          name: input.name,
          email: input.email,
          emirate: input.emirate,
          track,
          situation: input.situation,
          household: 'single' as Household,
          budget: '8-12' as BudgetBand,
          source: input.source ?? 'other',
          language: input.language,
          progress: 0,
          joined: at.slice(0, 10),
          lastActive: at.slice(0, 10),
          returned30: false,
          reminders: 0,
          partnerConsents: 0,
          marketing: input.marketing,
          journeys: [],
        },
        ...db.learners,
      ],
    }
    const first = input.name.split(' ')[0] ?? input.name
    return withAudit(
      {
        ...next,
        notifications: withNotification(
          next,
          id,
          { en: `Welcome to Home Ready, ${first}`, ar: `مرحباً بك في جاهز للسكن، ${first}` },
          {
            en: 'Your first step takes about 10 minutes.',
            ar: 'خطوتك الأولى تستغرق نحو 10 دقائق.',
          },
          '/onboarding/1',
        ),
      },
      input.name,
      L(
        `Registered (terms accepted, marketing ${input.marketing ? 'on' : 'off'})`,
        `سجّل (قبل الشروط، الرسائل التسويقية ${input.marketing ? 'مفعّلة' : 'متوقفة'})`,
      ),
      L('Learner account', 'حساب متعلم'),
    )
  })
  return id
}

/** Save onboarding answers for a step (1 situation, 2 track) and move to `step`. */
export function saveOnboarding(
  learnerId: string,
  patch: { household?: Household; budget?: BudgetBand; workArea?: string; track?: TrackKey },
  step: number,
) {
  update((db) => {
    const cur = db.onboarding[learnerId] ?? { step: 1, done: false }
    return {
      ...db,
      onboarding: { ...db.onboarding, [learnerId]: { ...cur, ...patch, step } },
      learners: db.learners.map((l) =>
        l.personaId === learnerId
          ? {
              ...l,
              household: patch.household ?? l.household,
              budget: patch.budget ?? l.budget,
              track: patch.track ?? l.track,
            }
          : l,
      ),
    }
  })
}

/** Step 3: score the chosen track's pre-quiz (no pass mark). Returns the percent. */
export function submitPreQuiz(
  learnerId: string,
  courseId: string,
  answers: Record<string, number>,
) {
  const quiz = getDb().courses.find((c) => c.id === courseId)?.preQuiz
  const score = quiz ? scoreQuiz(quiz, answers).score : 0
  update((db) => ({
    ...db,
    onboarding: {
      ...db.onboarding,
      [learnerId]: {
        ...(db.onboarding[learnerId] ?? { step: 3, done: false }),
        preQuiz: answers,
        preQuizScore: score,
        step: 4,
      },
    },
  }))
  return score
}

export function finishOnboarding(learnerId: string) {
  update((db) => ({
    ...db,
    onboarding: {
      ...db.onboarding,
      [learnerId]: {
        ...(db.onboarding[learnerId] ?? { step: 4, done: false }),
        step: 4,
        done: true,
      },
    },
  }))
}
