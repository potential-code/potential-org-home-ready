import { type AffordInputs, FEES, type RentBuyInputs, type TrueCostInputs } from '@/data/figures'

/**
 * Home Ready calculator (brief C11.2), three tabs. Pure maths; every screen, Dalil and the tests
 * use these functions. Educational estimates, not financial advice.
 */

const round2 = (n: number) => Math.round(n * 100) / 100

// ---------------------------------------------------------------- tab 1: true cost of renting

export interface TrueCostResult {
  rent: number
  agencyFee: number
  ejari: number
  moving: number
  /** 12 x (cooling + DEWA + internet). */
  running: number
  /** Dubai Municipality housing fee, 5% of annual rent (paid via DEWA). */
  housingFee: number
  /** First-year cash out (cost): rent + agency + Ejari + moving + running + housing fee. */
  firstYear: number
  monthly: number
  securityDeposit: number
  dewaDeposit: number
  /** Refundable, upfront cash, outside the cost comparison: security deposit + DEWA deposit. */
  refundable: number
  /** Cash needed on day one: first cheque + agency + Ejari + moving + refundable deposits. */
  upfrontCash: number
}

export function trueCost(i: TrueCostInputs): TrueCostResult {
  const agencyFee = i.agentUsed ? (i.annualRent * FEES.agencyRentPct.value) / 100 : 0
  const ejari = FEES.ejari.value
  const cooling = i.coolingSeparate ? i.coolingMonthly : 0
  const running = 12 * (cooling + i.dewaMonthly + i.internetMonthly)
  const housingFee = (i.annualRent * FEES.housingFeePct.value) / 100
  const firstYear = round2(i.annualRent + agencyFee + ejari + i.movingCost + running + housingFee)
  const depositPct = i.furnished ? FEES.depositFurnishedPct.value : FEES.depositUnfurnishedPct.value
  const securityDeposit = (i.annualRent * depositPct) / 100
  const dewaDeposit = i.villa ? FEES.dewaDepositVilla.value : FEES.dewaDepositApartment.value
  const refundable = securityDeposit + dewaDeposit
  const firstCheque = i.annualRent / Math.max(1, i.cheques)
  return {
    rent: i.annualRent,
    agencyFee,
    ejari,
    moving: i.movingCost,
    running,
    housingFee,
    firstYear,
    monthly: round2(firstYear / 12),
    securityDeposit,
    dewaDeposit,
    refundable,
    upfrontCash: round2(firstCheque + agencyFee + ejari + i.movingCost + refundable),
  }
}

// ---------------------------------------------------------------- tab 2: rent vs buy

/** Monthly repayment of an amortising loan. */
export function monthlyPayment(principal: number, ratePct: number, termYears: number): number {
  const r = ratePct / 100 / 12
  const n = termYears * 12
  if (principal <= 0) return 0
  if (r === 0) return principal / n
  return (principal * r) / (1 - (1 + r) ** -n)
}

/** Outstanding balance after `months` payments. */
export function loanBalance(
  principal: number,
  ratePct: number,
  termYears: number,
  months: number,
): number {
  const r = ratePct / 100 / 12
  const n = termYears * 12
  const m = Math.min(months, n)
  if (principal <= 0) return 0
  if (r === 0) return principal * (1 - m / n)
  const p = monthlyPayment(principal, ratePct, termYears)
  return principal * (1 + r) ** m - (p * ((1 + r) ** m - 1)) / r
}

export interface RentBuyYear {
  year: number
  /** Cumulative rent paid by the end of this year. */
  rentCumulative: number
  /** Net cost of buying: payments + upfront costs + running costs - equity. */
  buyNet: number
  payments: number
  upfront: number
  running: number
  equity: number
  value: number
  balance: number
}

export interface RentBuyResult {
  years: RentBuyYear[]
  /** First year in which buying is cheaper (null if not within the horizon). */
  breakEvenYear: number | null
  loan: number
  monthlyPayment: number
  upfront: number
  rentTotal: number
  buyTotal: number
}

export function rentVsBuy(i: RentBuyInputs): RentBuyResult {
  const down = (i.price * i.downPaymentPct) / 100
  const loan = i.price - down
  const pay = monthlyPayment(loan, i.ratePct, i.termYears)
  const upfront =
    down +
    (i.price * i.transferFeePct) / 100 +
    (loan * i.mortgageRegPct) / 100 +
    FEES.mortgageAdmin.value +
    (i.price * i.agencyFeePct) / 100
  const years: RentBuyYear[] = []
  let rentCumulative = 0
  let running = 0
  let breakEvenYear: number | null = null
  for (let y = 1; y <= i.horizonYears; y++) {
    rentCumulative += i.rentNow * (1 + i.rentGrowthPct / 100) ** (y - 1)
    const valueStart = i.price * (1 + i.priceGrowthPct / 100) ** (y - 1)
    running += i.serviceChargeYear + (valueStart * i.maintenancePct) / 100
    const payments = pay * Math.min(y * 12, i.termYears * 12)
    const value = i.price * (1 + i.priceGrowthPct / 100) ** y
    const balance = loanBalance(loan, i.ratePct, i.termYears, y * 12)
    const equity = value * (1 - i.sellingCostsPct / 100) - balance
    const buyNet = payments + upfront + running - equity
    if (breakEvenYear === null && buyNet < rentCumulative) breakEvenYear = y
    years.push({
      year: y,
      rentCumulative: Math.round(rentCumulative),
      buyNet: Math.round(buyNet),
      payments: Math.round(payments),
      upfront: Math.round(upfront),
      running: Math.round(running),
      equity: Math.round(equity),
      value: Math.round(value),
      balance: Math.round(balance),
    })
  }
  const last = years[years.length - 1]
  return {
    years,
    breakEvenYear,
    loan,
    monthlyPayment: Math.round(pay),
    upfront: Math.round(upfront),
    rentTotal: last?.rentCumulative ?? 0,
    buyTotal: last?.buyNet ?? 0,
  }
}

/**
 * Break-even over a long window (15 years): independent of the chosen horizon, so changing the
 * horizon changes totals and chart only (Vera, answer 1).
 */
export function breakEvenYear(i: RentBuyInputs): number | null {
  return rentVsBuy({ ...i, horizonYears: 15 }).breakEvenYear
}

// ---------------------------------------------------------------- tab 3: what can I afford

export interface AffordResult {
  /** Max monthly repayment under the debt-burden cap. */
  maxMonthlyPayment: number
  maxLoan: number
  /** Price the loan supports at the down-payment default. */
  priceByIncome: number
  /** Price the savings support (down payment + ~fees). */
  priceBySavings: number
  maxPrice: number
  /** Range shown to the learner: 90% to 100% of maxPrice, rounded to AED 10,000. */
  range: [number, number]
  limitedBy: 'income' | 'savings'
}

export function afford(i: AffordInputs): AffordResult {
  const maxMonthlyPayment = Math.max(0, (i.monthlyIncome * i.debtBurdenPct) / 100 - i.monthlyDebts)
  const r = i.ratePct / 100 / 12
  const n = i.termYears * 12
  const maxLoan = r === 0 ? maxMonthlyPayment * n : (maxMonthlyPayment * (1 - (1 + r) ** -n)) / r
  const dp = i.downPaymentPct / 100
  const priceByIncome = maxLoan / (1 - dp)
  // Savings cover the down payment plus transfer, agency and registration fees.
  const feesPct =
    (FEES.transferFeePct.value + FEES.agencyBuyPct.value + FEES.mortgageRegPct.value * (1 - dp)) /
    100
  const priceBySavings = Math.max(0, i.savings - FEES.mortgageAdmin.value) / (dp + feesPct)
  const maxPrice = Math.min(priceByIncome, priceBySavings)
  const r10k = (n2: number) => Math.floor(n2 / 10000) * 10000
  return {
    maxMonthlyPayment: Math.round(maxMonthlyPayment),
    maxLoan: Math.round(maxLoan),
    priceByIncome: Math.round(priceByIncome),
    priceBySavings: Math.round(priceBySavings),
    maxPrice: Math.round(maxPrice),
    range: [r10k(maxPrice * 0.9), r10k(maxPrice)],
    limitedBy: priceByIncome <= priceBySavings ? 'income' : 'savings',
  }
}
