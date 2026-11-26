import { BellRing, Footprints, Repeat, UserCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { StatCard } from '@/components/shared/StatCard'
import { pct } from '@/domain/progress'
import { formatNumber, useLocalized } from '@/i18n'
import { FunnelSteps } from '../components/FunnelSteps'
import { PageBanner } from '../components/PageBanner'
import { useFunnel } from '../hooks/use-funnel'

/** Funnel tab (C8.4): joined, onboarded, first useful action, returned within 30 days, reminders. */
export function FunnelPage() {
  const { t } = useTranslation('leadership')
  const { lang } = useLocalized()
  const { steps, k } = useFunnel()
  const n = (v: number) => formatNumber(v, lang)
  const joined = n(k.joined)
  return (
    <>
      <PageBanner eyebrow={t('banner.eyebrow')} title={t('banner.funnelTitle')}>
        <p>{t('banner.funnelBody')}</p>
      </PageBanner>
      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          tone="primary"
          icon={UserCheck}
          label={t('funnel.rates.onboarding')}
          value={`${pct(k.onboarded, k.joined)}%`}
          hint={t('funnel.rates.onboardingHint', { value: n(k.onboarded), joined })}
        />
        <StatCard
          tone="highlight"
          icon={Footprints}
          label={t('funnel.rates.useful')}
          value={`${k.k3Pct}%`}
          hint={t('funnel.rates.usefulHint', { value: n(k.firstUsefulAction), joined })}
        />
        <StatCard
          tone="deep"
          icon={Repeat}
          label={t('funnel.rates.returned')}
          value={`${k.k4Pct}%`}
          hint={t('funnel.rates.returnedHint', {
            value: n(k.returned30),
            eligible: n(k.returnedEligible),
          })}
        />
        <StatCard
          tone="accent"
          icon={BellRing}
          label={t('funnel.rates.reminders')}
          value={`${pct(k.reminderOptIns, k.joined)}%`}
          hint={t('funnel.rates.remindersHint', { value: n(k.reminderOptIns), joined })}
        />
      </section>
      <FunnelSteps steps={steps} />
    </>
  )
}
