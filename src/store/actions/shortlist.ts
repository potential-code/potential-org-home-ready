import type { PersonaId, ShortlistHome } from '@shared/types'
import { now } from '@/lib/clock'
import { update } from '../db'
import { uid } from './helpers'

export type HomeDraft = Omit<ShortlistHome, 'id' | 'learnerId' | 'addedAt'>

export function addHome(learnerId: PersonaId, draft: HomeDraft): string {
  const id = uid('SH')
  update((db) => ({
    ...db,
    shortlist: [...db.shortlist, { ...draft, id, learnerId, addedAt: now() }],
  }))
  return id
}
export function updateHome(id: string, patch: Partial<HomeDraft>) {
  update((db) => ({
    ...db,
    shortlist: db.shortlist.map((h) => (h.id === id ? { ...h, ...patch } : h)),
  }))
}
export function removeHome(id: string) {
  update((db) => ({ ...db, shortlist: db.shortlist.filter((h) => h.id !== id) }))
}
