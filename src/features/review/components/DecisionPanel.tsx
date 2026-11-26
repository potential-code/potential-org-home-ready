import type { ReviewItem } from '@shared/types'
import { CheckCircle2, PencilLine } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatDate, useLocalized } from '@/i18n'
import { approveReview, requestChanges } from '@/store/actions'
import { ReviewStatusBadge } from './ReviewStatusBadge'

/** Comment box with Approve / Request changes; shows the decision once made. */
export function DecisionPanel({ r }: { r: ReviewItem }) {
  const { t } = useTranslation('review')
  const { l, lang } = useLocalized()
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  if (r.status !== 'pending') {
    return (
      <section className="card space-y-2 p-5">
        <h2 className="text-lg">{t('item.decision')}</h2>
        <ReviewStatusBadge status={r.status} />
        {r.decidedAt && (
          <p className="text-sm text-ink-soft">
            {t('item.decidedOn', {
              status: t(`queue.status.${r.status}`),
              date: formatDate(r.decidedAt, lang),
            })}
          </p>
        )}
        {r.comment && <p className="rounded-xl bg-tint-50 p-3 text-sm">{r.comment}</p>}
      </section>
    )
  }
  const approve = () => {
    approveReview(r.id, comment.trim())
    toast.success(t('item.approved', { title: l(r.title) }), {
      description: t('item.approvedBody'),
    })
  }
  const changes = () => {
    if (!comment.trim()) {
      setError(t('item.commentRequired'))
      return
    }
    requestChanges(r.id, comment.trim())
    toast.success(t('item.changesSent', { title: l(r.title) }))
  }
  return (
    <section className="card space-y-3 p-5">
      <h2 className="text-lg">{t('item.decision')}</h2>
      <div className="space-y-1.5">
        <Label htmlFor="rv-comment">{t('item.comment')}</Label>
        <Textarea
          id="rv-comment"
          rows={4}
          value={comment}
          aria-invalid={!!error}
          aria-describedby="rv-hint"
          onChange={(e) => {
            setComment(e.target.value)
            setError('')
          }}
        />
        <p id="rv-hint" className={error ? 'text-sm text-danger' : 'text-xs text-ink-soft'}>
          {error || t('item.commentHint')}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={approve} className="rounded-full">
          <CheckCircle2 aria-hidden />
          {t('item.approve')}
        </Button>
        <Button variant="outline" onClick={changes}>
          <PencilLine aria-hidden />
          {t('item.requestChanges')}
        </Button>
      </div>
    </section>
  )
}
