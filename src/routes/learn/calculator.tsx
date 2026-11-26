import type { CalcTab } from '@shared/types'
import { createFileRoute } from '@tanstack/react-router'
import { CalculatorPage } from '@/features/learn-tools/pages/CalculatorPage'

const TABS: CalcTab[] = ['true-cost', 'rent-vs-buy', 'afford']

export const Route = createFileRoute('/learn/calculator')({
  validateSearch: (s: Record<string, unknown>): { tab?: CalcTab } =>
    TABS.includes(s.tab as CalcTab) ? { tab: s.tab as CalcTab } : {},
  component: CalculatorPage,
})
