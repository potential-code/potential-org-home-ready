import { CalendarRange, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { StatCard } from '@/components/shared/StatCard'
import { FEES, type TrueCostInputs } from '@/data/figures'
import { trueCost } from '@/domain/calculator'
import { ResultRows } from './ResultRows'
import { useMoney } from './use-money'

/** Tab 1 results: first-year cash out, monthly equivalent, refundable part kept apart. */
export function TrueCostResults({ inputs }: { inputs: TrueCostInputs }) {
  const { t } = useTranslation('calculator')
  const { aed } = useMoney()
  const r = trueCost(inputs)
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          tone="primary"
          icon={Wallet}
          label={t('trueCost.firstYear')}
          value={<span className="block text-3xl whitespace-nowrap">{aed(r.firstYear)}</span>}
          hint={t('trueCost.firstYearHint')}
        />
        <StatCard
          tone="highlight"
          icon={CalendarRange}
          label={t('trueCost.monthly')}
          value={<span className="block text-3xl whitespace-nowrap">{aed(r.monthly)}</span>}
          hint={t('trueCost.monthlyHint')}
        />
      </div>
      <ResultRows
        title={t('trueCost.breakdown')}
        rows={[
          { key: 'rent', label: t('trueCost.rent'), value: aed(r.rent) },
          { key: 'agency', label: t('trueCost.agency'), value: aed(r.agencyFee) },
          { key: 'ejari', label: t('trueCost.ejari'), value: aed(r.ejari) },
          { key: 'moving', label: t('trueCost.moving'), value: aed(r.moving) },
          { key: 'running', label: t('trueCost.running'), value: aed(r.running) },
          { key: 'housing', label: t('trueCost.housing'), value: aed(r.housingFee) },
          { key: 'total', label: t('trueCost.total'), value: aed(r.firstYear), strong: true },
        ]}
        note={t('trueCost.ejariNote', {
          online: aed(FEES.ejari.value),
          trustee: aed(FEES.ejariTrustee.value),
        })}
      />
      <ResultRows
        title={t('trueCost.refundable')}
        rows={[
          { key: 'deposit', label: t('trueCost.deposit'), value: aed(r.securityDeposit) },
          {
            key: 'dewa',
            label: t(inputs.villa ? 'trueCost.dewaVilla' : 'trueCost.dewaApartment'),
            value: aed(r.dewaDeposit),
          },
          {
            key: 'refundTotal',
            label: t('trueCost.refundTotal'),
            value: aed(r.refundable),
            strong: true,
          },
          { key: 'upfront', label: t('trueCost.upfront'), value: aed(r.upfrontCash), strong: true },
        ]}
        note={t('trueCost.refundableNote')}
      />
    </div>
  )
}
