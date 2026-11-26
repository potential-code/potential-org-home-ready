import type { Placement, PlatformSettings } from '@shared/types'
import { now } from '@/lib/clock'
import { getDb, update } from '../db'
import { uid, withAudit, withNotification } from './helpers'

const OWNER = 'Maya'

/** Publish content. Only approved items can be published (returns false otherwise). */
export function publishContent(contentId: string): boolean {
  const item = getDb().content.find((c) => c.id === contentId)
  const approved =
    item &&
    (item.status === 'approved' ||
      getDb().approvals.some(
        (a) => a.contentId === contentId && a.outcome === 'approved' && !a.published,
      ))
  if (!item || !approved) return false
  update((db) =>
    withAudit(
      {
        ...db,
        content: db.content.map((c) =>
          c.id === contentId
            ? {
                ...c,
                status: 'published' as const,
                en: c.en === 'approved' || c.en === 'in-review' ? ('published' as const) : c.en,
                ar: c.ar === 'approved' ? ('published' as const) : c.ar,
                updatedAt: now(),
              }
            : c,
        ),
        approvals: db.approvals.map((a) =>
          a.contentId === contentId && a.outcome === 'approved' ? { ...a, published: true } : a,
        ),
      },
      OWNER,
      'Published',
      item.title.en,
    ),
  )
  return true
}

/** Approvals: return an item to its author (status back to draft). */
export function returnToAuthor(approvalId: string) {
  update((db) => {
    const a = db.approvals.find((x) => x.id === approvalId)
    if (!a) return db
    return withAudit(
      {
        ...db,
        approvals: db.approvals.filter((x) => x.id !== approvalId),
        content: db.content.map((c) =>
          c.id === a.contentId ? { ...c, status: 'draft' as const, updatedAt: now() } : c,
        ),
      },
      OWNER,
      'Returned to author',
      a.title,
    )
  })
}

/** Content: submit a draft for review (adds it to the reviewer's queue). */
export function submitForReview(contentId: string) {
  update((db) => {
    const c = db.content.find((x) => x.id === contentId)
    if (!c) return db
    const at = now()
    const next = {
      ...db,
      content: db.content.map((x) =>
        x.id === contentId
          ? { ...x, status: 'in-review' as const, en: 'in-review' as const, updatedAt: at }
          : x,
      ),
      reviews: [
        ...db.reviews,
        {
          id: uid('RV'),
          contentId,
          title: c.title.en,
          languages: ['en' as const, 'ar' as const],
          enText: c.title.en,
          arText: c.title.ar,
          claims: c.sourceIds.map((s, i) => ({
            id: `${contentId}-c${i + 1}`,
            text: c.title.en,
            sourceId: s,
            checkedOn: c.checkedOn,
          })),
          submittedAt: at,
          dueAt: new Date(Date.parse(at) + 4 * 86400000).toISOString(),
          status: 'pending' as const,
        },
      ],
    }
    return withAudit(
      {
        ...next,
        notifications: withNotification(
          next,
          'reviewer',
          { en: `New in your queue: ${c.title.en}`, ar: `New in your queue: ${c.title.en}` },
          { en: 'Submitted by Maya.', ar: 'Submitted by Maya.' },
          '/review/queue',
        ),
      },
      OWNER,
      'Submitted for review',
      c.title.en,
    )
  })
}

export function addPlacement(draft: Omit<Placement, 'id' | 'createdAt' | 'status'>): string {
  const id = uid('PL')
  update((db) =>
    withAudit(
      {
        ...db,
        placements: [...db.placements, { ...draft, id, status: 'live' as const, createdAt: now() }],
      },
      OWNER,
      'Placement added',
      draft.label.en,
    ),
  )
  return id
}

/** Pause or resume a placement. Paused placements disappear for learners and the sponsor. */
export function setPlacementStatus(placementId: string, status: Placement['status']) {
  update((db) => {
    const p = db.placements.find((x) => x.id === placementId)
    if (!p) return db
    return withAudit(
      {
        ...db,
        placements: db.placements.map((x) => (x.id === placementId ? { ...x, status } : x)),
      },
      OWNER,
      status === 'paused' ? 'Placement paused' : 'Placement resumed',
      p.label.en,
    )
  })
}

/** Learners: send the "no useful action after 7 days" nudge to an audience. */
export function sendNudge(audience: string, count: number, templateId = 'ET-nudge') {
  update((db) =>
    withAudit(
      { ...db, nudges: [{ id: uid('NU'), templateId, audience, count, at: now() }, ...db.nudges] },
      OWNER,
      `Nudge sent to ${count} learners`,
      audience,
    ),
  )
}

export function scheduleAnnouncement(title: string, body: string, scheduledFor: string) {
  update((db) =>
    withAudit(
      {
        ...db,
        announcements: [
          { id: uid('AN'), title, body, scheduledFor, status: 'scheduled' as const },
          ...db.announcements,
        ],
      },
      OWNER,
      'Announcement scheduled',
      title,
    ),
  )
}

export function updateTemplate(id: string, subject: string, body: string) {
  update((db) =>
    withAudit(
      { ...db, templates: db.templates.map((t) => (t.id === id ? { ...t, subject, body } : t)) },
      OWNER,
      'Template edited',
      id,
    ),
  )
}

export function saveSettings(settings: PlatformSettings) {
  update((db) => withAudit({ ...db, settings }, OWNER, 'Settings saved', 'Platform settings'))
}

/** Reports: record a download in the audit log (files are simulated). */
export function logExport(actor: string, report: string) {
  update((db) => withAudit(db, actor, 'Report downloaded', report))
}

/** Edit a content item's English title (Maya's Content edit dialog). Audited. */
export function updateContent(contentId: string, titleEn: string): void {
  const item = getDb().content.find((c) => c.id === contentId)
  if (!item || !titleEn.trim()) return
  update((db) =>
    withAudit(
      {
        ...db,
        content: db.content.map((c) =>
          c.id === contentId
            ? { ...c, title: { ...c.title, en: titleEn.trim() }, updatedAt: now() }
            : c,
        ),
      },
      OWNER,
      'Edited',
      titleEn.trim(),
    ),
  )
}
