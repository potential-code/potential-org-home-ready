import type { LearnerRecord } from '@shared/types'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Column } from '@/components/shared/DataTable'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Progress } from '@/components/ui/progress'
import { formatDate, useLocalized } from '@/i18n'

/** Learners table columns (C8.2). */
export function useLearnerColumns(): Column<LearnerRecord>[] {
  const { t } = useTranslation('owner')
  const { lang } = useLocalized()
  return useMemo(() => {
    const d = (iso: string) => formatDate(iso, lang)
    return [
      {
        key: 'name',
        header: t('learners.col.name'),
        sortValue: (l) => l.name,
        cell: (l) => (
          <span className="flex flex-col">
            <span className="font-semibold">{l.name}</span>
            <span className="text-xs text-ink-soft">{l.email}</span>
          </span>
        ),
      },
      {
        key: 'emirate',
        header: t('learners.col.emirate'),
        sortValue: (l) => t(`emirate.${l.emirate}`),
        cell: (l) => t(`emirate.${l.emirate}`),
      },
      {
        key: 'track',
        header: t('learners.col.track'),
        sortValue: (l) => t(`track.${l.track}`),
        cell: (l) => t(`track.${l.track}`),
      },
      {
        key: 'progress',
        header: t('learners.col.progress'),
        sortValue: (l) => l.progress,
        cell: (l) => (
          <span className="flex min-w-24 items-center gap-2">
            <Progress
              value={l.progress}
              aria-label={`${l.progress}%`}
              className="h-1.5 w-14 bg-tint-100"
            />
            <span className="text-xs tabular-nums">{l.progress}%</span>
          </span>
        ),
      },
      {
        key: 'useful',
        header: t('learners.col.useful'),
        sortValue: (l) => l.firstUsefulActionAt ?? '',
        exportValue: (l) => l.firstUsefulActionAt ?? 'No',
        cell: (l) =>
          l.firstUsefulActionAt ? (
            <StatusBadge tone="success">
              {t('common.yes')}, {d(l.firstUsefulActionAt)}
            </StatusBadge>
          ) : (
            <StatusBadge tone="notice">{t('learners.noAction')}</StatusBadge>
          ),
      },
      {
        key: 'lastActive',
        header: t('learners.col.lastActive'),
        sortValue: (l) => l.lastActive,
        cell: (l) => d(l.lastActive),
        hideOnMobile: true,
      },
      {
        key: 'reminders',
        header: t('learners.col.reminders'),
        sortValue: (l) => l.reminders,
        cell: (l) => l.reminders,
        align: 'end',
        hideOnMobile: true,
      },
      {
        key: 'consents',
        header: t('learners.col.consents'),
        sortValue: (l) => l.partnerConsents,
        exportValue: (l) => `${l.partnerConsents} partner; marketing ${l.marketing ? 'on' : 'off'}`,
        cell: (l) =>
          t('learners.consentsValue', {
            partner: l.partnerConsents,
            marketing: t(l.marketing ? 'learners.on' : 'learners.off'),
          }),
        hideOnMobile: true,
      },
    ] satisfies Column<LearnerRecord>[]
  }, [t, lang])
}
