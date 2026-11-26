import type { Placement } from '@shared/types'
import { PauseCircle, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/shared/EmptyState'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PageBanner } from '@/features/leadership/components/PageBanner'
import { useSponsorPlacements } from '@/store/hooks'
import { PlacementCard } from '../components/PlacementCard'
import { PlacementPreview } from '../components/PlacementPreview'
import { OASIS_ID } from '../config'
import { useOasis } from '../hooks/use-oasis'

/** Oasis "My placements" (C8.5): live placements only; paused ones disappear (Maya's switch). */
export function PlacementsPage() {
  const { t } = useTranslation('sponsor')
  const oasis = useOasis()
  const placements = useSponsorPlacements(OASIS_ID)
  const [preview, setPreview] = useState<Placement | null>(null)
  const slotTitle = (p: Placement) => {
    const key: string = `slots.${p.slot}.title`
    return t(key)
  }
  return (
    <>
      <PageBanner
        eyebrow={t('banner.eyebrow', { status: oasis.status })}
        title={`${oasis.name}: ${t('pages.placements')}`}
      >
        <p>{t('banner.placementsBody')}</p>
        <p className="mt-2 inline-flex items-center gap-2 font-semibold text-white">
          <ShieldCheck className="size-4 shrink-0 text-brand-highlight" aria-hidden />
          {t('placement.rule')}
        </p>
      </PageBanner>
      {placements.length === 0 ? (
        <EmptyState
          icon={PauseCircle}
          title={t('placement.emptyTitle')}
          body={t('placement.emptyBody')}
          className="card"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {placements.map((p) => (
            <PlacementCard key={p.id} placement={p} onPreview={() => setPreview(p)} />
          ))}
        </div>
      )}
      <Dialog open={preview !== null} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {preview ? t('placement.previewTitle', { slot: slotTitle(preview) }) : ''}
            </DialogTitle>
            <DialogDescription>{t('placement.previewBody')}</DialogDescription>
          </DialogHeader>
          <div className="rounded-2xl bg-grad-soft p-4">
            {preview && <PlacementPreview placement={preview} />}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
