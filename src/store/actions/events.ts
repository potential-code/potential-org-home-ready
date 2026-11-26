import type { PersonaId } from '@shared/types'
import { EVENTS } from '@/data/catalogue'
import { now } from '@/lib/clock'
import { update } from '../db'
import { withNotification } from './helpers'

export function registerForEvent(learnerId: PersonaId, eventId: string) {
  const ev = EVENTS.find((e) => e.id === eventId)
  update((db) => {
    if (db.eventRegistrations.some((r) => r.eventId === eventId && r.learnerId === learnerId))
      return db
    const next = {
      ...db,
      eventRegistrations: [...db.eventRegistrations, { eventId, learnerId, at: now() }],
    }
    return ev
      ? {
          ...next,
          notifications: withNotification(
            next,
            learnerId,
            { en: `Registered: ${ev.title.en}`, ar: `تم التسجيل: ${ev.title.ar}` },
            { en: 'We will remind you 24 hours before.', ar: 'سنذكّرك قبل 24 ساعة.' },
            '/learn/events',
          ),
        }
      : next
  })
}

export function cancelEventRegistration(learnerId: PersonaId, eventId: string) {
  update((db) => ({
    ...db,
    eventRegistrations: db.eventRegistrations.filter(
      (r) => !(r.eventId === eventId && r.learnerId === learnerId),
    ),
  }))
}
