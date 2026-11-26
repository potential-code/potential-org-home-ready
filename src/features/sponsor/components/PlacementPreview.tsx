import type { Placement } from '@shared/types'
import { Calculator, CalendarDays, GraduationCap, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SponsoredLabel } from '@/components/shared/SponsoredLabel'
import { useLocalized } from '@/i18n'
import { labelText } from '../lib/label'

/** Learner-side mock of one placement: the slot as it renders, label always visible. */
export function PlacementPreview({ placement }: { placement: Placement }) {
  const { t } = useTranslation('sponsor')
  const { l } = useLocalized()
  const label = (
    <div className="flex flex-wrap items-center gap-2">
      <SponsoredLabel />
      <span className="text-xs text-ink-soft">{labelText(l(placement.label))}</span>
    </div>
  )
  switch (placement.slot) {
    case 'track':
      return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-border/70">
          <div className="relative bg-track-a p-5 text-white">
            <GraduationCap className="absolute end-4 top-4 size-12 text-white/20" aria-hidden />
            <p className="text-xs font-bold tracking-widest text-white/85 uppercase">
              {t('mock.trackMeta')}
            </p>
            <p className="mt-1 text-xl font-bold">{t('mock.trackTitle')}</p>
          </div>
          <div className="grid gap-2 p-4">
            {label}
            <p className="text-sm font-semibold text-ink">{t('mock.partnerLine')}</p>
          </div>
        </div>
      )
    case 'calculator':
      return (
        <div className="grid gap-3 rounded-2xl bg-white p-5 shadow-md ring-1 ring-border/70">
          <p className="inline-flex items-center gap-2 font-semibold text-brand-deep">
            <Calculator className="size-5 text-brand" aria-hidden />
            {t('mock.calcTitle')}
          </p>
          <p className="rounded-xl bg-tint-50 p-3 text-sm font-semibold text-ink">
            {t('mock.calcResult')}
          </p>
          <div className="grid gap-2 border-t border-border/70 pt-3">
            {label}
            <p className="text-sm text-ink-soft">{t('mock.poweredBy')}</p>
          </div>
        </div>
      )
    case 'offers':
      return (
        <div className="grid gap-3 rounded-2xl bg-white p-5 shadow-md ring-1 ring-border/70">
          {label}
          <p className="text-lg font-bold text-brand-deep">{t('mock.offerTitle')}</p>
          <p className="text-sm text-ink-soft">{t('mock.offerBody')}</p>
          <span className="inline-flex min-h-10 w-fit items-center gap-2 rounded-full bg-brand-highlight px-4 py-2 text-sm font-semibold text-ink">
            <Phone className="size-4" aria-hidden />
            {t('mock.offerCta')}
          </span>
        </div>
      )
    default:
      return (
        <div className="grid gap-3 rounded-2xl bg-white p-5 shadow-md ring-1 ring-border/70">
          {label}
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
            <CalendarDays className="size-5 text-brand" aria-hidden />
            {t('mock.eventLine')}
          </p>
        </div>
      )
  }
}
