import type { Journey } from '@shared/types'
import { UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Motif } from '@/components/brand'
import { useLocalized } from '@/i18n'

/** Scenario profile (fictional): shown beside every step and on the intro. */
export function ProfilePanel({ journey }: { journey: Journey }) {
  const { t } = useTranslation('journeys')
  const { l } = useLocalized()
  return (
    <aside className="relative overflow-hidden rounded-2xl bg-brand-deep p-5 text-white shadow-md">
      <Motif variant="corner" className="text-white/20" />
      <h2 className="flex items-center gap-2 text-base font-bold text-white">
        <UserRound className="size-5" aria-hidden />
        {t('player.profile')}
      </h2>
      <ul className="relative mt-3 space-y-2 text-sm text-white/90">
        {journey.profile.map((p) => (
          <li key={p.en} className="flex gap-2">
            <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-highlight" />
            {l(p)}
          </li>
        ))}
      </ul>
      <p className="relative mt-4 text-xs text-white/80">{l(journey.resultNote)}</p>
    </aside>
  )
}
