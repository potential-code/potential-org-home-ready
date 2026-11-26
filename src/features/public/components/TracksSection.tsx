import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { gsap } from '@/lib/gsap'
import { TRACKS } from '../config'
import { Section } from './Section'
import { SponsorSlot } from './SponsorSlot'
import { TrackCard } from './TrackCard'

/**
 * Landing section 7 "Programme content": Track A (with its sponsored sample slot below) and
 * Track B. On scroll, GSAP brings the cards in one by one, then each card's units in order.
 */
export function TracksSection() {
  const { t } = useTranslation('public')
  const reduce = useReducedMotion()
  const grid = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduce || !grid.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: grid.current, start: 'top 82%', once: true },
      })
      tl.from('[data-track-card]', {
        y: 36,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.14,
      }).from(
        '[data-track-unit]',
        { x: -12, opacity: 0, duration: 0.45, ease: 'power2.out', stagger: 0.05 },
        '-=0.35',
      )
    }, grid)
    return () => ctx.revert()
  }, [reduce])

  return (
    <Section id="tracks" tone="tint" motif eyebrow={t('nav.tracks')} title={t('tracks.title')}>
      <div ref={grid} className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
        {TRACKS.map((track) => (
          // GSAP animates this wrapper, not the card: `card-hover` has a CSS transform transition
          // that would make GSAP read a mid-transition start value.
          <div key={track.key} data-track-card className="flex flex-col gap-4">
            <TrackCard track={track} />
            {track.sponsored && <SponsorSlot />}
          </div>
        ))}
      </div>
    </Section>
  )
}
