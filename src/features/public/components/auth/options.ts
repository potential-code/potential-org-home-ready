import type {
  BudgetBand,
  Emirate,
  Household,
  SignupSource,
  Situation,
  TrackKey,
} from '@shared/types'

/** C6.1 option lists, in brief order. Labels: auth:options.<group>.<value>. */
export const EMIRATES: Emirate[] = [
  'dubai',
  'abu-dhabi',
  'sharjah',
  'ajman',
  'rak',
  'fujairah',
  'uaq',
  'moving',
]
export const SITUATIONS: Situation[] = ['moving', 'renewing', 'thinking-buy', 'buying']
export const SOURCES: SignupSource[] = [
  'social',
  'search',
  'friend',
  'employer',
  'event',
  'partner',
  'other',
]
export const HOUSEHOLDS: Household[] = ['single', 'couple', 'family']
export const BUDGETS: BudgetBand[] = ['u5', '5-8', '8-12', '12-20', 'o20']

/** Dubai work areas for onboarding step 1. `value` is stored (English, like the seed). */
export const WORK_AREAS = [
  { key: 'downtown', value: 'Downtown Dubai' },
  { key: 'businessBay', value: 'Business Bay' },
  { key: 'difc', value: 'DIFC' },
  { key: 'marina', value: 'Dubai Marina' },
  { key: 'jlt', value: 'Jumeirah Lake Towers' },
  { key: 'mediaCity', value: 'Dubai Internet City and Media City' },
  { key: 'barsha', value: 'Al Barsha' },
  { key: 'hills', value: 'Dubai Hills' },
  { key: 'jvc', value: 'Jumeirah Village Circle' },
  { key: 'quoz', value: 'Al Quoz' },
  { key: 'deira', value: 'Deira' },
  { key: 'burDubai', value: 'Bur Dubai' },
  { key: 'siliconOasis', value: 'Dubai Silicon Oasis' },
  { key: 'south', value: 'Dubai South' },
  { key: 'remote', value: 'Works from home' },
  { key: 'other', value: 'Other' },
] as const

/** Landing "Who it is for" card slug (`/register?path=`) to "What brings you here?". */
export const PATH_TO_SITUATION: Record<string, Situation> = {
  mover: 'moving',
  renewal: 'renewing',
  'renter-buyer': 'thinking-buy',
  'first-buyer': 'buying',
}

export const trackForSituation = (s: Situation | undefined): TrackKey =>
  s === 'buying' || s === 'thinking-buy' ? 'B' : 'A'

export const AUTH_IMAGE = 'images/generated/auth-panel.jpg'
