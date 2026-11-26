import { Award } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Motif } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { useLocalized } from '@/i18n'
import { CertificateDialog } from './cert/CertificateDialog'
import { useCertificate } from './cert/use-certificate'

/** Shown on the course view once the certificate is earned (all lessons + final quiz 70%). */
export function CertificateBanner({ courseId }: { courseId: string }) {
  const { t } = useTranslation('learning')
  const { l } = useLocalized()
  const { course, data } = useCertificate(courseId)
  if (!course || !data) return null
  return (
    <section
      aria-labelledby="cert-banner"
      className="relative flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-3xl bg-brand-deep p-5 text-white shadow-lg sm:p-6"
    >
      <Motif variant="banner" className="text-white/[0.1]" />
      <div className="relative min-w-0">
        <h2 id="cert-banner" className="flex items-center gap-2 text-lg text-white">
          <Award className="size-5 text-brand-highlight" aria-hidden /> {t('cert.earnedTitle')}
        </h2>
        <p className="text-sm text-white/85">{l(course.certificateTitle ?? course.title)}</p>
      </div>
      <CertificateDialog
        data={data}
        trigger={
          <Button className="relative rounded-full bg-brand-highlight text-ink hover:bg-brand-highlight/90">
            {t('cert.view')}
          </Button>
        }
      />
    </section>
  )
}
