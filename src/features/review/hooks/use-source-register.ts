import type { Source } from '@shared/types'
import { useSyncExternalStore } from 'react'
import { SOURCES } from '@/data/sources'

/**
 * Source register edits for this session. The shared store has no sources collection yet
 * (requested from the lead), so the register starts from SOURCES and keeps edits here.
 */
let register: Source[] = SOURCES
const listeners = new Set<() => void>()

export function upsertSource(s: Source) {
  register = register.some((x) => x.id === s.id)
    ? register.map((x) => (x.id === s.id ? s : x))
    : [s, ...register]
  for (const l of listeners) l()
}

export function useSourceRegister() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => register,
  )
}
