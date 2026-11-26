import config from '@config'
import type { Lang, Persona, PersonaId } from '@shared/types'
import { PERSONA_BY_ID, PERSONAS } from '@/data/personas'
import { type DemoDb, getDb, update, useDb } from '../db'

/** Persona for an id: config personas first, then learners registered live in this demo. */
export function personaFrom(db: DemoDb, id: PersonaId | null): Persona | null {
  if (!id) return null
  const fixed = PERSONA_BY_ID[id]
  if (fixed) return fixed
  const reg = db.registered.find((r) => r.id === id)
  return reg
    ? {
        id: reg.id,
        role: 'learner',
        name: { en: reg.name, ar: reg.name },
        title: { en: 'Learner', ar: 'متعلم' },
        home: '/onboarding/1',
        email: reg.email,
      }
    : null
}

export function signInAs(personaId: PersonaId) {
  update((db) => ({ ...db, session: { personaId } }))
}
export function signOut() {
  update((db) => ({ ...db, session: { personaId: null } }))
}

/**
 * Simulated sign-in: username or email (case-insensitive) plus password. Demo personas use
 * `config.demoPassword`; registered learners use the password they chose. Returns the persona
 * or an error code for the form.
 */
export function signInWithCredentials(
  identifier: string,
  password: string,
): { persona: Persona } | { error: 'required' | 'unknown' | 'password' } {
  const id = identifier.trim().toLowerCase()
  if (!id || !password) return { error: 'required' }
  const fixed = PERSONAS.find((p) => p.username === id || p.email?.toLowerCase() === id)
  if (fixed) {
    if (password !== config.demoPassword) return { error: 'password' }
    signInAs(fixed.id)
    return { persona: fixed }
  }
  const db = getDb()
  const reg = db.registered.find((r) => r.email.toLowerCase() === id)
  if (!reg) return { error: 'unknown' }
  if (reg.password !== password) return { error: 'password' }
  signInAs(reg.id)
  const persona = personaFrom(getDb(), reg.id)
  return persona ? { persona } : { error: 'unknown' }
}

export function setLang(lang: Lang) {
  update((db) => ({ ...db, prefs: { ...db.prefs, lang } }))
}
export function setReducedMotion(on: boolean) {
  update((db) => ({ ...db, prefs: { ...db.prefs, reducedMotion: on } }))
}

export function usePrefs() {
  return useDb((db) => db.prefs)
}
export function usePersona(): Persona | null {
  const id = useDb((db) => db.session.personaId)
  const registered = useDb((db) => db.registered)
  if (!id) return null
  return PERSONA_BY_ID[id] ?? personaFrom({ registered } as DemoDb, id)
}
export function currentPersona() {
  const db = getDb()
  return personaFrom(db, db.session.personaId)
}
