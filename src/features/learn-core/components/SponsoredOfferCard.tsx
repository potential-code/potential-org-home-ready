import { Truck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { SponsoredLabel } from '@/components/shared/SponsoredLabel'
import { useLocalized } from '@/i18n'
import { dismissPlacement } from '@/store/actions'
import { useMe, useVisiblePlacements } from '@/store/hooks'
import { SWIFT_HOME_PLACEMENT } from '../home-config'

/**
 * Labelled sponsor card on the renter Home (C8.1): SwiftMove sample offer. "Not interested"
 * dismisses the placement for this learner (stored), so it stays hidden after reload.
 */
export function SponsoredOfferCard() {
  const { t } = useTranslation('learn')
  const { l } = useLocalized()
  const me = useMe()
  const placement = useVisiblePlacements().find((p) => p.id === SWIFT_HOME_PLACEMENT)
  if (!placement) return null
  const offer = l(placement.label).split(' · ').slice(1).join(' · ') || l(placement.label)
  return (
    <aside
      aria-label={t('home.sponsor.aria')}
      className="card relative flex h-full flex-col gap-3 overflow-hidden p-6"
    >
      <SponsoredLabel className="self-start" />
      <p className="flex items-start gap-2.5 text-ink">
        <Truck className="mt-0.5 size-5 shrink-0 text-sponsor-ink" aria-hidden />
        <span className="font-semibold">{offer}</span>
      </p>
      <button
        type="button"
        onClick={() => {
          dismissPlacement(me.id, placement.id)
          toast.success(t('home.sponsor.dismissed'))
        }}
        className="mt-auto inline-flex min-h-11 items-center self-start text-sm font-semibold text-ink-soft underline underline-offset-4 hover:text-ink"
      >
        {t('home.sponsor.notInterested')}
      </button>
    </aside>
  )
}
