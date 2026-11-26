import type { AuditEntry } from '@shared/types'
import { History } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type Column, DataTable } from '@/components/shared/DataTable'
import { EmptyState } from '@/components/shared/EmptyState'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { formatDate, formatTime, useLocalized } from '@/i18n'
import { useAudit } from '@/store/hooks'
import { CONSENT_ACTIONS, PUBLISH_ACTIONS } from '../config'
import { useActorName } from '../hooks/use-actor-name'

type Kind = 'publish' | 'consent'

/** Settings: audit log of publish and consent events (C12). */
export function AuditLogCard() {
  const { t } = useTranslation('owner')
  const { l, lang } = useLocalized()
  const audit = useAudit()
  const actorName = useActorName()
  const [kind, setKind] = useState<Kind>('publish')
  const rows = useMemo(
    () =>
      audit.filter((a) =>
        (kind === 'publish' ? PUBLISH_ACTIONS : CONSENT_ACTIONS).test(a.action.en),
      ),
    [audit, kind],
  )
  const columns: Column<AuditEntry>[] = [
    {
      key: 'at',
      header: t('settings.when'),
      sortValue: (a) => a.at,
      cell: (a) => `${formatDate(a.at, lang)}, ${formatTime(a.at, lang)}`,
    },
    {
      key: 'actor',
      header: t('settings.who'),
      sortValue: (a) => a.actor,
      cell: (a) => actorName(a.actor),
    },
    {
      key: 'action',
      header: t('settings.what'),
      sortValue: (a) => l(a.action),
      cell: (a) => <span className="font-semibold">{l(a.action)}</span>,
    },
    { key: 'target', header: t('settings.target'), cell: (a) => l(a.target) },
  ]
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg">
            <History className="size-5 text-brand" aria-hidden />
            {t('settings.audit')}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">{t('settings.auditBody')}</p>
        </div>
        <ToggleGroup
          type="single"
          value={kind}
          onValueChange={(v) => v && setKind(v as Kind)}
          variant="outline"
          size="sm"
          aria-label={t('settings.audit')}
        >
          <ToggleGroupItem value="publish">{t('settings.filterPublish')}</ToggleGroupItem>
          <ToggleGroupItem value="consent">{t('settings.filterConsent')}</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(a) => a.id}
        initialSort={{ key: 'at', dir: 'desc' }}
        caption={t('settings.audit')}
        empty={
          <EmptyState
            icon={History}
            title={t('settings.auditEmpty')}
            body={t('settings.auditEmptyBody')}
          />
        }
      />
    </section>
  )
}
