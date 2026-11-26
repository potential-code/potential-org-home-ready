import type { Placement } from '@shared/types'
import { CircleCheck, Eye, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SponsoredLabel } from '@/components/shared/SponsoredLabel'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { formatDate, useLocalized } from '@/i18n'
import { labelText } from '../lib/label'

interface PlacementCardProps {
  placement: Placement
  onPreview: () => void
}

/** One placement: what it is, where it shows, the exact label and its live status. */
export function PlacementCard({ placement, onPreview }: PlacementCardProps) {
  const { t } = useTranslation('sponsor')
  const { l, lang } = useLocalized()
  const slotKey: string = `slots.${placement.slot}`
  return (
    <article className="card card-hover flex flex-col gap-4 p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="min-w-0 flex-1 text-lg leading-snug font-bold text-brand-deep">
          {t(`${slotKey}.title`)}
        </h2>
        <StatusBadge tone="success" icon={<CircleCheck className="size-3.5" aria-hidden />}>
          {t('placement.live')}
        </StatusBadge>
      </div>
      <p className="flex gap-2 text-sm text-ink-soft">
        <MapPin className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
        <span>
          <span className="sr-only">{t('placement.where')}: </span>
          {t(`${slotKey}.where`)}
        </span>
      </p>
      <div className="grid gap-2 rounded-xl bg-tint-50 p-3">
        <p className="text-xs font-semibold text-ink-soft">{t('placement.labelPreview')}</p>
        <div className="flex flex-wrap items-center gap-2">
          <SponsoredLabel />
          <span className="text-sm text-ink">{labelText(l(placement.label))}</span>
        </div>
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-ink-soft">
          {t('placement.since', { date: formatDate(placement.createdAt, lang) })}
        </span>
        <Button variant="outline" size="sm" className="rounded-full" onClick={onPreview}>
          <Eye aria-hidden />
          {t('placement.preview')}
        </Button>
      </div>
    </article>
  )
}
