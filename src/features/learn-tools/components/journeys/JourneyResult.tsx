import type { Journey, JourneyRun } from '@shared/types'
import { CheckCircle2, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Motif } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { optionOf, scoreBand } from '@/domain/journeys'
import { useLocalized } from '@/i18n'
import { STEP_SOURCE } from './config'
import { ResultActions } from './ResultActions'
import { ScoreMeter } from './ScoreMeter'
import { SourceLink } from './SourceLink'

/** Result page: score, band, next action tools, personal "what to check" list, recap. */
export function JourneyResult({
  journey,
  run,
  onReplay,
}: {
  journey: Journey
  run: JourneyRun
  onReplay: () => void
}) {
  const { t } = useTranslation('journeys')
  const { l } = useLocalized()
  const score = run.score ?? 0
  const band = scoreBand(score)
  const sources = journey.steps.map((s) => STEP_SOURCE[s.id]).filter((x): x is string => !!x)
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-grad-brand p-6 text-white shadow-lg sm:p-8">
        <Motif variant="banner" className="text-white/[0.12] max-sm:hidden" />
        <div className="relative max-w-xl">
          <p className="text-sm font-semibold text-white/85">{t('result.title')}</p>
          <p className="mt-1 text-5xl font-extrabold tabular-nums">{score}</p>
          <p className="mt-2 text-xl font-bold">{t(`result.band.${band}`)}</p>
          <p className="mt-1 text-white/85">{t(`result.bandBody.${band}`)}</p>
          <ScoreMeter score={score} label={l(journey.title)} onDark className="mt-5" />
          <Button
            onClick={onReplay}
            className="mt-5 rounded-full bg-white text-brand-deep hover:bg-white/90"
          >
            <RotateCcw className="size-4" aria-hidden />
            {t('result.replay')}
          </Button>
        </div>
      </section>
      <ResultActions journey={journey} run={run} />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5 sm:p-6" aria-labelledby="check-title">
          <h2 id="check-title" className="text-lg font-bold">
            {t('result.toCheck')}
          </h2>
          <ul className="mt-3 space-y-2.5">
            {journey.checkList.map((c) => (
              <li key={c.en} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                {l(c)}
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2">
            {sources.map((s) => (
              <SourceLink key={s} sourceId={s} />
            ))}
          </div>
        </section>
        <section className="card p-5 sm:p-6" aria-labelledby="recap-title">
          <h2 id="recap-title" className="text-lg font-bold">
            {t('result.choices')}
          </h2>
          <ol className="mt-3 space-y-3">
            {journey.steps.map((s, i) => {
              const o = optionOf(journey, s.id, run.answers[s.id])
              return (
                <li key={s.id} className="border-b border-border/60 pb-3 last:border-0 last:pb-0">
                  <p className="text-sm font-semibold text-ink-soft">
                    {i + 1}. {l(s.title)}
                  </p>
                  <p className="mt-0.5 font-medium">{l(o?.label)}</p>
                  <p className="text-sm text-ink-soft">
                    {o?.best ? t('player.best') : t('player.yourPick')} ·{' '}
                    {t('player.points', { points: o?.points ?? 0 })}
                  </p>
                </li>
              )
            })}
          </ol>
        </section>
      </div>
      <p className="text-sm text-ink-soft">{l(journey.resultNote)}</p>
    </div>
  )
}
