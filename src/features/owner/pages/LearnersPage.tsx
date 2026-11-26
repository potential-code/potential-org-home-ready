import type { LearnerRecord } from '@shared/types'
import { BellRing, Filter, Users } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { DataTable } from '@/components/shared/DataTable'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { formatDate, formatNumber, useLocalized } from '@/i18n'
import { logExport } from '@/store/actions'
import { useKpis, useLearners, useNudges } from '@/store/hooks'
import { LearnerDrawer } from '../components/LearnerDrawer'
import { LearnerFilterBar } from '../components/LearnerFilterBar'
import { NudgeDialog } from '../components/NudgeDialog'
import { useLearnerColumns } from '../hooks/use-learner-columns'
import { useLearnerFilters } from '../hooks/use-learner-filters'
import { downloadCsv } from '../lib/csv'

/** Maya's Learners (C8.2, C12 saved filter and nudge). */
export function LearnersPage() {
  const { t } = useTranslation('owner')
  const { lang } = useLocalized()
  const learners = useLearners()
  const k = useKpis()
  const lastNudge = useNudges().find((x) => x.templateId === 'ET-nudge')
  const columns = useLearnerColumns()
  const { f, set, reset, rows } = useLearnerFilters(learners)
  const [open, setOpen] = useState<LearnerRecord | null>(null)
  const [nudge, setNudge] = useState(false)
  const saved = t('learners.savedFilter')
  const n = (x: number) => formatNumber(x, lang)

  return (
    <div className="space-y-5">
      <PageHeader
        title={t('pages.learners')}
        description={t('learners.description', { joined: n(k.joined) })}
      />
      <section className="card relative flex flex-wrap items-center justify-between gap-4 overflow-hidden p-4 sm:p-5">
        <label htmlFor="saved-filter" className="flex min-w-0 cursor-pointer items-center gap-3">
          <Switch id="saved-filter" checked={f.saved} onCheckedChange={(saved) => set({ saved })} />
          <span className="min-w-0">
            <span className="flex items-center gap-1.5 font-semibold">
              <Filter className="size-4 text-brand" aria-hidden />
              {saved}
            </span>
            <span className="block text-sm text-ink-soft">
              {t('learners.savedFilterHint', { count: n(k.noUsefulAction7d) })}
              {lastNudge &&
                ` · ${t('learners.lastNudge', { count: n(lastNudge.count), date: formatDate(lastNudge.at, lang) })}`}
            </span>
          </span>
        </label>
        <Button onClick={() => setNudge(true)} className="rounded-full">
          <BellRing aria-hidden />
          {t('learners.sendNudge')}
        </Button>
      </section>
      <LearnerFilterBar f={f} set={set} reset={reset} />
      <p className="flex items-center gap-1.5 text-sm text-ink-soft">
        <Users className="size-4" aria-hidden />
        {t('learners.showing', { count: rows.length, total: n(k.joined) })}
      </p>
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        onRowClick={setOpen}
        caption={t('pages.learners')}
        initialSort={{ key: 'lastActive', dir: 'desc' }}
        onExport={(cols, sorted) => {
          downloadCsv('home-ready-learners.csv', [
            cols.map((c) => c.header),
            ...sorted.map((r) =>
              cols.map((c) => String((c.exportValue ?? c.sortValue)?.(r) ?? '')),
            ),
          ])
          logExport('Maya', { en: 'Learners list (CSV)', ar: 'قائمة المتعلمين (CSV)' })
          toast.success(t('learners.exported'))
        }}
        empty={
          <EmptyState
            icon={Filter}
            title={t('learners.empty')}
            body={t('learners.emptyBody')}
            action={
              <Button variant="outline" size="sm" onClick={reset}>
                {t('common.clear')}
              </Button>
            }
          />
        }
      />
      <LearnerDrawer learner={open} onClose={() => setOpen(null)} />
      <NudgeDialog
        open={nudge}
        onOpenChange={setNudge}
        audience={saved}
        count={k.noUsefulAction7d}
      />
    </div>
  )
}
