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

interface TalkToPersonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Prefills the form with the learner's last question. */
  question: string
  onSent: () => void
}

/** "Talk to a person": sends the question to the Home Ready team (demo: toast + sent state). */
export function TalkToPersonDialog({
  open,
  onOpenChange,
  question,
  onSent,
}: TalkToPersonDialogProps) {
  const { t } = useTranslation('dalil')
  const [text, setText] = useState(question)
  const [error, setError] = useState(false)
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim().length < 3) return setError(true)
    toast.success(t('chat.person.sent'))
    onSent()
    onOpenChange(false)
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (o) {
          setText(question)
          setError(false)
        }
        onOpenChange(o)
      }}
    >
      <DialogContent>
        <form onSubmit={submit} noValidate className="space-y-4">
          <DialogHeader>
            <DialogTitle>{t('chat.person.title')}</DialogTitle>
            <DialogDescription>{t('chat.person.body')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="dalil-person-q">{t('chat.person.questionLabel')}</Label>
            <Textarea
              id="dalil-person-q"
              rows={4}
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                setError(false)
              }}
              aria-invalid={error}
              aria-describedby={error ? 'dalil-person-err' : undefined}
            />
            {error && (
              <p id="dalil-person-err" role="alert" className="text-sm font-medium text-danger">
                {t('chat.person.questionError')}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common:cancel')}
            </Button>
            <Button type="submit" className="rounded-full">
              {t('chat.person.send')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
