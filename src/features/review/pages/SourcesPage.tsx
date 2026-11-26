import type { Source } from '@shared/types'
import { BookCheck, Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DataTable } from '@/components/shared/DataTable'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLocalized } from '@/i18n'
import { SourceDialog } from '../components/SourceDialog'
import { useSourceColumns } from '../hooks/use-source-columns'
import { useSourceRegister } from '../hooks/use-source-register'

/** Khalid's Sources register (C8.3). */
export function SourcesPage() {
  const { t } = useTranslation('review')
  const { l } = useLocalized()
  const sources = useSourceRegister()
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState<Source | 'new' | null>(null)
  const columns = useSourceColumns(setEditing)
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase()
    return s ? sources.filter((x) => `${l(x.name)} ${l(x.org)}`.toLowerCase().includes(s)) : sources
  }, [sources, q, l])
  return (
    <div className="space-y-5">
      <PageHeader
        title={t('pages.sources')}
        description={t('sources.description')}
        actions={
          <Button onClick={() => setEditing('new')} className="rounded-full">
            <Plus aria-hidden />
            {t('sources.add')}
          </Button>
        }
      />
      <div className="card p-4">
        <Label htmlFor="src-q" className="text-xs font-semibold text-ink-soft">
          {t('sources.search')}
        </Label>
        <div className="relative mt-1 max-w-md">
          <Search
            className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
            aria-hidden
          />
          <Input
            id="src-q"
            value={q}
            placeholder={t('sources.searchPlaceholder')}
            onChange={(e) => setQ(e.target.value)}
            className="ps-9"
          />
        </div>
      </div>
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(s) => s.id}
        pageSize={10}
        caption={t('pages.sources')}
        initialSort={{ key: 'checked', dir: 'asc' }}
        empty={
          <EmptyState
            icon={BookCheck}
            title={t('sources.empty')}
            body={t('sources.emptyBody')}
            action={
              <Button size="sm" onClick={() => setEditing('new')}>
                {t('sources.add')}
              </Button>
            }
          />
        }
      />
      <SourceDialog source={editing} onClose={() => setEditing(null)} />
    </div>
  )
}
