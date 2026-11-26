import type { Journey, JourneyRun } from '@shared/types'
import { Link } from '@tanstack/react-router'
import { Bell, BookmarkCheck, Check, ListChecks } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { formatDate, useLocalized } from '@/i18n'
import {
  addReminder,
  linkJourneyReminder,
  saveJourneyChecklist,
  saveNextAction,
} from '@/store/actions'
import { useReminders } from '@/store/hooks'
import { REMINDER_DATE } from './config'
import { ReminderDialog, type ReminderInput } from './ReminderDialog'

/** Next action card with Save next action, Save checklist and Set reminder. */
export function ResultActions({ journey, run }: { journey: Journey; run: JourneyRun }) {
  const { t } = useTranslation('journeys')
  const { l, lang } = useLocalized()
  const [open, setOpen] = useState(false)
  const reminder = useReminders().find((r) => r.id === run.reminderId)
  const saveNext = () => {
    saveNextAction(run.id)
    toast.success(t('result.nextSaved'))
  }
  const saveList = () => {
    saveJourneyChecklist(run.id)
    toast.success(t('result.checklistSaved'))
  }
  const setReminder = (r: ReminderInput) => {
    const id = addReminder(run.learnerId, r)
    linkJourneyReminder(run.id, id)
    setOpen(false)
    toast.success(t('result.reminderSet', { date: formatDate(r.date, lang) }))
  }
  return (
    <section className="card p-5 sm:p-6" aria-labelledby="next-title">
      <h2 id="next-title" className="text-lg font-bold">
        {t('result.nextAction')}
      </h2>
      <p className="mt-2 text-lg font-semibold text-brand-deep">
        {l(run.nextAction ?? journey.nextAction)}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant={run.nextAction ? 'secondary' : 'default'}
          className="rounded-full"
          onClick={saveNext}
          disabled={!!run.nextAction}
        >
          {run.nextAction ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <BookmarkCheck className="size-4" aria-hidden />
          )}
          {run.nextAction ? t('result.saved') : t('result.saveNext')}
        </Button>
        {run.savedChecklistId ? (
          <Button asChild variant="outline" className="rounded-full">
            <Link
              to="/learn/checklists/$checklistId"
              params={{ checklistId: run.savedChecklistId }}
            >
              <ListChecks className="size-4" aria-hidden />
              {t('result.openChecklist')}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" className="rounded-full" onClick={saveList}>
            <ListChecks className="size-4" aria-hidden />
            {t('result.saveChecklist')}
          </Button>
        )}
        <Button variant="outline" className="rounded-full" onClick={() => setOpen(true)}>
          <Bell className="size-4" aria-hidden />
          {reminder
            ? t('result.editReminder', { date: formatDate(reminder.date, lang) })
            : t('result.setReminder')}
        </Button>
      </div>
      {open && (
        <ReminderDialog
          open={open}
          onOpenChange={setOpen}
          defaultTitle={run.nextAction ?? journey.nextAction}
          defaultDate={reminder?.date.slice(0, 10) ?? REMINDER_DATE[journey.id]}
          onSave={setReminder}
        />
      )}
    </section>
  )
}
