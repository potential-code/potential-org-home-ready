import type { ReactNode } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

/** Checkbox with a wrapping label, hint and inline error (consent rows). */
export function CheckRow({
  id,
  checked,
  onChange,
  label,
  hint,
  error,
}: {
  id: string
  checked: boolean
  onChange: (v: boolean) => void
  label: ReactNode
  hint?: string
  error?: string
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-start gap-3">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(v) => onChange(v === true)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className="mt-0.5 size-5"
        />
        <Label htmlFor={id} className="block leading-snug font-medium text-ink">
          {label}
        </Label>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="ps-8 text-sm font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="ps-8 text-xs text-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
