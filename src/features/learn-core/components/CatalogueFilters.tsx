import type { CourseLevel } from '@shared/types'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CourseState } from '@/domain/learning'
import { LEVELS } from '../config'

export interface CatalogueFilterState {
  q: string
  level: CourseLevel | 'all'
  state: CourseState | 'all'
}

const STATES: CourseState[] = ['notStarted', 'inProgress', 'completed']

/** One compact filter row above the course grid. */
export function CatalogueFilters({
  value,
  onChange,
}: {
  value: CatalogueFilterState
  onChange: (next: CatalogueFilterState) => void
}) {
  const { t } = useTranslation('learning')
  return (
    <div className="card mb-4 grid grid-cols-2 gap-3 p-4 sm:grid-cols-[2fr_1fr_1fr]">
      <div className="col-span-2 space-y-1 sm:col-span-1">
        <Label htmlFor="course-search" className="text-xs font-semibold text-ink-soft">
          {t('catalogue.search')}
        </Label>
        <div className="relative">
          <Search
            className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
            aria-hidden
          />
          <Input
            id="course-search"
            value={value.q}
            onChange={(e) => onChange({ ...value, q: e.target.value })}
            placeholder={t('catalogue.searchPlaceholder')}
            className="ps-9"
          />
        </div>
      </div>
      <div className="min-w-0 space-y-1">
        <Label htmlFor="course-level" className="text-xs font-semibold text-ink-soft">
          {t('catalogue.level')}
        </Label>
        <Select
          value={value.level}
          onValueChange={(v) => onChange({ ...value, level: v as CatalogueFilterState['level'] })}
        >
          <SelectTrigger id="course-level">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('catalogue.anyLevel')}</SelectItem>
            {LEVELS.map((lv) => (
              <SelectItem key={lv} value={lv}>
                {t(`levels.${lv}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-0 space-y-1">
        <Label htmlFor="course-state" className="text-xs font-semibold text-ink-soft">
          {t('catalogue.progress')}
        </Label>
        <Select
          value={value.state}
          onValueChange={(v) => onChange({ ...value, state: v as CatalogueFilterState['state'] })}
        >
          <SelectTrigger id="course-state">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('catalogue.anyProgress')}</SelectItem>
            {STATES.map((s) => (
              <SelectItem key={s} value={s}>
                {t(`states.${s}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
