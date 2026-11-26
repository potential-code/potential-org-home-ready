import type { JourneyOption } from '@shared/types'
import { Check } from 'lucide-react'
import { useLocalized } from '@/i18n'
import { cn } from '@/lib/utils'

/** Whole selectable option card. Selected = primary background, white text, check. */
export function OptionCard({
  option,
  letter,
  selected,
  locked,
  onPick,
}: {
  option: JourneyOption
  letter: string
  selected: boolean
  locked: boolean
  onPick: () => void
}) {
  const { l } = useLocalized()
  return (
    <button
      type="button"
      onClick={onPick}
      disabled={locked && !selected}
      aria-pressed={selected}
      className={cn(
        'flex w-full items-start gap-3 rounded-2xl border p-4 text-start shadow-sm transition-all focus-visible:ring-4 focus-visible:ring-brand-highlight/70 focus-visible:outline-none',
        selected
          ? 'border-brand bg-brand text-white shadow-lg'
          : 'border-border/70 bg-white hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg',
        locked && !selected && 'cursor-default opacity-70 hover:translate-y-0 hover:shadow-sm',
      )}
    >
      <span
        className={cn(
          'mt-0.5 w-5 shrink-0 text-sm font-extrabold',
          selected ? 'text-white' : 'text-brand',
        )}
        aria-hidden
      >
        {letter}
      </span>
      <span className="flex-1 font-semibold">{l(option.label)}</span>
      {selected && <Check className="mt-0.5 size-5 shrink-0" aria-hidden />}
    </button>
  )
}
