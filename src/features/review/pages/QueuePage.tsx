import { CalendarClock, CheckCircle2, Inbox } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Stagger, StaggerItem } from '@/components/motion'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatCard } from '@/components/shared/StatCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate, useLocalized } from '@/i18n'
import { useReviews } from '@/store/hooks'
import { ReviewBanner } from '../components/ReviewBanner'
import { ReviewCard } from '../components/ReviewCard'

/** Khalid's review queue (C8.3). */
export function QueuePage() {
  const { t } = useTranslation('review')
  const { lang } = useLocalized()
  const reviews = useReviews()
  const { pending, decided, next } = useMemo(() => {
    const p = reviews
      .filter((r) => r.status === 'pending')
      .sort((a, b) => a.dueAt.localeCompare(b.dueAt))
    return {
      pending: p,
      decided: reviews.filter((r) => r.status !== 'pending'),
      next: p[0],
    }
  }, [reviews])
  const list = (items: typeof reviews, empty: { title: string; body: string }) =>
    items.length ? (
      <Stagger className="space-y-3">
        {items.map((r) => (
          <StaggerItem key={r.id}>
            <ReviewCard r={r} />
          </StaggerItem>
        ))}
      </Stagger>
    ) : (
      <EmptyState icon={Inbox} title={empty.title} body={empty.body} />
    )
  return (
    <div>
      <ReviewBanner
        eyebrow={t('queue.eyebrow')}
        title={t('queue.greeting')}
        body={t('queue.intro')}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          tone="primary"
          icon={Inbox}
          label={t('queue.pending')}
          value={pending.length}
          hint={t('queue.pendingHint')}
        />
        <StatCard
          tone="highlight"
          icon={CalendarClock}
          label={t('queue.dueSoon')}
          value={next ? formatDate(next.dueAt, lang, { day: 'numeric', month: 'short' }) : '0'}
          hint={next?.title ?? t('queue.dueSoonHint')}
        />
        <StatCard
          tone="deep"
          icon={CheckCircle2}
          label={t('queue.decided')}
          value={decided.length}
          hint={t('queue.decidedHint')}
        />
      </div>
      <Tabs defaultValue="pending" className="mt-6">
        <TabsList>
          <TabsTrigger value="pending">
            {t('queue.tabPending')} ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="decided">
            {t('queue.tabDecided')} ({decided.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-4">
          {list(pending, { title: t('queue.empty'), body: t('queue.emptyBody') })}
        </TabsContent>
        <TabsContent value="decided" className="mt-4">
          {list(decided, { title: t('queue.emptyDecided'), body: t('queue.emptyDecidedBody') })}
        </TabsContent>
      </Tabs>
    </div>
  )
}
