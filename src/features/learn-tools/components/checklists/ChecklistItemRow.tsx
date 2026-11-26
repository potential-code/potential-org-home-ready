import type { ChecklistItemDef } from '@shared/types'
import { Link } from '@tanstack/react-router'
import { BookOpen, ExternalLink, NotebookPen } from 'lucide-react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { useLocalized } from '@/i18n'
import { cn } from '@/lib/utils'
import { setChecklistNote, toggleChecklistItem } from '@/store/actions'

/** One checklist item: tick, link to its lesson or official source, and a personal note. */
export function ChecklistItemRow({
  checklistId,
  item,
  done,
  note,
}: {
  checklistId: string
  item: ChecklistItemDef
  done: boolean
  note?: string
}) {
  const { t } = useTranslation('journeys')
  const { l } = useLocalized()
  const id = useId()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(note ?? '')
  const text = l(item.text)
  const linkCls =
    'inline-flex items-center gap-1.5 text-sm font-semibold text-brand underline-offset-4 hover:underline'

  const save = () => {
    setChecklistNote(checklistId, item.id, draft.trim())
    setEditing(false)
    toast.success(t('checklists.detail.noteSaved'))
  }

  return (
    <li className="flex gap-3 px-4 py-4 sm:px-5 print:break-inside-avoid print:px-0 print:py-2">
      <Checkbox
        id={id}
        checked={done}
        onCheckedChange={() => toggleChecklistItem(checklistId, item.id)}
        aria-label={t('checklists.detail.tick', { item: text })}
        className="mt-0.5 size-5"
      />
      <div className="min-w-0 flex-1 space-y-2">
        <label
          htmlFor={id}
          className={cn(
            'block cursor-pointer leading-snug font-medium',
            done ? 'text-ink-soft line-through decoration-ink-soft/60' : 'text-ink',
          )}
        >
          {text}
        </label>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 print:hidden">
          {item.link.kind === 'unit' ? (
            <Link to={item.link.to} className={linkCls}>
              <BookOpen className="size-4" aria-hidden />
              <span className="sr-only">{t('checklists.detail.unitLink')}: </span>
              {l(item.link.label)}
            </Link>
          ) : (
            <a href={item.link.to} target="_blank" rel="noreferrer noopener" className={linkCls}>
              <ExternalLink className="size-4" aria-hidden />
              <span className="sr-only">{t('checklists.detail.sourceLink')}: </span>
              {l(item.link.label)}
              <span className="sr-only">{t('checklists.detail.opensNewTab')}</span>
            </a>
          )}
          {!editing && (
            <button
              type="button"
              onClick={() => {
                setDraft(note ?? '')
                setEditing(true)
              }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-brand"
            >
              <NotebookPen className="size-4" aria-hidden />
              {note ? t('checklists.detail.editNote') : t('checklists.detail.addNote')}
            </button>
          )}
        </div>
        {note && !editing && (
          <p className="rounded-lg bg-tint-50 px-3 py-2 text-sm text-ink">{note}</p>
        )}
        {editing && (
          <div className="space-y-2">
            <label htmlFor={`${id}-note`} className="text-xs font-semibold text-ink-soft">
              {t('checklists.detail.noteLabel')}
            </label>
            <Textarea
              id={`${id}-note`}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={2}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={save}>
                {t('checklists.detail.saveNote')}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                {t('checklists.detail.cancel')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </li>
  )
}
