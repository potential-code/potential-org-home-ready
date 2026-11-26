import { Link } from '@tanstack/react-router'
import { ArrowRight, Building2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Motif } from '@/components/brand'
import { Section } from '../Section'

/** C5.10 Partners and sponsors: two labelled fictional sample tiles and the editorial line. */
export function PartnersSection() {
  const { t } = useTranslation('public')
  return (
    <Section id="partners" tone="tint" eyebrow={t('partners.eyebrow')} title={t('partners.title')}>
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12">
        <ul className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((n) => (
            <li
              data-reveal
              key={n}
              className="card relative flex min-h-36 flex-col items-center justify-center gap-2 overflow-hidden bg-[linear-gradient(140deg,var(--brand-white),var(--brand-tint-100))] p-6 text-center"
            >
              <Motif variant="corner" className="text-brand/10" />
              <Building2 className="relative size-8 text-ink-soft" aria-hidden />
              <p className="relative font-bold text-ink">{t('partners.tile')}</p>
              <p className="relative text-sm text-ink-soft">{t('partners.tileNote')}</p>
            </li>
          ))}
        </ul>
        <div className="space-y-4">
          <p data-reveal className="text-lg text-ink-soft">
            {t('partners.body')}
          </p>
          <p data-reveal>
            <Link
              to="/editorial-policy"
              className="inline-flex min-h-11 items-center gap-1.5 font-bold text-brand underline-offset-4 hover:underline"
            >
              {t('partners.link')}
              <ArrowRight className="size-4 rtl-mirror" aria-hidden />
            </Link>
          </p>
        </div>
      </div>
    </Section>
  )
}
