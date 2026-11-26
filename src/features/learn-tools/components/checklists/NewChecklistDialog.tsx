import type { ChecklistTemplateId } from '@shared/types'
import { useNavigate } from '@tanstack/react-router'
import { Check, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CHECKLIST_TEMPLATES } from '@/data/checklists'
import { useLocalized } from '@/i18n'
import { cn } from '@/lib/utils'
import { createChecklist } from '@/store/actions'
import { useMe } from '@/store/hooks'

/** Create a saved checklist from a template, then open it. */
export function NewChecklistDialog({
  open,
  onOpenChange,
  initial,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: ChecklistTemplateId
}) {
  const { t } = useTranslation('journeys')
  const { l } = useLocalized()
  const me = useMe()
  const navigate = useNavigate()
  const [picked, setPicked] = useState<ChecklistTemplateId | undefined>(initial)
  const [error, setError] = useState(false)

  const create = () => {
    if (!picked) return setError(true)
    const id = createChecklist(me.id, picked)
    toast.success(t('checklists.created'))
    onOpenChange(false)
    navigate({ to: '/learn/checklists/$checklistId', params: { checklistId: id } })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (o) {
          setPicked(initial)
          setError(false)
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('checklists.dialog.title')}</DialogTitle>
          <DialogDescription>{t('checklists.dialog.body')}</DialogDescription>
        </DialogHeader>
        <div role="radiogroup" aria-label={t('checklists.templates')} className="grid gap-2">
          {CHECKLIST_TEMPLATES.map((tpl) => {
            const on = picked === tpl.id
            return (
              // biome-ignore lint/a11y/useSemanticElements: card-style radio option
              <button
                key={tpl.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => {
                  setPicked(tpl.id)
                  setError(false)
                }}
                className={cn(
                  'flex items-start gap-3 rounded-xl border p-3 text-start transition-colors focus-visible:ring-4 focus-visible:ring-brand-highlight/70 focus-visible:outline-none',
                  on
                    ? 'border-brand bg-brand text-white shadow-md'
                    : 'border-border bg-white hover:border-brand/50 hover:bg-tint-50',
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{l(tpl.title)}</span>
                  <span className={cn('block text-sm', on ? 'text-white/85' : 'text-ink-soft')}>
                    {l(tpl.summary)} {t('checklists.itemsCount', { count: tpl.items.length })}
                  </span>
                </span>
                {on && <Check className="mt-0.5 size-5 shrink-0" aria-hidden />}
              </button>
            )
          })}
        </div>
        {error && (
          <p role="alert" className="text-sm font-medium text-danger">
            {t('checklists.dialog.pick')}
          </p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('checklists.dialog.cancel')}
          </Button>
          <Button onClick={create} className="rounded-full">
            <Plus className="size-4" aria-hidden />
            {t('checklists.dialog.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
