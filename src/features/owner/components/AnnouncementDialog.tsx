import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textarea'
import { formatDate, useLocalized } from '@/i18n'
import { nowMs } from '@/lib/clock'
import { scheduleAnnouncement } from '@/store/actions'
import { DAY_MS } from '../config'

/** Schedule an announcement (prefilled with the brief's example). */
export function AnnouncementDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const { t } = useTranslation('owner')
  const { lang } = useLocalized()
  const [title, setTitle] = useState(t('comms.annDefaultTitle'))
  const [body, setBody] = useState(t('comms.annDefaultBody'))
  const [date, setDate] = useState(new Date(nowMs() + 3 * DAY_MS).toISOString().slice(0, 10))
  const [error, setError] = useState('')
  const save = () => {
    if (!title.trim() || !body.trim() || !date) {
      setError(t('comms.annRequired'))
      return
    }
    const iso = `${date}T10:00:00+04:00`
    scheduleAnnouncement(title.trim(), body.trim(), iso)
    toast.success(t('comms.annScheduled', { date: formatDate(iso, lang) }), {
      description: title.trim(),
    })
    setError('')
    onOpenChange(false)
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('comms.scheduleAnnouncement')}</DialogTitle>
          <DialogDescription>{t('comms.announcementsBody')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="an-title">{t('comms.annTitle')}</Label>
            <Input id="an-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="an-body">{t('comms.annBody')}</Label>
            <Textarea
              id="an-body"
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="an-date">{t('comms.annWhen')}</Label>
            <Input
              id="an-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={save} className="rounded-full">
            {t('comms.scheduleAnnouncement')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
