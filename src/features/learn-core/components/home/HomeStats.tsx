import type { LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Stagger, StaggerItem } from '@/components/motion'
import { StatCard, type StatTone } from '@/components/shared/StatCard'

export interface HomeStat {
  icon: LucideIcon
  label: string
  value: string | number
  hint: string
  tone: StatTone
  to?: string
}

/** One row of four StatCards on the learner Home (neighbouring tones differ). */
export function HomeStats({ stats }: { stats: HomeStat[] }) {
  const { t } = useTranslation('learn')
  return (
    <>
      <h2 className="sr-only">{t('home.stats.title')}</h2>
      <Stagger className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <StaggerItem key={s.label}>
            <StatCard
              tone={s.tone}
              icon={s.icon}
              label={s.label}
              value={s.value}
              hint={s.hint}
              to={s.to}
              className="h-full"
            />
          </StaggerItem>
        ))}
      </Stagger>
    </>
  )
}
