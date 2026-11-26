import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/** Label, control, hint and inline error for one form field. Ids follow `<id>-hint` / `<id>-error`. */
export function Field({
  id,
  label,
  hint,
  error,
  optional = false,
  className,
  children,
}: {
  id: string
  label: ReactNode
  hint?: string
  error?: string
  optional?: boolean
  className?: string
  children: ReactNode
}) {
  const { t } = useTranslation('auth')
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={id} className="font-semibold text-ink">
        {label}
        {optional && (
          <span className="ms-1 text-xs font-normal text-ink-soft">({t('register.optional')})</span>
        )}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

/** aria props for a control inside `Field`. */
export const describedBy = (id: string, error?: string, hint?: string) => ({
  'aria-invalid': !!error,
  'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined,
})
