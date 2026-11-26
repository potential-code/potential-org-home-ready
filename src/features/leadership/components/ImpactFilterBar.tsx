import { Filter, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { formatNumber, useLocalized } from '@/i18n'
import {
  EMIRATES,
  HOUSEHOLDS,
  type ImpactFilters,
  LANGUAGES,
  RANGES,
  SOURCES,
  TRACKS,
} from '../config'
import { FilterSelect } from './FilterSelect'

interface ImpactFilterBarProps {
  filters: ImpactFilters
  set: <K extends keyof ImpactFilters>(key: K, value: ImpactFilters[K]) => void
  reset: () => void
  isFiltered: boolean
  segment: number
  total: number
}

/** C13 filters in one compact row; a filtered state names the segment and its estimated size. */
export function ImpactFilterBar({
  filters,
  set,
  reset,
  isFiltered,
  segment,
  total,
}: ImpactFilterBarProps) {
  const { t } = useTranslation('leadership')
  const { lang } = useLocalized()
  const opts = <V extends string>(values: readonly V[], prefix: string, withAll = true) => [
    ...(withAll ? [{ value: 'all' as V, label: t('filters.all') }] : []),
    ...values.map((v) => {
      const key: string = `${prefix}.${v}`
      return { value: v, label: t(key) }
    }),
  ]
  const active = (Object.keys(filters) as (keyof ImpactFilters)[])
    .filter((k) => k !== 'range' && filters[k] !== 'all')
    .map((k) => {
      const prefix = {
        track: 'filters.tracks',
        emirate: 'filters.emirates',
        source: 'filters.sources',
        household: 'filters.households',
        language: 'filters.languages',
        range: 'filters.ranges',
      }[k]
      const key: string = `${prefix}.${filters[k]}`
      return { key: k, label: t(key) }
    })
  return (
    <section aria-label={t('filters.title')} className="card mb-6 p-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-[repeat(6,minmax(0,1fr))_auto] xl:items-end">
        <FilterSelect
          label={t('filters.range')}
          value={filters.range}
          options={opts(RANGES, 'filters.ranges', false)}
          onChange={(v) => set('range', v)}
        />
        <FilterSelect
          label={t('filters.track')}
          value={filters.track}
          options={opts(TRACKS, 'filters.tracks')}
          onChange={(v) => set('track', v)}
        />
        <FilterSelect
          label={t('filters.emirate')}
          value={filters.emirate}
          options={opts(EMIRATES, 'filters.emirates')}
          onChange={(v) => set('emirate', v)}
        />
        <FilterSelect
          label={t('filters.source')}
          value={filters.source}
          options={opts(SOURCES, 'filters.sources')}
          onChange={(v) => set('source', v)}
        />
        <FilterSelect
          label={t('filters.household')}
          value={filters.household}
          options={opts(HOUSEHOLDS, 'filters.households')}
          onChange={(v) => set('household', v)}
        />
        <FilterSelect
          label={t('filters.language')}
          value={filters.language}
          options={opts(LANGUAGES, 'filters.languages')}
          onChange={(v) => set('language', v)}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={reset}
          disabled={!isFiltered}
          className="col-span-2 md:col-span-3 xl:col-span-1"
        >
          <RotateCcw aria-hidden />
          {t('filters.clear')}
        </Button>
      </div>
      {isFiltered && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/70 pt-3 text-sm">
          <StatusBadge tone="brand" icon={<Filter className="size-3.5" aria-hidden />}>
            {t('filters.filtered')}
          </StatusBadge>
          <StatusBadge tone="neutral">{t(`filters.ranges.${filters.range}`)}</StatusBadge>
          {active.map((a) => (
            <StatusBadge key={a.key} tone="neutral">
              {a.label}
            </StatusBadge>
          ))}
          <span className="font-semibold text-ink">
            {t('filters.segment', {
              count: formatNumber(segment, lang),
              total: formatNumber(total, lang),
            })}
          </span>
          <span className="w-full text-xs text-ink-soft">{t('filters.segmentNote')}</span>
        </div>
      )}
    </section>
  )
}
