import { Send } from 'lucide-react'
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { sendNudge } from '@/store/actions'

/** Targeted message to one learner (logged as a one-person nudge). */
export function MessageDialog({
  name,
  open,
  onOpenChange,
}: {
  name: string
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const { t } = useTranslation('owner')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const send = () => {
    if (!body.trim()) {
      setError(t('learners.message.required'))
      return
    }
    sendNudge(name, 1, 'direct-message')
    toast.success(t('learners.message.sent', { name }))
    setBody('')
    setError('')
    onOpenChange(false)
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('learners.message.title', { name })}</DialogTitle>
          <DialogDescription>{t('learners.message.description')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label htmlFor="msg-body">{t('learners.nudge.body')}</Label>
          <Textarea
            id="msg-body"
            rows={4}
            value={body}
            aria-invalid={!!error}
            aria-describedby={error ? 'msg-err' : undefined}
            onChange={(e) => setBody(e.target.value)}
          />
          {error && (
            <p id="msg-err" className="text-sm text-danger">
              {error}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={send} className="rounded-full">
            <Send aria-hidden />
            {t('learners.message.send')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
