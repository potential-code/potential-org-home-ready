import { cn } from '@/lib/utils'

/**
 * Home Ready motif (original line art, redrawn for this mockup; potential.org has no motif):
 * a UAE home skyline in one stroke weight: two apartment towers, a villa with a pitched roof and an
 * arched door, a townhouse roof line, and a key. Strokes on `currentColor`, decorative only.
 */
export function HomeMark({
  className,
  strokeWidth = 1.6,
}: {
  className?: string
  strokeWidth?: number
}) {
  return (
    <svg
      viewBox="0 0 200 140"
      className={cn('block', className)}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* ground */}
      <path d="M 6 132 H 194" />
      {/* tall tower */}
      <path d="M 18 132 V 26 L 35 16 L 52 26 V 132" />
      <path d="M 35 16 V 6" />
      {[40, 54, 68, 82, 96, 110].map((y) => (
        <path key={y} d={`M 25 ${y} H 31 M 39 ${y} H 45`} />
      ))}
      {/* mid tower with stepped top */}
      <path d="M 58 132 V 52 H 64 V 44 H 80 V 52 H 86 V 132" />
      {[64, 78, 92, 106].map((y) => (
        <path key={y} d={`M 65 ${y} H 79`} />
      ))}
      {/* villa */}
      <path d="M 94 86 L 128 58 L 162 86" />
      <path d="M 100 82 V 132 H 156 V 82" />
      <path d="M 120 132 V 112 A 8 8 0 0 1 136 112 V 132" />
      <path d="M 106 96 H 116 V 106 H 106 Z M 140 96 H 150 V 106 H 140 Z" />
      {/* townhouse roof line */}
      <path d="M 162 100 L 177 88 L 192 100" />
      <path d="M 166 97 V 132 M 188 97 V 132" />
      <path d="M 173 132 V 118 H 181 V 132" />
      {/* key */}
      <circle cx="150" cy="24" r="9" />
      <circle cx="150" cy="24" r="3" />
      <path d="M 159 24 H 192 M 182 24 V 31 M 189 24 V 30" />
    </svg>
  )
}

/** The key alone: a quiet companion for small corners (stat cards). Decorative. */
export function KeyMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn('block', className)}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="20" cy="32" r="12" />
      <circle cx="20" cy="32" r="4" />
      <path d="M 32 32 H 60 M 50 32 V 41 M 58 32 V 40" />
    </svg>
  )
}
