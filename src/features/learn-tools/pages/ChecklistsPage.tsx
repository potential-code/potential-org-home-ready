import type { ChecklistTemplateId } from '@shared/types'
import { CheckCheck, ClipboardList, ListChecks, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { Button } from '@/components/ui/button'
import { CHECKLIST_TEMPLATES } from '@/data/checklists'
import { useLocalized } from '@/i18n'
import { useChecklists } from '@/store/hooks'
import { ChecklistCard } from '../components/checklists/ChecklistCard'
import { checklistProgress } from '../components/checklists/checklist-status'
import { NewChecklistDialog } from '../components/checklists/NewChecklistDialog'

/** My checklists (brief C11.6): saved checklists with progress, and templates to start from. */
export function ChecklistsPage() {
  const { t } = useTranslation('journeys')
  const { l } = useLocalized()
  const checklists = useChecklists()
  const [open, setOpen] = useState(false)
  const [initial, setInitial] = useState<ChecklistTemplateId | undefined>()

  const sorted = useMemo(
    () => [...checklists].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [checklists],
  )
  const totals = useMemo(() => {
    const ps = checklists.map(checklistProgress)
    return {
      ticked: ps.reduce((s, p) => s + p.done, 0),
      complete: ps.filter((p) => p.status === 'complete').length,
    }
  }, [checklists])

  const start = (id?: ChecklistTemplateId) => {
    setInitial(id)
    setOpen(true)
  }

  return (
    <>
      <PageHeader
        title={t('checklists.title')}
        description={t('checklists.description')}
        actions={
          <Button onClick={() => start()} className="rounded-full">
            <Plus className="size-4" aria-hidden />
            {t('checklists.new')}
          </Button>
        }
      />
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          tone="primary"
          icon={ClipboardList}
          label={t('checklists.stats.saved')}
          value={checklists.length}
          hint={t('checklists.stats.savedHint')}
        />
        <StatCard
          tone="accent"
          icon={ListChecks}
          label={t('checklists.stats.ticked')}
          value={totals.ticked}
          hint={t('checklists.stats.tickedHint')}
        />
        <StatCard
          tone="deep"
          icon={CheckCheck}
          label={t('checklists.stats.complete')}
          value={totals.complete}
          hint={t('checklists.stats.completeHint')}
        />
      </div>

      {sorted.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map((c) => (
            <ChecklistCard key={c.id} checklist={c} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ListChecks}
          title={t('checklists.emptyTitle')}
          body={t('checklists.emptyBody')}
          action={
            <Button onClick={() => start()} className="rounded-full">
              {t('checklists.new')}
            </Button>
          }
        />
      )}

      <section aria-labelledby="tpl-h" className="mt-10">
        <h2 id="tpl-h" className="text-xl">
          {t('checklists.templates')}
        </h2>
        <p className="mt-1 mb-4 text-sm text-ink-soft">{t('checklists.templatesBody')}</p>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {CHECKLIST_TEMPLATES.map((tpl) => (
            <li key={tpl.id} className="card flex flex-col gap-2 p-4">
              <p className="text-xs font-semibold text-ink-soft">
                {t(`checklists.track.${tpl.track}`)} ·{' '}
                {t('checklists.itemsCount', { count: tpl.items.length })}
              </p>
              <h3 className="leading-snug font-bold">{l(tpl.title)}</h3>
              <Button
                variant="outline"
                size="sm"
                className="mt-auto self-start"
                onClick={() => start(tpl.id)}
              >
                {t('checklists.useTemplate')}
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <NewChecklistDialog open={open} onOpenChange={setOpen} initial={initial} />
    </>
  )
}
