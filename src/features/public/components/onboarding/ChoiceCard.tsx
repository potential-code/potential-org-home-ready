import { Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Whole selectable card used as a radio (design system v2 choice card): quiet content, selected =
 * primary background, white text and a check. Pass `role="radio"` semantics via the parent group.
 */
export function ChoiceCard({
  selected,
  onSelect,
  children,
  className,
}: {
  selected: boolean
  onSelect: () => void
  children: ReactNode
  className?: string
}) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: whole selectable card acting as a radio (design system v2 choice card)
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'relative flex min-h-11 w-full items-center gap-3 rounded-2xl border px-4 py-3 text-start font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:outline-none',
        selected
          ? 'border-brand bg-brand text-white'
          : 'border-border/70 bg-white text-ink hover:border-brand/50',
        className,
      )}
    >
      <span className="min-w-0 flex-1">{children}</span>
      {selected && <Check className="size-5 shrink-0" aria-hidden />}
    </button>
  )
}
