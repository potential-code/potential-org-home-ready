import type { Localized } from '@shared/types'
import { useSyncExternalStore } from 'react'
import { updateContent } from '@/store/actions'

/**
 * Title edits made in the Content dialog. The shared store has no "edit content" action yet
 * (now added: `updateContent` persists the English title in the demo db; this overlay keeps
 * the Arabic edit for the session).
 */
let edits: Record<string, Localized> = {}
const listeners = new Set<() => void>()

export function saveContentTitle(id: string, title: Localized) {
  edits = { ...edits, [id]: title }
  updateContent(id, title.en)
  for (const l of listeners) l()
}

export function useContentEdits() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => edits,
  )
}
