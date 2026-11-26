import { Link } from '@tanstack/react-router'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { HomeMark } from '@/components/brand'
import { Magnetic, SplitWords } from '@/components/motion'
import { SmartImage } from '@/components/shared/SmartImage'
import { Button } from '@/components/ui/button'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { gsap } from '@/lib/gsap'
import { scrollToId } from '../scroll-to'

/**
 * Landing hero (brief C5.2, copy verbatim): headline in two SplitWords lines, sub-headline, amber
 * "Join free" and "See how it works", the small proof line, and the couple-at-the-door photo. GSAP
 * ScrollTrigger drifts the copy and the art at different speeds on scroll.
 */
export function Hero() {
  const { t } = useTranslation('public')
  const reduce = useReducedMotion()
  const root = useRef<HTMLElement>(null)
  const copy = useRef<HTMLDivElement>(null)
  const art = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduce || !root.current) return
    const ctx = gsap.context(() => {
      const trigger = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to(copy.current, { yPercent: 12, opacity: 0.4, ease: 'none', scrollTrigger: trigger })
      gsap.to(art.current, { yPercent: -8, ease: 'none', scrollTrigger: trigger })
    }, root)
    return () => ctx.revert()
  }, [reduce])

  // "See how it works" scrolls to section 6 (its id is the nav's "journeys" target).
  const seeHow = () => scrollToId('journeys')
  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.7 },
  })

  return (
    <section
      ref={root}
      className="on-dark relative isolate flex h-[100svh] min-h-[560px] items-center overflow-hidden bg-brand-deep pt-20 pb-10 text-white"
    >
      {/* Full-bleed hero photo. Mirrored in LTR so the couple sits on the end side, away from the copy. */}
      <div ref={art} className="absolute inset-x-0 -top-[4%] -bottom-[10%] -z-10">
        <motion.div
          className="h-full w-full"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        >
          <SmartImage
            src="images/generated/hero-family.jpg"
            alt={t('hero.imageAlt')}
            loading="eager"
            className="h-full w-full object-cover object-[72%_center] rtl:-scale-x-100"
          />
        </motion.div>
      </div>
      {/* Scrim: solid ink behind the copy, fading out towards the photo; bottom fade into the next band. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-brand-deep/75 lg:bg-transparent lg:bg-[linear-gradient(90deg,var(--brand-deep-900)_0%,color-mix(in_oklab,var(--brand-deep)_88%,transparent)_38%,color-mix(in_oklab,var(--brand-deep)_35%,transparent)_62%,transparent_82%)] lg:rtl:bg-[linear-gradient(270deg,var(--brand-deep-900)_0%,color-mix(in_oklab,var(--brand-deep)_88%,transparent)_38%,color-mix(in_oklab,var(--brand-deep)_35%,transparent)_62%,transparent_82%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-40 bg-[linear-gradient(180deg,var(--brand-deep-900),transparent)] opacity-80"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-[linear-gradient(0deg,var(--brand-deep-900),transparent)] opacity-70"
      />
      <HomeMark
        className="pointer-events-none absolute start-4 bottom-0 hidden h-auto w-56 text-white/[0.07] lg:block"
        strokeWidth={1.2}
      />
      <div className="container-page relative w-full">
        <div ref={copy} className="max-w-[40rem]">
          <h1 className="text-[clamp(2.2rem,4.3vw,3.6rem)] leading-[1.08] font-bold text-balance text-white">
            <span className="block">
              <SplitWords text={t('hero.line1')} onView={false} delay={0.1} />
            </span>
            <span className="block text-brand-highlight">
              <SplitWords text={t('hero.line2')} onView={false} delay={0.4} />
            </span>
          </h1>
          <motion.p {...fade(0.8)} className="mt-6 max-w-xl text-lg leading-relaxed text-white/90">
            {t('hero.body')}
          </motion.p>
          <motion.div {...fade(0.95)} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button
                asChild
                className="h-11 rounded-full bg-brand-highlight px-6 font-bold text-ink shadow-lg hover:bg-white"
              >
                <Link to="/register">
                  {t('hero.primary')}
                  <ArrowRight className="size-4 rtl-mirror" aria-hidden />
                </Link>
              </Button>
            </Magnetic>
            <Button
              variant="ghost"
              className="h-11 rounded-full border border-white/60 px-5 text-white hover:bg-white/15 hover:text-white"
              onClick={seeHow}
            >
              {t('hero.secondary')}
              <ChevronDown className="size-4" aria-hidden />
            </Button>
          </motion.div>
          <motion.p {...fade(1.1)} className="mt-5 text-sm font-medium text-white/80">
            {t('hero.proof')}
          </motion.p>
        </div>
      </div>
    </section>
  )
}
