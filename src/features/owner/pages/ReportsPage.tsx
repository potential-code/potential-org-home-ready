import { FileSpreadsheet, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Stagger, StaggerItem } from '@/components/motion'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { logExport } from '@/store/actions'
import { useScorecard } from '../hooks/use-scorecard'
import { downloadCsv } from '../lib/csv'

/** Maya's Reports: Home Ready scorecard with simulated downloads. */
export function ReportsPage() {
  const { t } = useTranslation('owner')
  const sections = useScorecard()
  const xlsx = () => {
    downloadCsv('home-ready-scorecard.csv', [
      [t('reports.metric'), t('reports.value')],
      ...sections.flatMap((s) => s.rows.map((r) => [`${s.title}: ${r.label}`, r.value])),
    ])
    logExport('Maya', { en: 'Home Ready scorecard (XLSX)', ar: 'بطاقة أداء جاهز للسكن (XLSX)' })
    toast.success(t('reports.xlsxDone'))
  }
  const pdf = () => {
    logExport('Maya', { en: 'Home Ready scorecard (PDF)', ar: 'بطاقة أداء جاهز للسكن (PDF)' })
    toast.success(t('reports.pdfDone'))
    window.print()
  }
  return (
    <div className="space-y-5">
      <PageHeader
        title={t('pages.reports')}
        description={t('reports.description')}
        actions={
          <>
            <Button variant="outline" onClick={xlsx}>
              <FileSpreadsheet aria-hidden />
              {t('reports.xlsx')}
            </Button>
            <Button onClick={pdf} className="rounded-full">
              <FileText aria-hidden />
              {t('reports.pdf')}
            </Button>
          </>
        }
      />
      <Stagger className="grid gap-5 lg:grid-cols-2">
        {sections.map((s) => (
          <StaggerItem key={s.id} className={cn(s.id === 'engagement' && 'lg:row-span-2')}>
            <section className="card h-full p-5">
              <h2 className="text-lg">{s.title}</h2>
              {s.body && <p className="mt-1 text-sm text-ink-soft">{s.body}</p>}
              <dl className="mt-3 divide-y divide-border/70">
                {s.rows.map((r) => (
                  <div
                    key={r.label}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-2.5"
                  >
                    <dt className="text-sm">{r.label}</dt>
                    <dd
                      className={cn(
                        'text-sm font-bold tabular-nums',
                        r.muted && 'font-semibold text-ink-soft',
                      )}
                    >
                      {r.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  )
}
