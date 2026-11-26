import { FileDown } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type Column, DataTable } from '@/components/shared/DataTable'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatDate, formatTime, useLocalized } from '@/i18n'
import { useAudit } from '@/store/hooks'

type Entry = ReturnType<typeof useAudit>[number]

/** Downloads by the signed-in staff member, read from the shared audit log. */
export function DownloadHistory({ actor }: { actor: string }) {
  const { t } = useTranslation('leadership')
  const { lang } = useLocalized()
  const audit = useAudit()
  const rows = useMemo(
    () => audit.filter((a) => a.action === 'Report downloaded' && a.actor === actor),
    [audit, actor],
  )
  const columns: Column<Entry>[] = [
    {
      key: 'report',
      header: t('reports.colReport'),
      cell: (r) => r.target,
      sortValue: (r) => r.target,
    },
    {
      key: 'when',
      header: t('reports.colWhen'),
      cell: (r) => `${formatDate(r.at, lang)}, ${formatTime(r.at, lang)}`,
      sortValue: (r) => r.at,
    },
  ]
  return (
    <section className="card mt-6 overflow-hidden p-5">
      <h2 className="text-lg font-bold text-brand-deep">{t('reports.historyTitle')}</h2>
      <p className="mb-4 text-sm text-ink-soft">{t('reports.historySub')}</p>
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        pageSize={5}
        initialSort={{ key: 'when', dir: 'desc' }}
        empty={
          <EmptyState
            icon={FileDown}
            title={t('reports.historyEmpty')}
            body={t('reports.historyEmptyBody')}
          />
        }
      />
    </section>
  )
}
