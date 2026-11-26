import type { Emirate, LearnerRecord, Situation } from '@shared/types'
import { Pencil, UserRound } from 'lucide-react'
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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EMIRATES, SITUATIONS } from '../../profile-config'

export interface ProfileDetails {
  emirate: Emirate
  situation: Situation
}

/** Details (name, email, emirate, situation) with an edit dialog for emirate and situation. */
export function DetailsCard({
  name,
  record,
  details,
  onSave,
}: {
  name: string
  record?: LearnerRecord
  details: ProfileDetails
  onSave: (d: ProfileDetails) => void
}) {
  const { t } = useTranslation('learn')
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(details)
  const rows = [
    { k: 'name', v: name },
    { k: 'email', v: record?.email ?? '' },
    { k: 'emirate', v: t(`profile.emirates.${details.emirate}`) },
    { k: 'situation', v: t(`profile.situations.${details.situation}`) },
  ]
  return (
    <section aria-labelledby="details-title" className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="details-title" className="flex items-center gap-2 text-lg">
          <UserRound className="size-5 text-brand" aria-hidden /> {t('profile.details.title')}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setDraft(details)
            setOpen(true)
          }}
        >
          <Pencil aria-hidden /> {t('profile.details.edit')}
        </Button>
      </div>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.k} className="min-w-0 rounded-xl bg-tint-50 px-4 py-3">
            <dt className="text-xs font-semibold text-ink-soft">{t(`profile.details.${r.k}`)}</dt>
            <dd className="mt-0.5 font-semibold [overflow-wrap:anywhere] text-ink">{r.v}</dd>
          </div>
        ))}
      </dl>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('profile.details.editTitle')}</DialogTitle>
            <DialogDescription>{t('profile.details.editBody')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="pf-emirate">{t('profile.details.emirate')}</Label>
              <Select
                value={draft.emirate}
                onValueChange={(v) => setDraft({ ...draft, emirate: v as Emirate })}
              >
                <SelectTrigger id="pf-emirate" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EMIRATES.map((e) => (
                    <SelectItem key={e} value={e}>
                      {t(`profile.emirates.${e}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="pf-situation">{t('profile.details.situation')}</Label>
              <Select
                value={draft.situation}
                onValueChange={(v) => setDraft({ ...draft, situation: v as Situation })}
              >
                <SelectTrigger id="pf-situation" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SITUATIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {t(`profile.situations.${s}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('profile.cancel')}
            </Button>
            <Button
              className="rounded-full"
              onClick={() => {
                onSave(draft)
                setOpen(false)
                toast.success(t('profile.details.saved'))
              }}
            >
              {t('profile.details.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
