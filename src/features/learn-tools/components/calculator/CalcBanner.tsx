import { Calculator } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Motif } from '@/components/brand'

/** Page banner with the education note (C11.2). */
export function CalcBanner() {
  const { t } = useTranslation('calculator')
  return (
    <section className="relative mb-6 overflow-hidden rounded-3xl bg-grad-brand p-6 text-white shadow-lg sm:p-8">
      <Motif variant="banner" className="text-white/[0.12]" />
      <div className="relative max-w-2xl space-y-2">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-white/85">
          <Calculator className="size-4" aria-hidden />
          {t('banner.eyebrow')}
        </p>
        <h1 className="text-2xl text-white sm:text-3xl">{t('pages.title')}</h1>
        <p className="text-white/85">{t('banner.body')}</p>
        <p className="pt-1 text-sm font-semibold text-white">{t('banner.note')}</p>
      </div>
    </section>
  )
}
