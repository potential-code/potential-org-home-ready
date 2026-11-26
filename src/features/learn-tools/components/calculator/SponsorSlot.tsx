import { useTranslation } from 'react-i18next'
import { SponsoredLabel } from '@/components/shared/SponsoredLabel'
import { useLocalized } from '@/i18n'
import { useVisiblePlacements } from '@/store/hooks'

const SLOT = 'PL-OASIS-CALC'

/** "Powered by" calculator partner slot; hidden while the placement is paused. */
export function SponsorSlot() {
  const { t } = useTranslation('calculator')
  const { l } = useLocalized()
  const placement = useVisiblePlacements().find((p) => p.id === SLOT)
  if (!placement) return null
  const partner = l(placement.label).split(': ').slice(1).join(': ') || l(placement.label)
  return (
    <aside className="card flex flex-col gap-2 p-4" aria-label={t('sponsor.aria')}>
      <SponsoredLabel className="self-start" />
      <p className="text-sm text-ink">
        {t('sponsor.poweredBy')} <span className="font-semibold">{partner}</span>
      </p>
      <p className="text-xs text-ink-soft">{t('sponsor.note')}</p>
    </aside>
  )
}
