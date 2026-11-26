import { useId } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FilterSelectProps<V extends string> {
  label: string
  value: V
  options: { value: V; label: string }[]
  onChange: (v: V) => void
}

/** Compact labelled select for the filter row (h-9). */
export function FilterSelect<V extends string>({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps<V>) {
  const id = useId()
  return (
    <div className="grid min-w-0 gap-1">
      <label htmlFor={id} className="text-xs font-semibold text-ink-soft">
        {label}
      </label>
      <Select value={value} onValueChange={(v) => onChange(v as V)}>
        <SelectTrigger id={id} size="sm" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
