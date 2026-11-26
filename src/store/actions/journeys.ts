import type { JourneyId, Localized, PersonaId } from '@shared/types'
import { CHECKLIST_BY_ID } from '@/data/checklists'
import { JOURNEY_BY_ID } from '@/data/journeys'
import { journeyScore } from '@/domain/journeys'
import { now } from '@/lib/clock'
import { getDb, update } from '../db'
import { uid, withPoints } from './helpers'

/** Start (or replay) a journey: a fresh run with no answers. Returns the run id. */
export function startJourney(learnerId: PersonaId, journeyId: JourneyId): string {
  const id = uid('JR')
  update((db) => ({
    ...db,
    journeyRuns: [...db.journeyRuns, { id, journeyId, learnerId, answers: {}, startedAt: now() }],
  }))
  return id
}

export function answerJourney(runId: string, stepId: string, optionId: string) {
  update((db) => ({
    ...db,
    journeyRuns: db.journeyRuns.map((r) =>
      r.id === runId ? { ...r, answers: { ...r.answers, [stepId]: optionId } } : r,
    ),
  }))
}

/** Finish a run: score it, award points (journey 50) and badges. Returns the score. */
export function finishJourney(runId: string): number {
  const run = getDb().journeyRuns.find((r) => r.id === runId)
  const journey = run ? JOURNEY_BY_ID[run.journeyId] : undefined
  if (!run || !journey) return 0
  const score = journeyScore(journey, run.answers)
  update((db) => {
    const next = {
      ...db,
      journeyRuns: db.journeyRuns.map((r) =>
        r.id === runId ? { ...r, score, finishedAt: now() } : r,
      ),
      learners: db.learners.map((l) =>
        l.personaId === run.learnerId
          ? {
              ...l,
              journeys: [
                ...l.journeys,
                { journeyId: run.journeyId, score, at: now().slice(0, 10) },
              ],
            }
          : l,
      ),
    }
    return withPoints(next, run.learnerId, 'journey', {
      en: `Finished ${journey.title.en} (${score}/100)`,
      ar: `أنهيت ${journey.title.ar} (${score}/100)`,
    })
  })
  return score
}

export function saveNextAction(runId: string, text?: Localized) {
  update((db) => ({
    ...db,
    journeyRuns: db.journeyRuns.map((r) =>
      r.id === runId ? { ...r, nextAction: text ?? JOURNEY_BY_ID[r.journeyId]?.nextAction } : r,
    ),
  }))
}

/** Save the journey's checklist template to the learner's checklists. Returns the checklist id. */
export function saveJourneyChecklist(runId: string): string | undefined {
  const run = getDb().journeyRuns.find((r) => r.id === runId)
  const journey = run ? JOURNEY_BY_ID[run.journeyId] : undefined
  const tpl = journey ? CHECKLIST_BY_ID[journey.checklistTemplateId] : undefined
  if (!run || !tpl) return undefined
  if (run.savedChecklistId) return run.savedChecklistId
  const id = uid('CL')
  update((db) => {
    const next = {
      ...db,
      checklists: [
        ...db.checklists,
        {
          id,
          learnerId: run.learnerId,
          templateId: tpl.id,
          title: tpl.title,
          ticked: [],
          notes: {},
          createdAt: now(),
          updatedAt: now(),
        },
      ],
      journeyRuns: db.journeyRuns.map((r) => (r.id === runId ? { ...r, savedChecklistId: id } : r)),
    }
    return withPoints(next, run.learnerId, 'checklist', {
      en: `Saved ${tpl.title.en}`,
      ar: `حفظت ${tpl.title.ar}`,
    })
  })
  return id
}

export function linkJourneyReminder(runId: string, reminderId: string) {
  update((db) => ({
    ...db,
    journeyRuns: db.journeyRuns.map((r) => (r.id === runId ? { ...r, reminderId } : r)),
  }))
}
