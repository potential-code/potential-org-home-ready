import type { ShortlistHome } from '@shared/types'
import { MapPin, NotebookPen, Trash2 } from 'lucide-react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
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
import { Textarea } from '@/components/ui/textarea'
import type { TrueCostResult } from '@/domain/calculator'
import { formatNumber, useLocalized } from '@/i18n'
import { cn } from '@/lib/utils'
import { removeHome, updateHome } from '@/store/actions'

/** One shortlisted home in the side-by-side comparison: costs from the domain, notes, remove. */
export function HomeCard({
  home,
  cost,
  lowest,
}: {
  home: ShortlistHome
  cost: TrueCostResult
  lowest: boolean
}) {
  const { t } = useTranslation('journeys')
  const { l, lang } = useLocalized()
  const id = useId()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(home.notes)
  const name = l(home.title)
  const aed = (n: number) => t('homes.aed', { value: formatNumber(Math.round(n), lang) })

  const rows = [
    { label: t('homes.advertised'), value: aed(home.annualRent) },
    { label: t('homes.monthly'), value: aed(cost.monthly) },
    { label: t('homes.upfront'), value: aed(cost.upfrontCash) },
    {
      label: t('homes.refundable'),
      value: aed(cost.refundable),
      hint: t('homes.refundableHint'),
    },
  ]

  return (
    <article
      className={cn(
        'card flex flex-col overflow-hidden',
        lowest && 'ring-2 ring-brand ring-offset-2 ring-offset-white',
      )}
    >
      <header className="space-y-2 p-5 pb-4">
        <div className="flex min-h-6 flex-wrap gap-2">
          {lowest && <StatusBadge tone="success">{t('homes.lowestBadge')}</StatusBadge>}
          <StatusBadge tone="neutral">
            {home.furnished ? t('homes.furnished') : t('homes.unfurnished')}
          </StatusBadge>
        </div>
        <h3 className="text-lg leading-snug font-bold">{name}</h3>
        <p className="flex items-center gap-1.5 text-sm text-ink-soft">
          <MapPin className="size-4 shrink-0 text-brand" aria-hidden />
          {l(home.area)} · {l(home.bedrooms)} · {t('homes.cheques', { n: home.cheques })}
        </p>
      </header>
      <div className="bg-tint-50 px-5 py-4">
        <p className="text-xs font-semibold text-ink-soft">{t('homes.trueYearly')}</p>
        <p className="text-3xl font-extrabold tracking-tight text-brand-deep tabular-nums">
          {aed(cost.firstYear)}
        </p>
      </div>
      <dl className="divide-y divide-border/70 px-5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-3 py-2.5 text-sm">
            <dt className="text-ink-soft">
              {r.label}
              {r.hint && <span className="block text-xs">{r.hint}</span>}
            </dt>
            <dd className="font-semibold whitespace-nowrap text-ink tabular-nums">{r.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-auto space-y-2 border-t border-border/70 p-5">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
          <NotebookPen className="size-4" aria-hidden />
          {t('homes.notes')}
        </p>
        {editing ? (
          <>
            <label htmlFor={id} className="sr-only">
              {t('homes.notesLabel', { home: name })}
            </label>
            <Textarea id={id} value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  updateHome(home.id, { notes: draft.trim() })
                  setEditing(false)
                  toast.success(t('homes.notesSaved'))
                }}
              >
                {t('homes.saveNotes')}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                {t('homes.cancel')}
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm text-ink">{home.notes || t('homes.noNotes')}</p>
        )}
        {!editing && (
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setDraft(home.notes)
                setEditing(true)
              }}
            >
              {t('homes.editNotes')}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-danger hover:text-danger"
                  aria-label={t('homes.removeNamed', { home: name })}
                >
                  <Trash2 className="size-4" aria-hidden />
                  {t('homes.remove')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('homes.removeTitle')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('homes.removeBody', { home: name })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('homes.cancel')}</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => {
                      removeHome(home.id)
                      toast.success(t('homes.removed'))
                    }}
                  >
                    {t('homes.removeConfirm')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </article>
  )
}
