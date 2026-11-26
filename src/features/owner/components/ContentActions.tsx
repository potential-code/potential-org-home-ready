import type { ContentItem } from '@shared/types'
import { Pencil, Rocket, Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { publishContent, submitForReview } from '@/store/actions'

/** Row actions: Edit, Submit for review (draft or changes), Publish (approved only). */
export function ContentActions({
  item,
  title,
  onEdit,
}: {
  item: ContentItem
  title: string
  onEdit: () => void
}) {
  const { t } = useTranslation('owner')
  const canSubmit = item.status === 'draft' || item.status === 'changes'
  const canPublish = item.status === 'approved'
  return (
    <div className="flex flex-wrap gap-1.5">
      <Button variant="ghost" size="sm" onClick={onEdit}>
        <Pencil aria-hidden />
        {t('content.edit')}
      </Button>
      {canSubmit && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            submitForReview(item.id)
            toast.success(t('content.submitted', { title }))
          }}
        >
          <Send aria-hidden />
          {t('content.submit')}
        </Button>
      )}
      {canPublish && (
        <Button
          size="sm"
          onClick={() => {
            if (publishContent(item.id)) toast.success(t('content.published', { title }))
            else toast.error(t('content.publishBlocked'))
          }}
        >
          <Rocket aria-hidden />
          {t('content.publish')}
        </Button>
      )}
    </div>
  )
}
