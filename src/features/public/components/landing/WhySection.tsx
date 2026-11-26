import { CalendarCheck, RotateCcw, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { STAT_TONES, StatCard } from '@/components/shared/StatCard'
import { KPI } from '@/data/figures'
import { useKpis } from '@/store/hooks'
import { Section } from '../Section'

/**
 * C5.4 Why it matters, with the three pilot targets as stat cards (targets from the figures
 * register, the sourced share from the live KPIs). Nav target "calculator" (true-cost view).
 */
export function WhySection() {
  const { t } = useTranslation('public')
  const kpis = useKpis()
  const stats = [
    { key: 'k3', value: KPI.targets.k3Pct, icon: CalendarCheck },
    { key: 'k4', value: KPI.targets.k4Pct, icon: RotateCcw },
    { key: 'k2', value: kpis.k2ClaimsPct, icon: ShieldCheck },
  ]
  return (
    <Section
      id="calculator"
      tone="tint"
      motif
      eyebrow={t('why.eyebrow')}
      title={t('why.title')}
      intro={t('why.body')}
    >
      <p data-reveal className="mb-4 text-xs font-bold tracking-widest text-ink-soft uppercase">
        {t('why.targets')}
      </p>
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
        {stats.map((s, i) => (
          <div data-reveal key={s.key}>
            <StatCard
              tone={STAT_TONES[i]}
              icon={s.icon}
              label={t(`why.${s.key}`)}
              value={`${s.value}%`}
              className="h-full min-h-40"
            />
          </div>
        ))}
      </div>
    </Section>
  )
}
