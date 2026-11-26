import type { Placement } from '@shared/types'
import { Eye, Pause, Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { SponsoredLabel } from '@/components/shared/SponsoredLabel'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { useLocalized } from '@/i18n'
import { setPlacementStatus } from '@/store/actions'

/** One placement: slot, label preview, status, Pause/Resume, Preview. */
export function PlacementRow({ p, onPreview }: { p: Placement; onPreview: () => void }) {
  const { t } = useTranslation('owner')
  const { l } = useLocalized()
  const live = p.status === 'live'
  const toggle = () => {
    setPlacementStatus(p.id, live ? 'paused' : 'live')
    toast.success(
      t(live ? 'sponsors.paused' : 'sponsors.resumed', { label: t(`sponsors.slots.${p.slot}`) }),
    )
  }
  return (
    <li className="flex flex-col gap-2.5 py-3">
      <div className="min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">{t(`sponsors.slots.${p.slot}`)}</span>
          <StatusBadge tone={live ? 'success' : 'neutral'}>{t(`status.${p.status}`)}</StatusBadge>
        </div>
        <p className="text-sm text-ink-soft">
          <SponsoredLabel className="me-2 align-middle" />
          <span className="min-w-0">{l(p.label).replace(/^Sponsored · /, '')}</span>
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={onPreview}>
          <Eye aria-hidden />
          {t('sponsors.preview')}
        </Button>
        <Button variant="outline" size="sm" onClick={toggle}>
          {live ? <Pause aria-hidden /> : <Play aria-hidden />}
          {t(live ? 'sponsors.pause' : 'sponsors.resume')}
        </Button>
      </div>
    </li>
  )
}
