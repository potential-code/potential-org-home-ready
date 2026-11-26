import { ArrowRight, ArrowUpRight, Calculator, Footprints, Repeat, Route } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { StatCard } from '@/components/shared/StatCard'
import { formatNumber, useLocalized } from '@/i18n'
import { useKpis } from '@/store/hooks'

function Trend({ up }: { up: boolean }) {
  const { t } = useTranslation('leadership')
  const Icon = up ? ArrowUpRight : ArrowRight
  return (
    <span className="inline-flex items-center gap-1">
      <Icon className="size-4 rtl-mirror" aria-hidden />
      {up ? t('trend.up') : t('trend.flat')}
    </span>
  )
}

/** K1 to K4 exactly as C13: label, definition (hint), demo value, target and trend (footer). */
export function KpiGrid() {
  const { t } = useTranslation('leadership')
  const { lang } = useLocalized()
  const k = useKpis()
  const n = (v: number) => formatNumber(v, lang)
  const foot = (target: string, up: boolean) => (
    <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
      <span>{t('kpi.target', { value: target })}</span>
      <Trend up={up} />
    </span>
  )
  return (
    <section aria-label={t('pages.impact')} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        tone="primary"
        icon={Route}
        label={t('kpi.k1.label')}
        value={t('kpi.k1.value', { working: k.journeysWorking, built: k.journeysBuilt })}
        hint={
          <>
            {t('kpi.k1.definition')}{' '}
            {t('kpi.k1.detail', {
              completed: n(k.journeysCompleted),
              withNext: n(k.journeysWithNextAction),
              pct: k.k1Pct,
            })}
          </>
        }
        footer={foot(t('kpi.k1.target'), true)}
      />
      <StatCard
        tone="deep"
        icon={Calculator}
        label={t('kpi.k2.label')}
        value={t('kpi.k2.value', { working: k.calculatorsWorking, pct: k.k2ClaimsPct })}
        hint={
          <>
            {t('kpi.k2.definition')}{' '}
            {t('kpi.k2.detail', {
              sourced: k.claimsSourced,
              total: k.claimsTotal,
            })}
          </>
        }
        footer={foot(t('kpi.k2.target'), false)}
      />
      <StatCard
        tone="highlight"
        icon={Footprints}
        label={t('kpi.k3.label')}
        value={`${k.k3Pct}%`}
        hint={
          <>
            {t('kpi.k3.definition')}{' '}
            {t('kpi.k3.detail', {
              useful: n(k.firstUsefulAction),
              joined: n(k.joined),
            })}
          </>
        }
        footer={foot(t('kpi.k3.target'), true)}
      />
      <StatCard
        tone="warm"
        icon={Repeat}
        label={t('kpi.k4.label')}
        value={`${k.k4Pct}%`}
        hint={
          <>
            {t('kpi.k4.definition')}{' '}
            {t('kpi.k4.detail', {
              returned: n(k.returned30),
              eligible: n(k.returnedEligible),
              unconsented: k.unconsentedShares,
              reminders: n(k.reminderOptIns),
              consented: n(k.consentedRequests),
            })}
          </>
        }
        footer={foot(t('kpi.k4.target'), true)}
      />
    </section>
  )
}
