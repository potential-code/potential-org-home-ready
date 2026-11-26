import { describe, expect, test } from 'bun:test'
import {
  AFFORD_DEFAULTS,
  FEES,
  JOURNEY1,
  RENT_BUY_DEFAULTS,
  TRUE_COST_DEFAULTS,
} from '@/data/figures'
import {
  afford,
  breakEvenYear,
  loanBalance,
  monthlyPayment,
  rentVsBuy,
  trueCost,
} from './calculator'

describe('true cost of renting', () => {
  const r = trueCost(TRUE_COST_DEFAULTS)
  test('formula: rent + agency + Ejari + moving + 12 x running + housing fee', () => {
    const expected = 95000 + 4750 + 177.75 + 3000 + 12 * (450 + 600 + 389) + 4750
    expect(r.firstYear).toBeCloseTo(expected, 2)
    expect(r.ejari).toBe(177.75)
  })
  test('refundable = security deposit + DEWA deposit, outside the cost', () => {
    expect(r.securityDeposit).toBe(4750)
    expect(r.dewaDeposit).toBe(2000)
    expect(r.refundable).toBe(6750)
    expect(trueCost({ ...TRUE_COST_DEFAULTS, villa: true }).dewaDeposit).toBe(4000)
    expect(trueCost({ ...TRUE_COST_DEFAULTS, furnished: true }).securityDeposit).toBe(9500)
  })
  test('no agent, no cooling', () => {
    const x = trueCost({ ...TRUE_COST_DEFAULTS, agentUsed: false, coolingSeparate: false })
    expect(x.agencyFee).toBe(0)
    expect(x.running).toBe(12 * (600 + 389))
  })
})

describe('journey 1 figures', () => {
  test('JVC first-year = 82,000 + 4,100 + 4,100 + 3,000 + Ejari', () => {
    const j = JOURNEY1
    expect(j.jvcRent + j.jvcAgency + j.jvcDeposit + j.jvcMoving + FEES.ejari.value).toBeCloseTo(
      j.jvcFirstYear,
      2,
    )
    expect(j.jvcFirstYear).toBe(93377.75)
    expect(j.currentRent * 1.05).toBe(j.renewAllowed)
  })
})

describe('rent vs buy', () => {
  test('break-even is year 3 at the defaults', () => {
    expect(rentVsBuy(RENT_BUY_DEFAULTS).breakEvenYear).toBe(3)
    expect(breakEvenYear(RENT_BUY_DEFAULTS)).toBe(3)
  })
  test('horizon 8 -> 4 changes totals and chart, break-even stays year 3', () => {
    const a = rentVsBuy(RENT_BUY_DEFAULTS)
    const b = rentVsBuy({ ...RENT_BUY_DEFAULTS, horizonYears: 4 })
    expect(a.years).toHaveLength(8)
    expect(b.years).toHaveLength(4)
    expect(b.rentTotal).not.toBe(a.rentTotal)
    expect(b.breakEvenYear).toBe(3)
  })
  test('loan maths', () => {
    expect(monthlyPayment(1_840_000, 4.49, 25)).toBeGreaterThan(10_000)
    expect(loanBalance(1_000_000, 4, 25, 300)).toBeCloseTo(0, 0)
    expect(monthlyPayment(1200, 0, 1)).toBe(100)
  })
})

describe('afford', () => {
  test('50% debt-burden cap and 20% down payment', () => {
    const r = afford(AFFORD_DEFAULTS)
    expect(r.maxMonthlyPayment).toBe(45000 * 0.5 - 3000)
    expect(r.maxPrice).toBeLessThanOrEqual(r.priceByIncome)
    expect(r.range[0]).toBeLessThanOrEqual(r.range[1])
    expect(afford({ ...AFFORD_DEFAULTS, monthlyDebts: 1_000_000 }).maxPrice).toBe(0)
  })
})
