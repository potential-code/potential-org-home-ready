import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/shared/EmptyState'
import { POINTS } from '@/domain/gamification'
import { formatDate, useLocalized } from '@/i18n'
import { useActivity } from '@/store/hooks'

/** Recent points (C11.5): what earned them, newest first. Row cards, not a leaderboard. */
export function PointsLedger() {
  const { t } = useTranslation('learn')
  const { l, lang } = useLocalized()
  const rows = [...useActivity()].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 8)
  return (
    <section aria-labelledby="points-title" className="card p-5 sm:p-6">
      <h2 id="points-title" className="flex items-center gap-2 text-lg">
        <Star className="size-5 text-brand" aria-hidden /> {t('ach.points.title')}
      </h2>
      {rows.length ? (
        <ul className="mt-3 divide-y divide-border/70">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 py-3">
              <span className="min-w-0 text-ink">
                {l(r.label)}
                <span className="block text-xs text-ink-soft">{formatDate(r.at, lang)}</span>
              </span>
              <span className="shrink-0 font-bold text-brand">+{POINTS[r.action]}</span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={Star}
          title={t('ach.points.emptyTitle')}
          body={t('ach.points.emptyBody')}
          className="mt-3"
        />
      )}
    </section>
  )
}
