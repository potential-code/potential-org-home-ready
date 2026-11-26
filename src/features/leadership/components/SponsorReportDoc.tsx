import { useTranslation } from 'react-i18next'
import { KPI } from '@/data/figures'
import { formatNumber, useLocalized } from '@/i18n'
import { useKpis } from '@/store/hooks'
import { DocList, DocSection, ReportDoc } from './ReportDoc'

/** "Sponsor aggregate report": counts only, never a name, email or phone. */
export function SponsorReportDoc({ title }: { title: string }) {
  const { t } = useTranslation(['leadership', 'sponsor'])
  const { lang } = useLocalized()
  const k = useKpis()
  const n = (v: number) => formatNumber(v, lang)
  return (
    <ReportDoc title={title}>
      <p className="rounded-xl bg-sponsor-soft px-3 py-2 font-semibold text-sponsor-ink">
        {t('sponsor:privacy')}
      </p>
      <DocSection title={t('charts.sponsor')}>
        <DocList
          rows={[
            { id: 'imp', label: t('charts.impressions'), value: n(KPI.sponsor.impressions) },
            { id: 'runs', label: t('charts.calculatorRuns'), value: n(KPI.sponsor.calculatorRuns) },
            { id: 'views', label: t('charts.offerViews'), value: n(KPI.sponsor.offerViews) },
            { id: 'req', label: t('charts.consentedRequests'), value: n(k.consentedRequests) },
            {
              id: 'unc',
              label: t('reports.status.unconsented'),
              value: n(k.unconsentedShares),
            },
          ]}
        />
      </DocSection>
    </ReportDoc>
  )
}
