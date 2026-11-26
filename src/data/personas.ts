import config from '@config'
import type { Persona, Role } from '@shared/types'

// One list (from mockup.config.ts) drives the sign-in cards and the presenter role switcher.
export const PERSONAS: Persona[] = config.personas.map((p) => ({ ...p }))

export const PERSONA_BY_ID: Record<string, Persona> = Object.fromEntries(
  PERSONAS.map((p) => [p.id, p]),
)

/** Landing route per role: the first persona of that role decides it. */
export const ROLE_HOME = Object.fromEntries(
  config.roles.map((r) => [r, PERSONAS.find((p) => p.role === r)?.home ?? '/']),
) as Record<Role, string>
