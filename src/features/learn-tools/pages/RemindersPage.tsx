import type { Reminder } from '@shared/types'
import { Bell, BellRing, CalendarClock, Lightbulb, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { Button } from '@/components/ui/button'
import { formatDate, useLocalized } from '@/i18n'
import { useReminders } from '@/store/hooks'
import { ReminderDialog } from '../components/reminders/ReminderDialog'
import { ReminderRow } from '../components/reminders/ReminderRow'

const byDate = (a: Reminder, b: Reminder) => a.date.localeCompare(b.date)

/** Reminders (C8.1): active and suggested, set / edit / delete, channel email or in-platform. */
export function RemindersPage() {
  const { t } = useTranslation('journeys')
  const { l, lang } = useLocalized()
  const reminders = useReminders()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Reminder | undefined>()

  const { active, suggested, done } = useMemo(
    () => ({
      active: reminders.filter((r) => r.status === 'active').sort(byDate),
      suggested: reminders.filter((r) => r.status === 'suggested').sort(byDate),
      done: reminders.filter((r) => r.status === 'done').sort(byDate),
    }),
    [reminders],
  )
  const next = active[0]
  const edit = (r?: Reminder) => {
    setEditing(r)
    setOpen(true)
  }
  const list = (items: Reminder[]) => (
    <ul className="space-y-3">
      {items.map((r) => (
        <ReminderRow key={r.id} reminder={r} onEdit={() => edit(r)} />
      ))}
    </ul>
  )

  return (
    <>
      <PageHeader
        title={t('reminders.title')}
        description={t('reminders.description')}
        actions={
          <Button onClick={() => edit()} className="rounded-full">
            <Plus className="size-4" aria-hidden />
            {t('reminders.add')}
          </Button>
        }
      />
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          tone="primary"
          icon={BellRing}
          label={t('reminders.stats.active')}
          value={active.length}
          hint={t('reminders.stats.activeHint')}
        />
        <StatCard
          tone="highlight"
          icon={Lightbulb}
          label={t('reminders.stats.suggested')}
          value={suggested.length}
          hint={t('reminders.stats.suggestedHint')}
        />
        <StatCard
          tone="deep"
          icon={CalendarClock}
          label={t('reminders.stats.next')}
          value={
            <span className="text-2xl">
              {next ? formatDate(next.date, lang) : t('reminders.stats.nextNone')}
            </span>
          }
          hint={next ? l(next.title) : undefined}
        />
      </div>

      <section aria-labelledby="rem-active" className="mb-10">
        <h2 id="rem-active" className="mb-4 text-xl">
          {t('reminders.active')}
        </h2>
        {active.length ? (
          list(active)
        ) : (
          <EmptyState
            icon={Bell}
            title={t('reminders.emptyActiveTitle')}
            body={t('reminders.emptyActiveBody')}
          />
        )}
      </section>

      <section aria-labelledby="rem-sugg" className="mb-10">
        <h2 id="rem-sugg" className="text-xl">
          {t('reminders.suggested')}
        </h2>
        <p className="mt-1 mb-4 text-sm text-ink-soft">{t('reminders.suggestedBody')}</p>
        {suggested.length ? (
          list(suggested)
        ) : (
          <EmptyState
            icon={Lightbulb}
            title={t('reminders.emptySuggestedTitle')}
            body={t('reminders.emptySuggestedBody')}
          />
        )}
      </section>

      {done.length > 0 && (
        <section aria-labelledby="rem-done">
          <h2 id="rem-done" className="mb-4 text-xl">
            {t('reminders.done')}
          </h2>
          {list(done)}
        </section>
      )}

      <ReminderDialog open={open} onOpenChange={setOpen} reminder={editing} />
    </>
  )
}
