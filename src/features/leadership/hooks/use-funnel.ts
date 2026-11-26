import { useMemo } from 'react'
import { FUNNEL } from '@/data/figures'
import { pct } from '@/domain/progress'
import { useKpis } from '@/store/hooks'

export type FunnelNote =
  | { kind: 'fromPrev'; pct: number }
  | { kind: 'ofEligible'; pct: number; eligible: number }
  | { kind: 'optIn' }
  | { kind: 'none' }

/** Funnel steps (C13) with live values from useKpis, so they match the Impact KPI tiles. */
export function useFunnel() {
  const k = useKpis()
  return useMemo(() => {
    const live: Record<(typeof FUNNEL)[number]['id'], number> = {
      joined: k.joined,
      onboarded: k.onboarded,
      useful: k.firstUsefulAction,
      returned: k.returned30,
      reminders: k.reminderOptIns,
    }
    const steps = FUNNEL.map((s, i) => {
      const value = live[s.id]
      const before = FUNNEL[i - 1]
      const prev = before ? live[before.id] : value
      let note: FunnelNote = { kind: 'none' }
      if (s.id === 'onboarded' || s.id === 'useful')
        note = { kind: 'fromPrev', pct: pct(value, prev) }
      if (s.id === 'returned')
        note = { kind: 'ofEligible', pct: k.k4Pct, eligible: k.returnedEligible }
      if (s.id === 'reminders') note = { kind: 'optIn' }
      return { id: s.id, label: s.label, value, ofJoined: pct(value, k.joined), note }
    })
    return { steps, k }
  }, [k])
}
