import { BellRing, Footprints, type LucideIcon, Save, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CountUp } from '@/components/motion'
import { StatCard, type StatTone } from '@/components/shared/StatCard'
import { useKpis } from '@/store/hooks'
import { Section } from '../Section'

/** C5.11 Impact counters, animated from the live KPIs (same numbers as Maya's and Hessa's views). */
export function ImpactSection() {
  const { t } = useTranslation('public')
  const k = useKpis()
  const items: { key: string; value: number; icon: LucideIcon; tone: StatTone }[] = [
    { key: 'joined', value: k.joined, icon: Users, tone: 'primary' },
    { key: 'useful', value: k.firstUsefulAction, icon: Footprints, tone: 'highlight' },
    { key: 'saves', value: k.totalSaves, icon: Save, tone: 'tint' },
    { key: 'reminders', value: k.reminderOptIns, icon: BellRing, tone: 'accent' },
  ]
  return (
    <Section
      id="impact"
      tone="deep"
      motif
      eyebrow={t('impact.eyebrow')}
      title={t('impact.title')}
      aside={<p className="text-sm font-semibold text-white/80">{t('impact.hint')}</p>}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {items.map((s) => (
          <div data-reveal key={s.key}>
            <StatCard
              tone={s.tone}
              icon={s.icon}
              label={t(`impact.${s.key}`)}
              value={<CountUp value={s.value} duration={1.8} />}
              className="h-full min-h-40"
            />
          </div>
        ))}
      </div>
    </Section>
  )
}
