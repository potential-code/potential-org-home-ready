import type { JourneyId } from '@shared/types'
import { useMemo } from 'react'
import { useJourneyRuns } from '@/store/hooks'

/**
 * The signed-in learner's latest run of a journey (undefined before the first start). Runs are
 * appended in order, so the last match is the newest (seeded runs can be dated after the demo clock).
 */
export function useLatestRun(journeyId: JourneyId) {
  const runs = useJourneyRuns()
  return useMemo(() => runs.filter((r) => r.journeyId === journeyId).at(-1), [runs, journeyId])
}
