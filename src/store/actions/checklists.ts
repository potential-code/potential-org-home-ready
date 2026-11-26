import type { ChecklistTemplateId, PersonaId } from '@shared/types'
import { CHECKLIST_BY_ID } from '@/data/checklists'
import { now } from '@/lib/clock'
import { update } from '../db'
import { uid, withBadges, withPoints } from './helpers'

/** Create a saved checklist from a template (points: checklist 20). Returns its id. */
export function createChecklist(learnerId: PersonaId, templateId: ChecklistTemplateId): string {
  const tpl = CHECKLIST_BY_ID[templateId]
  const id = uid('CL')
  if (!tpl) return id
  update((db) =>
    withPoints(
      {
        ...db,
        checklists: [
          ...db.checklists,
          {
            id,
            learnerId,
            templateId,
            title: tpl.title,
            ticked: [],
            notes: {},
            createdAt: now(),
            updatedAt: now(),
          },
        ],
      },
      learnerId,
      'checklist',
      { en: `Saved ${tpl.title.en}`, ar: `حفظت ${tpl.title.ar}` },
    ),
  )
  return id
}

export function toggleChecklistItem(checklistId: string, itemId: string) {
  update((db) => {
    const c = db.checklists.find((x) => x.id === checklistId)
    if (!c) return db
    const ticked = c.ticked.includes(itemId)
      ? c.ticked.filter((i) => i !== itemId)
      : [...c.ticked, itemId]
    const next = {
      ...db,
      checklists: db.checklists.map((x) =>
        x.id === checklistId ? { ...x, ticked, updatedAt: now() } : x,
      ),
    }
    return withBadges(next, c.learnerId)
  })
}

export function setChecklistNote(checklistId: string, itemId: string, note: string) {
  update((db) => ({
    ...db,
    checklists: db.checklists.map((x) =>
      x.id === checklistId
        ? { ...x, notes: { ...x.notes, [itemId]: { en: note, ar: note } }, updatedAt: now() }
        : x,
    ),
  }))
}

export function deleteChecklist(checklistId: string) {
  update((db) => ({ ...db, checklists: db.checklists.filter((x) => x.id !== checklistId) }))
}
