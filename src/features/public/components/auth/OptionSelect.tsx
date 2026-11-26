import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/** Select over one `auth:options.<group>` list. Empty value shows the "Choose one" prompt. */
export function OptionSelect<T extends string>({
  id,
  group,
  options,
  value,
  onChange,
  error,
}: {
  id: string
  group: string
  options: readonly T[]
  value: T | ''
  onChange: (v: T) => void
  error?: string
}) {
  const { t } = useTranslation('auth')
  return (
    <Select value={value || undefined} onValueChange={(x) => onChange(x as T)}>
      <SelectTrigger
        id={id}
        className="w-full"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <SelectValue placeholder={t('fields.choose')} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {t(`options.${group}.${String(o)}` as string)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
