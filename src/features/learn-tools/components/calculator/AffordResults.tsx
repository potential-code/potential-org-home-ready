import { Banknote, Home, PiggyBank } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { StatCard } from '@/components/shared/StatCard'
import type { AffordInputs } from '@/data/figures'
import { afford } from '@/domain/calculator'
import { ResultRows } from './ResultRows'
import { useMoney } from './use-money'

/** Tab 3 results: price range under the debt-burden cap and the savings limit. */
export function AffordResults({ inputs }: { inputs: AffordInputs }) {
  const { t } = useTranslation('calculator')
  const { aed, num } = useMoney()
  const r = afford(inputs)
  return (
    <div className="space-y-4">
      <StatCard
        tone="primary"
        icon={Home}
        label={t('afford.range')}
        value={
          <span className="block text-3xl sm:text-4xl">
            {t('afford.rangeValue', { from: aed(r.range[0]), to: aed(r.range[1]) })}
          </span>
        }
        hint={t(r.limitedBy === 'income' ? 'afford.limitedIncome' : 'afford.limitedSavings')}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          tone="highlight"
          icon={Banknote}
          label={t('afford.maxMonthly')}
          value={
            <span className="block text-3xl whitespace-nowrap">{aed(r.maxMonthlyPayment)}</span>
          }
          hint={t('afford.maxMonthlyHint', { pct: num(inputs.debtBurdenPct) })}
        />
        <StatCard
          tone="deep"
          icon={PiggyBank}
          label={t('afford.maxLoan')}
          value={<span className="block text-3xl whitespace-nowrap">{aed(r.maxLoan)}</span>}
          hint={t('afford.maxLoanHint', { years: num(inputs.termYears) })}
        />
      </div>
      <ResultRows
        title={t('afford.how')}
        rows={[
          { key: 'income', label: t('afford.byIncome'), value: aed(r.priceByIncome) },
          { key: 'savings', label: t('afford.bySavings'), value: aed(r.priceBySavings) },
          { key: 'max', label: t('afford.maxPrice'), value: aed(r.maxPrice), strong: true },
        ]}
        note={t('afford.note', { pct: num(inputs.debtBurdenPct) })}
      />
    </div>
  )
}
