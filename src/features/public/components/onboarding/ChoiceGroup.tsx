import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { ChoiceCard } from './ChoiceCard'

/** Labelled radio group of `ChoiceCard`s over one `auth:options.<group>` list, with inline error. */
export function ChoiceGroup<T extends string>({
  id,
  label,
  group,
  options,
  value,
  onChange,
  error,
  className,
  icon,
}: {
  id: string
  label: string
  group: string
  options: readonly T[]
  value: T | undefined
  onChange: (v: T) => void
  error?: string
  className?: string
  icon?: ReactNode
}) {
  const { t } = useTranslation('auth')
  return (
    <div>
      <h2 id={`${id}-label`} className="flex items-center gap-2 text-lg">
        {icon}
        {label}
      </h2>
      <div
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn('mt-3 grid gap-2.5', className)}
      >
        {options.map((o) => (
          <ChoiceCard key={o} selected={value === o} onSelect={() => onChange(o)}>
            {t(`options.${group}.${String(o)}` as string)}
          </ChoiceCard>
        ))}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
