import { cn } from '@/lib/utils'

/** Accessible progress bar that fills from the start side (works in RTL). */
export function ProgressBar({
  value,
  label,
  className,
  fillClassName,
}: {
  value: number
  label: string
  className?: string
  /** Fill colour override, e.g. white on a brand banner. */
  fillClassName?: string
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className={cn('h-2.5 w-full overflow-hidden rounded-full bg-tint-100', className)}
    >
      <div
        className={cn(
          'h-full rounded-full transition-[width] duration-300',
          fillClassName ?? (pct === 100 ? 'bg-success' : 'bg-brand'),
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
