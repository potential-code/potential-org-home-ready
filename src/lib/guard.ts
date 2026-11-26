import config from '@config'
import type { Role } from '@shared/types'
import { redirect } from '@tanstack/react-router'
import { personaFrom } from '@/store/actions/session'
import { getDb } from '@/store/db'

/** Layout guard: the signed-in persona must have this role, else go to sign-in. */
export function requireRole(role: Role) {
  return () => {
    const db = getDb()
    const persona = personaFrom(db, db.session.personaId)
    if (!persona || persona.role !== role) throw redirect({ to: config.signInRoute })
  }
}
