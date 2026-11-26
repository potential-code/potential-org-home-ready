import type { ReviewItem } from '@shared/types'
import { CheckCircle2, Clock, PencilLine } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { StatusBadge } from '@/components/shared/StatusBadge'

const MAP = {
  pending: { tone: 'info', Icon: Clock },
  approved: { tone: 'success', Icon: CheckCircle2 },
  changes: { tone: 'notice', Icon: PencilLine },
} as const

/** Review status as text plus icon. */
export function ReviewStatusBadge({ status }: { status: ReviewItem['status'] }) {
  const { t } = useTranslation('review')
  const { tone, Icon } = MAP[status]
  return (
    <StatusBadge tone={tone} icon={<Icon className="size-3.5" aria-hidden />}>
      {t(`queue.status.${status}`)}
    </StatusBadge>
  )
}
