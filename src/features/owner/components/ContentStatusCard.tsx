import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { useContentCounts } from '@/store/hooks'

/** Overview: content counts by status (live from the store). */
export function ContentStatusCard() {
  const { t } = useTranslation('owner')
  const c = useContentCounts()
  const rows = [
    { label: t('overview.published'), value: c.published, bar: '[&>*]:bg-success' },
    { label: t('overview.inReview'), value: c.inReview, bar: '[&>*]:bg-info' },
    { label: t('overview.draftAr'), value: c.draft, bar: '[&>*]:bg-brand-accent-600' },
    { label: t('overview.approvedWaiting'), value: c.approved, bar: '[&>*]:bg-brand-highlight' },
  ]
  const total = rows.reduce((s, r) => s + r.value, 0) || 1
  return (
    <section className="card flex h-full flex-col p-5">
      <h2 className="text-lg">{t('overview.contentTitle')}</h2>
      <p className="mt-1 text-sm text-ink-soft">{t('overview.contentBody')}</p>
      <ul className="mt-4 space-y-3">
        {rows.map((r) => (
          <li key={r.label}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-semibold">{r.label}</span>
              <span className="text-lg font-extrabold tabular-nums">{r.value}</span>
            </div>
            <Progress
              value={(r.value / total) * 100}
              aria-label={r.label}
              className={cn('mt-1 bg-tint-100', r.bar)}
            />
          </li>
        ))}
      </ul>
      <Button asChild variant="outline" size="sm" className="mt-5 self-start">
        <Link to="/admin/content">
          {t('overview.openSources')}
          <ArrowRight className="rtl-mirror" aria-hidden />
        </Link>
      </Button>
    </section>
  )
}
