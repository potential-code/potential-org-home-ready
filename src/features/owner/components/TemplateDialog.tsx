import type { EmailTemplate } from '@shared/types'
import { useEffect, useState } from 'react'
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
import { updateTemplate } from '@/store/actions'

/** Edit a C14 template's subject and body. */
export function TemplateDialog({
  tpl,
  onClose,
}: {
  tpl: EmailTemplate | null
  onClose: () => void
}) {
  const { t } = useTranslation('owner')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    setSubject(tpl?.subject ?? '')
    setBody(tpl?.body ?? '')
    setError('')
  }, [tpl])
  const save = () => {
    if (!tpl) return
    if (!subject.trim() || !body.trim()) {
      setError(t('comms.required'))
      return
    }
    updateTemplate(tpl.id, subject.trim(), body.trim())
    toast.success(t('comms.saved'), { description: subject.trim() })
    onClose()
  }
  return (
    <Dialog open={!!tpl} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('comms.editTitle')}</DialogTitle>
          <DialogDescription>
            {tpl?.trigger} · {tpl?.channel}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="tp-subject">{t('comms.subject')}</Label>
            <Input id="tp-subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tp-body">{t('comms.body')}</Label>
            <Textarea
              id="tp-body"
              rows={6}
              value={body}
              aria-invalid={!!error}
              aria-describedby={error ? 'tp-err' : undefined}
              onChange={(e) => setBody(e.target.value)}
            />
            {error && (
              <p id="tp-err" className="text-sm text-danger">
                {error}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={save} className="rounded-full">
            {t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
