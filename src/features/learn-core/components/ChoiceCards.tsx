import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

/**
 * Single-choice options as whole selectable cards (design system v2): a quiet letter, and the
 * selected card turns primary with white text and a check. Native radios keep keyboard support.
 */
export function ChoiceCards({
  legend,
  hint,
  options,
  value,
  onChange,
  name,
}: {
  legend: string
  hint?: string
  options: string[]
  value: number | undefined
  onChange: (i: number) => void
  name: string
}) {
  return (
    <fieldset className="grid gap-2.5">
      <legend className="mb-1 text-lg font-semibold text-ink">{legend}</legend>
      {hint && <p className="-mt-1 mb-1 text-xs text-ink-soft">{hint}</p>}
      {options.map((opt, i) => {
        const chosen = value === i
        return (
          <label
            key={`${name}-${opt}`}
            className={cn(
              'flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-brand-highlight/70',
              chosen
                ? 'border-brand bg-brand text-white'
                : 'border-border bg-white text-ink hover:border-brand hover:bg-tint-50',
            )}
          >
            <input
              type="radio"
              name={name}
              checked={chosen}
              onChange={() => onChange(i)}
              className="sr-only"
            />
            <span
              aria-hidden
              className={cn('w-4 shrink-0 font-bold', chosen ? 'text-white' : 'text-brand')}
            >
              {LETTERS[i]}
            </span>
            <span className="flex-1">{opt}</span>
            {chosen && <Check className="size-4 shrink-0" strokeWidth={3} aria-hidden />}
          </label>
        )
      })}
    </fieldset>
  )
}
