import type { DemoEvent, Placement } from '@shared/types'
import { CalendarDays, CheckCircle2, Clock, Globe2, Mic, MonitorPlay } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Motif } from '@/components/brand'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { formatDate, formatTime, useLocalized } from '@/i18n'
import { cn } from '@/lib/utils'
import { cancelEventRegistration, registerForEvent } from '@/store/actions'
import { useMe } from '@/store/hooks'

interface EventCardProps {
  event: DemoEvent & { placement?: Placement }
  registered: boolean
  index: number
}

const BANDS = ['bg-grad-brand', 'bg-brand-deep', 'bg-grad-brand-v'] as const

/** Live session card (C11.4): date strip, details, sponsor label while its placement is live. */
export function EventCard({ event, registered, index }: EventCardProps) {
  const { t } = useTranslation('dalil')
  const { l, lang } = useLocalized()
  const me = useMe()
  const title = l(event.title)
  const closed = event.status !== 'open'
  const register = () => {
    registerForEvent(me.id, event.id)
    toast.success(t('events.registeredToast', { title }))
  }
  const cancel = () => {
    cancelEventRegistration(me.id, event.id)
    toast.success(t('events.cancelledToast'))
  }
  return (
    <article className="card card-hover flex flex-col overflow-hidden">
      <div
        className={cn('relative overflow-hidden px-5 py-4 text-white', BANDS[index % BANDS.length])}
      >
        <Motif variant="corner" className="text-white/25" />
        <p className="relative flex items-center gap-2 text-sm font-semibold text-white/90">
          <CalendarDays className="size-4" aria-hidden />
          {formatDate(event.start, lang, {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>
        <p className="relative mt-1 flex items-center gap-2 text-2xl font-extrabold tabular-nums">
          <Clock className="size-5" aria-hidden />
          {formatTime(event.start, lang)}
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          {registered ? (
            <StatusBadge tone="success" icon={<CheckCircle2 className="size-3.5" aria-hidden />}>
              {t('events.registered')}
            </StatusBadge>
          ) : (
            <StatusBadge tone={closed ? 'neutral' : 'info'}>
              {t(
                event.status === 'full'
                  ? 'events.full'
                  : event.status === 'past'
                    ? 'events.past'
                    : 'events.open',
              )}
            </StatusBadge>
          )}
          {event.placement && (
            <span className="rounded-full bg-sponsor-soft px-2.5 py-1 text-xs font-semibold text-sponsor-ink ring-1 ring-sponsor-ink/15">
              {l(event.placement.label)}
            </span>
          )}
        </div>
        <h2 className="text-lg leading-snug">{title}</h2>
        <dl className="space-y-1.5 text-sm text-ink-soft">
          <div className="flex items-start gap-2">
            <Mic className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
            <dt className="sr-only">{t('events.speaker')}</dt>
            <dd>{l(event.speaker)}</dd>
          </div>
          <div className="flex items-start gap-2">
            <MonitorPlay className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
            <dt className="sr-only">{t('events.format')}</dt>
            <dd>{l(event.format)}</dd>
          </div>
          <div className="flex items-start gap-2">
            <Globe2 className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
            <dt className="sr-only">{t('events.languages')}</dt>
            <dd>{l(event.languages)}</dd>
          </div>
        </dl>
        <div className="mt-auto pt-2">
          {registered ? (
            <Button variant="outline" onClick={cancel} className="w-full sm:w-auto">
              {t('events.cancel')}
            </Button>
          ) : (
            <Button
              onClick={register}
              disabled={closed}
              className="w-full rounded-full bg-brand-highlight text-ink hover:bg-brand-highlight/90 sm:w-auto"
            >
              {t('events.register')}
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
