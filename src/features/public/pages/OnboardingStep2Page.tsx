import type { TrackKey } from '@shared/types'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { saveOnboarding } from '@/store/actions/auth'
import { trackForSituation } from '../components/auth/options'
import { BackButton } from '../components/onboarding/BackButton'
import { NextButton } from '../components/onboarding/NextButton'
import { OnboardingShell } from '../components/onboarding/OnboardingShell'
import { TrackChoice } from '../components/onboarding/TrackChoice'
import { useOnboardingLearner } from '../components/onboarding/use-onboarding-learner'

const TRACKS: TrackKey[] = ['A', 'B']

/** Onboarding step 2 "Pick your track" (C6.1): preselected from "What brings you here?". */
export function OnboardingStep2Page() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { id, onboarding, learner } = useOnboardingLearner()
  const suggested = trackForSituation(learner?.situation)
  const [track, setTrack] = useState<TrackKey | undefined>(onboarding?.track ?? suggested)
  const [error, setError] = useState('')

  const next = () => {
    if (!track) return setError(t('errors.track'))
    saveOnboarding(id, { track }, 3)
    void navigate({ to: '/onboarding/3' })
  }

  return (
    <OnboardingShell
      step={2}
      body={t('onboarding.s2.body')}
      actions={
        <>
          <BackButton to="/onboarding/1" />
          <NextButton onClick={next} />
        </>
      }
    >
      <div
        role="radiogroup"
        aria-label={t('onboarding.s2.title')}
        className="grid gap-5 sm:grid-cols-2"
      >
        {TRACKS.map((k) => (
          <TrackChoice
            key={k}
            track={k}
            selected={track === k}
            suggested={suggested === k}
            onSelect={() => {
              setTrack(k)
              setError('')
            }}
          />
        ))}
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </OnboardingShell>
  )
}
