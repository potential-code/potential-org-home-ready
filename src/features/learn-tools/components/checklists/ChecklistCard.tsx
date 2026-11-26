import type { SavedChecklist } from '@shared/types'
import { Link } from '@tanstack/react-router'
import { ArrowRight, ListChecks } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { CHECKLIST_BY_ID } from '@/data/checklists'
import { formatDate, useLocalized } from '@/i18n'
import { checklistProgress, STATUS_TONE } from './checklist-status'
import { ProgressBar } from './ProgressBar'

/** One saved checklist: title, template track, progress and a whole-card link. */
export function ChecklistCard({ checklist }: { checklist: SavedChecklist }) {
  const { t } = useTranslation('journeys')
  const { l, lang } = useLocalized()
  const p = checklistProgress(checklist)
  const tpl = CHECKLIST_BY_ID[checklist.templateId]
  const title = l(checklist.title)
  return (
    <Link
      to="/learn/checklists/$checklistId"
      params={{ checklistId: checklist.id }}
      aria-label={t('checklists.openNamed', { title })}
      className="card card-hover group relative flex flex-col gap-4 overflow-hidden p-5 focus-visible:ring-4 focus-visible:ring-brand-highlight/70"
    >
      <ListChecks
        className="absolute -end-3 -bottom-3 size-20 text-brand/[0.05]"
        strokeWidth={1.5}
        aria-hidden
      />
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge tone={STATUS_TONE[p.status]}>{t(`checklists.status.${p.status}`)}</StatusBadge>
        {tpl && <StatusBadge tone="brand">{t(`checklists.track.${tpl.track}`)}</StatusBadge>}
      </div>
      <div className="min-w-0 space-y-1">
        <h3 className="text-lg leading-snug font-bold text-ink">{title}</h3>
        {tpl && <p className="text-sm text-ink-soft">{l(tpl.summary)}</p>}
      </div>
      <div className="relative mt-auto space-y-2">
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="font-semibold text-ink tabular-nums">
            {t('checklists.progress', { done: p.done, total: p.total })}
          </span>
          <span className="text-ink-soft">
            {t('checklists.updated', { date: formatDate(checklist.updatedAt, lang) })}
          </span>
        </div>
        <ProgressBar value={p.pct} label={t('checklists.progressLabel')} />
        <span className="inline-flex items-center gap-1 pt-1 text-sm font-semibold text-brand">
          {t('checklists.open')}
          <ArrowRight
            className="size-4 rtl-mirror transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  )
}
