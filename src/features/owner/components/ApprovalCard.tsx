import type { Approval } from '@shared/types'
import { CheckCircle2, PencilLine, Rocket, Undo2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { formatDate, formatTime, useLocalized } from '@/i18n'
import { publishContent, returnToAuthor } from '@/store/actions'
import { useActorName } from '../hooks/use-actor-name'

/** One item returned by the reviewer, with Publish / Return to author. */
export function ApprovalCard({ a }: { a: Approval }) {
  const { t } = useTranslation('owner')
  const { l, lang } = useLocalized()
  const approved = a.outcome === 'approved'
  const actorName = useActorName()
  return (
    <article className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          {a.published ? (
            <StatusBadge tone="success" icon={<CheckCircle2 className="size-3.5" aria-hidden />}>
              {t('approvals.publishedTag')}
            </StatusBadge>
          ) : approved ? (
            <StatusBadge tone="brand" icon={<CheckCircle2 className="size-3.5" aria-hidden />}>
              {t('status.approved')}
            </StatusBadge>
          ) : (
            <StatusBadge tone="notice" icon={<PencilLine className="size-3.5" aria-hidden />}>
              {t('status.changes')}
            </StatusBadge>
          )}
        </div>
        <h3 className="text-base">{l(a.title)}</h3>
        <p className="text-sm text-ink">{l(a.note)}</p>
        <p className="text-xs text-ink-soft">
          {t('approvals.reviewer', {
            name: actorName(a.reviewer),
            date: `${formatDate(a.at, lang)}, ${formatTime(a.at, lang)}`,
          })}
        </p>
      </div>
      {!a.published && (
        <div className="flex flex-wrap gap-2">
          {approved && (
            <Button
              className="rounded-full"
              onClick={() => {
                if (publishContent(a.contentId))
                  toast.success(t('approvals.published', { title: l(a.title) }))
              }}
            >
              <Rocket aria-hidden />
              {t('approvals.publish')}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => {
              returnToAuthor(a.id)
              toast.success(t('approvals.returned', { title: l(a.title) }))
            }}
          >
            <Undo2 className="rtl-mirror" aria-hidden />
            {t('approvals.return')}
          </Button>
        </div>
      )}
    </article>
  )
}
