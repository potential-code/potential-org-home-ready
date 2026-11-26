import type { Reminder } from '@shared/types'
import { Link } from '@tanstack/react-router'
import { BellRing, CalendarDays } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Motif } from '@/components/brand'
import { formatDate, useLocalized } from '@/i18n'

/** Reminder card on the learner Home (C8.1): the next active reminder, its date and channels. */
export function ReminderCard({ reminder }: { reminder?: Reminder }) {
  const { t } = useTranslation('learn')
  const { l, lang } = useLocalized()
  return (
    <section
      aria-labelledby="reminder-title"
      className="card relative flex h-full flex-col overflow-hidden p-6"
    >
      <Motif variant="corner" className="text-brand/15" />
      <h2 id="reminder-title" className="flex items-center gap-2 text-base">
        <BellRing className="size-5 text-brand" aria-hidden />
        {t('home.reminder.title')}
      </h2>
      {reminder ? (
        <>
          <p className="mt-3 text-lg leading-snug font-bold text-ink">{l(reminder.title)}</p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-soft">
            <CalendarDays className="size-4" aria-hidden />
            {formatDate(reminder.date, lang)} ·{' '}
            {reminder.channels
              .map((c) => t(`home.reminder.channels.${c}`))
              .join(lang === 'ar' ? '، ' : ', ')}
          </p>
        </>
      ) : (
        <p className="mt-3 text-sm text-ink-soft">{t('home.reminder.none')}</p>
      )}
      <Link
        to="/learn/reminders"
        className="relative mt-auto inline-flex min-h-11 items-center self-start pt-3 text-sm font-semibold text-brand hover:underline"
      >
        {t('home.reminder.manage')}
      </Link>
    </section>
  )
}
