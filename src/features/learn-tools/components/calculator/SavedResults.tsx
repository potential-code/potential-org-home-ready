import { BookmarkCheck, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { formatDate, useLocalized } from '@/i18n'
import { deleteCalcResult } from '@/store/actions'
import { useCalcResults } from '@/store/hooks'
import { CompareResults } from './CompareResults'

/** The learner's saved results: tick two to compare, delete with a toast. */
export function SavedResults() {
  const { t } = useTranslation('calculator')
  const { l, lang } = useLocalized()
  const results = useCalcResults()
  const [picked, setPicked] = useState<string[]>([])
  const [comparing, setComparing] = useState(false)
  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p.slice(-1), id]))
  const chosen = results.filter((r) => picked.includes(r.id))
  return (
    <section aria-labelledby="calc-saved" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="calc-saved" className="text-xl">
          {t('saved.title')}
        </h2>
        {results.length > 1 && (
          <Button size="sm" disabled={chosen.length !== 2} onClick={() => setComparing(true)}>
            {t('saved.compare', { n: chosen.length })}
          </Button>
        )}
      </div>
      {comparing && chosen.length === 2 && (
        <CompareResults items={chosen} onClose={() => setComparing(false)} />
      )}
      {results.length === 0 ? (
        <EmptyState
          icon={BookmarkCheck}
          title={t('saved.emptyTitle')}
          body={t('saved.emptyBody')}
        />
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {[...results].reverse().map((r) => (
            <li key={r.id} className="card flex items-start gap-3 p-4">
              <Checkbox
                id={`pick-${r.id}`}
                className="mt-1"
                checked={picked.includes(r.id)}
                onCheckedChange={() => toggle(r.id)}
                aria-label={t('saved.pick', { name: l(r.name) })}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-brand">
                  {t(`tabs.${r.tab}.title`)} · {formatDate(r.savedAt, lang)}
                </p>
                <label htmlFor={`pick-${r.id}`} className="mt-0.5 block font-semibold text-ink">
                  {l(r.name)}
                </label>
                <p className="mt-1 text-sm text-ink-soft">{l(r.summary)}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t('saved.delete', { name: l(r.name) })}
                onClick={() => {
                  deleteCalcResult(r.id)
                  setPicked((p) => p.filter((x) => x !== r.id))
                  toast.success(t('saved.deleted'))
                }}
              >
                <Trash2 className="size-4" aria-hidden />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
