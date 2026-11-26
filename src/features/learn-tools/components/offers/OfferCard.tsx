import type { Offer } from '@shared/types'
import { CheckCircle2, PhoneCall } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Motif } from '@/components/brand'
import { SponsoredLabel } from '@/components/shared/SponsoredLabel'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { SPONSORS } from '@/data/catalogue'
import { useLocalized } from '@/i18n'
import { cn } from '@/lib/utils'
import { PartnerConsentDialog } from './PartnerConsentDialog'

const BANDS = ['bg-grad-brand', 'bg-brand-deep', 'bg-grad-brand-v'] as const

/** Sponsored offer card: label always visible, call request only through the consent dialog. */
export function OfferCard({
  offer,
  requested,
  index,
}: {
  offer: Offer
  requested: boolean
  index: number
}) {
  const { t } = useTranslation('dalil')
  const { l } = useLocalized()
  const [open, setOpen] = useState(false)
  const partner = l(SPONSORS.find((s) => s.id === offer.sponsorId)?.name)
  return (
    <article className="card card-hover flex flex-col overflow-hidden">
      <div
        className={cn(
          'relative overflow-hidden px-5 pt-4 pb-5 text-white',
          BANDS[index % BANDS.length],
        )}
      >
        <Motif variant="corner" className="text-white/25" />
        <SponsoredLabel className="relative" />
        <p className="relative mt-3 text-sm font-semibold text-white/85">{l(offer.category)}</p>
        <p className="relative text-xl font-extrabold">{partner}</p>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h2 className="text-lg leading-snug">{l(offer.title)}</h2>
        <p className="text-sm leading-relaxed text-ink-soft">{l(offer.body)}</p>
        <p className="text-xs text-ink-soft">{t('offers.sampleNote')}</p>
        <div className="mt-auto pt-2">
          {requested ? (
            <div className="space-y-1">
              <StatusBadge tone="success" icon={<CheckCircle2 className="size-3.5" aria-hidden />}>
                {t('offers.requested')}
              </StatusBadge>
              <p className="text-xs text-ink-soft">{t('offers.requestedHint')}</p>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setOpen(true)} className="w-full sm:w-auto">
              <PhoneCall aria-hidden />
              {t('offers.request')}
            </Button>
          )}
        </div>
      </div>
      <PartnerConsentDialog
        offerId={offer.id}
        partner={partner}
        open={open}
        onOpenChange={setOpen}
      />
    </article>
  )
}
