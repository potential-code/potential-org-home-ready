import { Quote } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { HomeMark } from '@/components/brand'
import { Section } from '../Section'

/** C5.3 About the programme: the verbatim paragraph, with its independence line pulled out. */
export function AboutSection() {
  const { t } = useTranslation('public')
  return (
    <Section id="about" eyebrow={t('about.eyebrow')} title={t('about.title')}>
      <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-12">
        <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
          <p data-reveal>{t('about.p1')}</p>
          <p data-reveal>{t('about.p2')}</p>
        </div>
        <figure
          data-reveal
          className="on-dark relative flex flex-col justify-between overflow-hidden rounded-3xl bg-grad-brand p-7 text-white shadow-lg sm:p-8"
        >
          <HomeMark
            className="pointer-events-none absolute -end-6 -bottom-4 w-64 text-white/[0.12]"
            strokeWidth={1.4}
          />
          <Quote className="relative size-8 text-brand-highlight rtl-mirror" aria-hidden />
          <blockquote className="relative mt-4 text-2xl leading-snug font-bold text-balance text-white sm:text-[1.7rem]">
            {t('about.quote')}
          </blockquote>
          <figcaption className="relative mt-6 text-sm font-semibold text-white/80">
            {t('header.brand')}
          </figcaption>
        </figure>
      </div>
    </Section>
  )
}
