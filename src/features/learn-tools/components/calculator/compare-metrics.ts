import type { CalcResult } from '@shared/types'
import {
  AFFORD_DEFAULTS,
  type AffordInputs,
  RENT_BUY_DEFAULTS,
  type RentBuyInputs,
  TRUE_COST_DEFAULTS,
  type TrueCostInputs,
} from '@/data/figures'
import { afford, breakEvenYear, rentVsBuy, trueCost } from '@/domain/calculator'

export interface Metric {
  key: string
  /** Amount in AED, or a year count when `kind` is 'year'. */
  value: number | null
  kind: 'aed' | 'year'
}

/** Headline numbers of a saved result, recalculated from its inputs with the domain maths. */
export function metricsOf(r: CalcResult): Metric[] {
  if (r.tab === 'true-cost') {
    const x = trueCost({ ...TRUE_COST_DEFAULTS, ...r.inputs } as TrueCostInputs)
    return [
      { key: 'firstYear', value: x.firstYear, kind: 'aed' },
      { key: 'monthly', value: x.monthly, kind: 'aed' },
      { key: 'refundable', value: x.refundable, kind: 'aed' },
    ]
  }
  if (r.tab === 'rent-vs-buy') {
    const i = { ...RENT_BUY_DEFAULTS, ...r.inputs } as RentBuyInputs
    const x = rentVsBuy(i)
    return [
      { key: 'breakEven', value: breakEvenYear(i), kind: 'year' },
      { key: 'rentTotal', value: x.rentTotal, kind: 'aed' },
      { key: 'buyTotal', value: x.buyTotal, kind: 'aed' },
    ]
  }
  const x = afford({ ...AFFORD_DEFAULTS, ...r.inputs } as AffordInputs)
  return [
    { key: 'rangeLow', value: x.range[0], kind: 'aed' },
    { key: 'rangeHigh', value: x.range[1], kind: 'aed' },
    { key: 'maxMonthly', value: x.maxMonthlyPayment, kind: 'aed' },
  ]
}
