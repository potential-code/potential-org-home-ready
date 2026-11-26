import type { Localized, ReminderChannel } from '@shared/types'
import { type FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
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

export interface ReminderInput {
  title: Localized
  date: string
  channels: ReminderChannel[]
}

const CHANNELS: { id: ReminderChannel; key: string }[] = [
  { id: 'email', key: 'reminder.email' },
  { id: 'in-platform', key: 'reminder.inPlatform' },
]

/** Set a reminder for a journey's next action (title, date, channels). */
export function ReminderDialog({
  open,
  onOpenChange,
  defaultTitle,
  defaultDate,
  onSave,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  defaultTitle: Localized
  defaultDate: string
  onSave: (r: ReminderInput) => void
}) {
  const { t } = useTranslation('journeys')
  const { l } = useLocalized()
  const [title, setTitle] = useState(l(defaultTitle))
  const [date, setDate] = useState(defaultDate)
  const [channels, setChannels] = useState<ReminderChannel[]>(['email', 'in-platform'])
  const [error, setError] = useState('')
  const toggle = (c: ReminderChannel) =>
    setChannels((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]))
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!date) return setError(t('reminder.dateError'))
    if (!channels.length) return setError(t('reminder.channelError'))
    const same = title.trim() === l(defaultTitle)
    onSave({
      title: same ? defaultTitle : { en: title.trim(), ar: title.trim() },
      date,
      channels,
    })
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={submit} noValidate className="space-y-4">
          <DialogHeader>
            <DialogTitle>{t('reminder.title')}</DialogTitle>
            <DialogDescription>{t('reminder.body')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="jr-title">{t('reminder.what')}</Label>
            <Input id="jr-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="jr-date">{t('reminder.date')}</Label>
            <Input
              id="jr-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">{t('reminder.channels')}</legend>
            {CHANNELS.map((c) => (
              <div key={c.id} className="flex items-center gap-2">
                <Checkbox
                  id={`jr-${c.id}`}
                  checked={channels.includes(c.id)}
                  onCheckedChange={() => toggle(c.id)}
                />
                <Label htmlFor={`jr-${c.id}`} className="font-normal">
                  {t(c.key)}
                </Label>
              </div>
            ))}
          </fieldset>
          {error && (
            <p role="alert" className="text-sm font-medium text-danger">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              {t('reminder.cancel')}
            </Button>
            <Button type="submit" className="rounded-full">
              {t('reminder.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
