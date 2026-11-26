import {
  BookmarkCheck,
  ClipboardCheck,
  type LucideIcon,
  PlayCircle,
  Route,
  UserPlus,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { STEPS } from '../../config'
import { Section } from '../Section'

const ICONS: Record<(typeof STEPS)[number], LucideIcon> = {
  join: UserPlus,
  pick: Route,
  watch: PlayCircle,
  decide: ClipboardCheck,
  save: BookmarkCheck,
}

/**
 * C5.6 How it works: five numbered steps on the deep band, joined by a line on wide screens.
 * Nav target "journeys" (step 4 is the scored decision journey) and the hero's "See how it works".
 */
export function StepsSection() {
  const { t } = useTranslation('public')
  return (
    <Section id="journeys" tone="deep" motif eyebrow={t('steps.eyebrow')} title={t('steps.title')}>
      <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
        {STEPS.map((key, i) => {
          const Icon = ICONS[key]
          return (
            <li
              data-reveal
              key={key}
              className="relative overflow-hidden rounded-2xl bg-white/[0.07] p-5 shadow-lg ring-1 ring-white/15"
            >
              <Icon
                className="pointer-events-none absolute -end-3 -bottom-3 size-24 text-white/[0.08]"
                aria-hidden
              />
              <p className="text-xs font-bold tracking-widest text-brand-highlight uppercase">
                {t('steps.step', { n: i + 1 })}
              </p>
              <h3 className="mt-2 flex items-center gap-2 text-lg text-white">
                <Icon className="size-5 shrink-0 text-brand-highlight" aria-hidden />
                {t(`steps.${key}.title`)}
              </h3>
              <p className="mt-1.5 text-white/80">{t(`steps.${key}.body`)}</p>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}
