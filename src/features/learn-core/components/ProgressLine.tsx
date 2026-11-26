import { cn } from '@/lib/utils'

/** Thin labelled progress bar. `onDark` for brand banners (white track, highlight fill). */
export function ProgressLine({
  value,
  label,
  onDark = false,
  className,
}: {
  value: number
  label: string
  onDark?: boolean
  className?: string
}) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        'h-2 overflow-hidden rounded-full',
        onDark ? 'bg-white/25' : 'bg-tint-100',
        className,
      )}
    >
      <div
        className={cn(
          'h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none',
          onDark ? 'bg-brand-highlight' : 'bg-brand',
        )}
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
