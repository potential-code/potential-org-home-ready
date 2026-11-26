import type { PersonaId } from '@shared/types'
import { DALIL_FALLBACK, matchDalil } from '@/data/dalil'
import { now } from '@/lib/clock'
import { getDb, update } from '../db'
import { uid } from './helpers'

/** Ask Dalil: store the question and the scripted answer (keyword match, else fallback). */
export function askDalil(learnerId: PersonaId, text: string) {
  const lang = getDb().prefs.lang
  const hit = matchDalil(text)
  update((db) => ({
    ...db,
    chat: [
      ...db.chat,
      {
        id: uid('CH'),
        learnerId,
        from: 'user',
        text: lang === 'ar' ? { en: text, ar: text } : { en: text, ar: text },
        at: now(),
      },
      {
        id: uid('CH'),
        learnerId,
        from: 'dalil',
        text: hit ? hit.answer : DALIL_FALLBACK,
        answerId: hit?.id,
        at: now(),
      },
    ],
  }))
  return hit
}

export function clearDalilChat(learnerId: PersonaId) {
  update((db) => ({ ...db, chat: db.chat.filter((m) => m.learnerId !== learnerId) }))
}
