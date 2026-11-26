import type { CalcTab, Localized, PersonaId } from '@shared/types'
import { calcSummary } from '@/domain/calculator-summary'
import { now } from '@/lib/clock'
import { update } from '../db'
import { uid, withPoints } from './helpers'

/** Save a calculator result (points: calculator 20). Returns the result id. */
export function saveCalcResult(
  learnerId: PersonaId,
  tab: CalcTab,
  inputs: Record<string, number | boolean>,
  name: Localized,
): string {
  const id = uid('CR')
  update((db) =>
    withPoints(
      {
        ...db,
        calcResults: [
          ...db.calcResults,
          {
            id,
            learnerId,
            tab,
            name,
            inputs: { ...inputs },
            summary: calcSummary(tab, inputs),
            savedAt: now(),
          },
        ],
      },
      learnerId,
      'calculator',
      { en: `Saved ${name.en}`, ar: `حفظت ${name.ar || name.en}` },
    ),
  )
  return id
}

export function deleteCalcResult(id: string) {
  update((db) => ({ ...db, calcResults: db.calcResults.filter((r) => r.id !== id) }))
}
