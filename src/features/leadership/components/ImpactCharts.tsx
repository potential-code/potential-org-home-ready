import { useTranslation } from 'react-i18next'
import { BarChart, CHART, ChartCard } from '@/components/charts'
import { KPI, SCORE_DISTRIBUTION } from '@/data/figures'
import { formatNumber, useLocalized } from '@/i18n'
import { useKpis } from '@/store/hooks'
import { CONFIDENCE_COLOR, TRACK_COLOR, type TrackKey } from '../config'

/** Track completion, confidence, score distribution and the sponsor aggregate (C13). */
export function ImpactCharts({ track }: { track: TrackKey | 'all' }) {
  const { t } = useTranslation('leadership')
  const { lang } = useLocalized()
  const k = useKpis()
  const n = (v: number) => formatNumber(v, lang)
  const pctFmt = (v: number) => `${v}%`
  const completion = [
    { key: 'A' as const, label: t('charts.tracks.A'), value: KPI.trackACompletionPct },
    { key: 'B' as const, label: t('charts.tracks.B'), value: KPI.trackBCompletionPct },
  ]
    .filter((d) => track === 'all' || d.key === track)
    .map((d) => ({ ...d, color: TRACK_COLOR[d.key] }))
  const confidence = [
    { key: 'pre', label: t('charts.pre'), value: k.confidencePre, color: CONFIDENCE_COLOR.pre },
    { key: 'post', label: t('charts.post'), value: k.confidencePost, color: CONFIDENCE_COLOR.post },
  ]
  const scores = SCORE_DISTRIBUTION.map((s) => ({ key: s.band, label: s.band, value: s.count }))
  const scoreTotal = scores.reduce((s, x) => s + x.value, 0)
  const sponsor = [
    { key: 'imp', label: t('charts.impressions'), value: KPI.sponsor.impressions },
    { key: 'runs', label: t('charts.calculatorRuns'), value: KPI.sponsor.calculatorRuns },
    { key: 'views', label: t('charts.offerViews'), value: KPI.sponsor.offerViews },
    { key: 'req', label: t('charts.consentedRequests'), value: k.consentedRequests },
  ]
  return (
    <>
      <ChartCard
        title={t('charts.completion')}
        subtitle={t('charts.completionSub')}
        footer={t('charts.certificates', {
          total: n(k.certificates),
          a: n(k.certificatesA),
          b: n(k.certificatesB),
        })}
        table={{
          columns: [t('charts.track'), t('charts.completionSeries')],
          rows: completion.map((d) => [d.label, pctFmt(d.value)]),
        }}
      >
        <BarChart
          data={completion}
          seriesLabel={t('charts.completionSeries')}
          format={pctFmt}
          domainMax={100}
        />
      </ChartCard>
      <ChartCard
        title={t('charts.confidence')}
        subtitle={t('charts.confidenceSub')}
        table={{
          columns: [t('charts.measure'), t('charts.confidenceSeries')],
          rows: confidence.map((d) => [d.label, d.value.toFixed(1)]),
        }}
      >
        <BarChart
          data={confidence}
          layout="column"
          seriesLabel={t('charts.confidenceSeries')}
          format={(v) => v.toFixed(1)}
          domainMax={5}
          height={200}
        />
      </ChartCard>
      <ChartCard
        title={t('charts.scores')}
        subtitle={t('charts.scoresSub', { count: n(scoreTotal) })}
        table={{
          columns: [t('charts.band'), t('charts.scoresSeries')],
          rows: scores.map((d) => [d.label, d.value]),
        }}
      >
        <BarChart
          data={scores}
          layout="column"
          seriesLabel={t('charts.scoresSeries')}
          color={CHART.primary}
          height={200}
        />
      </ChartCard>
      <ChartCard
        title={t('charts.sponsor')}
        subtitle={t('charts.sponsorSub')}
        table={{
          columns: [t('charts.measure'), t('charts.value')],
          rows: sponsor.map((d) => [d.label, n(d.value)]),
        }}
      >
        <BarChart
          data={sponsor}
          seriesLabel={t('charts.sponsorSeries')}
          color={CHART.deep}
          format={n}
        />
      </ChartCard>
    </>
  )
}
