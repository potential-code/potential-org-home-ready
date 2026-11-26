import { Quote } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useKpis } from '@/store/hooks'
import { ImpactCharts } from '../components/ImpactCharts'
import { ImpactFilterBar } from '../components/ImpactFilterBar'
import { KpiGrid } from '../components/KpiGrid'
import { PageBanner } from '../components/PageBanner'
import { SignupsChart } from '../components/SignupsChart'
import { useImpactFilters } from '../hooks/use-impact-filters'

/** Hessa's single Impact view (C8.4, C13). Read-only: filters change the view, never the data. */
export function ImpactPage() {
  const { t } = useTranslation('leadership')
  const k = useKpis()
  const f = useImpactFilters()
  return (
    <>
      <PageBanner eyebrow={t('banner.eyebrow')} title={t('banner.impactTitle')}>
        <figure className="mt-1 flex gap-3">
          <Quote className="mt-1 size-5 shrink-0 text-brand-highlight rtl-mirror" aria-hidden />
          <div>
            <figcaption className="text-xs font-bold tracking-widest text-white/85 uppercase">
              {t('banner.storyLabel')}
            </figcaption>
            <blockquote className="mt-1 text-base leading-relaxed text-white sm:text-lg">
              {t('banner.story', {
                useful: k.k3Pct,
                returned: k.k4Pct,
                pre: k.confidencePre,
                post: k.confidencePost,
              })}
            </blockquote>
          </div>
        </figure>
      </PageBanner>
      <KpiGrid />
      <div className="mt-6">
        <ImpactFilterBar
          filters={f.filters}
          set={f.set}
          reset={f.reset}
          isFiltered={f.isFiltered}
          segment={f.segment}
          total={f.allSignups}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <SignupsChart weeks={f.weeks} series={f.series} total={f.inRange} />
        <ImpactCharts track={f.filters.track} />
      </div>
    </>
  )
}
