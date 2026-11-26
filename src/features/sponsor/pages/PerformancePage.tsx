import { Calculator, Download, Eye, Lock, MousePointerClick, PhoneCall } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { BarChart, CHART, ChartCard } from '@/components/charts'
import { StatCard } from '@/components/shared/StatCard'
import { Button } from '@/components/ui/button'
import { KPI } from '@/data/figures'
import { pct } from '@/domain/progress'
import { PageBanner } from '@/features/leadership/components/PageBanner'
import { PrintDialog } from '@/features/leadership/components/PrintDialog'
import { SponsorReportDoc } from '@/features/leadership/components/SponsorReportDoc'
import { formatNumber, useLocalized } from '@/i18n'
import { logExport } from '@/store/actions'
import { useKpis } from '@/store/hooks'
import { useOasis } from '../hooks/use-oasis'

/** Oasis Performance (C8.5): aggregates only, never a name, email or phone. */
export function PerformancePage() {
  const { t } = useTranslation('sponsor')
  const { lang } = useLocalized()
  const oasis = useOasis()
  const k = useKpis()
  const [open, setOpen] = useState(false)
  const n = (v: number) => formatNumber(v, lang)
  const s = KPI.sponsor
  const reportTitle = `${oasis.name}: ${t('pages.performance')}`
  const download = () => {
    setOpen(true)
    logExport(oasis.name, reportTitle)
    toast.success(t('perf.download'))
  }
  const bars = [
    { key: 'imp', label: t('perf.impressions'), value: s.impressions },
    { key: 'runs', label: t('perf.calculatorRuns'), value: s.calculatorRuns },
    { key: 'views', label: t('perf.offerViews'), value: s.offerViews },
    { key: 'req', label: t('perf.requests'), value: k.consentedRequests },
  ]
  return (
    <>
      <PageBanner
        eyebrow={t('banner.eyebrow', { status: oasis.status })}
        title={`${oasis.name}: ${t('pages.performance')}`}
        actions={
          <Button
            className="rounded-full bg-white text-brand-deep hover:bg-tint-50"
            onClick={download}
          >
            <Download aria-hidden />
            {t('perf.download')}
          </Button>
        }
      >
        <p>{t('banner.performanceBody')}</p>
        <p className="mt-2 inline-flex items-start gap-2 font-semibold text-white">
          <Lock className="mt-0.5 size-4 shrink-0 text-brand-highlight" aria-hidden />
          {t('privacy')}
        </p>
      </PageBanner>
      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          tone="primary"
          icon={Eye}
          label={t('perf.impressions')}
          value={n(s.impressions)}
          hint={t('perf.impressionsHint')}
        />
        <StatCard
          tone="accent"
          icon={Calculator}
          label={t('perf.calculatorRuns')}
          value={n(s.calculatorRuns)}
          hint={t('perf.calculatorRunsHint')}
        />
        <StatCard
          tone="deep"
          icon={MousePointerClick}
          label={t('perf.offerViews')}
          value={n(s.offerViews)}
          hint={t('perf.offerViewsHint')}
        />
        <StatCard
          tone="highlight"
          icon={PhoneCall}
          label={t('perf.requests')}
          value={n(k.consentedRequests)}
          hint={t('perf.requestsHint')}
        />
      </section>
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          className="lg:col-span-2"
          title={t('perf.chartTitle')}
          subtitle={t('perf.chartSub')}
          table={{
            columns: [t('perf.measure'), t('perf.value')],
            rows: bars.map((b) => [b.label, n(b.value)]),
          }}
          footer={t('perf.requestRate', { pct: pct(k.consentedRequests, s.offerViews) })}
        >
          <BarChart data={bars} seriesLabel={t('perf.series')} color={CHART.primary} format={n} />
        </ChartCard>
        <section className="card relative overflow-hidden p-5">
          <Lock className="absolute end-4 bottom-4 size-20 text-brand/10" aria-hidden />
          <h2 className="text-lg font-bold text-brand-deep">{t('perf.noPersonal')}</h2>
          <p className="relative mt-2 text-sm text-ink-soft">{t('perf.noPersonalBody')}</p>
        </section>
      </div>
      <PrintDialog open={open} onOpenChange={setOpen} title={reportTitle}>
        <SponsorReportDoc title={reportTitle} />
      </PrintDialog>
    </>
  )
}
