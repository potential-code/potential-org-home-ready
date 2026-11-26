import type { Unit } from '@shared/types'
import { useTranslation } from 'react-i18next'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { useLocalized } from '@/i18n'
import { UNIT_ICON } from '../config'

/** Title block of the main panel: kind and minutes, unit title, summary. */
export function UnitHeader({ unit }: { unit: Unit }) {
  const { t } = useTranslation('learning')
  const { l, isPlaceholder } = useLocalized()
  const Icon = UNIT_ICON[unit.kind]
  return (
    <header className="grid gap-1.5">
      <StatusBadge tone="brand" icon={<Icon className="size-3.5" aria-hidden />} className="w-fit">
        {t(`unitKinds.${unit.kind}`)} · {t('meta.minutes', { count: unit.minutes })}
      </StatusBadge>
      <h2 id="unit-title" className="text-xl sm:text-2xl">
        {l(unit.title)}
      </h2>
      <p dir="auto" className="text-ink-soft">
        {l(unit.summary)}
      </p>
      {isPlaceholder(unit.summary) && (
        <p className="text-xs text-ink-soft">{t('common:arabicPlaceholder')}</p>
      )}
    </header>
  )
}
