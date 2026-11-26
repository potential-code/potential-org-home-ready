import type { ContentStatus } from '@shared/types'
import { CheckCircle2, CircleDashed, Clock, PencilLine, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { STATUS_TONE } from '../config'

const ICON = {
  draft: CircleDashed,
  'in-review': Clock,
  changes: PencilLine,
  approved: ShieldCheck,
  published: CheckCircle2,
} as const

/** Content status as text plus icon. */
export function ContentStatusBadge({ status, prefix }: { status: ContentStatus; prefix?: string }) {
  const { t } = useTranslation('owner')
  const Icon = ICON[status]
  return (
    <StatusBadge tone={STATUS_TONE[status]} icon={<Icon className="size-3.5" aria-hidden />}>
      {prefix ? `${prefix} ` : ''}
      {t(`status.${status}`)}
    </StatusBadge>
  )
}
