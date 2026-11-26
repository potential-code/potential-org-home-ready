import type { ReviewItem } from '@shared/types'
import { Link } from '@tanstack/react-router'
import { ArrowRight, CalendarClock, Languages, ListChecks } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { formatDate, useLocalized } from '@/i18n'
import { ReviewStatusBadge } from './ReviewStatusBadge'

/** One queue item: title, languages, claims, submitted and due dates, Open item. */
export function ReviewCard({ r }: { r: ReviewItem }) {
  const { t } = useTranslation('review')
  const { lang } = useLocalized()
  return (
    <article className="card card-hover flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1 space-y-2">
        <ReviewStatusBadge status={r.status} />
        <h2 className="text-lg">{r.title}</h2>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-soft">
          <li className="flex items-center gap-1.5">
            <Languages className="size-4 text-brand" aria-hidden />
            {t('queue.languages', { langs: r.languages.map((l) => l.toUpperCase()).join(', ') })}
          </li>
          <li className="flex items-center gap-1.5">
            <ListChecks className="size-4 text-brand" aria-hidden />
            {t('queue.claims', { count: r.claims.length })}
          </li>
          <li>{t('queue.submitted', { date: formatDate(r.submittedAt, lang) })}</li>
          <li className="flex items-center gap-1.5 font-semibold text-ink">
            <CalendarClock className="size-4 text-brand" aria-hidden />
            {t('queue.due', { date: formatDate(r.dueAt, lang) })}
          </li>
        </ul>
      </div>
      <Button
        asChild
        variant={r.status === 'pending' ? 'default' : 'outline'}
        className="self-start rounded-full sm:self-center"
      >
        <Link to="/review/item/$itemId" params={{ itemId: r.id }}>
          {t('queue.open')}
          <ArrowRight className="rtl-mirror" aria-hidden />
        </Link>
      </Button>
    </article>
  )
}
