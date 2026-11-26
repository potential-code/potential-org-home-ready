import { useCallback } from 'react'
import { PERSONAS } from '@/data/personas'
import { useLocalized } from '@/i18n'

/** Audit actors are stored by English name; show a persona's name in the current language. */
export function useActorName() {
  const { l } = useLocalized()
  return useCallback(
    (actor: string) => {
      const p = PERSONAS.find((x) => x.name.en === actor)
      return p ? l(p.name) : actor
    },
    [l],
  )
}
