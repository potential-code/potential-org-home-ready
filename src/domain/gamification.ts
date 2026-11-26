import type { ActivityEntry, BadgeId, PointsAction } from '@shared/types'
import { pct } from './progress'

/** Points per action (brief C11.5). */
export const POINTS: Record<PointsAction, number> = {
  unit: 20,
  journey: 50,
  checklist: 20,
  calculator: 20,
  reminder: 30,
  event: 40,
}

export function totalPoints(entries: ActivityEntry[]): number {
  return entries.reduce((sum, e) => sum + POINTS[e.action], 0)
}

/** Facts about one learner used to award badges. */
export interface BadgeFacts {
  usefulActions: number
  trueCostSaved: boolean
  rentBuySaved: boolean
  /** Best tick ratio (0..100) per checklist template. */
  checklistPct: Partial<Record<string, number>>
  hasChecklist: (templateId: string) => boolean
  completedUnits: string[]
  bestJourneyScore: number
  certificates: number
}

/**
 * Badges the facts qualify for. Badges are awarded on actions and never revoked, so seeded
 * awards (Aisha: First Step, Budget Builder, Viewing Pro) stay as in the brief.
 */
export function qualifyingBadges(f: BadgeFacts): BadgeId[] {
  const out: BadgeId[] = []
  if (f.usefulActions > 0) out.push('first-step')
  if (f.trueCostSaved) out.push('budget-builder')
  if ((f.checklistPct.viewing ?? 0) >= 80) out.push('viewing-pro')
  if (f.completedUnits.includes('A4') && f.hasChecklist('renewal')) out.push('contract-ready')
  if (f.bestJourneyScore >= 70) out.push('decision-maker')
  if (f.rentBuySaved) out.push('smart-buyer')
  if ((f.checklistPct['due-diligence'] ?? 0) >= 80) out.push('due-diligence')
  if (f.certificates > 0) out.push('graduate')
  return out
}

export function tickPct(ticked: number, total: number): number {
  return pct(ticked, total)
}

/** Track milestones at 20 / 60 / 100 percent. */
export const MILESTONES = [20, 60, 100] as const
export function milestonesReached(progress: number): number[] {
  return MILESTONES.filter((m) => progress >= m)
}
