import { Link } from '@tanstack/react-router'
import { Mail } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Motif } from '@/components/brand'
import { Logo } from '@/components/shared/Logo'
import { asset } from '@/lib/asset'
import { SECTIONS } from '../config'
import { scrollToId } from '../scroll-to'

const linkCls = 'inline-flex min-h-11 items-center text-white/80 hover:text-white hover:underline'

const SOCIAL: { key: 'linkedin' | 'instagram' | 'youtube'; href: string; icon: ReactNode }[] = [
  {
    key: 'linkedin',
    href: 'https://www.linkedin.com/company/potential-org',
    icon: (
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.6h.06c.53-1 1.83-1.9 3.77-1.9 4.03 0 4.77 2.5 4.77 5.8v5.5h-4v-4.9c0-1.2-.02-2.7-1.7-2.7-1.68 0-1.94 1.3-1.94 2.6v5h-4v-11Z" />
    ),
  },
  {
    key: 'instagram',
    href: 'https://www.instagram.com/potential.org',
    icon: (
      <path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM16.4 2H7.6A5.6 5.6 0 0 0 2 7.6v8.8A5.6 5.6 0 0 0 7.6 22h8.8a5.6 5.6 0 0 0 5.6-5.6V7.6A5.6 5.6 0 0 0 16.4 2Zm3.8 14.4a3.8 3.8 0 0 1-3.8 3.8H7.6a3.8 3.8 0 0 1-3.8-3.8V7.6a3.8 3.8 0 0 1 3.8-3.8h8.8a3.8 3.8 0 0 1 3.8 3.8v8.8Z" />
    ),
  },
  {
    key: 'youtube',
    href: 'https://www.youtube.com/@potential',
    icon: (
      <path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
    ),
  },
]

/**
 * Landing footer per C5.14: Potential.org logo, programme and help links (contact email), social
 * icons, the advice line, the demo tag (passed in by the shell slot) and the "Powered by Potential.com" wordmark (white
 * "potential", light ".com" on the dark band). Meant to be rendered by the frozen `PublicFooter`.
 */
export function SiteFooter({ demoTag }: { demoTag?: ReactNode }) {
  const { t } = useTranslation('public')
  const help = [
    { to: '/faq', key: 'faq' },
    { to: '/editorial-policy', key: 'editorial' },
    { to: '/privacy', key: 'privacy' },
    { to: '/terms', key: 'terms' },
    { to: '/contact', key: 'contact' },
  ] as const
  return (
    <footer className="on-dark relative overflow-hidden bg-brand-deep text-white">
      <Motif variant="sidebar" className="text-white/[0.07]" />
      <div className="container-page relative grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
        <div className="space-y-4">
          <Logo variant="white" className="h-8" />
          <p className="max-w-sm text-sm text-white/80">{t('footer.tagline')}</p>
          {demoTag}
        </div>
        <div>
          <p className="mb-2 text-xs font-bold tracking-widest text-white/70 uppercase">
            {t('site.programme')}
          </p>
          <ul className="text-sm">
            <li>
              <a href="https://potential.org" target="_blank" rel="noreferrer" className={linkCls}>
                {t('site.about')}
              </a>
            </li>
            {SECTIONS.map((id) => (
              <li key={id}>
                <button type="button" onClick={() => scrollToId(id)} className={linkCls}>
                  {t(`nav.${id}`)}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-xs font-bold tracking-widest text-white/70 uppercase">
            {t('site.help')}
          </p>
          <ul className="text-sm">
            {help.map((l) => (
              <li key={l.key}>
                <Link to={l.to} className={linkCls}>
                  {t(`site.${l.key}`)}
                </Link>
              </li>
            ))}
            <li>
              <a href={`mailto:${t('site.email')}`} className={`${linkCls} gap-1.5`}>
                <Mail className="size-4" aria-hidden />
                <span dir="ltr">{t('site.email')}</span>
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-2 text-xs font-bold tracking-widest text-white/70 uppercase">
            {t('site.follow')}
          </p>
          <ul className="flex gap-1">
            {SOCIAL.map((s) => (
              <li key={s.key}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex size-11 items-center justify-center text-white/80 transition-colors hover:text-brand-highlight"
                >
                  <span className="sr-only">{t(`site.social.${s.key}`)}</span>
                  <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden>
                    {s.icon}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/15">
        <div className="container-page flex flex-col gap-2 py-4 text-xs text-white/80 sm:flex-row sm:items-center sm:justify-between">
          <p>{t('footer.disclaimer')}</p>
          <p className="flex items-center gap-2" dir="ltr">
            <span>{t('site.poweredBy')}</span>
            <img
              src={asset('brand/potential/potential-com-white.svg')}
              alt="Potential.com"
              className="h-5 w-auto"
            />
          </p>
        </div>
      </div>
    </footer>
  )
}
