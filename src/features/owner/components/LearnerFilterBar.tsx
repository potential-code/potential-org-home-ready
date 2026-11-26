import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { EMIRATE_OPTIONS, SOURCE_OPTIONS } from '../config'
import type { LearnerFilters } from '../hooks/use-learner-filters'
import { FilterSelect } from './FilterSelect'
import { SearchInput } from './SearchInput'

/** One compact filter row: search, track, emirate, source, activated, returned. */
export function LearnerFilterBar({
  f,
  set,
  reset,
}: {
  f: LearnerFilters
  set: (p: Partial<LearnerFilters>) => void
  reset: () => void
}) {
  const { t } = useTranslation('owner')
  const all = { value: 'all', label: t('common.all') }
  const yn = [all, { value: 'yes', label: t('common.yes') }, { value: 'no', label: t('common.no') }]
  return (
    <div className="card grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-[minmax(0,1.6fr)_repeat(5,minmax(0,1fr))_auto] lg:items-end">
      <div className="col-span-2 sm:col-span-3 lg:col-span-1">
        <SearchInput
          id="lf-q"
          label={t('common.search')}
          value={f.q}
          placeholder={t('learners.searchPlaceholder')}
          onChange={(q) => set({ q })}
        />
      </div>
      <FilterSelect
        id="lf-track"
        label={t('learners.track')}
        value={f.track}
        onChange={(track) => set({ track })}
        options={[all, { value: 'A', label: t('track.A') }, { value: 'B', label: t('track.B') }]}
      />
      <FilterSelect
        id="lf-emirate"
        label={t('learners.emirate')}
        value={f.emirate}
        onChange={(emirate) => set({ emirate })}
        options={[all, ...EMIRATE_OPTIONS.map((e) => ({ value: e, label: t(`emirate.${e}`) }))]}
      />
      <FilterSelect
        id="lf-source"
        label={t('learners.source')}
        value={f.source}
        onChange={(source) => set({ source })}
        options={[all, ...SOURCE_OPTIONS.map((s) => ({ value: s, label: t(`source.${s}`) }))]}
      />
      <FilterSelect
        id="lf-act"
        label={t('learners.activated')}
        value={f.activated}
        onChange={(activated) => set({ activated })}
        options={yn}
      />
      <FilterSelect
        id="lf-ret"
        label={t('learners.returned')}
        value={f.returned}
        onChange={(returned) => set({ returned })}
        options={yn}
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={reset}
        className="col-span-2 justify-self-start sm:col-span-1 lg:justify-self-end"
      >
        <X aria-hidden />
        {t('common.clear')}
      </Button>
    </div>
  )
}
