import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface ResultRow {
  key: string
  label: string
  value: ReactNode
  strong?: boolean
}

/** Breakdown list inside a card: label at the start, amount at the end. */
export function ResultRows({
  title,
  rows,
  note,
}: {
  title: string
  rows: ResultRow[]
  note?: ReactNode
}) {
  return (
    <section className="card p-5">
      <h3 className="mb-3 text-base">{title}</h3>
      <dl className="divide-y divide-border/70">
        {rows.map((r) => (
          <div key={r.key} className="flex items-baseline justify-between gap-3 py-2 text-sm">
            <dt className={cn('text-ink-soft', r.strong && 'font-semibold text-ink')}>{r.label}</dt>
            <dd className={cn('whitespace-nowrap tabular-nums text-ink', r.strong && 'font-bold')}>
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
      {note && <div className="mt-3 text-xs leading-snug text-ink-soft">{note}</div>}
    </section>
  )
}
