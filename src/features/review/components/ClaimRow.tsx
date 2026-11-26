import type { Claim } from '@shared/types'
import { CalendarCheck, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatDate, useLocalized } from '@/i18n'
import { updateClaimCheckDate } from '@/store/actions'
import { useSourceRegister } from '../hooks/use-source-register'

/** One claim: text, official source link, editable "checked on" date. */
export function ClaimRow({
  reviewId,
  claim,
  readOnly,
}: {
  reviewId: string
  claim: Claim
  readOnly: boolean
}) {
  const { t } = useTranslation('review')
  const { l, lang } = useLocalized()
  const source = useSourceRegister().find((s) => s.id === claim.sourceId)
  const [date, setDate] = useState(claim.checkedOn.slice(0, 10))
  useEffect(() => setDate(claim.checkedOn.slice(0, 10)), [claim.checkedOn])
  const id = `chk-${claim.id}`
  const save = () => {
    updateClaimCheckDate(reviewId, claim.id, date)
    toast.success(t('item.checkUpdated', { date: formatDate(date, lang) }))
  }
  return (
    <li className="grid gap-3 py-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-end">
      <div className="min-w-0 space-y-1">
        <p className="font-semibold">{claim.text}</p>
        <p className="text-sm text-ink-soft">
          {t('item.source')}: {source ? `${l(source.org)}, ${l(source.name)}` : claim.sourceId}
        </p>
        {source && (
          <a
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
          >
            {t('item.openSource')}
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        )}
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor={id} className="text-xs font-semibold text-ink-soft">
            {t('item.checkedOn')}
          </Label>
          <Input
            id={id}
            type="date"
            value={date}
            disabled={readOnly}
            onChange={(e) => setDate(e.target.value)}
            className="h-9 w-40"
          />
        </div>
        {!readOnly && (
          <Button variant="outline" size="sm" onClick={save} disabled={!date}>
            <CalendarCheck aria-hidden />
            {t('item.updateCheck')}
          </Button>
        )}
      </div>
    </li>
  )
}
