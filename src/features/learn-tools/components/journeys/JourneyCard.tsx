import type { Journey } from '@shared/types'
import { Link } from '@tanstack/react-router'
import { ArrowRight, CheckCircle2, Circle, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SmartImage } from '@/components/shared/SmartImage'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { currentStepIndex } from '@/domain/journeys'
import { useLocalized } from '@/i18n'
import { asset } from '@/lib/asset'
import { useLatestRun } from '../../hooks/use-journey-run'

export function JourneyCard({ journey }: { journey: Journey }) {
  const { t } = useTranslation('journeys')
  const { l } = useLocalized()
  const run = useLatestRun(journey.id)
  const total = journey.steps.length
  const done = !!run?.finishedAt
  const step = run ? currentStepIndex(journey, run.answers) : 0
  const pct = done ? 100 : Math.round((step / total) * 100)
  const to = `/learn/journeys/${journey.id}`
  return (
    <article className="card card-hover flex flex-col overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden">
        <SmartImage
          src={journey.cover ? asset(journey.cover) : undefined}
          alt=""
          className="size-full object-cover"
        />
        <span className="absolute start-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-deep shadow-sm">
          {t(`list.track.${journey.track}`)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {done ? (
            <StatusBadge tone="success" icon={<CheckCircle2 className="size-3.5" aria-hidden />}>
              {t('list.status.done')}
            </StatusBadge>
          ) : run ? (
            <StatusBadge tone="info" icon={<Clock className="size-3.5" aria-hidden />}>
              {t('list.status.progress', { step: step + 1, total })}
            </StatusBadge>
          ) : (
            <StatusBadge tone="neutral" icon={<Circle className="size-3.5" aria-hidden />}>
              {t('list.status.new')}
            </StatusBadge>
          )}
          {done && run?.score !== undefined && (
            <StatusBadge tone="brand">{t('list.score', { score: run.score })}</StatusBadge>
          )}
          <span className="text-sm text-ink-soft">{t('list.steps', { count: total })}</span>
        </div>
        <h2 className="text-xl font-bold">{l(journey.title)}</h2>
        <p className="text-ink-soft">{l(journey.summary)}</p>
        <Progress value={pct} aria-label={`${pct}%`} className="mt-auto h-2" />
        <Button asChild className="self-start rounded-full">
          <Link to={to}>
            {done ? t('list.review') : run ? t('list.continue') : t('list.start')}
            <ArrowRight className="size-4 rtl-mirror" aria-hidden />
          </Link>
        </Button>
      </div>
    </article>
  )
}
