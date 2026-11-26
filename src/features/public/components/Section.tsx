import { type ReactNode, useRef } from 'react'
import { Motif } from '@/components/brand'
import { cn } from '@/lib/utils'
import { useSectionReveal } from '../hooks/use-section-reveal'

export type SectionTone = 'white' | 'tint' | 'deep' | 'page'

const TONE: Record<SectionTone, string> = {
  white: 'bg-white',
  page: 'bg-tint-50',
  tint: 'bg-grad-soft',
  deep: 'on-dark bg-brand-deep text-white',
}

/**
 * Landing building block: a full-width band with an id (the header nav scrolls to it), eyebrow,
 * heading and intro, then any content. Mark children with `data-reveal` to have them revealed one
 * by one after the heading (GSAP ScrollTrigger, see `useSectionReveal`).
 */
export function Section({
  id,
  tone = 'white',
  eyebrow,
  title,
  intro,
  motif = false,
  center = false,
  aside,
  children,
  className,
}: {
  id: string
  tone?: SectionTone
  eyebrow?: string
  title: string
  intro?: ReactNode
  /** Show the brand motif in the corner (decorative). */
  motif?: boolean
  center?: boolean
  /** Content beside the heading on wide screens (e.g. a link). */
  aside?: ReactNode
  children?: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLElement>(null)
  useSectionReveal(ref)
  const dark = tone === 'deep'
  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn('relative overflow-hidden py-16 sm:py-20', TONE[tone], className)}
    >
      {motif && (
        <Motif variant="banner" className={dark ? 'text-white/[0.08]' : 'text-brand/[0.07]'} />
      )}
      <div className="container-page relative">
        <div
          className={cn(
            'flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between',
            center && 'items-center text-center lg:flex-col lg:items-center',
          )}
        >
          <div className={cn('max-w-2xl', center && 'mx-auto')}>
            {eyebrow && (
              <p
                data-reveal
                className={cn(
                  'mb-3 text-xs font-bold tracking-widest uppercase',
                  dark ? 'text-brand-highlight' : 'text-brand',
                )}
              >
                {eyebrow}
              </p>
            )}
            <h2
              data-reveal
              id={`${id}-title`}
              className={cn('text-3xl text-balance sm:text-4xl', dark && 'text-white')}
            >
              {title}
            </h2>
            {intro && (
              <p
                data-reveal
                className={cn('mt-4 text-lg', dark ? 'text-white/85' : 'text-ink-soft')}
              >
                {intro}
              </p>
            )}
          </div>
          {aside && (
            <div data-reveal className="shrink-0">
              {aside}
            </div>
          )}
        </div>
        {children && <div className="mt-10 sm:mt-12">{children}</div>}
      </div>
    </section>
  )
}
