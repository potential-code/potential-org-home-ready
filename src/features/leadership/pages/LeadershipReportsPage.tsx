import { FileBarChart, FileSpreadsheet, FileText } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { formatNumber, useLocalized } from '@/i18n'
import { logExport } from '@/store/actions'
import { useKpis, useMe } from '@/store/hooks'
import { DownloadHistory } from '../components/DownloadHistory'
import { LeadershipSummaryDoc } from '../components/LeadershipSummaryDoc'
import { PageBanner } from '../components/PageBanner'
import { PrintDialog } from '../components/PrintDialog'
import { ReportCard } from '../components/ReportCard'
import { SponsorReportDoc } from '../components/SponsorReportDoc'
import { downloadCsv } from '../lib/csv'
import { scorecardRows, statusRows } from '../lib/scorecard'

type Doc = 'summary' | 'sponsor' | null

/** Reports tab (C13): scorecard (CSV for Excel), leadership summary and sponsor report (print). */
export function LeadershipReportsPage() {
  const { t } = useTranslation('leadership')
  const { l, lang } = useLocalized()
  const me = useMe()
  const k = useKpis()
  const [doc, setDoc] = useState<Doc>(null)
  const actor = l(me.name)
  const n = (v: number) => formatNumber(v, lang)

  const record = (title: string) => {
    logExport(actor, title)
    toast.success(t('reports.downloaded', { name: title }))
  }
  const scorecard = () => {
    const kpis = scorecardRows(k, t, n)
    downloadCsv('home-ready-scorecard.csv', [
      [
        t('reports.csv.kpi'),
        t('reports.csv.definition'),
        t('reports.csv.target'),
        t('reports.csv.value'),
        t('reports.csv.trend'),
      ],
      ...kpis.map((r) => [r.label, r.definition, r.target, r.value, r.trend]),
      [],
      [t('reports.sections.status')],
      ...statusRows(k, t).map((r) => [r.label, r.value]),
    ])
    record(t('reports.scorecard.title'))
  }
  const open = (d: Exclude<Doc, null>) => {
    setDoc(d)
    record(t(`reports.${d}.title`))
  }

  return (
    <>
      <PageBanner eyebrow={t('banner.eyebrow')} title={t('banner.reportsTitle')}>
        <p>{t('banner.reportsBody')}</p>
      </PageBanner>
      <div className="grid gap-4 md:grid-cols-3">
        <ReportCard
          icon={FileSpreadsheet}
          title={t('reports.scorecard.title')}
          body={t('reports.scorecard.body')}
          format={t('reports.scorecard.format')}
          action={t('reports.scorecard.action')}
          onAction={scorecard}
        />
        <ReportCard
          icon={FileText}
          title={t('reports.summary.title')}
          body={t('reports.summary.body')}
          format={t('reports.summary.format')}
          action={t('reports.summary.action')}
          onAction={() => open('summary')}
        />
        <ReportCard
          icon={FileBarChart}
          title={t('reports.sponsor.title')}
          body={t('reports.sponsor.body')}
          format={t('reports.sponsor.format')}
          action={t('reports.sponsor.action')}
          onAction={() => open('sponsor')}
        />
      </div>
      <DownloadHistory actor={actor} />
      <PrintDialog
        open={doc !== null}
        onOpenChange={(o) => !o && setDoc(null)}
        title={doc ? t(`reports.${doc}.title`) : ''}
      >
        {doc === 'summary' && <LeadershipSummaryDoc />}
        {doc === 'sponsor' && <SponsorReportDoc title={t('reports.sponsor.title')} />}
      </PrintDialog>
    </>
  )
}
