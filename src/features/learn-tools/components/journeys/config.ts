import type { JourneyId } from '@shared/types'

/** Official source linked from a journey step (opens the public page in a new tab). */
export const STEP_SOURCE: Record<string, string> = {
  rm2: 'dld-rental-index',
  rm3: 'dld-ejari',
  rb4: 'dld-title-deed',
}

/** Default reminder date for the journey's next action (ISO date). */
export const REMINDER_DATE: Record<JourneyId, string> = {
  'renew-or-move': '2027-02-01',
  'rent-or-buy': '2026-12-09',
}
