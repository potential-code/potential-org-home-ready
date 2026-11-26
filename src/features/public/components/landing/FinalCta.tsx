import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Motif } from '@/components/brand'
import { Magnetic } from '@/components/motion'
import { SmartImage } from '@/components/shared/SmartImage'
import { Button } from '@/components/ui/button'
import { useSectionReveal } from '../../hooks/use-section-reveal'

/** C5.13 Final call to action over the open-door photo (dark scrim, white text). */
export function FinalCta() {
  const { t } = useTranslation('public')
  const ref = useRef<HTMLElement>(null)
  useSectionReveal(ref)
  return (
    <section
      ref={ref}
      aria-labelledby="cta-title"
      className="on-dark relative isolate overflow-hidden bg-brand-deep text-white"
    >
      <SmartImage
        src="images/generated/cta-band.jpg"
        alt=""
        className="absolute inset-0 -z-20 size-full"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(var(--shadow-rgb)/0.92)_0%,rgb(var(--shadow-rgb)/0.78)_55%,rgb(var(--shadow-rgb)/0.45)_100%)] rtl:bg-[linear-gradient(270deg,rgb(var(--shadow-rgb)/0.92)_0%,rgb(var(--shadow-rgb)/0.78)_55%,rgb(var(--shadow-rgb)/0.45)_100%)]"
      />
      <Motif variant="banner" className="text-white/[0.08]" />
      <div className="container-page relative py-20 sm:py-28">
        <h2
          data-reveal
          id="cta-title"
          className="max-w-2xl text-4xl text-balance text-white sm:text-5xl"
        >
          {t('cta.title')}
        </h2>
        <div data-reveal className="mt-8">
          <Magnetic>
            <Button
              asChild
              className="h-12 rounded-full bg-brand-highlight px-7 text-base font-bold text-ink shadow-lg hover:bg-white"
            >
              <Link to="/register">
                {t('cta.button')}
                <ArrowRight className="size-4 rtl-mirror" aria-hidden />
              </Link>
            </Button>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
