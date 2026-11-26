import { CheckCircle2, Inbox, PencilLine, Rocket } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Stagger, StaggerItem } from '@/components/motion'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { useApprovals } from '@/store/hooks'
import { ApprovalCard } from '../components/ApprovalCard'

/** Maya's Approvals (C8.2): live from the reviewer's decisions. */
export function ApprovalsPage() {
  const { t } = useTranslation('owner')
  const approvals = useApprovals()
  const waiting = approvals.filter((a) => a.outcome === 'approved' && !a.published)
  const changes = approvals.filter((a) => a.outcome === 'changes')
  const done = approvals.filter((a) => a.published)
  const ordered = [...waiting, ...changes, ...done]
  return (
    <div className="space-y-5">
      <PageHeader title={t('pages.approvals')} description={t('approvals.description')} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          tone="primary"
          icon={Rocket}
          label={t('approvals.waiting')}
          value={waiting.length}
        />
        <StatCard
          tone="highlight"
          icon={PencilLine}
          label={t('approvals.changes')}
          value={changes.length}
        />
        <StatCard tone="deep" icon={CheckCircle2} label={t('approvals.done')} value={done.length} />
      </div>
      {ordered.length ? (
        <Stagger className="space-y-3">
          {ordered.map((a) => (
            <StaggerItem key={a.id}>
              <ApprovalCard a={a} />
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <EmptyState icon={Inbox} title={t('approvals.empty')} body={t('approvals.emptyBody')} />
      )}
    </div>
  )
}
