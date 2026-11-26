import { BadgeCheck, Lock, Scale, Tag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageBanner } from '@/features/leadership/components/PageBanner'
import { GUIDELINE_SECTIONS } from '../config'
import { useOasis } from '../hooks/use-oasis'

const ICON = { editorial: BadgeCheck, labelling: Tag, influence: Scale, data: Lock }

/** Sponsor guidelines (C8.5): editorial independence, labelling, no influence, personal data. */
export function GuidelinesPage() {
  const { t } = useTranslation('sponsor')
  const oasis = useOasis()
  return (
    <>
      <PageBanner
        eyebrow={t('banner.eyebrow', { status: oasis.status })}
        title={t('pages.guidelines')}
      >
        <p>{t('banner.guidelinesBody')}</p>
      </PageBanner>
      <div className="grid gap-4 md:grid-cols-2">
        {GUIDELINE_SECTIONS.map((id) => {
          const Icon = ICON[id]
          const points = t(`guidelines.${id}.points`, { returnObjects: true }) as string[]
          return (
            <section key={id} className="card relative overflow-hidden p-5">
              <Icon className="absolute end-4 top-4 size-14 text-brand/10" aria-hidden />
              <h2 className="pe-16 text-lg font-bold text-brand-deep">
                {t(`guidelines.${id}.title`)}
              </h2>
              <ul className="mt-3 grid gap-2.5">
                {points.map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-ink">
                    <BadgeCheck className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </>
  )
}
