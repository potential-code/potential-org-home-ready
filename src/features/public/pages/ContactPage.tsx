import { Clock, Mail, MessageCircleQuestion } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Motif } from '@/components/brand'
import { usePageTitle } from '@/hooks/use-page-title'
import { ContactForm } from '../components/static/ContactForm'
import { StaticBanner } from '../components/static/StaticBanner'
import { StaticPage } from '../components/static/StaticPage'

/** Contact (static, C5.14): hello@potential.org, a demo contact form and response notes. */
export function ContactPage() {
  const { t } = useTranslation('public')
  usePageTitle(t('pages.contact'))
  const email = t('static.email')
  return (
    <StaticPage>
      <StaticBanner
        eyebrow={t('static.eyebrow')}
        title={t('static.contact.title')}
        intro={t('static.contact.intro')}
      />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8">
        <section aria-labelledby="contact-form-title" className="card p-6 sm:p-8">
          <h2 id="contact-form-title" className="text-xl">
            {t('static.contact.formTitle')}
          </h2>
          <p className="mt-1 mb-6 text-ink-soft">{t('static.contact.formIntro')}</p>
          <ContactForm />
        </section>
        <div className="space-y-4">
          <aside className="on-dark relative overflow-hidden rounded-2xl bg-brand-deep p-6 text-white shadow-md">
            <Motif variant="corner" className="text-white/[0.14]" />
            <h2 className="flex items-center gap-2 text-lg text-white">
              <Mail className="size-5 text-brand-highlight" aria-hidden />
              {t('static.contact.emailTitle')}
            </h2>
            <a
              href={`mailto:${email}`}
              className="mt-2 inline-flex min-h-11 items-center text-lg font-bold text-white underline-offset-4 hover:underline"
            >
              {email}
            </a>
            <p className="flex items-start gap-2 text-sm text-white/85">
              <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
              {t('static.contact.hours')}
            </p>
          </aside>
          <aside className="card p-6">
            <h2 className="flex items-center gap-2 text-lg">
              <MessageCircleQuestion className="size-5 text-brand" aria-hidden />
              {t('static.contact.personTitle')}
            </h2>
            <p className="mt-2 text-sm text-ink-soft">{t('static.contact.personBody')}</p>
          </aside>
          <aside className="card p-6">
            <h2 className="text-lg">{t('static.contact.adviceTitle')}</h2>
            <p className="mt-2 text-sm text-ink-soft">{t('static.contact.adviceBody')}</p>
          </aside>
        </div>
      </div>
    </StaticPage>
  )
}
