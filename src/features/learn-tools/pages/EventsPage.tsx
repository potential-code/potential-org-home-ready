import { CalendarCheck, CalendarDays } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { useEventRegistrations, useEvents } from '@/store/hooks'
import { EventCard } from '../components/events/EventCard'

/** Events (brief C11.4): live sessions with register / cancel. */
export function EventsPage() {
  const { t } = useTranslation('dalil')
  const events = useEvents()
  const regs = useEventRegistrations()
  const isReg = (id: string) => regs.some((r) => r.eventId === id)
  const upcoming = events.filter((e) => e.status !== 'past')
  return (
    <>
      <PageHeader title={t('events.title')} description={t('events.description')} />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:max-w-2xl">
        <StatCard
          tone="primary"
          icon={CalendarDays}
          label={t('events.upcoming')}
          value={upcoming.length}
          hint={t('events.upcomingHint')}
        />
        <StatCard
          tone="accent"
          icon={CalendarCheck}
          label={t('events.registeredCount')}
          value={events.filter((e) => isReg(e.id)).length}
          hint={t('events.registeredHint')}
        />
      </div>
      {events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title={t('events.emptyTitle')}
          body={t('events.emptyBody')}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {events.map((e, i) => (
            <EventCard key={e.id} event={e} index={i} registered={isReg(e.id)} />
          ))}
        </div>
      )}
    </>
  )
}
