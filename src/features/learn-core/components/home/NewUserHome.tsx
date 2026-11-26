import { Link } from '@tanstack/react-router'
import { ArrowRight, Compass, Footprints, Home, KeyRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Motif } from '@/components/brand'
import { Stagger, StaggerItem } from '@/components/motion'
import { Button } from '@/components/ui/button'

const JOURNEYS = [
  { key: 'renew', to: '/learn/journeys/renew-or-move', icon: KeyRound },
  { key: 'buy', to: '/learn/journeys/rent-or-buy', icon: Home },
] as const

/** New-user Home (C8.1 empty state): "Start your first step" with the two decision journeys. */
export function NewUserHome() {
  const { t } = useTranslation('learn')
  return (
    <Stagger className="grid gap-5">
      <StaggerItem>
        <section
          aria-labelledby="first-step-title"
          className="relative overflow-hidden rounded-3xl bg-grad-brand p-6 text-white shadow-lg sm:p-10"
        >
          <Motif variant="banner" className="text-white/[0.12]" />
          <p className="relative flex items-center gap-2 text-sm font-semibold text-white/85">
            <Footprints className="size-4" aria-hidden /> {t('home.empty.eyebrow')}
          </p>
          <h2 id="first-step-title" className="relative mt-2 text-2xl text-white sm:text-3xl">
            {t('home.empty.title')}
          </h2>
          <p className="relative mt-2 max-w-xl text-white/85">{t('home.empty.body')}</p>
          <div className="relative mt-6 flex flex-wrap gap-3">
            {JOURNEYS.map((j, i) => (
              <Button
                key={j.key}
                asChild
                className={
                  i === 0
                    ? 'rounded-full bg-brand-highlight text-ink hover:bg-brand-highlight/90'
                    : 'rounded-full bg-white text-brand-deep hover:bg-tint-50'
                }
              >
                <Link to={j.to}>
                  <j.icon aria-hidden /> {t(`home.empty.${j.key}`)}
                  <ArrowRight className="rtl-mirror" aria-hidden />
                </Link>
              </Button>
            ))}
          </div>
        </section>
      </StaggerItem>
      <StaggerItem>
        <section aria-labelledby="explore-title" className="card p-6">
          <h2 id="explore-title" className="flex items-center gap-2 text-base">
            <Compass className="size-5 text-brand" aria-hidden /> {t('home.empty.exploreTitle')}
          </h2>
          <p className="mt-2 text-sm text-ink-soft">{t('home.empty.exploreBody')}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/learn/tracks">{t('home.empty.tracks')}</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/learn/calculator">{t('home.empty.calculator')}</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/learn/assistant">{t('home.empty.assistant')}</Link>
            </Button>
          </div>
        </section>
      </StaggerItem>
    </Stagger>
  )
}
