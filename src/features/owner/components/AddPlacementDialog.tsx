import type { PlacementSlot } from '@shared/types'
import { useEffect, useState } from 'react'
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
import { SPONSORS } from '@/data/catalogue'
import { useLocalized } from '@/i18n'
import { addPlacement } from '@/store/actions'
import { SLOT_OPTIONS } from '../config'
import { FilterSelect } from './FilterSelect'

/** Add a placement: sponsor, slot, label text (goes live straight away). */
export function AddPlacementDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const { t } = useTranslation('owner')
  const { l } = useLocalized()
  const [sponsorId, setSponsorId] = useState(SPONSORS[1]?.id ?? '')
  const [slot, setSlot] = useState<PlacementSlot>('event')
  const [label, setLabel] = useState('')
  const [error, setError] = useState('')
  const sponsorLabel = SPONSORS.find((s) => s.id === sponsorId)?.name.en ?? ''
  useEffect(() => {
    setLabel(
      t('sponsors.labelDefault', { slot: t(`sponsors.slots.${slot}`), sponsor: sponsorLabel }),
    )
    setError('')
  }, [slot, sponsorLabel, t])
  const save = () => {
    if (!label.trim()) {
      setError(t('sponsors.labelRequired'))
      return
    }
    addPlacement({ sponsorId, slot, label: { en: label.trim(), ar: label.trim() } })
    toast.success(t('sponsors.added'), { description: label.trim() })
    onOpenChange(false)
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('sponsors.addTitle')}</DialogTitle>
          <DialogDescription>{t('sponsors.addDescription')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <FilterSelect
            id="ap-sponsor"
            label={t('sponsors.sponsor')}
            value={sponsorId}
            onChange={setSponsorId}
            options={SPONSORS.map((s) => ({ value: s.id, label: l(s.name) }))}
          />
          <FilterSelect
            id="ap-slot"
            label={t('sponsors.slot')}
            value={slot}
            onChange={(v) => setSlot(v as PlacementSlot)}
            options={SLOT_OPTIONS.map((s) => ({ value: s, label: t(`sponsors.slots.${s}`) }))}
          />
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="ap-label">{t('sponsors.label')}</Label>
            <Input
              id="ap-label"
              value={label}
              aria-invalid={!!error}
              aria-describedby={error ? 'ap-err' : undefined}
              onChange={(e) => setLabel(e.target.value)}
            />
            {error && (
              <p id="ap-err" className="text-sm text-danger">
                {error}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={save} className="rounded-full">
            {t('sponsors.add')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
