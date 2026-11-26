import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { FileDown, Link2, ListChecks, Loader2, Trash2 } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Motif } from '@/components/brand'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { CHECKLIST_BY_ID } from '@/data/checklists'
import { formatDate, useLocalized } from '@/i18n'
import { now } from '@/lib/clock'
import { createChecklist, deleteChecklist } from '@/store/actions'
import { useChecklist, useMe } from '@/store/hooks'
import { ChecklistItemRow } from '../components/checklists/ChecklistItemRow'
import { checklistProgress, STATUS_TONE } from '../components/checklists/checklist-status'
import { ProgressBar } from '../components/checklists/ProgressBar'

/** Print only the checklist (Export PDF uses the browser's print to PDF). */
const PRINT_CSS =
  '@media print{body *{visibility:hidden}#checklist-print,#checklist-print *{visibility:visible}#checklist-print{position:absolute;inset:0 auto auto 0;width:100%}}'

/**
 * Last checklist created from /learn/checklists/new. The route can re-mount while it redirects,
 * so a second mount within a few seconds reuses the id instead of creating a duplicate.
 */
const lastCreated = { template: '', id: '', at: 0 }

/** One saved checklist (C11.6). /learn/checklists/new?template=<id> creates one first. */
export function ChecklistDetailPage() {
  const { t } = useTranslation('journeys')
  const { l, lang } = useLocalized()
  const me = useMe()
  const navigate = useNavigate()
  const { checklistId } = useParams({ from: '/learn/checklists/$checklistId' })
  const { template } = useSearch({ from: '/learn/checklists/$checklistId' })
  const checklist = useChecklist(checklistId)
  const created = useRef(false)

  useEffect(() => {
    if (checklistId !== 'new' || created.current) return
    created.current = true
    const tpl = template && CHECKLIST_BY_ID[template] ? template : undefined
    if (!tpl) {
      navigate({ to: '/learn/checklists', replace: true })
      return
    }
    const fresh = lastCreated.template === tpl && performance.now() - lastCreated.at < 3000
    const id = fresh ? lastCreated.id : createChecklist(me.id, tpl)
    if (!fresh) {
      Object.assign(lastCreated, { template: tpl, id, at: performance.now() })
      toast.success(t('checklists.created'))
    }
    navigate({ to: '/learn/checklists/$checklistId', params: { checklistId: id }, replace: true })
  }, [checklistId, template, me.id, navigate, t])

  const crumbs = [{ label: t('checklists.detail.back'), to: '/learn/checklists' }]

  if (checklistId === 'new')
    return (
      <p className="flex items-center gap-2 py-10 text-ink-soft" role="status">
        <Loader2 className="size-5 animate-spin" aria-hidden />
        {t('checklists.detail.creating')}
      </p>
    )

  if (!checklist || checklist.learnerId !== me.id)
    return (
      <>
        <PageHeader title={t('checklists.detail.notFoundTitle')} crumbs={crumbs} />
        <EmptyState
          icon={ListChecks}
          title={t('checklists.detail.notFoundTitle')}
          body={t('checklists.detail.notFoundBody')}
          action={
            <Button onClick={() => navigate({ to: '/learn/checklists' })} className="rounded-full">
              {t('checklists.detail.back')}
            </Button>
          }
        />
      </>
    )

  const tpl = CHECKLIST_BY_ID[checklist.templateId]
  const p = checklistProgress(checklist)
  const title = l(checklist.title)

  const share = async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href)
    } catch {
      // Clipboard can be blocked; the link is still shown in the address bar.
    }
    toast.success(t('checklists.detail.shared'))
  }
  const remove = () => {
    deleteChecklist(checklist.id)
    toast.success(t('checklists.detail.deleted'))
    navigate({ to: '/learn/checklists' })
  }

  return (
    <div id="checklist-print">
      <style>{PRINT_CSS}</style>
      <PageHeader
        title={title}
        crumbs={crumbs}
        description={tpl ? l(tpl.summary) : undefined}
        actions={
          <div className="flex flex-wrap gap-2 print:hidden">
            <Button variant="outline" onClick={() => window.print()}>
              <FileDown className="size-4" aria-hidden />
              {t('checklists.detail.export')}
            </Button>
            <Button variant="outline" onClick={share}>
              <Link2 className="size-4" aria-hidden />
              {t('checklists.detail.share')}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="text-danger hover:text-danger">
                  <Trash2 className="size-4" aria-hidden />
                  {t('checklists.detail.delete')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('checklists.detail.deleteTitle')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('checklists.detail.deleteBody')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('checklists.detail.cancel')}</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={remove}>
                    {t('checklists.detail.deleteConfirm')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      />

      <section className="relative mb-6 overflow-hidden rounded-3xl bg-grad-brand p-6 text-white shadow-lg print:bg-none print:p-0 print:text-ink print:shadow-none">
        <Motif variant="banner" className="text-white/[0.12] print:hidden" />
        <div className="relative max-w-xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone={STATUS_TONE[p.status]}>
              {t(`checklists.status.${p.status}`)}
            </StatusBadge>
            {tpl && <StatusBadge tone="brand">{t(`checklists.track.${tpl.track}`)}</StatusBadge>}
          </div>
          <p className="text-3xl font-extrabold tabular-nums">
            {t('checklists.detail.summary', { done: p.done, total: p.total })}
          </p>
          <ProgressBar
            value={p.pct}
            label={t('checklists.progressLabel')}
            className="bg-white/25 print:hidden"
            fillClassName="bg-brand-highlight"
          />
          <p className="text-sm text-white/85 print:text-ink-soft">
            {p.status === 'complete'
              ? t('checklists.detail.allDone')
              : t('checklists.updated', { date: formatDate(checklist.updatedAt, lang) })}
          </p>
        </div>
      </section>

      <section
        aria-labelledby="items-h"
        className="card overflow-hidden print:shadow-none print:border-0"
      >
        <h2 id="items-h" className="border-b border-border/70 px-5 py-3 text-lg print:px-0">
          {t('checklists.detail.items')}
        </h2>
        <ul className="divide-y divide-border/70">
          {(tpl?.items ?? []).map((item) => (
            <ChecklistItemRow
              key={item.id}
              checklistId={checklist.id}
              item={item}
              done={checklist.ticked.includes(item.id)}
              note={l(checklist.notes[item.id]) || undefined}
            />
          ))}
        </ul>
      </section>
      <p className="mt-4 hidden text-xs text-ink-soft print:block">
        {t('checklists.detail.printedOn', { date: formatDate(now(), lang) })}
      </p>
    </div>
  )
}
