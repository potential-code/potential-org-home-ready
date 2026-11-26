import config from '@config'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Clock, GraduationCap, PlayCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Motif } from '@/components/brand'
import { SmartImage } from '@/components/shared/SmartImage'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { TrackConfig } from '../config'

const TONE = {
  A: {
    band: 'bg-[linear-gradient(135deg,var(--brand-track-a-ink)_0%,var(--brand-track-a)_100%)]',
    soft: 'bg-track-a-soft text-track-a-ink',
    ink: 'text-track-a-ink',
    button: 'border-track-a-ink/40 text-track-a-ink hover:bg-track-a-soft hover:text-track-a-ink',
  },
  B: {
    band: 'bg-[linear-gradient(135deg,var(--brand-track-b-ink)_0%,var(--brand-track-b)_100%)]',
    soft: 'bg-track-b-soft text-track-b-ink',
    ink: 'text-track-b-ink',
    button: 'border-track-b-ink/40 text-track-b-ink hover:bg-track-b-soft hover:text-track-b-ink',
  },
} as const

/**
 * One track card (C5.7): track photo, track-coloured band with title and facts, the C9 description, the five
 * unit titles, and "Preview track". `data-track-unit` rows are revealed by GSAP in `TracksSection`.
 */
export function TrackCard({ track }: { track: TrackConfig }) {
  const { t } = useTranslation('public')
  const tone = TONE[track.letter]
  const k = `tracks.${track.key}`
  const facts = [
    { icon: PlayCircle, text: t(`${k}.videos`) },
    { icon: Clock, text: t(`${k}.duration`) },
    { icon: GraduationCap, text: t('tracks.level') },
  ]
  return (
    <article
      aria-labelledby={`track-${track.key}`}
      className="card card-hover flex flex-col overflow-hidden"
    >
      <SmartImage src={track.image} alt="" className="aspect-[16/7] w-full" />
      <div className={cn('on-dark relative overflow-hidden px-6 pt-6 pb-5 text-white', tone.band)}>
        <Motif variant="card" className="text-white/[0.16]" />
        <p className="relative text-xs font-bold tracking-widest text-white uppercase">
          {t('tracks.trackLabel', { letter: track.letter })}
        </p>
        <h3
          id={`track-${track.key}`}
          className="relative mt-1.5 text-2xl text-white sm:text-[1.7rem]"
        >
          {t(`${k}.title`)}
        </h3>
        <ul className="relative mt-4 flex flex-wrap gap-2">
          {facts.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/25"
            >
              <Icon className="size-3.5" aria-hidden />
              {text}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-ink-soft">{t(`${k}.description`)}</p>
        <ol className="mt-5 divide-y divide-border/80" aria-label={t('tracks.unitsLabel')}>
          {track.units.map((u) => (
            <li key={u} data-track-unit className="flex items-center gap-3 py-2.5">
              <span
                className={cn(
                  'w-9 shrink-0 rounded-md py-0.5 text-center text-xs font-bold tabular-nums',
                  tone.soft,
                )}
              >
                {u}
              </span>
              <span className="font-semibold text-ink">{t(`${k}.units.${u}`)}</span>
            </li>
          ))}
        </ol>
        <div className="mt-auto pt-6">
          <Button asChild variant="outline" className={cn('h-10 rounded-full px-5', tone.button)}>
            <Link to={config.signInRoute}>
              {t('tracks.preview')}
              <ArrowRight className="size-4 rtl-mirror" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
