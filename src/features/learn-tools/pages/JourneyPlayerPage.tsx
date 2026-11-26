import type { JourneyId } from '@shared/types'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/shared/PageHeader'
import { SmartImage } from '@/components/shared/SmartImage'
import { Button } from '@/components/ui/button'
import { JOURNEY_BY_ID } from '@/data/journeys'
import { currentStepIndex, journeyScore } from '@/domain/journeys'
import { useLocalized } from '@/i18n'
import { asset } from '@/lib/asset'
import { answerJourney, finishJourney, startJourney } from '@/store/actions'
import { useMe } from '@/store/hooks'
import { JourneyResult } from '../components/journeys/JourneyResult'
import { ProfilePanel } from '../components/journeys/ProfilePanel'
import { ScoreMeter } from '../components/journeys/ScoreMeter'
import { StepScreen } from '../components/journeys/StepScreen'
import { useLatestRun } from '../hooks/use-journey-run'

/** Journey player (brief C11.1): intro, five decisions with instant feedback, result. */
export function JourneyPlayerPage({ journeyId }: { journeyId: JourneyId }) {
  const { t } = useTranslation('journeys')
  const { l } = useLocalized()
  const me = useMe()
  const journey = JOURNEY_BY_ID[journeyId]
  const run = useLatestRun(journeyId)
  const [step, setStep] = useState(0)
  const runId = run?.id
  // Resume at the first unanswered step whenever a different run becomes current.
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset only when the run changes
  useEffect(() => {
    if (run && !run.finishedAt) setStep(Math.min(currentStepIndex(journey, run.answers), 4))
    window.scrollTo({ top: 0 })
  }, [runId])
  const start = () => {
    startJourney(me.id, journeyId)
    setStep(0)
  }
  const next = () => {
    if (!run) return
    if (step >= journey.steps.length - 1) finishJourney(run.id)
    else setStep(step + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <>
      <PageHeader
        title={l(journey.title)}
        description={l(journey.summary)}
        crumbs={[{ label: t('player.crumb'), to: '/learn/journeys' }, { label: l(journey.title) }]}
      />
      {run?.finishedAt ? (
        <JourneyResult journey={journey} run={run} onReplay={start} />
      ) : run ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <StepScreen
            journey={journey}
            index={step}
            answers={run.answers}
            onPick={(o) => answerJourney(run.id, journey.steps[step]?.id ?? '', o)}
            onBack={() => setStep(Math.max(0, step - 1))}
            onNext={next}
          />
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="card p-5">
              <ScoreMeter
                score={journeyScore(journey, run.answers)}
                label={t('player.scoreSoFar')}
              />
            </div>
            <ProfilePanel journey={journey} />
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <section className="card overflow-hidden">
            <SmartImage
              src={journey.cover ? asset(journey.cover) : undefined}
              alt=""
              className="aspect-[21/9] w-full object-cover"
            />
            <div className="p-5 sm:p-7">
              <p className="text-lg">{l(journey.summary)}</p>
              <p className="mt-2 text-sm text-ink-soft">
                {t('list.steps', { count: journey.steps.length })}
              </p>
              <Button className="mt-5 rounded-full" onClick={start}>
                {t('player.start')}
                <ArrowRight className="size-4 rtl-mirror" aria-hidden />
              </Button>
            </div>
          </section>
          <ProfilePanel journey={journey} />
        </div>
      )}
    </>
  )
}
