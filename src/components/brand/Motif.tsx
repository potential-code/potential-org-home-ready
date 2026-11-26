import { cn } from '@/lib/utils'
import { HomeMark, KeyMark } from './HomeMark'

export type MotifVariant = 'banner' | 'sidebar' | 'card' | 'auth' | 'corner'

/**
 * Brand motif layer, always shown whole (never cropped at an edge). Place inside a
 * `relative overflow-hidden` container. Colour comes from `className` (e.g. `text-white/[0.12]`
 * on primary, `text-brand/10` on white). Always decorative.
 *
 * Home Ready: `HomeMark` (towers, villa, townhouse, key; original line art) for the large slots and
 * `KeyMark` for the small corner. The variant names and placements are the stable API.
 */
export function Motif({ variant, className }: { variant: MotifVariant; className?: string }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 select-none', className)} aria-hidden>
      {variant === 'banner' && (
        <HomeMark className="absolute end-6 bottom-4 h-auto w-64" strokeWidth={1.3} />
      )}
      {variant === 'sidebar' && (
        <HomeMark className="absolute start-1/2 bottom-14 h-auto w-52 -translate-x-1/2 rtl:translate-x-1/2" />
      )}
      {variant === 'card' && <HomeMark className="absolute end-4 bottom-3 h-auto w-32" />}
      {variant === 'corner' && <KeyMark className="absolute end-3 bottom-3 h-12 w-12" />}
      {variant === 'auth' && (
        <HomeMark className="absolute end-8 top-24 h-auto w-[22rem]" strokeWidth={1.1} />
      )}
    </div>
  )
}
