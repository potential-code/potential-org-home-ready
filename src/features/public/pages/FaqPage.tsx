import { Link } from '@tanstack/react-router'
import { ArrowRight, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Motif } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { usePageTitle } from '@/hooks/use-page-title'
import { FaqAccordion } from '../components/FaqAccordion'
import { StaticBanner } from '../components/static/StaticBanner'
import { StaticPage } from '../components/static/StaticPage'

/** FAQ page (static, C5.12): the same eight answers as the landing, plus a contact card. */
export function FaqPage() {
  const { t } = useTranslation('public')
  usePageTitle(t('pages.faq'))
  return (
    <StaticPage>
      <StaticBanner
        eyebrow={t('static.eyebrow')}
        title={t('static.faq.title')}
        intro={t('static.faq.intro')}
      />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8">
        <FaqAccordion />
        <aside className="on-dark relative overflow-hidden rounded-2xl bg-brand-deep p-6 text-white shadow-md lg:sticky lg:top-24">
          <Motif variant="corner" className="text-white/[0.14]" />
          <h2 className="relative text-lg text-white">{t('static.faq.moreTitle')}</h2>
          <p className="relative mt-2 text-sm text-white/85">{t('static.faq.moreBody')}</p>
          <p className="relative mt-3 flex items-center gap-2 text-sm font-semibold text-white">
            <Mail className="size-4 text-brand-highlight" aria-hidden />
            {t('static.email')}
          </p>
          <Button
            asChild
            className="relative mt-5 h-10 rounded-full bg-white px-5 font-bold text-brand-deep hover:bg-brand-highlight hover:text-ink"
          >
            <Link to="/contact">
              {t('static.contactCta')}
              <ArrowRight className="size-4 rtl-mirror" aria-hidden />
            </Link>
          </Button>
        </aside>
      </div>
    </StaticPage>
  )
}
