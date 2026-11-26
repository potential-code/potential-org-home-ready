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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { addHome } from '@/store/actions'
import { useMe } from '@/store/hooks'

const CHEQUES = [1, 2, 4, 6, 12]
const EMPTY = {
  name: '',
  area: '',
  bedrooms: '',
  rent: '',
  cheques: '4',
  furnished: false,
  notes: '',
}
type Errors = Partial<Record<'name' | 'area' | 'rent', string>>

/** Add a home to My homes. The learner's own text is stored in both languages. */
export function AddHomeDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation('journeys')
  const me = useMe()
  const [f, setF] = useState(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const set = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) =>
    setF((x) => ({ ...x, [k]: v }))
  const same = (s: string) => ({ en: s.trim(), ar: s.trim() })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const rent = Number(f.rent)
    const next: Errors = {}
    if (!f.name.trim()) next.name = t('homes.dialog.errName')
    if (!f.area.trim()) next.area = t('homes.dialog.errArea')
    if (!Number.isFinite(rent) || rent <= 0) next.rent = t('homes.dialog.errRent')
    setErrors(next)
    if (Object.keys(next).length) return
    addHome(me.id, {
      title: same(f.name),
      area: same(f.area),
      bedrooms: same(f.bedrooms || '-'),
      annualRent: Math.round(rent),
      cheques: Number(f.cheques),
      furnished: f.furnished,
      notes: f.notes.trim(),
    })
    toast.success(t('homes.dialog.added'))
    onOpenChange(false)
  }

  const field = (k: 'name' | 'area' | 'bedrooms', type = 'text') => (
    <div className="space-y-1.5">
      <Label htmlFor={`home-${k}`}>{t(`homes.dialog.${k}`)}</Label>
      <Input
        id={`home-${k}`}
        type={type}
        value={f[k]}
        placeholder={t(`homes.dialog.${k}Placeholder`)}
        onChange={(e) => set(k, e.target.value)}
        aria-invalid={k !== 'bedrooms' && !!errors[k]}
        aria-describedby={k !== 'bedrooms' && errors[k] ? `home-${k}-err` : undefined}
      />
      {k !== 'bedrooms' && errors[k] && (
        <p id={`home-${k}-err`} className="text-sm text-danger">
          {errors[k]}
        </p>
      )}
    </div>
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (o) {
          setF(EMPTY)
          setErrors({})
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('homes.dialog.title')}</DialogTitle>
          <DialogDescription>{t('homes.dialog.body')}</DialogDescription>
        </DialogHeader>
        <form id="add-home" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">{field('name')}</div>
          {field('area')}
          {field('bedrooms')}
          <div className="space-y-1.5">
            <Label htmlFor="home-rent">{t('homes.dialog.rent')}</Label>
            <Input
              id="home-rent"
              type="number"
              inputMode="numeric"
              min={1}
              value={f.rent}
              onChange={(e) => set('rent', e.target.value)}
              aria-invalid={!!errors.rent}
              aria-describedby={errors.rent ? 'home-rent-err' : undefined}
            />
            {errors.rent && (
              <p id="home-rent-err" className="text-sm text-danger">
                {errors.rent}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="home-cheques">{t('homes.dialog.cheques')}</Label>
            <Select value={f.cheques} onValueChange={(v) => set('cheques', v)}>
              <SelectTrigger id="home-cheques">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHEQUES.map((c) => (
                  <SelectItem key={c} value={String(c)}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 sm:col-span-2">
            <Switch
              id="home-furnished"
              checked={f.furnished}
              onCheckedChange={(v) => set('furnished', v)}
            />
            <Label htmlFor="home-furnished">{t('homes.dialog.furnished')}</Label>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="home-notes">{t('homes.dialog.notes')}</Label>
            <Textarea
              id="home-notes"
              rows={2}
              value={f.notes}
              onChange={(e) => set('notes', e.target.value)}
            />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('homes.dialog.cancel')}
          </Button>
          <Button type="submit" form="add-home" className="rounded-full">
            {t('homes.dialog.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
