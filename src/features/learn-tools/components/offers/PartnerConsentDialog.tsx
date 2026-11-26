import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { givePartnerConsent } from '@/store/actions'
import { useMe } from '@/store/hooks'

interface PartnerConsentDialogProps {
  offerId: string
  partner: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Separate consent step (C11.3). The box starts unticked every time; without the tick nothing is
 * shared and the confirm button stays disabled.
 */
export function PartnerConsentDialog({
  offerId,
  partner,
  open,
  onOpenChange,
}: PartnerConsentDialogProps) {
  const { t } = useTranslation('dalil')
  const me = useMe()
  const [ticked, setTicked] = useState(false)
  const change = (o: boolean) => {
    setTicked(false)
    onOpenChange(o)
  }
  const confirm = () => {
    const id = givePartnerConsent(me.id, offerId, ticked)
    if (!id) {
      toast.info(t('offers.notShared'))
      return
    }
    toast.success(t('offers.sentToast', { partner }))
    change(false)
  }
  return (
    <Dialog open={open} onOpenChange={change}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pe-8">{t('offers.dialogTitle', { partner })}</DialogTitle>
          <DialogDescription>{t('offers.dialogBody', { partner })}</DialogDescription>
        </DialogHeader>
        <div className="flex items-start gap-3 rounded-xl bg-tint-50 p-4 ring-1 ring-border/70">
          <Checkbox
            id={`consent-${offerId}`}
            checked={ticked}
            onCheckedChange={(v) => setTicked(v === true)}
            className="mt-0.5 size-5"
          />
          <label htmlFor={`consent-${offerId}`} className="text-sm leading-relaxed text-ink">
            {t('offers.consentLabel', { partner })}
          </label>
        </div>
        {!ticked && <p className="text-xs text-ink-soft">{t('offers.notShared')}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={() => change(false)}>
            {t('common:cancel')}
          </Button>
          <Button onClick={confirm} disabled={!ticked} className="rounded-full">
            {t('offers.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
