import type { Reminder, ReminderChannel } from '@shared/types'
import { BellPlus, CalendarDays, CheckCircle2, Pencil, Trash2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { StatusBadge } from '@/components/shared/StatusBadge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { formatDate, useLocalized } from '@/i18n'
import { cn } from '@/lib/utils'
import { acceptSuggestedReminder, deleteReminder, setReminderChannels } from '@/store/actions'
import { REMINDER_CHANNELS } from './ReminderDialog'

const TONE = { active: 'success', suggested: 'info', done: 'neutral' } as const

/** One reminder: date, channels (toggle in place), edit, delete, or accept when suggested. */
export function ReminderRow({ reminder, onEdit }: { reminder: Reminder; onEdit: () => void }) {
  const { t } = useTranslation('journeys')
  const { l, lang } = useLocalized()
  const title = l(reminder.title)
  const active = reminder.status === 'active'

  const toggle = (c: ReminderChannel) => {
    const on = reminder.channels.includes(c)
    if (on && reminder.channels.length === 1) return toast.error(t('reminders.needChannel'))
    setReminderChannels(
      reminder.id,
      on ? reminder.channels.filter((x) => x !== c) : [...reminder.channels, c],
    )
    toast.success(t('reminders.channelsSaved'))
  }

  return (
    <li className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone={TONE[reminder.status]}>
            {t(`reminders.status.${reminder.status}`)}
          </StatusBadge>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-deep">
            <CalendarDays className="size-4 text-brand" aria-hidden />
            {t('reminders.on', { date: formatDate(reminder.date, lang) })}
          </span>
        </div>
        <h3 className="leading-snug font-bold">{title}</h3>
        {reminder.note && <p className="text-sm text-ink-soft">{l(reminder.note)}</p>}
      </div>

      {active && (
        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">{t('reminders.channels')}</legend>
          {REMINDER_CHANNELS.map((c) => {
            const on = reminder.channels.includes(c)
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                aria-label={t('reminders.channelToggle', {
                  channel: t(`reminders.channel.${c}`),
                  title,
                })}
                onClick={() => toggle(c)}
                className={cn(
                  'inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition-colors focus-visible:ring-4 focus-visible:ring-brand-highlight/70 focus-visible:outline-none',
                  on
                    ? 'border-brand bg-brand text-white'
                    : 'border-border bg-white text-ink-soft hover:border-brand/50',
                )}
              >
                {on && <CheckCircle2 className="size-4" aria-hidden />}
                {t(`reminders.channel.${c}`)}
              </button>
            )
          })}
        </fieldset>
      )}

      <div className="flex flex-wrap gap-2">
        {reminder.status === 'suggested' && (
          <Button
            size="sm"
            className="rounded-full"
            aria-label={t('reminders.acceptNamed', { title })}
            onClick={() => {
              acceptSuggestedReminder(reminder.id)
              toast.success(t('reminders.accepted'))
            }}
          >
            <BellPlus className="size-4" aria-hidden />
            {t('reminders.accept')}
          </Button>
        )}
        {reminder.status !== 'done' && (
          <Button
            size="sm"
            variant="outline"
            aria-label={t('reminders.editNamed', { title })}
            onClick={onEdit}
          >
            <Pencil className="size-4" aria-hidden />
            {t('reminders.edit')}
          </Button>
        )}
        {reminder.status === 'suggested' ? (
          <Button
            size="sm"
            variant="ghost"
            aria-label={t('reminders.dismissNamed', { title })}
            onClick={() => {
              deleteReminder(reminder.id)
              toast.success(t('reminders.dismissed'))
            }}
          >
            <X className="size-4" aria-hidden />
            {t('reminders.dismiss')}
          </Button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="text-danger hover:text-danger"
                aria-label={t('reminders.deleteNamed', { title })}
              >
                <Trash2 className="size-4" aria-hidden />
                {t('reminders.delete')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('reminders.deleteTitle')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('reminders.deleteBody', { title })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('reminders.dialog.cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => {
                    deleteReminder(reminder.id)
                    toast.success(t('reminders.deleted'))
                  }}
                >
                  {t('reminders.deleteConfirm')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </li>
  )
}
