import { useParams } from '@tanstack/react-router'
import { CalendarClock, FileQuestion, ListChecks } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { formatDate, useLocalized } from '@/i18n'
import { useReview } from '@/store/hooks'
import { ClaimRow } from '../components/ClaimRow'
import { DecisionPanel } from '../components/DecisionPanel'
import { ReviewStatusBadge } from '../components/ReviewStatusBadge'

/** Khalid's review item (C8.3): EN | AR side by side, claims, comment, decision. */
export function ReviewItemPage() {
  const { t } = useTranslation('review')
  const { lang } = useLocalized()
  const { itemId } = useParams({ from: '/review/item/$itemId' })
  const r = useReview(itemId)
  const crumbs = [{ label: t('item.back'), to: '/review/queue' }]
  if (!r) {
    return (
      <div>
        <PageHeader title={t('pages.item')} crumbs={[...crumbs, { label: t('pages.item') }]} />
        <EmptyState icon={FileQuestion} title={t('item.notFound')} body={t('item.notFoundBody')} />
      </div>
    )
  }
  return (
    <div className="space-y-5">
      <PageHeader
        title={r.title}
        crumbs={[...crumbs, { label: r.title }]}
        eyebrow={<ReviewStatusBadge status={r.status} />}
        description={
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span>{t('item.submitted', { date: formatDate(r.submittedAt, lang) })}</span>
            <span className="flex items-center gap-1 font-semibold text-ink">
              <CalendarClock className="size-4 text-brand" aria-hidden />
              {t('item.due', { date: formatDate(r.dueAt, lang) })}
            </span>
          </span>
        }
      />
      <div className="grid gap-5 md:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-sm font-bold text-ink-soft">{t('item.english')}</h2>
          <p className="mt-2 leading-relaxed">{r.enText}</p>
        </section>
        <section className="card p-5" lang="ar" dir="rtl">
          <h2 className="text-sm font-bold text-ink-soft">{t('item.arabic')}</h2>
          {r.arText ? (
            <p className="mt-2 leading-loose">{r.arText}</p>
          ) : (
            <p className="mt-2 text-sm text-ink-soft" dir="ltr" lang="en">
              {t('item.noArabic')}
            </p>
          )}
        </section>
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
        <section className="card p-5">
          <h2 className="flex items-center gap-2 text-lg">
            <ListChecks className="size-5 text-brand" aria-hidden />
            {t('item.claims')}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">{t('item.claimsBody')}</p>
          <ul className="divide-y divide-border/70">
            {r.claims.map((c) => (
              <ClaimRow key={c.id} reviewId={r.id} claim={c} readOnly={r.status !== 'pending'} />
            ))}
          </ul>
        </section>
        <DecisionPanel r={r} />
      </div>
    </div>
  )
}
