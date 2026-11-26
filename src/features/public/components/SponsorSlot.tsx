import { Handshake } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SponsoredLabel } from '@/components/shared/SponsoredLabel'

/** Labelled sample sponsor slot under Track A (C5.7): label top-start, partner line, fictional. */
export function SponsorSlot() {
  const { t } = useTranslation('public')
  return (
    <aside
      aria-label={t('tracks.sponsorAria')}
      className="card relative flex flex-col gap-2.5 overflow-hidden p-5"
    >
      <SponsoredLabel className="self-start" />
      <p className="flex items-start gap-2 text-ink">
        <Handshake className="mt-0.5 size-5 shrink-0 text-sponsor-ink" aria-hidden />
        <span>
          <span className="font-semibold">{t('tracks.sponsorPartner')}</span>{' '}
          <span className="text-ink-soft">{t('tracks.sponsorSample')}</span>
        </span>
      </p>
    </aside>
  )
}
