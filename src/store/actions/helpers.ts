import type { DemoNotification, Localized, PersonaId, PointsAction, Role } from '@shared/types'
import { CHECKLIST_BY_ID } from '@/data/checklists'
import { qualifyingBadges, tickPct } from '@/domain/gamification'
import { certificateEarned } from '@/domain/tracks'
import { now } from '@/lib/clock'
import type { DemoDb } from '../db'

let counter = 0
/** Unique id for a live demo record. */
export function uid(prefix: string): string {
  counter += 1
  return `${prefix}-${Date.now().toString(36)}${counter}`
}

/** Display name of the acting persona or registered learner (staff logs, audit). */
export function actorName(db: DemoDb, personaId: PersonaId | null): string {
  if (!personaId) return 'Visitor'
  const reg = db.registered.find((r) => r.id === personaId)
  if (reg) return reg.name
  return db.learners.find((l) => l.personaId === personaId)?.name ?? personaId
}

export function withAudit(db: DemoDb, actor: string, action: Localized, target: Localized): DemoDb {
  return { ...db, audit: [{ id: uid('AU'), at: now(), actor, action, target }, ...db.audit] }
}

export function withNotification(
  db: DemoDb,
  to: PersonaId | Role,
  title: Localized,
  body: Localized,
  route?: string,
): DemoNotification[] {
  return [
    { id: uid('NT'), to, title, body, to_route: route, at: now(), read: false },
    ...db.notifications,
  ]
}

/** Badge facts for one learner, from the current db. */
function facts(db: DemoDb, learnerId: PersonaId) {
  const mine = <T extends { learnerId: PersonaId }>(xs: T[]) =>
    xs.filter((x) => x.learnerId === learnerId)
  const checklists = mine(db.checklists)
  const checklistPct: Record<string, number> = {}
  for (const c of checklists) {
    const total = CHECKLIST_BY_ID[c.templateId]?.items.length ?? 0
    checklistPct[c.templateId] = Math.max(
      checklistPct[c.templateId] ?? 0,
      tickPct(c.ticked.length, total),
    )
  }
  const calcs = mine(db.calcResults)
  const runs = mine(db.journeyRuns).filter((r) => r.finishedAt)
  const enrs = mine(db.enrollments)
  return {
    usefulActions: runs.length + checklists.length + calcs.length,
    trueCostSaved: calcs.some((c) => c.tab === 'true-cost'),
    rentBuySaved: calcs.some((c) => c.tab === 'rent-vs-buy'),
    checklistPct,
    hasChecklist: (id: string) => checklists.some((c) => c.templateId === id),
    completedUnits: enrs.flatMap((e) => e.completedUnitIds),
    bestJourneyScore: Math.max(0, ...runs.map((r) => r.score ?? 0)),
    certificates: db.courses.filter((c) =>
      certificateEarned(
        c,
        enrs.find((e) => e.courseId === c.id),
      ),
    ).length,
  }
}

/** Award new badges (never revokes). */
export function withBadges(db: DemoDb, learnerId: PersonaId): DemoDb {
  const have = new Set(db.badges.filter((b) => b.learnerId === learnerId).map((b) => b.badgeId))
  const fresh = qualifyingBadges(facts(db, learnerId)).filter((b) => !have.has(b))
  if (!fresh.length) return db
  return {
    ...db,
    badges: [...db.badges, ...fresh.map((badgeId) => ({ learnerId, badgeId, at: now() }))],
  }
}

/** Record a points-earning action, mark first useful action, then re-check badges. */
export function withPoints(
  db: DemoDb,
  learnerId: PersonaId,
  action: PointsAction,
  label: Localized,
): DemoDb {
  const at = now()
  const useful = action === 'journey' || action === 'checklist' || action === 'calculator'
  const next: DemoDb = {
    ...db,
    activity: [...db.activity, { id: uid('AC'), learnerId, action, label, at }],
    learners: db.learners.map((l) =>
      l.personaId === learnerId
        ? {
            ...l,
            lastActive: at.slice(0, 10),
            firstUsefulActionAt: l.firstUsefulActionAt ?? (useful ? at.slice(0, 10) : undefined),
          }
        : l,
    ),
  }
  return withBadges(next, learnerId)
}
