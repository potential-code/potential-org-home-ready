import { Link } from '@tanstack/react-router'
import { BadgeCheck, Languages, MessageCircle, Scale } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Motif } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { Section } from '../Section'
import { DalilAvatar } from './DalilAvatar'

const POINTS = [
  { key: 'language', icon: Languages },
  { key: 'source', icon: BadgeCheck },
  { key: 'neutral', icon: Scale },
] as const

/** C5.8 AI experience: Dalil card with the verbatim sample question and answer, "Ask Dalil". */
export function DalilSection() {
  const { t } = useTranslation('public')
  return (
    <Section
      id="dalil"
      eyebrow={t('dalil.eyebrow')}
      title={t('dalil.title')}
      intro={t('dalil.body')}
    >
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)] lg:gap-12">
        <div className="flex flex-col gap-5">
          <ul className="space-y-3">
            {POINTS.map(({ key, icon: Icon }) => (
              <li data-reveal key={key} className="flex items-center gap-3 font-semibold text-ink">
                <Icon className="size-5 shrink-0 text-brand" aria-hidden />
                {t(`dalil.points.${key}`)}
              </li>
            ))}
          </ul>
          <div data-reveal>
            <Button
              asChild
              className="h-11 rounded-full bg-brand-highlight px-6 font-bold text-ink shadow-md hover:bg-brand hover:text-white"
            >
              <Link to="/register">
                <MessageCircle className="size-4" aria-hidden />
                {t('dalil.cta')}
              </Link>
            </Button>
          </div>
        </div>
        <div data-reveal className="card relative overflow-hidden">
          <div className="on-dark relative flex items-center gap-3 overflow-hidden bg-grad-brand px-5 py-4 text-white">
            <Motif variant="card" className="text-white/[0.14]" />
            <span className="relative rounded-xl bg-white p-1 shadow-sm">
              <DalilAvatar className="size-9" />
            </span>
            <span className="relative">
              <span className="block font-bold text-white">{t('dalil.name')}</span>
              <span className="block text-sm text-white/80">{t('dalil.online')}</span>
            </span>
          </div>
          <div className="space-y-4 bg-white p-5 sm:p-6">
            <div className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl rounded-ee-md bg-brand-deep px-4 py-3 text-white shadow-sm">
                <span className="sr-only">{t('dalil.you')}: </span>
                {t('dalil.q')}
              </p>
            </div>
            <div className="flex items-end gap-2.5">
              <DalilAvatar className="size-8" />
              <div className="max-w-[90%] rounded-2xl rounded-es-md bg-tint-50 px-4 py-3 text-ink ring-1 ring-brand/10">
                <span className="sr-only">{t('dalil.name')}: </span>
                <p>{t('dalil.a')}</p>
                <p className="mt-3 flex items-start gap-1.5 text-sm font-semibold text-brand">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
                  {t('dalil.source')}
                </p>
                <p className="mt-1 text-sm text-ink-soft">{t('dalil.note')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
