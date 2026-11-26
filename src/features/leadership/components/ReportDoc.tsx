import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { formatDate, useLocalized } from '@/i18n'
import { now } from '@/lib/clock'

/** Print-friendly document frame: title, generated line, sections. */
export function ReportDoc({ title, children }: { title: string; children: ReactNode }) {
  const { t } = useTranslation('leadership')
  const { lang } = useLocalized()
  return (
    <article className="grid gap-5 text-sm text-ink">
      <header className="border-b-2 border-brand pb-3">
        <h2 className="text-xl font-extrabold text-brand-deep">{title}</h2>
        <p className="mt-1 text-xs text-ink-soft">
          {t('reports.generated', { date: formatDate(now(), lang) })}
        </p>
      </header>
      {children}
    </article>
  )
}

export function DocSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-2 break-inside-avoid">
      <h3 className="text-xs font-bold tracking-widest text-brand uppercase">{title}</h3>
      {children}
    </section>
  )
}

/** Two-column label/value list for report documents. */
export function DocList({ rows }: { rows: { id: string; label: string; value: ReactNode }[] }) {
  return (
    <dl className="divide-y divide-border/70 rounded-xl ring-1 ring-border/70">
      {rows.map((r) => (
        <div key={r.id} className="flex items-baseline justify-between gap-4 px-3 py-2">
          <dt className="text-ink-soft">{r.label}</dt>
          <dd className="text-end font-semibold tabular-nums">{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}
