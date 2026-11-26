import type { CalcTab } from '@shared/types'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AFFORD_DEFAULTS,
  type AffordInputs,
  RENT_BUY_DEFAULTS,
  type RentBuyInputs,
  TRUE_COST_DEFAULTS,
  type TrueCostInputs,
} from '@/data/figures'
import { usePageTitle } from '@/hooks/use-page-title'
import { AffordResults } from '../components/calculator/AffordResults'
import { CalcBanner } from '../components/calculator/CalcBanner'
import { AFFORD_FIELDS, RENT_BUY_FIELDS, TRUE_COST_FIELDS } from '../components/calculator/config'
import { type CalcInputs, InputsCard } from '../components/calculator/InputsCard'
import { RentBuyResults } from '../components/calculator/RentBuyResults'
import { SavedResults } from '../components/calculator/SavedResults'
import { SaveResultDialog } from '../components/calculator/SaveResultDialog'
import { SponsorSlot } from '../components/calculator/SponsorSlot'
import { TabBar } from '../components/calculator/TabBar'
import { TrueCostResults } from '../components/calculator/TrueCostResults'

const DEFAULTS: Record<CalcTab, CalcInputs> = {
  'true-cost': TRUE_COST_DEFAULTS,
  'rent-vs-buy': RENT_BUY_DEFAULTS,
  afford: AFFORD_DEFAULTS,
}
const FIELDS = {
  'true-cost': TRUE_COST_FIELDS,
  'rent-vs-buy': RENT_BUY_FIELDS,
  afford: AFFORD_FIELDS,
}

/** Negative or empty numbers count as 0 so the maths never breaks while typing. */
const clean = <T extends CalcInputs>(v: T): T =>
  Object.fromEntries(
    Object.entries(v).map(([k, x]) => [k, typeof x === 'number' ? Math.max(0, x || 0) : x]),
  ) as T

/** Home Ready calculator (brief C11.2): true cost, rent vs buy, what can I afford. */
export function CalculatorPage() {
  const { t } = useTranslation('calculator')
  usePageTitle(t('pages.title'))
  const search = useSearch({ from: '/learn/calculator' })
  const navigate = useNavigate({ from: '/learn/calculator' })
  const tab: CalcTab = search.tab ?? 'true-cost'
  const [values, setValues] = useState<Record<CalcTab, CalcInputs>>(DEFAULTS)
  const current = values[tab]
  const set = (key: string, v: number | boolean) =>
    setValues((s) => ({ ...s, [tab]: { ...s[tab], [key]: v } }))
  const inputs = clean(current)
  return (
    <>
      <CalcBanner />
      <TabBar value={tab} onChange={(next) => navigate({ search: { tab: next }, replace: true })} />
      <div
        id="calc-panel"
        role="tabpanel"
        aria-labelledby={`calc-tab-${tab}`}
        className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
      >
        <div className="space-y-4">
          <InputsCard
            tab={tab}
            fields={FIELDS[tab]}
            values={current}
            onChange={set}
            onReset={() => setValues((s) => ({ ...s, [tab]: DEFAULTS[tab] }))}
          />
          <SponsorSlot />
        </div>
        <div className="min-w-0 space-y-4 max-lg:order-first">
          {tab === 'true-cost' && <TrueCostResults inputs={inputs as TrueCostInputs} />}
          {tab === 'rent-vs-buy' && (
            <RentBuyResults
              inputs={{
                ...(inputs as RentBuyInputs),
                horizonYears: Math.min(15, Math.max(1, Number(inputs.horizonYears))),
              }}
              onHorizon={(y) => set('horizonYears', y)}
            />
          )}
          {tab === 'afford' && <AffordResults inputs={inputs as AffordInputs} />}
          <div className="flex flex-wrap items-center gap-3">
            <SaveResultDialog tab={tab} inputs={inputs} />
            <p className="text-xs text-ink-soft">{t('save.hint')}</p>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <SavedResults />
      </div>
    </>
  )
}
