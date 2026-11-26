import type { Localized, PersonaId, Reminder, ReminderChannel } from '@shared/types'
import { update } from '../db'
import { uid, withNotification, withPoints } from './helpers'

export interface ReminderDraft {
  title: Localized
  date: string
  channels: ReminderChannel[]
  note?: Localized
}

/** Set a reminder (points: reminder 30) with an in-platform confirmation. Returns its id. */
export function addReminder(learnerId: PersonaId, draft: ReminderDraft): string {
  const id = uid('RM')
  update((db) => {
    const next = {
      ...db,
      reminders: [...db.reminders, { ...draft, id, learnerId, status: 'active' as const }],
      learners: db.learners.map((l) =>
        l.personaId === learnerId ? { ...l, reminders: l.reminders + 1 } : l,
      ),
    }
    return withPoints(
      {
        ...next,
        notifications: withNotification(
          next,
          learnerId,
          { en: 'Reminder set', ar: 'تم ضبط التذكير' },
          draft.title,
          '/learn/reminders',
        ),
      },
      learnerId,
      'reminder',
      { en: `Set reminder: ${draft.title.en}`, ar: `ضبطت تذكيراً: ${draft.title.ar}` },
    )
  })
  return id
}

export function updateReminder(id: string, patch: Partial<Omit<Reminder, 'id' | 'learnerId'>>) {
  update((db) => ({
    ...db,
    reminders: db.reminders.map((r) => (r.id === id ? { ...r, ...patch } : r)),
  }))
}
export function setReminderChannels(id: string, channels: ReminderChannel[]) {
  updateReminder(id, { channels })
}
/** Turn a suggested reminder into an active one. */
export function acceptSuggestedReminder(id: string) {
  update((db) => {
    const r = db.reminders.find((x) => x.id === id)
    if (!r) return db
    return withPoints(
      {
        ...db,
        reminders: db.reminders.map((x) => (x.id === id ? { ...x, status: 'active' as const } : x)),
      },
      r.learnerId,
      'reminder',
      { en: `Set reminder: ${r.title.en}`, ar: `ضبطت تذكيراً: ${r.title.ar}` },
    )
  })
}
export function deleteReminder(id: string) {
  update((db) => ({ ...db, reminders: db.reminders.filter((r) => r.id !== id) }))
}
