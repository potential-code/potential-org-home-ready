import { Link } from '@tanstack/react-router'
import { CalendarCheck, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Stagger, StaggerItem } from '@/components/motion'
import { Button } from '@/components/ui/button'
import { StaticBanner } from './StaticBanner'
import { StaticPage } from './StaticPage'

export type PolicyKey = 'terms' | 'privacy' | 'editorial'

/**
 * Shared layout for Terms, Privacy and Editorial policy: banner, numbered section cards and a
 * side card with the review date and the contact address. Copy lives in public:static.<page>.
 */
export function PolicyArticle({
  page,
  sections,
}: {
  page: PolicyKey
  sections: readonly string[]
}) {
  const { t } = useTranslation('public')
  const k = `static.${page}`
  return (
    <StaticPage>
      <StaticBanner
        eyebrow={t('static.eyebrow')}
        title={t(`${k}.title`)}
        intro={t(`${k}.intro`)}
        meta={
          <span className="inline-flex items-center gap-2">
            <CalendarCheck className="size-4" aria-hidden />
            {t('static.updated')}
          </span>
        }
      />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8">
        <Stagger className="space-y-4">
          {sections.map((s, i) => (
            <StaggerItem key={s} className="card p-6 sm:p-7">
              <h2 className="flex items-baseline gap-3 text-xl">
                <span className="text-sm font-bold text-brand tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {t(`${k}.sections.${s}.title`)}
              </h2>
              <p className="mt-2 leading-relaxed text-ink-soft">{t(`${k}.sections.${s}.body`)}</p>
            </StaggerItem>
          ))}
        </Stagger>
        <aside className="card space-y-3 p-6 lg:sticky lg:top-24">
          <h2 className="text-lg">{t('static.questionsTitle')}</h2>
          <p className="text-sm text-ink-soft">{t('static.questionsBody')}</p>
          <a
            href={`mailto:${t('static.email')}`}
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-brand hover:underline"
          >
            <Mail className="size-4" aria-hidden />
            {t('static.email')}
          </a>
          <Button asChild variant="outline" className="h-10 w-full rounded-full">
            <Link to="/contact">{t('static.contactCta')}</Link>
          </Button>
        </aside>
      </div>
    </StaticPage>
  )
}
