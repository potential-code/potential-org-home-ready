import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/shared/PageHeader'
import { useLocalized } from '@/i18n'
import {
  useCalcResults,
  useChecklists,
  useEnrollments,
  useJourneyRuns,
  useMe,
  useOnboarding,
} from '@/store/hooks'
import { BuyerHome } from '../components/home/BuyerHome'
import { NewUserHome } from '../components/home/NewUserHome'
import { RenterHome } from '../components/home/RenterHome'

/**
 * Learner Home (brief C8.1). Three states: renter (Aisha, Track A), buyer (Rohan, Track B) and a
 * new learner with no saved work yet ("Start your first step" with the two journeys).
 */
export function HomePage() {
  const { t } = useTranslation('learn')
  const { l } = useLocalized()
  const me = useMe()
  const onboarding = useOnboarding()
  const runs = useJourneyRuns()
  const checklists = useChecklists()
  const calc = useCalcResults()
  const started = useEnrollments().some((e) => e.learnerId === me.id && e.completedUnitIds.length)
  const isNew = !runs.length && !checklists.length && !calc.length && !started
  const first = l(me.name).split(' ')[0]
  return (
    <>
      <PageHeader
        title={t(isNew ? 'home.welcome' : 'home.greeting', { name: first })}
        description={isNew ? t('home.welcomeBody') : undefined}
      />
      {isNew ? <NewUserHome /> : onboarding?.track === 'B' ? <BuyerHome /> : <RenterHome />}
    </>
  )
}
