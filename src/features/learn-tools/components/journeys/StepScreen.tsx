import type { Journey } from '@shared/types'
import { ArrowLeft, ArrowRight, Info, Lightbulb } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { optionOf } from '@/domain/journeys'
import { useLocalized } from '@/i18n'
import { cn } from '@/lib/utils'
import { STEP_SOURCE } from './config'
import { OptionCard } from './OptionCard'
import { SourceLink } from './SourceLink'

const LETTERS = ['A', 'B', 'C', 'D']

/** One decision screen: prompt, optional figures, three options and instant feedback. */
export function StepScreen({
  journey,
  index,
  answers,
  onPick,
  onBack,
  onNext,
}: {
  journey: Journey
  index: number
  answers: Record<string, string>
  onPick: (optionId: string) => void
  onBack: () => void
  onNext: () => void
}) {
  const { t } = useTranslation('journeys')
  const { l } = useLocalized()
  const step = journey.steps[index]
  if (!step) return null
  const picked = optionOf(journey, step.id, answers[step.id])
  const best = step.options.find((o) => o.best)
  const last = index === journey.steps.length - 1
  const sourceId = STEP_SOURCE[step.id]
  return (
    <section className="card p-5 sm:p-7" aria-labelledby="step-title">
      <p className="text-sm font-semibold text-brand">
        {t('player.stepOf', { step: index + 1, total: journey.steps.length })}
      </p>
      <h2 id="step-title" className="mt-1 text-2xl font-bold">
        {l(step.title)}
      </h2>
      <p className="mt-2 text-lg text-ink">{l(step.prompt)}</p>
      {step.info && (
        <div className="mt-4 rounded-xl bg-tint-50 p-4 ring-1 ring-brand/10">
          <p className="flex items-center gap-2 text-sm font-bold text-brand-deep">
            <Info className="size-4" aria-hidden />
            {t('player.facts')}
          </p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {step.info.map((i) => (
              <li key={i.en}>{l(i)}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-5 text-xs font-semibold text-ink-soft uppercase">{t('player.choose')}</p>
      <div className="mt-2 grid gap-3">
        {step.options.map((o, i) => (
          <OptionCard
            key={o.id}
            option={o}
            letter={LETTERS[i] ?? ''}
            selected={picked?.id === o.id}
            locked={!!picked}
            onPick={() => onPick(o.id)}
          />
        ))}
      </div>
      {picked && (
        <div
          role="status"
          className={cn(
            'mt-4 rounded-xl p-4 ring-1',
            picked.best ? 'bg-success-soft ring-success/20' : 'bg-notice-soft ring-notice/20',
          )}
        >
          <p className="flex flex-wrap items-center gap-2 font-bold text-ink">
            <Lightbulb className="size-4" aria-hidden />
            {picked.best ? t('player.best') : t('player.yourPick')}
            <span className="text-sm font-semibold text-ink-soft">
              {t('player.points', { points: picked.points })}
            </span>
          </p>
          <p className="mt-1 text-ink">{l(picked.feedback)}</p>
          {!picked.best && best && (
            <p className="mt-2 text-sm text-ink-soft">
              {t('player.best')}: {l(best.label)}
            </p>
          )}
        </div>
      )}
      {picked && sourceId && (
        <div className="mt-3">
          <SourceLink sourceId={sourceId} />
        </div>
      )}
      <div className="mt-6 flex flex-wrap justify-between gap-3">
        <Button variant="ghost" onClick={onBack} disabled={index === 0}>
          <ArrowLeft className="size-4 rtl-mirror" aria-hidden />
          {t('player.back')}
        </Button>
        <Button className="rounded-full" onClick={onNext} disabled={!picked}>
          {last ? t('player.finish') : t('player.next')}
          <ArrowRight className="size-4 rtl-mirror" aria-hidden />
        </Button>
      </div>
    </section>
  )
}
