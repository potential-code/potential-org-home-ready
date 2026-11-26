import { CheckCircle2, Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { BadgeMedal } from '@/components/shared/BadgeMedal'
import { formatDate, useLocalized } from '@/i18n'
import { useBadges } from '@/store/hooks'
import { BADGE_LOOK } from '../../home-config'

/** All eight badges (C11.5): earned medals with the date, locked ones with their criteria. */
export function BadgeGrid() {
  const { t } = useTranslation('learn')
  const { l, lang } = useLocalized()
  const badges = useBadges()
  return (
    <section aria-labelledby="all-badges" className="card p-5 sm:p-6">
      <h2 id="all-badges" className="text-lg">
        {t('ach.badges.title')}
      </h2>
      <ul className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {badges.map((b) => (
          <li
            key={b.id}
            className={`flex flex-col items-center gap-2 rounded-2xl border p-3 text-center sm:p-4 ${b.earnedAt ? 'border-brand/25 bg-tint-50' : 'border-border/70 bg-white'}`}
          >
            <BadgeMedal
              icon={BADGE_LOOK[b.id].icon}
              tone={BADGE_LOOK[b.id].tone}
              earned={!!b.earnedAt}
              size={72}
            />
            <p className="font-bold text-ink">{l(b.title)}</p>
            <p className="text-xs text-ink-soft sm:text-sm">{l(b.criteria)}</p>
            <p
              className={`mt-auto flex items-center gap-1.5 text-xs font-semibold ${b.earnedAt ? 'text-success' : 'text-ink-soft'}`}
            >
              {b.earnedAt ? (
                <CheckCircle2 className="size-3.5" aria-hidden />
              ) : (
                <Lock className="size-3.5" aria-hidden />
              )}
              {b.earnedAt
                ? t('ach.badges.earnedOn', { date: formatDate(b.earnedAt, lang) })
                : t('ach.badges.locked')}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
