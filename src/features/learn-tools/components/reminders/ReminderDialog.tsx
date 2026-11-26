import type { Reminder, ReminderChannel } from '@shared/types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLocalized } from '@/i18n'
import { addReminder, updateReminder } from '@/store/actions'
import { useMe } from '@/store/hooks'

export const REMINDER_CHANNELS: ReminderChannel[] = ['email', 'in-platform']
type Errors = Partial<Record<'name' | 'date' | 'channels', string>>

/** Add or edit a reminder: title, date and channels (email / in-platform). */
export function ReminderDialog({
  open,
  onOpenChange,
  reminder,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  reminder?: Reminder
}) {
  const { t } = useTranslation('journeys')
  const { l } = useLocalized()
  const me = useMe()
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [channels, setChannels] = useState<ReminderChannel[]>(['email', 'in-platform'])
  const [errors, setErrors] = useState<Errors>({})

  const reset = () => {
    setName(reminder ? l(reminder.title) : '')
    setDate(reminder ? reminder.date.slice(0, 10) : '')
    setChannels(reminder ? reminder.channels : ['email', 'in-platform'])
    setErrors({})
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Errors = {}
    if (!name.trim()) next.name = t('reminders.dialog.errName')
    if (!date) next.date = t('reminders.dialog.errDate')
    if (!channels.length) next.channels = t('reminders.dialog.errChannel')
    setErrors(next)
    if (Object.keys(next).length) return
    const iso = `${date}T09:00:00+04:00`
    if (reminder) {
      const changed = name.trim() !== l(reminder.title)
      updateReminder(reminder.id, {
        date: iso,
        channels,
        ...(changed ? { title: { en: name.trim(), ar: name.trim() } } : {}),
      })
      toast.success(t('reminders.dialog.updated'))
    } else {
      addReminder(me.id, { title: { en: name.trim(), ar: name.trim() }, date: iso, channels })
      toast.success(t('reminders.dialog.added'))
    }
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (o) reset()
      }}
    >
      <DialogContent
        className="sm:max-w-md"
        onOpenAutoFocus={() => {
          reset()
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {reminder ? t('reminders.dialog.editTitle') : t('reminders.dialog.addTitle')}
          </DialogTitle>
          <DialogDescription>{t('reminders.dialog.body')}</DialogDescription>
        </DialogHeader>
        <form id="reminder-form" onSubmit={submit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="rem-name">{t('reminders.dialog.name')}</Label>
            <Input
              id="rem-name"
              value={name}
              placeholder={t('reminders.dialog.namePlaceholder')}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'rem-name-err' : undefined}
            />
            {errors.name && (
              <p id="rem-name-err" className="text-sm text-danger">
                {errors.name}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rem-date">{t('reminders.dialog.date')}</Label>
            <Input
              id="rem-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-invalid={!!errors.date}
              aria-describedby={errors.date ? 'rem-date-err' : undefined}
            />
            {errors.date && (
              <p id="rem-date-err" className="text-sm text-danger">
                {errors.date}
              </p>
            )}
          </div>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">{t('reminders.dialog.channels')}</legend>
            {REMINDER_CHANNELS.map((c) => (
              <div key={c} className="flex items-center gap-2.5">
                <Checkbox
                  id={`rem-ch-${c}`}
                  checked={channels.includes(c)}
                  onCheckedChange={(v) =>
                    setChannels((cur) => (v ? [...cur, c] : cur.filter((x) => x !== c)))
                  }
                />
                <Label htmlFor={`rem-ch-${c}`} className="font-normal">
                  {t(`reminders.channel.${c}`)}
                </Label>
              </div>
            ))}
            {errors.channels && (
              <p role="alert" className="text-sm text-danger">
                {errors.channels}
              </p>
            )}
          </fieldset>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('reminders.dialog.cancel')}
          </Button>
          <Button type="submit" form="reminder-form" className="rounded-full">
            {t('reminders.dialog.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
