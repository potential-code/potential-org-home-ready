import type { LearnerRecord } from '@shared/types'
import { update } from '../db'

/** Learner edits their own profile (emirate, situation, household). Persists in the demo db. */
export function updateLearnerProfile(
  learnerId: string,
  patch: Partial<Pick<LearnerRecord, 'emirate' | 'situation' | 'household'>>,
): void {
  update((db) => ({
    ...db,
    learners: db.learners.map((l) =>
      l.id === learnerId || l.personaId === learnerId ? { ...l, ...patch } : l,
    ),
  }))
}
