import { Calculator, CalendarCheck, Compass, Repeat, UserPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { STAT_TONES, StatCard } from '@/components/shared/StatCard'
import { KPI } from '@/data/figures'
import { formatNumber, useLocalized } from '@/i18n'
import { useKpis } from '@/store/hooks'

/** K1 to K4 plus sign-ups (C8.2, values from useKpis so they match leadership and landing). */
export function KpiRow() {
  const { t } = useTranslation('owner')
  const { lang } = useLocalized()
  const k = useKpis()
  const n = (x: number) => formatNumber(x, lang)
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard
        tone={STAT_TONES[0]}
        icon={Compass}
        label={t('overview.k1')}
        value={t('overview.k1Value', { built: k.journeysWorking, total: k.journeysBuilt })}
        hint={t('overview.k1Hint', {
          withAction: n(k.journeysWithNextAction),
          completed: n(k.journeysCompleted),
          pct: k.k1Pct,
        })}
        to="/admin/reports"
      />
      <StatCard
        tone={STAT_TONES[1]}
        icon={Calculator}
        label={t('overview.k2')}
        value={t('overview.k2Value', { pct: k.k2ClaimsPct })}
        hint={t('overview.k2Hint', {
          working: k.calculatorsWorking,
          sourced: k.claimsSourced,
          claims: k.claimsTotal,
        })}
        to="/admin/content"
      />
      <StatCard
        tone={STAT_TONES[2]}
        icon={CalendarCheck}
        label={t('overview.k3')}
        value={`${k.k3Pct}%`}
        hint={t('overview.k3Hint', {
          useful: n(k.firstUsefulAction),
          joined: n(k.joined),
          target: KPI.targets.k3Pct,
        })}
        to="/admin/learners"
      />
      <StatCard
        tone={STAT_TONES[3]}
        icon={Repeat}
        label={t('overview.k4')}
        value={`${k.k4Pct}%`}
        hint={t('overview.k4Hint', {
          returned: n(k.returned30),
          eligible: n(k.returnedEligible),
          unconsented: k.unconsentedShares,
        })}
        to="/admin/reports"
      />
      <StatCard
        tone={STAT_TONES[4]}
        icon={UserPlus}
        label={t('overview.signups')}
        value={n(k.signupsLast30)}
        hint={t('overview.signupsHint', { joined: n(k.joined) })}
        to="/admin/learners"
        className="sm:col-span-2 xl:col-span-1"
      />
    </div>
  )
}
