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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatNumber, useLocalized } from '@/i18n'
import { sendNudge } from '@/store/actions'
import { useTemplates } from '@/store/hooks'

/** Send the C14 "no useful action after 7 days" nudge to the saved-filter audience. */
export function NudgeDialog({
  open,
  onOpenChange,
  audience,
  count,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  audience: string
  count: number
}) {
  const { t, i18n } = useTranslation('owner')
  const { l, lang } = useLocalized()
  const tpl = useTemplates().find((x) => x.id === 'ET-nudge')
  const [subject, setSubject] = useState(l(tpl?.subject))
  const [body, setBody] = useState(l(tpl?.body))
  const n = formatNumber(count, lang)

  const send = () => {
    sendNudge(
      {
        en: i18n.getFixedT('en', 'owner')('learners.savedFilter'),
        ar: i18n.getFixedT('ar', 'owner')('learners.savedFilter'),
      },
      count,
      'ET-nudge',
    )
    toast.success(t('learners.nudge.sent', { count: n }), {
      description: t('learners.nudge.sentBody'),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('learners.nudge.title')}</DialogTitle>
          <DialogDescription>{t('learners.nudge.description')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-xl bg-tint-50 p-3 text-sm">
            <span className="font-semibold">{t('learners.nudge.audience')}: </span>
            {t('learners.nudge.audienceValue', { label: audience, count: n })}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nd-subject">{t('learners.nudge.subject')}</Label>
            <Input id="nd-subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nd-body">{t('learners.nudge.body')}</Label>
            <Textarea
              id="nd-body"
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={send}
            disabled={!subject.trim() || !body.trim()}
            className="rounded-full"
          >
            <Send aria-hidden />
            {t('learners.nudge.send', { count: n })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
