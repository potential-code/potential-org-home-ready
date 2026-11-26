import type { LearnerRecord } from '@shared/types'
import { useMemo, useState } from 'react'
import { nowMs } from '@/lib/clock'
import { DAY_MS } from '../config'

export interface LearnerFilters {
  q: string
  track: string
  emirate: string
  source: string
  activated: string
  returned: string
  saved: boolean
}

export const NO_FILTERS: LearnerFilters = {
  q: '',
  track: 'all',
  emirate: 'all',
  source: 'all',
  activated: 'all',
  returned: 'all',
  saved: false,
}

/** Saved filter C12: signed up 7+ days ago and no first useful action yet. */
export function isStalled(l: LearnerRecord) {
  return !l.firstUsefulActionAt && nowMs() - Date.parse(l.joined) >= 7 * DAY_MS
}

export function useLearnerFilters(learners: LearnerRecord[]) {
  const [f, setF] = useState<LearnerFilters>(NO_FILTERS)
  const rows = useMemo(() => {
    const q = f.q.trim().toLowerCase()
    const yn = (v: string, b: boolean) => v === 'all' || (v === 'yes') === b
    return learners.filter(
      (l) =>
        (!q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q)) &&
        (f.track === 'all' || l.track === f.track) &&
        (f.emirate === 'all' || l.emirate === f.emirate) &&
        (f.source === 'all' || l.source === f.source) &&
        yn(f.activated, !!l.firstUsefulActionAt) &&
        yn(f.returned, l.returned30) &&
        (!f.saved || isStalled(l)),
    )
  }, [learners, f])
  const set = (patch: Partial<LearnerFilters>) => setF((x) => ({ ...x, ...patch }))
  return { f, set, reset: () => setF(NO_FILTERS), rows }
}
