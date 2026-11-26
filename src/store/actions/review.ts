import { now } from '@/lib/clock'
import { update } from '../db'
import { uid, withAudit, withNotification } from './helpers'

const REVIEWER = 'Khalid Al Mansoori'

/** Reviewer approves an item: content becomes "approved", Maya gets it in Approvals + a notice. */
export function approveReview(reviewId: string, comment = '') {
  update((db) => {
    const r = db.reviews.find((x) => x.id === reviewId)
    if (r?.status !== 'pending') return db
    const at = now()
    const langs = r.languages.map((l) => l.toUpperCase()).join(', ')
    const next = {
      ...db,
      reviews: db.reviews.map((x) =>
        x.id === reviewId ? { ...x, status: 'approved' as const, comment, decidedAt: at } : x,
      ),
      content: db.content.map((c) =>
        c.id === r.contentId
          ? {
              ...c,
              status: 'approved' as const,
              en: r.languages.includes('en') ? ('approved' as const) : c.en,
              ar: r.languages.includes('ar') ? ('approved' as const) : c.ar,
              updatedAt: at,
            }
          : c,
      ),
      approvals: [
        {
          id: uid('AP'),
          contentId: r.contentId,
          title: r.title,
          outcome: 'approved' as const,
          note: comment || 'Approved.',
          reviewer: REVIEWER,
          at,
          published: false,
        },
        ...db.approvals,
      ],
    }
    return withAudit(
      {
        ...next,
        notifications: withNotification(
          next,
          'owner',
          { en: `Approved: ${r.title}`, ar: `Approved: ${r.title}` },
          {
            en: `${REVIEWER} approved ${r.title} (${langs}). Ready to publish.`,
            ar: `${REVIEWER} approved ${r.title} (${langs}). Ready to publish.`,
          },
          '/admin/approvals',
        ),
      },
      REVIEWER,
      'Approved',
      r.title,
    )
  })
}

export function requestChanges(reviewId: string, comment: string) {
  update((db) => {
    const r = db.reviews.find((x) => x.id === reviewId)
    if (r?.status !== 'pending') return db
    const at = now()
    const next = {
      ...db,
      reviews: db.reviews.map((x) =>
        x.id === reviewId ? { ...x, status: 'changes' as const, comment, decidedAt: at } : x,
      ),
      content: db.content.map((c) =>
        c.id === r.contentId ? { ...c, status: 'changes' as const, updatedAt: at } : c,
      ),
      approvals: [
        {
          id: uid('AP'),
          contentId: r.contentId,
          title: r.title,
          outcome: 'changes' as const,
          note: `Changes requested: ${comment}`,
          reviewer: REVIEWER,
          at,
          published: false,
        },
        ...db.approvals,
      ],
    }
    return withAudit(next, REVIEWER, 'Changes requested', r.title)
  })
}

/** Update a claim's "checked on" date (reviewer edits source fields). */
export function updateClaimCheckDate(reviewId: string, claimId: string, checkedOn: string) {
  update((db) => ({
    ...db,
    reviews: db.reviews.map((r) =>
      r.id === reviewId
        ? { ...r, claims: r.claims.map((c) => (c.id === claimId ? { ...c, checkedOn } : c)) }
        : r,
    ),
  }))
}
