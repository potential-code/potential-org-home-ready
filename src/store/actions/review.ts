import { L } from '@/data/l'
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
          note: comment ? L(comment, comment) : L('Approved.', 'تمت الموافقة.'),
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
          { en: `Approved: ${r.title.en}`, ar: `تمت الموافقة: ${r.title.ar || r.title.en}` },
          {
            en: `${REVIEWER} approved ${r.title.en} (${langs}). Ready to publish.`,
            ar: `وافق خالد المنصوري على ${r.title.ar || r.title.en} (${langs}). جاهز للنشر.`,
          },
          '/admin/approvals',
        ),
      },
      REVIEWER,
      L('Approved', 'تمت الموافقة'),
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
          note: L(`Changes requested: ${comment}`, `طُلبت تعديلات: ${comment}`),
          reviewer: REVIEWER,
          at,
          published: false,
        },
        ...db.approvals,
      ],
    }
    return withAudit(next, REVIEWER, L('Changes requested', 'طُلبت تعديلات'), r.title)
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
