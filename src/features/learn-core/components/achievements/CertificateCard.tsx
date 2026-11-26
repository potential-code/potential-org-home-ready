import { Link } from '@tanstack/react-router'
import { Award, Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { CERTIFICATE_PASS_MARK } from '@/domain/tracks'
import { formatDate, useLocalized } from '@/i18n'
import { CertificateDialog } from '../cert/CertificateDialog'
import { useCertificate } from '../cert/use-certificate'

/** One track certificate on Achievements: view and download when earned, the rule when not. */
export function CertificateCard({ courseId }: { courseId: string }) {
  const { t } = useTranslation('learn')
  const { l, lang } = useLocalized()
  const { course, data } = useCertificate(courseId)
  if (!course) return null
  return (
    <article className="card relative flex flex-col gap-3 overflow-hidden p-5 sm:p-6">
      <p
        className={`flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase ${data ? 'text-success' : 'text-ink-soft'}`}
      >
        {data ? <Award className="size-4" aria-hidden /> : <Lock className="size-4" aria-hidden />}
        {data ? t('ach.certs.earned') : t('ach.certs.locked')}
      </p>
      <h3 className="text-base">{l(course.certificateTitle ?? course.title)}</h3>
      <p className="text-sm text-ink-soft">
        {data
          ? t('ach.certs.issued', { date: formatDate(data.date, lang), id: data.id })
          : t('ach.certs.rule', { pass: CERTIFICATE_PASS_MARK })}
      </p>
      {data ? (
        <CertificateDialog
          data={data}
          trigger={
            <Button className="mt-auto self-start rounded-full">{t('ach.certs.view')}</Button>
          }
        />
      ) : (
        <Button asChild variant="outline" className="mt-auto self-start rounded-full">
          <Link to="/learn/tracks/$trackId" params={{ trackId: course.id }}>
            {t('ach.certs.continue')}
          </Link>
        </Button>
      )}
    </article>
  )
}
