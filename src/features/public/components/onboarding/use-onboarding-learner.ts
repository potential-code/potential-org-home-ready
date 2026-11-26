import { usePersona } from '@/store/actions/session'
import { useDb } from '@/store/db'

/** The signed-in learner's id, their onboarding record and their directory record (situation). */
export function useOnboardingLearner() {
  const me = usePersona()
  const id = me?.id ?? ''
  const onboarding = useDb((db) => db.onboarding[id])
  const learner = useDb((db) => db.learners.find((l) => l.personaId === id))
  return { id, me, onboarding, learner }
}
