import type { Placement } from '@shared/types'
import { EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Motif } from '@/components/brand'
import { SponsoredLabel } from '@/components/shared/SponsoredLabel'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PLACEMENT_RULE } from '@/data/catalogue'
import { useLocalized } from '@/i18n'

/** How a placement looks to learners (label always visible). */
export function PlacementPreviewDialog({
  placement,
  sponsorName,
  onClose,
}: {
  placement: Placement | null
  sponsorName: string
  onClose: () => void
}) {
  const { t } = useTranslation('owner')
  const { l } = useLocalized()
  return (
    <Dialog open={!!placement} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('sponsors.previewTitle')}</DialogTitle>
          <DialogDescription>{t('sponsors.previewBody')}</DialogDescription>
        </DialogHeader>
        {placement && (
          <div className="space-y-3">
            <div className="card relative overflow-hidden p-5">
              <Motif variant="card" className="text-brand/10" />
              <SponsoredLabel />
              <p className="relative mt-3 text-lg font-bold text-brand-deep">{sponsorName}</p>
              <p className="relative mt-1 text-sm text-ink-soft">{l(placement.label)}</p>
              <p className="relative mt-3 text-sm font-semibold text-brand">
                {t('sponsors.previewCta')}
              </p>
            </div>
            <p className="text-xs text-ink-soft">{PLACEMENT_RULE}</p>
            {placement.status === 'paused' && (
              <p className="flex items-center gap-2 rounded-xl bg-notice-soft p-3 text-sm font-semibold text-notice">
                <EyeOff className="size-4 shrink-0" aria-hidden />
                {t('sponsors.previewHidden')}
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
