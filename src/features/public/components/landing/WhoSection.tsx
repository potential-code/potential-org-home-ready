import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SmartImage } from '@/components/shared/SmartImage'
import { AUDIENCES } from '../../config'
import { Section } from '../Section'

/** C5.5 Who it is for: four photo cards; "Start here" preselects the register form's path. */
export function WhoSection() {
  const { t } = useTranslation('public')
  return (
    <Section id="who" eyebrow={t('who.eyebrow')} title={t('who.title')}>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {AUDIENCES.map((a) => (
          <li data-reveal key={a.path}>
            <Link
              to="/register"
              search={{ path: a.path }}
              className="card card-hover group flex h-full flex-col overflow-hidden"
            >
              <div className="overflow-hidden">
                <SmartImage
                  src={a.image}
                  alt=""
                  className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg leading-snug">{t(`who.${a.path}.title`)}</h3>
                <p className="mt-2 text-ink-soft">{t(`who.${a.path}.body`)}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold text-brand">
                  {t('who.cta')}
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1 rtl-mirror"
                    aria-hidden
                  />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}
