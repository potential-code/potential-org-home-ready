import type { CalcTab } from '@shared/types'
import { Save } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { calcSummary } from '@/domain/calculator-summary'
import { useLocalized } from '@/i18n'
import { saveCalcResult } from '@/store/actions'
import { useMe } from '@/store/hooks'
import type { CalcInputs } from './InputsCard'

/** Name and save the current result (points: calculator 20). */
export function SaveResultDialog({ tab, inputs }: { tab: CalcTab; inputs: CalcInputs }) {
  const { t } = useTranslation('calculator')
  const { l } = useLocalized()
  const me = useMe()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState(false)
  const start = () => {
    setName(t(`save.defaultName.${tab}`))
    setError(false)
    setOpen(true)
  }
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return setError(true)
    saveCalcResult(me.id, tab, inputs, { en: name.trim(), ar: name.trim() })
    setOpen(false)
    toast.success(t('save.done'), { description: l(calcSummary(tab, inputs)) })
  }
  return (
    <>
      <Button
        onClick={start}
        className="rounded-full bg-brand-highlight text-ink hover:bg-brand-highlight/90"
      >
        <Save className="size-4" aria-hidden />
        {t('save.cta')}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={submit} noValidate className="space-y-4">
            <DialogHeader>
              <DialogTitle>{t('save.title')}</DialogTitle>
              <DialogDescription>{l(calcSummary(tab, inputs))}</DialogDescription>
            </DialogHeader>
            <div className="space-y-1.5">
              <Label htmlFor="calc-save-name">{t('save.name')}</Label>
              <Input
                id="calc-save-name"
                className="h-10"
                value={name}
                aria-invalid={error}
                onChange={(e) => {
                  setName(e.target.value)
                  setError(false)
                }}
              />
              {error && <p className="text-xs font-medium text-danger">{t('save.nameError')}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {t('save.cancel')}
              </Button>
              <Button type="submit">{t('save.confirm')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
