import { Lock, type LucideIcon } from 'lucide-react'
import { GeoFrames } from '@/components/brand'
import { cn } from '@/lib/utils'

export type MedalTone = 'primary' | 'accent' | 'deep' | 'highlight' | 'warm'

const TONE: Record<MedalTone, { fill: string; frame: string }> = {
  primary: { fill: 'from-brand to-brand-deep text-white', frame: 'text-brand' },
  accent: {
    fill: 'from-brand-accent to-brand-accent-600 text-ink',
    frame: 'text-brand-accent-600',
  },
  deep: { fill: 'from-brand-deep to-brand-deep text-white', frame: 'text-brand-deep' },
  highlight: {
    fill: 'from-brand-highlight-300 to-brand-highlight text-ink',
    frame: 'text-brand-highlight',
  },
  warm: { fill: 'from-brand-warm to-brand-warm-800 text-white', frame: 'text-brand-warm' },
}

/**
 * Neutral medallion for a badge: a coloured disc with the badge icon inside concentric frames.
 * Earned: coloured. Locked: dashed outline, pale frames and a lock beside the disc.
 * Decorative; always pair it with the badge name in text. Swap the frame for a client motif.
 */
export function BadgeMedal({
  icon: Icon,
  earned,
  tone = 'primary',
  size = 88,
  className,
}: {
  icon: LucideIcon
  earned: boolean
  tone?: MedalTone
  size?: number
  className?: string
}) {
  const t = TONE[tone]
  return (
    <span
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <GeoFrames
        className={cn('absolute inset-0 size-full', earned ? t.frame : 'text-border')}
        count={2}
      />
      <span
        className={cn(
          'relative flex items-center justify-center rounded-full',
          earned
            ? `bg-gradient-to-br ${t.fill} shadow-md ring-4 ring-white`
            : 'border-2 border-dashed border-input/60 bg-white text-ink-soft/60',
        )}
        style={{ width: size * 0.52, height: size * 0.52 }}
      >
        <Icon style={{ width: size * 0.22, height: size * 0.22 }} strokeWidth={2.2} />
      </span>
      {!earned && <Lock className="absolute end-[6%] bottom-[6%] size-4 text-ink-soft" />}
    </span>
  )
}
