import { useMemo, useState } from 'react'
import { MIX, WEEKLY_SIGNUPS } from '@/data/figures'
import {
  DEFAULT_FILTERS,
  type ImpactFilters,
  SIGNUP_SERIES,
  type SignupSeries,
  SOURCES,
} from '../config'

type Week = (typeof WEEKLY_SIGNUPS)[number]

const weekTotal = (w: Week) => SOURCES.reduce((s, k) => s + w[k], 0)

/**
 * Impact filter state and what it does to the view. Date range and source act on the weekly
 * data directly; track, emirate and language narrow the segment estimate by the C15 mix.
 * Household type has no split in the pilot data, so it only labels the segment.
 */
export function useImpactFilters() {
  const [filters, setFilters] = useState<ImpactFilters>(DEFAULT_FILTERS)
  const set = <K extends keyof ImpactFilters>(key: K, value: ImpactFilters[K]) =>
    setFilters((f) => ({ ...f, [key]: value }))
  const reset = () => setFilters(DEFAULT_FILTERS)

  const view = useMemo(() => {
    const weeks = WEEKLY_SIGNUPS.slice(-Number(filters.range))
    const src = filters.source
    const series: SignupSeries[] =
      src === 'all'
        ? SIGNUP_SERIES.map((s) => ({ key: s.key, parts: [...s.parts], color: s.color }))
        : SIGNUP_SERIES.filter((s) => (s.parts as readonly string[]).includes(src)).map((s) => ({
            key: src,
            parts: [src],
            color: s.color,
          }))
    const inRange = weeks.reduce((s, w) => s + weekTotal(w), 0)
    const bySource = src === 'all' ? inRange : weeks.reduce((s, w) => s + w[src], 0)
    let share = 1
    if (filters.track !== 'all') share *= MIX.track[filters.track] / 100
    if (filters.emirate !== 'all') share *= MIX.emirate[filters.emirate] / 100
    if (filters.language !== 'all') share *= MIX.language[filters.language] / 100
    const isFiltered = (Object.keys(filters) as (keyof ImpactFilters)[]).some(
      (k) => filters[k] !== DEFAULT_FILTERS[k],
    )
    return {
      weeks,
      series,
      inRange: bySource,
      allSignups: WEEKLY_SIGNUPS.reduce((s, w) => s + weekTotal(w), 0),
      segment: Math.round(bySource * share),
      isFiltered,
    }
  }, [filters])

  return { filters, set, reset, ...view }
}
