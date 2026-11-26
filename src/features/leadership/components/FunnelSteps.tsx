import { useTranslation } from 'react-i18next'
import { ChartCard } from '@/components/charts'
import { formatNumber, useLocalized } from '@/i18n'
import type { useFunnel } from '../hooks/use-funnel'

type Step = ReturnType<typeof useFunnel>['steps'][number]

const FILL = ['bg-brand-deep', 'bg-brand', 'bg-track-a', 'bg-brand-warm', 'bg-brand-accent']

/** Funnel as labelled horizontal bars, width = share of everyone who joined. */
export function FunnelSteps({ steps }: { steps: Step[] }) {
  const { t } = useTranslation('leadership')
  const { l, lang } = useLocalized()
  const note = (s: Step) => {
    switch (s.note.kind) {
      case 'fromPrev':
        return t('funnel.fromPrev', { pct: s.note.pct })
      case 'ofEligible':
        return t('funnel.ofEligible', {
          pct: s.note.pct,
          eligible: formatNumber(s.note.eligible, lang),
        })
      case 'optIn':
        return t('funnel.optIn')
      default:
        return null
    }
  }
  return (
    <ChartCard
      title={t('funnel.stepsTitle')}
      subtitle={t('funnel.stepsSub')}
      table={{
        columns: [t('funnel.step'), t('funnel.people'), t('funnel.share')],
        rows: steps.map((s) => [l(s.label), formatNumber(s.value, lang), `${s.ofJoined}%`]),
      }}
    >
      <ol className="grid gap-4">
        {steps.map((s, i) => (
          <li key={s.id} className="grid gap-1.5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span className="font-semibold text-ink">
                <span className="me-2 text-ink-soft tabular-nums">{i + 1}.</span>
                {l(s.label)}
              </span>
              <span className="text-2xl font-extrabold tabular-nums text-brand-deep">
                {formatNumber(s.value, lang)}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-tint-50" aria-hidden>
              <div
                className={`h-full rounded-e-full ${FILL[i % FILL.length]}`}
                style={{ width: `${Math.max(2, s.ofJoined)}%` }}
              />
            </div>
            <p className="flex flex-wrap gap-x-3 text-xs text-ink-soft">
              <span className="font-semibold text-ink">
                {t('funnel.ofJoined', { pct: s.ofJoined })}
              </span>
              {note(s) && <span>{note(s)}</span>}
            </p>
          </li>
        ))}
      </ol>
    </ChartCard>
  )
}
