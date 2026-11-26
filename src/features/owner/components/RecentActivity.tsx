import { Link } from '@tanstack/react-router'
import { History } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatDate, formatTime, useLocalized } from '@/i18n'
import { useAudit } from '@/store/hooks'
import { useActorName } from '../hooks/use-actor-name'

/** Overview: last five audit events. */
export function RecentActivity() {
  const { t } = useTranslation('owner')
  const { l, lang } = useLocalized()
  const audit = useAudit().slice(0, 5)
  const actorName = useActorName()
  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg">
          <History className="size-5 text-brand" aria-hidden />
          {t('overview.activityTitle')}
        </h2>
        <Link to="/admin/settings" className="text-sm font-semibold text-brand hover:underline">
          {t('overview.allActivity')}
        </Link>
      </div>
      <p className="mt-1 text-sm text-ink-soft">{t('overview.activityBody')}</p>
      <ul className="mt-3 divide-y divide-border/70">
        {audit.map((a) => (
          <li
            key={a.id}
            className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:gap-3"
          >
            <span className="shrink-0 text-xs text-ink-soft tabular-nums sm:w-32">
              {formatDate(a.at, lang, { day: 'numeric', month: 'short' })}, {formatTime(a.at, lang)}
            </span>
            <span className="min-w-0 text-sm">
              <span className="font-semibold">{actorName(a.actor)}</span>{' '}
              {lang === 'en' ? a.action.en.toLowerCase() : l(a.action)}:{' '}
              <span className="text-ink-soft">{l(a.target)}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
