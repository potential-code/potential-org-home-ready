import type { Source } from '@shared/types'
import { ExternalLink, Pencil } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Column } from '@/components/shared/DataTable'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { formatDate, useLocalized } from '@/i18n'
import { nowMs } from '@/lib/clock'
import { useSettings } from '@/store/hooks'

/** Source register columns; "check due" follows the expiry setting. */
export function useSourceColumns(onEdit: (s: Source) => void): Column<Source>[] {
  const { t } = useTranslation('review')
  const { l, lang } = useLocalized()
  const expiry = useSettings().checkExpiryDays
  return useMemo(
    () =>
      [
        {
          key: 'name',
          header: t('sources.name'),
          sortValue: (s) => l(s.name),
          cell: (s) => (
            <span className="flex flex-col">
              <span className="font-semibold">{l(s.name)}</span>
              <span className="text-xs text-ink-soft">{l(s.org)}</span>
            </span>
          ),
        },
        {
          key: 'emirate',
          header: t('sources.emirate'),
          sortValue: (s) => l(s.emirate),
          cell: (s) => l(s.emirate),
          hideOnMobile: true,
        },
        {
          key: 'checked',
          header: t('sources.checked'),
          sortValue: (s) => s.checkedOn,
          cell: (s) => {
            const stale = nowMs() - Date.parse(s.checkedOn) > expiry * 86400000
            return (
              <span className="flex flex-col items-start gap-1">
                {formatDate(s.checkedOn, lang)}
                <StatusBadge tone={stale ? 'notice' : 'success'}>
                  {t(stale ? 'sources.stale' : 'sources.fresh')}
                </StatusBadge>
              </span>
            )
          },
        },
        {
          key: 'link',
          header: t('sources.link'),
          exportValue: (s) => s.url,
          cell: (s) => (
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-brand hover:underline"
            >
              {t('sources.open')}
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          ),
        },
        {
          key: 'actions',
          header: t('sources.update'),
          cell: (s) => (
            <Button variant="outline" size="sm" onClick={() => onEdit(s)}>
              <Pencil aria-hidden />
              {t('sources.update')}
            </Button>
          ),
        },
      ] satisfies Column<Source>[],
    [t, l, lang, expiry, onEdit],
  )
}
