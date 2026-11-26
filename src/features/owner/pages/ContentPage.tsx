import type { ContentItem } from '@shared/types'
import { FileSearch } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DataTable } from '@/components/shared/DataTable'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { useContent } from '@/store/hooks'
import { ContentEditDialog } from '../components/ContentEditDialog'
import { FilterSelect } from '../components/FilterSelect'
import { SearchInput } from '../components/SearchInput'
import { KIND_OPTIONS, STATUS_OPTIONS } from '../config'
import { useContentColumns } from '../hooks/use-content-columns'
import { useContentEdits } from '../hooks/use-content-edits'

/** Maya's Content (C8.2). */
export function ContentPage() {
  const { t } = useTranslation('owner')
  const content = useContent()
  const edits = useContentEdits()
  const [q, setQ] = useState('')
  const [kind, setKind] = useState('all')
  const [status, setStatus] = useState('all')
  const [editing, setEditing] = useState<ContentItem | null>(null)
  const titleOf = useCallback((c: ContentItem) => edits[c.id] ?? c.title, [edits])
  const columns = useContentColumns(titleOf, setEditing)
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase()
    return content.filter(
      (c) =>
        (!s || titleOf(c).en.toLowerCase().includes(s)) &&
        (kind === 'all' || c.kind === kind) &&
        (status === 'all' || c.status === status),
    )
  }, [content, q, kind, status, titleOf])
  const all = { value: 'all', label: t('common.all') }

  return (
    <div className="space-y-5">
      <PageHeader title={t('pages.content')} description={t('content.description')} />
      <div className="card grid grid-cols-2 gap-3 p-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] sm:items-end">
        <div className="col-span-2 sm:col-span-1">
          <SearchInput
            id="cf-q"
            label={t('common.search')}
            value={q}
            placeholder={t('content.col.item')}
            onChange={setQ}
          />
        </div>
        <FilterSelect
          id="cf-kind"
          label={t('content.kind')}
          value={kind}
          onChange={setKind}
          options={[
            all,
            ...KIND_OPTIONS.map((k) => ({ value: k, label: t(`content.kinds.${k}`) })),
          ]}
        />
        <FilterSelect
          id="cf-status"
          label={t('common.status')}
          value={status}
          onChange={setStatus}
          options={[all, ...STATUS_OPTIONS.map((s) => ({ value: s, label: t(`status.${s}`) }))]}
        />
      </div>
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        pageSize={10}
        caption={t('pages.content')}
        initialSort={{ key: 'status', dir: 'asc' }}
        empty={
          <EmptyState icon={FileSearch} title={t('content.empty')} body={t('content.emptyBody')} />
        }
      />
      <ContentEditDialog
        item={editing}
        title={editing ? titleOf(editing) : { en: '' }}
        onClose={() => setEditing(null)}
      />
    </div>
  )
}
