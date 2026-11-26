import { cn } from '@/lib/utils'

/**
 * Neutral placeholder motif: nested quarter arcs inside a square frame with a dot lattice.
 * Pure strokes on `currentColor`, so any text colour class tints it. Decorative only.
 *
 * Per mockup: replace this art with a motif cut from the client's own identity (emblem, pattern,
 * logo geometry) and keep the component name and props, so every `Motif` call site keeps working.
 */
export function GeoMark({
  className,
  strokeWidth = 1.4,
}: {
  className?: string
  strokeWidth?: number
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn('block', className)}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    >
      <rect x="4" y="4" width="112" height="112" rx="18" />
      <path d="M 4 92 A 88 88 0 0 1 92 4" />
      <path d="M 4 72 A 68 68 0 0 1 72 4" />
      <path d="M 4 52 A 48 48 0 0 1 52 4" />
      <path d="M 4 32 A 28 28 0 0 1 32 4" />
      {[36, 60, 84, 108].map((x) =>
        [60, 84, 108].map((y) =>
          x + y > 116 ? (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" fill="currentColor" />
          ) : null,
        ),
      )}
    </svg>
  )
}

/** Concentric rounded squares, a quieter companion to `GeoMark`. Decorative. */
export function GeoFrames({ className, count = 3 }: { className?: string; count?: number }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn('block', className)}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      {Array.from({ length: count }, (_, i) => {
        const inset = 4 + i * 14
        return (
          <rect
            // biome-ignore lint/suspicious/noArrayIndexKey: static decorative geometry
            key={i}
            x={inset}
            y={inset}
            width={120 - inset * 2}
            height={120 - inset * 2}
            rx={18 - i * 4}
          />
        )
      })}
    </svg>
  )
}
