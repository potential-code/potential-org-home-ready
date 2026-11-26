import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { type ReactNode, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatNumber, useLocalized } from '@/i18n'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: string
  header: string
  cell: (row: T) => ReactNode
  /** Enables sorting on this column. */
  sortValue?: (row: T) => string | number | null | undefined
  /** Plain value for CSV export (defaults to sortValue). */
  exportValue?: (row: T) => string | number | null | undefined
  className?: string
  /** Hidden in the mobile card layout. */
  hideOnMobile?: boolean
  align?: 'start' | 'end'
}

/**
 * Client-side table with sorting and pagination, inside a lifted `card`. Below `md` it becomes a
 * stacked card list so wide tables stay usable on phones. Optional CSV export callback.
 * Pure local state: pass already-filtered `rows` (filters live in the page or a hook).
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  pageSize = 8,
  empty,
  onRowClick,
  onExport,
  caption,
  initialSort,
}: {
  columns: Column<T>[]
  rows: T[]
  getRowId: (row: T) => string
  pageSize?: number
  /** Shown when there are no rows (use an `EmptyState` that explains the next step). */
  empty?: ReactNode
  onRowClick?: (row: T) => void
  onExport?: (columns: Column<T>[], sorted: T[]) => void
  caption?: string
  initialSort?: { key: string; dir: 'asc' | 'desc' }
}) {
  const { t } = useTranslation()
  const { lang } = useLocalized()
  const [sort, setSort] = useState(initialSort)
  const [page, setPage] = useState(0)

  const sorted = useMemo(() => {
    if (!sort) return rows
    const col = columns.find((c) => c.key === sort.key)
    if (!col?.sortValue) return rows
    const v = col.sortValue
    return [...rows].sort((a, b) => {
      const x = v(a) ?? ''
      const y = v(b) ?? ''
      const r =
        typeof x === 'number' && typeof y === 'number'
          ? x - y
          : String(x).localeCompare(String(y), lang)
      return sort.dir === 'asc' ? r : -r
    })
  }, [rows, sort, columns, lang])

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const current = Math.min(page, pageCount - 1)
  const visible = sorted.slice(current * pageSize, current * pageSize + pageSize)

  const toggleSort = (key: string) =>
    setSort((s) =>
      s?.key === key ? (s.dir === 'asc' ? { key, dir: 'desc' } : undefined) : { key, dir: 'asc' },
    )

  const primary = columns[0]
  const rest = columns.slice(1).filter((c) => !c.hideOnMobile)
  const emptyNode = empty ?? <p className="text-sm text-ink-soft">{t('noResults')}</p>

  if (rows.length === 0) return <div>{emptyNode}</div>

  return (
    <div className="grid min-w-0 gap-3">
      {/* Desktop table */}
      <div className="card hidden overflow-hidden md:block">
        <Table>
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead
                  key={c.key}
                  scope="col"
                  className={cn('whitespace-normal', c.align === 'end' && 'text-end', c.className)}
                  aria-sort={
                    sort?.key === c.key
                      ? sort.dir === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  {c.sortValue ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      className="inline-flex min-h-9 items-center gap-1 uppercase hover:text-brand"
                    >
                      {c.header}
                      {sort?.key === c.key ? (
                        sort.dir === 'asc' ? (
                          <ArrowUp className="size-3" aria-hidden />
                        ) : (
                          <ArrowDown className="size-3" aria-hidden />
                        )
                      ) : (
                        <ArrowUpDown className="size-3 opacity-50" aria-hidden />
                      )}
                    </button>
                  ) : (
                    c.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((row) => (
              <TableRow
                key={getRowId(row)}
                className={cn(onRowClick && 'cursor-pointer')}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={onRowClick ? (e) => e.key === 'Enter' && onRowClick(row) : undefined}
              >
                {columns.map((c) => (
                  <TableCell
                    key={c.key}
                    className={cn(
                      'py-3 whitespace-normal',
                      c.align === 'end' && 'text-end',
                      c.className,
                    )}
                  >
                    {c.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <ul className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2 md:hidden">
        {visible.map((row) => (
          <li key={getRowId(row)}>
            <div className="card relative grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2 p-4">
              {onRowClick ? (
                <button
                  type="button"
                  className="absolute inset-0 rounded-2xl"
                  onClick={() => onRowClick(row)}
                >
                  <span className="sr-only">{t('table.openRecord')}</span>
                </button>
              ) : null}
              {primary ? (
                <div className="font-semibold text-brand-deep">{primary.cell(row)}</div>
              ) : null}
              <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                {rest.map((c) => (
                  <div key={c.key} className="min-w-0">
                    <dt className="text-xs text-ink-soft">{c.header}</dt>
                    <dd className="min-w-0">{c.cell(row)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-ink-soft" aria-live="polite">
          {t('table.records', { count: sorted.length, n: formatNumber(sorted.length, lang) })}
        </p>
        <div className="flex items-center gap-2">
          {onExport ? (
            <Button variant="outline" size="sm" onClick={() => onExport(columns, sorted)}>
              <Download aria-hidden /> {t('table.export')}
            </Button>
          ) : null}
          {pageCount > 1 ? (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(current - 1)}
                disabled={current === 0}
                aria-label={t('table.previous')}
              >
                <ChevronLeft className="rtl-mirror" aria-hidden />
              </Button>
              <span className="tabular-nums">
                {t('table.page', { current: current + 1, total: pageCount })}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(current + 1)}
                disabled={current >= pageCount - 1}
                aria-label={t('table.next')}
              >
                <ChevronRight className="rtl-mirror" aria-hidden />
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

/** Build CSV rows from table columns (uses exportValue or sortValue). */
export function columnsToCsvRows<T>(cols: Column<T>[], rows: T[]) {
  const usable = cols.filter((c) => c.exportValue || c.sortValue)
  return {
    headers: usable.map((c) => c.header),
    rows: rows.map((r) => usable.map((c) => (c.exportValue ?? c.sortValue)?.(r) ?? '')),
  }
}
