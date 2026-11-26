import type { PersonaId } from '@shared/types'
import { OFFERS, SPONSORS } from '@/data/catalogue'
import { now } from '@/lib/clock'
import { update } from '../db'
import { actorName, uid, withAudit, withNotification } from './helpers'

/**
 * Partner request (C11.3). Nothing is shared unless `explicitTick` is true (the unticked consent
 * checkbox in the dialog). Returns the consent id, or null when not consented.
 */
export function givePartnerConsent(
  learnerId: PersonaId,
  offerId: string,
  explicitTick: boolean,
): string | null {
  if (explicitTick !== true) return null
  const offer = OFFERS.find((o) => o.id === offerId)
  const sponsor = SPONSORS.find((s) => s.id === offer?.sponsorId)
  if (!offer || !sponsor) return null
  const id = uid('PC')
  update((db) => {
    const next = {
      ...db,
      partnerConsents: [
        ...db.partnerConsents,
        { id, learnerId, offerId, sponsorId: sponsor.id, givenAt: now() },
      ],
      learners: db.learners.map((l) =>
        l.personaId === learnerId ? { ...l, partnerConsents: l.partnerConsents + 1 } : l,
      ),
    }
    return withAudit(
      {
        ...next,
        notifications: withNotification(
          next,
          learnerId,
          {
            en: `We've passed your request to ${sponsor.name.en}`,
            ar: `أرسلنا طلبك إلى ${sponsor.name.ar}`,
          },
          {
            en: 'We shared only your name, email and phone, for this request. Withdraw any time in Profile.',
            ar: 'شاركنا اسمك وبريدك الإلكتروني وهاتفك فقط، لهذا الطلب. يمكنك السحب في أي وقت من الملف الشخصي.',
          },
          '/learn/profile',
        ),
      },
      actorName(db, learnerId),
      'Partner consent given',
      `${sponsor.name.en} (${offer.title.en})`,
    )
  })
  return id
}

export function withdrawPartnerConsent(consentId: string) {
  update((db) => {
    const c = db.partnerConsents.find((x) => x.id === consentId)
    if (!c || c.withdrawnAt) return db
    const sponsor = SPONSORS.find((s) => s.id === c.sponsorId)
    return withAudit(
      {
        ...db,
        partnerConsents: db.partnerConsents.map((x) =>
          x.id === consentId ? { ...x, withdrawnAt: now() } : x,
        ),
      },
      actorName(db, c.learnerId),
      'Partner consent withdrawn',
      sponsor?.name.en ?? c.sponsorId,
    )
  })
}

export function setMarketingConsent(learnerId: PersonaId, on: boolean) {
  update((db) =>
    withAudit(
      {
        ...db,
        consents: db.consents.map((c) => (c.learnerId === learnerId ? { ...c, marketing: on } : c)),
        learners: db.learners.map((l) => (l.personaId === learnerId ? { ...l, marketing: on } : l)),
      },
      actorName(db, learnerId),
      on ? 'Marketing emails on' : 'Marketing emails off',
      'Consents',
    ),
  )
}

/** "Not interested" on a sponsor card: hide that placement for this learner. */
export function dismissPlacement(learnerId: PersonaId, placementId: string) {
  update((db) => ({
    ...db,
    dismissedPlacements: [...db.dismissedPlacements, { learnerId, placementId }],
  }))
}
