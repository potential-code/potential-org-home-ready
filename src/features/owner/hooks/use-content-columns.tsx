import type { ContentItem, Localized } from '@shared/types'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Column } from '@/components/shared/DataTable'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { SOURCE_BY_ID } from '@/data/sources'
import { formatDate, useLocalized } from '@/i18n'
import { ContentActions } from '../components/ContentActions'
import { ContentStatusBadge } from '../components/ContentStatusBadge'

/** Content table columns. `titleOf` applies local title edits. */
export function useContentColumns(
  titleOf: (c: ContentItem) => Localized,
  onEdit: (c: ContentItem) => void,
): Column<ContentItem>[] {
  const { t } = useTranslation('owner')
  const { l, lang } = useLocalized()
  return useMemo(
    () =>
      [
        {
          key: 'item',
          header: t('content.col.item'),
          sortValue: (c) => titleOf(c).en,
          cell: (c) => (
            <span className="flex flex-col gap-1">
              <span className="font-semibold">{titleOf(c).en}</span>
              <span className="text-xs text-ink-soft">
                {t(`content.kinds.${c.kind}`)}
                {c.track ? ` · ${t(`track.${c.track}`)}` : ''}
              </span>
            </span>
          ),
        },
        {
          key: 'versions',
          header: t('content.col.versions'),
          cell: (c) => (
            <span className="flex flex-col items-start gap-1">
              <ContentStatusBadge status={c.en} prefix="EN" />
              <ContentStatusBadge status={c.ar} prefix="AR" />
              {c.arDraft && c.ar !== 'published' && (
                <StatusBadge tone="brand">{t('content.arDraft')}</StatusBadge>
              )}
            </span>
          ),
        },
        {
          key: 'sources',
          header: t('content.col.sources'),
          hideOnMobile: true,
          exportValue: (c) => c.sourceIds.join('; '),
          cell: (c) => (
            <ul className="space-y-0.5 text-xs">
              {c.sourceIds.map((s) => (
                <li key={s}>{SOURCE_BY_ID[s] ? l(SOURCE_BY_ID[s].org) : s}</li>
              ))}
            </ul>
          ),
        },
        {
          key: 'checked',
          header: t('content.col.checked'),
          sortValue: (c) => c.checkedOn,
          cell: (c) => formatDate(c.checkedOn, lang),
        },
        {
          key: 'status',
          header: t('content.col.status'),
          sortValue: (c) => c.status,
          cell: (c) => <ContentStatusBadge status={c.status} />,
        },
        {
          key: 'actions',
          header: t('common.actions'),
          cell: (c) => <ContentActions item={c} title={titleOf(c).en} onEdit={() => onEdit(c)} />,
        },
      ] satisfies Column<ContentItem>[],
    [t, l, lang, titleOf, onEdit],
  )
}
