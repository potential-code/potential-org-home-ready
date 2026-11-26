import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Motif } from '@/components/brand'
import { cn } from '@/lib/utils'

export type StatTone = 'primary' | 'accent' | 'deep' | 'highlight' | 'warm' | 'tint'

/** Suggested order for a row of stat cards so neighbours never share a colour. */
export const STAT_TONES: StatTone[] = ['primary', 'accent', 'deep', 'highlight', 'warm', 'tint']

const TONE: Record<StatTone, { box: string; muted: string; motif: string; link: string }> = {
  primary: {
    box: 'bg-[linear-gradient(140deg,var(--brand-primary),var(--brand-deep))] text-white',
    muted: 'text-white/85',
    motif: 'text-white/20',
    link: 'text-white',
  },
  accent: {
    box: 'bg-[linear-gradient(140deg,var(--brand-accent),var(--brand-accent-600))] text-ink',
    muted: 'text-ink/90',
    motif: 'text-white/35',
    link: 'text-ink',
  },
  deep: {
    box: 'bg-[linear-gradient(140deg,var(--brand-deep),var(--brand-deep-900))] text-white',
    muted: 'text-white/80',
    motif: 'text-brand-accent/30',
    link: 'text-white',
  },
  highlight: {
    box: 'bg-[linear-gradient(140deg,var(--brand-highlight-300),var(--brand-highlight))] text-ink',
    muted: 'text-ink/85',
    motif: 'text-white/45',
    link: 'text-ink',
  },
  warm: {
    box: 'bg-[linear-gradient(140deg,var(--brand-warm),var(--brand-warm-800))] text-white',
    muted: 'text-white/85',
    motif: 'text-white/25',
    link: 'text-white',
  },
  tint: {
    box: 'bg-[linear-gradient(140deg,var(--brand-tint-100),var(--brand-white))] text-brand-deep ring-1 ring-brand/15',
    muted: 'text-ink-soft',
    motif: 'text-brand/15',
    link: 'text-brand',
  },
}

/**
 * Coloured metric card. Icon sits inline with the label (no chip), the number leads, and the brand
 * motif fills the corner. `hint` carries the definition or denominator.
 * Pass `to` to make the whole card a link.
 */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'primary',
  footer,
  to,
  className,
}: {
  label: string
  value: ReactNode
  hint?: ReactNode
  icon?: LucideIcon
  tone?: StatTone
  footer?: ReactNode
  to?: string
  className?: string
}) {
  const t = TONE[tone]
  const body = (
    <>
      <Motif variant="corner" className={t.motif} />
      <p
        className={cn(
          'relative flex items-start gap-1.5 pe-4 text-sm leading-snug font-semibold',
          t.muted,
        )}
      >
        {Icon && <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />}
        <span className="min-w-0">{label}</span>
      </p>
      {/* Value block sits at the bottom so numbers align across a row even when labels wrap. */}
      <div className="relative mt-auto pt-3">
        <p className="text-4xl leading-none font-extrabold tracking-tight tabular-nums">{value}</p>
        {hint && <p className={cn('mt-2 pe-12 text-xs leading-snug', t.muted)}>{hint}</p>}
        {footer && (
          <div
            className={cn(
              'mt-3 pe-12 text-sm font-semibold [&_a]:underline-offset-4 hover:[&_a]:underline',
              t.link,
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </>
  )
  const cls = cn(
    'relative flex flex-col overflow-hidden rounded-2xl p-5 shadow-md',
    t.box,
    className,
  )
  return to ? (
    <Link
      to={to}
      className={cn(cls, 'card-hover focus-visible:ring-4 focus-visible:ring-brand-highlight/70')}
    >
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  )
}
