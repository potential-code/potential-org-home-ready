import type { CalcTab, Localized } from '@shared/types'
import {
  AFFORD_DEFAULTS,
  type AffordInputs,
  RENT_BUY_DEFAULTS,
  type RentBuyInputs,
  TRUE_COST_DEFAULTS,
  type TrueCostInputs,
} from '@/data/figures'
import { afford, breakEvenYear, rentVsBuy, trueCost } from './calculator'

/** AED amount with thousands separators (decimals only when needed). */
export function aed(n: number): string {
  const decimals = Number.isInteger(n) ? 0 : 2
  return `AED ${n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
}
const aedAr = (n: number) => aed(n).replace('AED', 'درهم')

/** Headline line for a saved calculator result (EN + AR). */
export function calcSummary(tab: CalcTab, inputs: Record<string, number | boolean>): Localized {
  if (tab === 'true-cost') {
    const r = trueCost({ ...TRUE_COST_DEFAULTS, ...inputs } as TrueCostInputs)
    return {
      en: `First-year cash out ${aed(r.firstYear)} (${aed(r.monthly)} a month); refundable ${aed(r.refundable)}`,
      ar: `التكلفة في السنة الأولى ${aedAr(r.firstYear)} (${aedAr(r.monthly)} شهرياً)؛ المبالغ المستردة ${aedAr(r.refundable)}`,
    }
  }
  if (tab === 'rent-vs-buy') {
    const i = { ...RENT_BUY_DEFAULTS, ...inputs } as RentBuyInputs
    const y = breakEvenYear(i)
    const r = rentVsBuy(i)
    return y
      ? {
          en: `Buying costs less from year ${y} at these numbers (over ${i.horizonYears} years: rent ${aed(r.rentTotal)}, buy ${aed(r.buyTotal)})`,
          ar: `يصبح الشراء أقل تكلفة من السنة ${y} بهذه الأرقام (على مدى ${i.horizonYears} سنوات: الإيجار ${aedAr(r.rentTotal)}، الشراء ${aedAr(r.buyTotal)})`,
        }
      : {
          en: 'Renting stays cheaper for 15 years at these numbers',
          ar: 'يبقى الإيجار أقل تكلفة لمدة 15 سنة بهذه الأرقام',
        }
  }
  const r = afford({ ...AFFORD_DEFAULTS, ...inputs } as AffordInputs)
  return {
    en: `Price range ${aed(r.range[0])} to ${aed(r.range[1])}`,
    ar: `نطاق السعر من ${aedAr(r.range[0])} إلى ${aedAr(r.range[1])}`,
  }
}
