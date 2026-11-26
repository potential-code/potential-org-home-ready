import type { CalcTab, Figure } from '@shared/types'
import { CALC_SOURCES, FEES } from '@/data/figures'

/** One editable calculator input. `source` is the register figure shown under the field. */
export interface FieldDef {
  key: string
  kind: 'number' | 'toggle'
  unit?: 'aed' | 'pct' | 'years' | 'count'
  step?: number
  min?: number
  max?: number
  source?: Figure
}

export const CALC_TABS: CalcTab[] = ['true-cost', 'rent-vs-buy', 'afford']

export const TRUE_COST_FIELDS: FieldDef[] = [
  { key: 'annualRent', kind: 'number', unit: 'aed', step: 1000, source: CALC_SOURCES.annualRent },
  { key: 'cheques', kind: 'number', unit: 'count', min: 1, max: 12 },
  { key: 'movingCost', kind: 'number', unit: 'aed', step: 500, source: CALC_SOURCES.movingCost },
  {
    key: 'coolingMonthly',
    kind: 'number',
    unit: 'aed',
    step: 50,
    source: CALC_SOURCES.coolingMonthly,
  },
  { key: 'dewaMonthly', kind: 'number', unit: 'aed', step: 50, source: CALC_SOURCES.dewaMonthly },
  {
    key: 'internetMonthly',
    kind: 'number',
    unit: 'aed',
    step: 10,
    source: CALC_SOURCES.internetMonthly,
  },
  { key: 'agentUsed', kind: 'toggle', source: FEES.agencyRentPct },
  { key: 'furnished', kind: 'toggle', source: FEES.depositFurnishedPct },
  { key: 'coolingSeparate', kind: 'toggle' },
  { key: 'villa', kind: 'toggle', source: FEES.dewaDepositVilla },
]

export const RENT_BUY_FIELDS: FieldDef[] = [
  { key: 'price', kind: 'number', unit: 'aed', step: 10000 },
  {
    key: 'downPaymentPct',
    kind: 'number',
    unit: 'pct',
    min: 0,
    max: 100,
    source: FEES.minDownPaymentPct,
  },
  { key: 'ratePct', kind: 'number', unit: 'pct', step: 0.01, source: CALC_SOURCES.ratePct },
  { key: 'termYears', kind: 'number', unit: 'years', min: 1, max: 30 },
  { key: 'rentNow', kind: 'number', unit: 'aed', step: 1000 },
  {
    key: 'rentGrowthPct',
    kind: 'number',
    unit: 'pct',
    step: 0.5,
    source: CALC_SOURCES.rentGrowthPct,
  },
  {
    key: 'serviceChargeYear',
    kind: 'number',
    unit: 'aed',
    step: 500,
    source: CALC_SOURCES.serviceChargeYear,
  },
  {
    key: 'maintenancePct',
    kind: 'number',
    unit: 'pct',
    step: 0.1,
    source: CALC_SOURCES.maintenancePct,
  },
  {
    key: 'priceGrowthPct',
    kind: 'number',
    unit: 'pct',
    step: 0.5,
    source: CALC_SOURCES.priceGrowthPct,
  },
  {
    key: 'transferFeePct',
    kind: 'number',
    unit: 'pct',
    step: 0.25,
    source: FEES.transferFeePct,
  },
  {
    key: 'mortgageRegPct',
    kind: 'number',
    unit: 'pct',
    step: 0.05,
    source: FEES.mortgageRegPct,
  },
  { key: 'agencyFeePct', kind: 'number', unit: 'pct', step: 0.5, source: FEES.agencyBuyPct },
  {
    key: 'sellingCostsPct',
    kind: 'number',
    unit: 'pct',
    step: 0.5,
    source: CALC_SOURCES.sellingCostsPct,
  },
]

export const AFFORD_FIELDS: FieldDef[] = [
  { key: 'monthlyIncome', kind: 'number', unit: 'aed', step: 1000 },
  { key: 'monthlyDebts', kind: 'number', unit: 'aed', step: 500 },
  { key: 'savings', kind: 'number', unit: 'aed', step: 10000 },
  { key: 'ratePct', kind: 'number', unit: 'pct', step: 0.01, source: CALC_SOURCES.ratePct },
  { key: 'termYears', kind: 'number', unit: 'years', min: 1, max: 30 },
  {
    key: 'downPaymentPct',
    kind: 'number',
    unit: 'pct',
    min: 0,
    max: 100,
    source: FEES.minDownPaymentPct,
  },
  {
    key: 'debtBurdenPct',
    kind: 'number',
    unit: 'pct',
    min: 0,
    max: 100,
    source: FEES.debtBurdenPct,
  },
]
