import { Building2, KeyRound, Scale } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CHART, ChartCard } from '@/components/charts'
import { StatCard } from '@/components/shared/StatCard'
import type { RentBuyInputs } from '@/data/figures'
import { breakEvenYear, rentVsBuy } from '@/domain/calculator'
import { RentBuyChart } from './RentBuyChart'
import { useMoney } from './use-money'

/** Tab 2 results: break-even (15-year window), horizon slider, chart and table by year. */
export function RentBuyResults({
  inputs,
  onHorizon,
}: {
  inputs: RentBuyInputs
  onHorizon: (years: number) => void
}) {
  const { t } = useTranslation('calculator')
  const { aed, num } = useMoney()
  const r = rentVsBuy(inputs)
  const be = breakEvenYear(inputs)
  const year = (y: number) => t('rentBuy.yearShort', { year: num(y) })
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          tone="primary"
          icon={Scale}
          label={t('rentBuy.breakEven')}
          value={
            <span className="block text-2xl">
              {be ? t('rentBuy.yearLong', { year: num(be) }) : t('rentBuy.none')}
            </span>
          }
          hint={t('rentBuy.breakEvenHint')}
        />
        <StatCard
          tone="deep"
          icon={KeyRound}
          label={t('rentBuy.rentTotal', { years: num(inputs.horizonYears) })}
          value={<span className="block text-2xl whitespace-nowrap">{aed(r.rentTotal)}</span>}
        />
        <StatCard
          tone="highlight"
          icon={Building2}
          label={t('rentBuy.buyTotal', { years: num(inputs.horizonYears) })}
          value={<span className="block text-2xl whitespace-nowrap">{aed(r.buyTotal)}</span>}
          hint={t('rentBuy.monthlyPayment', { amount: aed(r.monthlyPayment) })}
        />
      </div>
      <div className="card p-5">
        <label htmlFor="calc-horizon" className="flex justify-between text-sm font-semibold">
          <span>{t('rentBuy.horizon')}</span>
          <span className="tabular-nums text-brand">
            {t('rentBuy.years', { n: num(inputs.horizonYears) })}
          </span>
        </label>
        <input
          id="calc-horizon"
          type="range"
          min={1}
          max={15}
          value={inputs.horizonYears}
          onChange={(e) => onHorizon(Number(e.target.value))}
          className="mt-3 h-10 w-full cursor-pointer accent-brand"
        />
        <p className="text-xs text-ink-soft">{t('rentBuy.horizonHint')}</p>
      </div>
      <ChartCard
        title={t('rentBuy.chartTitle')}
        subtitle={t('rentBuy.chartSubtitle')}
        legend={[
          { key: 'rent', label: t('rentBuy.rentSeries'), color: CHART.deep, shape: 'line' },
          { key: 'buy', label: t('rentBuy.buySeries'), color: CHART.primary, shape: 'line' },
        ]}
        table={{
          columns: [
            t('rentBuy.colYear'),
            t('rentBuy.rentSeries'),
            t('rentBuy.buySeries'),
            t('rentBuy.colEquity'),
          ],
          rows: r.years.map((y) => [
            year(y.year),
            aed(y.rentCumulative),
            aed(y.buyNet),
            aed(y.equity),
          ]),
        }}
      >
        <RentBuyChart
          years={r.years}
          breakEven={be}
          money={aed}
          labels={{
            rent: t('rentBuy.rentSeries'),
            buy: t('rentBuy.buySeries'),
            year,
            breakEven: t('rentBuy.breakEvenMark'),
          }}
        />
      </ChartCard>
    </div>
  )
}
