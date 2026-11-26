import { Link } from '@tanstack/react-router'
import { Award } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { BadgeMedal } from '@/components/shared/BadgeMedal'
import { useLocalized } from '@/i18n'
import { useBadges } from '@/store/hooks'
import { BADGE_LOOK } from '../home-config'

/** Earned badges strip on the learner Home (C8.1); links to Achievements for the full set. */
export function BadgesStrip() {
  const { t } = useTranslation('learn')
  const { l } = useLocalized()
  const badges = useBadges()
  const earned = badges.filter((b) => b.earnedAt)
  return (
    <section aria-labelledby="badges-title" className="card flex h-full flex-col p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="badges-title" className="flex items-center gap-2 text-base">
          <Award className="size-5 text-brand" aria-hidden />
          {t('home.badges.title')}
        </h2>
        <p className="text-sm text-ink-soft">
          {t('home.badges.count', { earned: earned.length, total: badges.length })}
        </p>
      </div>
      {earned.length ? (
        <ul className="mt-4 grid grid-cols-3 gap-3">
          {earned.slice(0, 3).map((b) => (
            <li key={b.id} className="flex flex-col items-center gap-2 text-center">
              <BadgeMedal
                icon={BADGE_LOOK[b.id].icon}
                tone={BADGE_LOOK[b.id].tone}
                earned
                size={76}
              />
              <span className="text-sm leading-tight font-semibold text-ink">{l(b.title)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-ink-soft">{t('home.badges.none')}</p>
      )}
      <Link
        to="/learn/achievements"
        className="mt-auto inline-flex min-h-11 items-center self-start pt-3 text-sm font-semibold text-brand hover:underline"
      >
        {t('home.badges.all')}
      </Link>
    </section>
  )
}
