import { RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { FieldDef } from './config'
import { SourceLine } from './SourceLine'

export type CalcInputs = Record<string, number | boolean>

/** Editable inputs for one tab. Every change recalculates the results at once. */
export function InputsCard({
  fields,
  values,
  onChange,
  onReset,
  tab,
}: {
  fields: FieldDef[]
  values: CalcInputs
  onChange: (key: string, value: number | boolean) => void
  onReset: () => void
  tab: string
}) {
  const { t } = useTranslation('calculator')
  return (
    <section className="card p-5" aria-labelledby={`${tab}-inputs`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 id={`${tab}-inputs`} className="text-lg">
          {t('inputs.title')}
        </h2>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="size-4" aria-hidden />
          {t('inputs.reset')}
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => {
          const id = `${tab}-${f.key}`
          const label = t(`fields.${f.key}`)
          const v = values[f.key]
          if (f.kind === 'toggle')
            return (
              <div key={f.key} className="flex items-start justify-between gap-3 sm:col-span-1">
                <div className="min-w-0 space-y-1">
                  <Label htmlFor={id}>{label}</Label>
                  {f.source && <SourceLine source={f.source} />}
                </div>
                <Switch id={id} checked={v === true} onCheckedChange={(c) => onChange(f.key, c)} />
              </div>
            )
          const n = typeof v === 'number' ? v : 0
          const invalid = n < (f.min ?? 0) || (f.max !== undefined && n > f.max)
          return (
            <div key={f.key} className="space-y-1.5">
              <Label htmlFor={id}>
                {label}
                {f.unit && <span className="ms-1 text-ink-soft">({t(`units.${f.unit}`)})</span>}
              </Label>
              <Input
                id={id}
                type="number"
                inputMode="decimal"
                className="h-10 tabular-nums"
                value={Number.isFinite(n) ? n : ''}
                step={f.step ?? 1}
                min={f.min ?? 0}
                max={f.max}
                aria-invalid={invalid}
                aria-describedby={`${id}-src`}
                onChange={(e) =>
                  onChange(f.key, e.target.value === '' ? 0 : Number(e.target.value))
                }
              />
              {invalid && (
                <p className="text-xs font-medium text-danger">
                  {t('inputs.range', { min: f.min ?? 0, max: f.max ?? '∞' })}
                </p>
              )}
              <SourceLine source={f.source} id={`${id}-src`} />
            </div>
          )
        })}
      </div>
    </section>
  )
}
