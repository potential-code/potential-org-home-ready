import type { Course } from '@shared/types'
import { BadgeCheck } from 'lucide-react'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Motif } from '@/components/brand'
import { formatDate, useLocalized } from '@/i18n'
import { VerifyMark } from './VerifyMark'

export interface CertificateData {
  course: Course
  name: string
  date: string
  id: string
}

/** The certificate itself (C9): title, issuer line, name, date, ID and the verification block. */
export const CertificateView = forwardRef<HTMLDivElement, CertificateData>(function CertificateView(
  { course, name, date, id },
  ref,
) {
  const { t } = useTranslation('learning')
  const { l, lang } = useLocalized()
  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border-4 border-double border-brand/40 bg-white p-6 text-center text-ink sm:p-10"
    >
      <Motif variant="corner" className="text-brand/10" />
      <p className="relative text-xs font-bold tracking-widest text-brand uppercase">
        {t('cert.issuer')}
      </p>
      <h2 className="relative mx-auto mt-4 max-w-xl text-2xl text-brand-deep sm:text-3xl">
        {l(course.certificateTitle ?? course.title)}
      </h2>
      <p className="relative mt-6 text-sm text-ink-soft">{t('cert.awardedTo')}</p>
      <p className="relative mt-1 text-2xl font-bold text-ink sm:text-3xl">{name}</p>
      <p className="relative mx-auto mt-3 max-w-md text-sm text-ink-soft">{t('cert.body')}</p>
      <div className="relative mt-8 grid items-center gap-5 border-t border-border/70 pt-6 text-start sm:grid-cols-[1fr_auto]">
        <dl className="grid gap-2 text-sm">
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-semibold">{t('cert.date')}</dt>
            <dd>{formatDate(date, lang, { day: 'numeric', month: 'long', year: 'numeric' })}</dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-semibold">{t('cert.id')}</dt>
            <dd dir="ltr" className="font-mono">
              {id}
            </dd>
          </div>
          <div className="flex flex-wrap items-center gap-x-2">
            <dt className="flex items-center gap-1.5 font-semibold">
              <BadgeCheck className="size-4 text-brand" aria-hidden /> {t('cert.verify')}
            </dt>
            <dd dir="ltr" className="break-all">
              potential.courses/verify/{id}
            </dd>
          </div>
          <p className="text-xs text-ink-soft">{t('cert.note')}</p>
        </dl>
        <div className="justify-self-start sm:justify-self-end">
          <VerifyMark id={id} />
        </div>
      </div>
    </div>
  )
})
