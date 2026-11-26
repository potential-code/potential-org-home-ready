import { CalendarClock, Megaphone, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { formatDate, formatTime, useLocalized } from '@/i18n'
import { useAnnouncements } from '@/store/hooks'
import { AnnouncementDialog } from './AnnouncementDialog'

/** Announcements list with Schedule action. */
export function AnnouncementsCard() {
  const { t } = useTranslation('owner')
  const { lang } = useLocalized()
  const items = useAnnouncements()
  const [open, setOpen] = useState(false)
  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg">
            <Megaphone className="size-5 text-brand" aria-hidden />
            {t('comms.announcements')}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">{t('comms.announcementsBody')}</p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)} className="rounded-full">
          <Plus aria-hidden />
          {t('comms.scheduleAnnouncement')}
        </Button>
      </div>
      {items.length ? (
        <ul className="mt-4 space-y-3">
          {items.map((a) => (
            <li key={a.id} className="rounded-xl bg-tint-50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{a.title}</p>
                <StatusBadge tone={a.status === 'sent' ? 'success' : 'info'}>
                  {t(`status.${a.status}`)}
                </StatusBadge>
              </div>
              <p className="mt-1 text-sm text-ink-soft">{a.body}</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-brand-deep">
                <CalendarClock className="size-3.5" aria-hidden />
                {t('comms.sendOn', {
                  date: formatDate(a.scheduledFor, lang),
                  time: formatTime(a.scheduledFor, lang),
                })}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          className="mt-4"
          icon={Megaphone}
          title={t('comms.noAnnouncements')}
          body={t('comms.noAnnouncementsBody')}
        />
      )}
      <AnnouncementDialog open={open} onOpenChange={setOpen} />
    </section>
  )
}
