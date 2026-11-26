import { CHART, SERIES } from '@/components/charts'

/** Impact filter options (C13). Values are keys into the leadership namespace. */
export const RANGES = ['12', '8', '4'] as const
export const TRACKS = ['A', 'B'] as const
export const EMIRATES = ['dubai', 'sharjah', 'abu-dhabi', 'other'] as const
export const SOURCES = ['social', 'search', 'employer', 'friend', 'partner', 'event'] as const
export const HOUSEHOLDS = ['single', 'couple', 'family', 'sharing'] as const
export const LANGUAGES = ['en', 'ar'] as const

export type Range = (typeof RANGES)[number]
export type TrackKey = (typeof TRACKS)[number]
export type EmirateKey = (typeof EMIRATES)[number]
export type SourceKey = (typeof SOURCES)[number]

export interface ImpactFilters {
  range: Range
  track: TrackKey | 'all'
  emirate: EmirateKey | 'all'
  source: SourceKey | 'all'
  household: (typeof HOUSEHOLDS)[number] | 'all'
  language: (typeof LANGUAGES)[number] | 'all'
}

export const DEFAULT_FILTERS: ImpactFilters = {
  range: '12',
  track: 'all',
  emirate: 'all',
  source: 'all',
  household: 'all',
  language: 'all',
}

/**
 * Sign-up chart series: five categorical slots in fixed order (partner offer and event fold into
 * one "other" series so the palette never cycles). Colour follows the source, never its rank.
 */
export const SIGNUP_SERIES = [
  { key: 'social', parts: ['social'], color: SERIES[0] },
  { key: 'search', parts: ['search'], color: SERIES[1] },
  { key: 'employer', parts: ['employer'], color: SERIES[2] },
  { key: 'friend', parts: ['friend'], color: SERIES[3] },
  { key: 'other', parts: ['partner', 'event'], color: SERIES[4] },
] as const satisfies readonly { key: string; parts: readonly SourceKey[]; color: string }[]

export const TRACK_COLOR: Record<TrackKey, string> = {
  A: 'var(--brand-track-a)',
  B: 'var(--brand-track-b)',
}

export const CONFIDENCE_COLOR = { pre: CHART.ramp[1], post: CHART.primary }

export interface SignupSeries {
  key: string
  parts: SourceKey[]
  color: string
}
