import type { Journey, JourneyOption } from '@shared/types'

/** Journey scoring (brief C11.1): score = sum of chosen option points; best path = 100. */

export function optionOf(journey: Journey, stepId: string, optionId: string | undefined) {
  return journey.steps.find((s) => s.id === stepId)?.options.find((o) => o.id === optionId)
}

export function journeyScore(journey: Journey, answers: Record<string, string>): number {
  return journey.steps.reduce(
    (sum, s) => sum + (optionOf(journey, s.id, answers[s.id])?.points ?? 0),
    0,
  )
}

export function maxJourneyScore(journey: Journey): number {
  return journey.steps.reduce((sum, s) => sum + Math.max(0, ...s.options.map((o) => o.points)), 0)
}

export function bestOption(options: JourneyOption[]): JourneyOption | undefined {
  return options.find((o) => o.best) ?? [...options].sort((a, b) => b.points - a.points)[0]
}

export function isJourneyComplete(journey: Journey, answers: Record<string, string>): boolean {
  return journey.steps.every((s) => !!answers[s.id])
}

/** Index of the first unanswered step (steps.length when all are answered). */
export function currentStepIndex(journey: Journey, answers: Record<string, string>): number {
  const i = journey.steps.findIndex((s) => !answers[s.id])
  return i === -1 ? journey.steps.length : i
}

/** Score meter band for the result page. */
export function scoreBand(score: number): 'well-informed' | 'informed' | 'getting-there' {
  if (score >= 70) return 'well-informed'
  if (score >= 40) return 'informed'
  return 'getting-there'
}
