import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FaqAccordion } from '../FaqAccordion'
import { Section } from '../Section'

/** C5.12 FAQ: the eight questions, with a link to the full FAQ page. */
export function FaqSection() {
  const { t } = useTranslation('public')
  return (
    <Section
      id="faq"
      eyebrow={t('faq.eyebrow')}
      title={t('faq.title')}
      aside={
        <Link
          to="/faq"
          className="inline-flex min-h-11 items-center gap-1.5 font-bold text-brand underline-offset-4 hover:underline"
        >
          {t('faq.more')}
          <ArrowRight className="size-4 rtl-mirror" aria-hidden />
        </Link>
      }
    >
      <FaqAccordion className="mx-auto max-w-4xl" />
    </Section>
  )
}
