import type { SavedChecklist } from '@shared/types'
import { CHECKLIST_BY_ID } from '@/data/checklists'

/** Progress of a saved checklist against its template items. */
export function checklistProgress(c: SavedChecklist) {
  const items = CHECKLIST_BY_ID[c.templateId]?.items ?? []
  const done = items.filter((i) => c.ticked.includes(i.id)).length
  const total = items.length
  const pct = total ? (done / total) * 100 : 0
  const status: 'notStarted' | 'inProgress' | 'complete' =
    done === 0 ? 'notStarted' : done === total ? 'complete' : 'inProgress'
  return { done, total, pct, status }
}

export const STATUS_TONE = {
  notStarted: 'neutral',
  inProgress: 'info',
  complete: 'success',
} as const
