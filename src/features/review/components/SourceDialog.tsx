import type { Source } from '@shared/types'
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
import { now } from '@/lib/clock'
import { upsertSource } from '../hooks/use-source-register'

const EMPTY = { name: '', org: '', url: 'https://', emirate: 'Dubai', checkedOn: '' }

/** Add a new source or update an existing one. `source` null = closed, 'new' = add. */
export function SourceDialog({
  source,
  onClose,
}: {
  source: Source | 'new' | null
  onClose: () => void
}) {
  const { t } = useTranslation('review')
  const [f, setF] = useState(EMPTY)
  const [error, setError] = useState('')
  useEffect(() => {
    const today = now().slice(0, 10)
    setF(
      source && source !== 'new'
        ? {
            name: source.name.en,
            org: source.org.en,
            url: source.url,
            emirate: source.emirate.en,
            checkedOn: source.checkedOn.slice(0, 10),
          }
        : { ...EMPTY, checkedOn: today },
    )
    setError('')
  }, [source])
  const isNew = source === 'new'
  const save = () => {
    if (!source) return
    if (!f.name.trim() || !f.org.trim() || !/^https:\/\/\S+\.\S+/.test(f.url) || !f.checkedOn) {
      setError(t('sources.required'))
      return
    }
    const prev = source === 'new' ? null : source
    upsertSource({
      id: prev?.id ?? `src-${Date.now().toString(36)}`,
      name: { en: f.name.trim(), ar: prev?.name.ar ?? f.name.trim() },
      org: { en: f.org.trim(), ar: prev?.org.ar ?? f.org.trim() },
      url: f.url.trim(),
      emirate: { en: f.emirate.trim(), ar: prev?.emirate.ar ?? f.emirate.trim() },
      checkedOn: f.checkedOn,
    })
    toast.success(t('sources.saved', { name: f.name.trim() }))
    onClose()
  }
  const field = (key: keyof typeof EMPTY, label: string, type = 'text') => (
    <div className="space-y-1.5">
      <Label htmlFor={`sd-${key}`}>{label}</Label>
      <Input
        id={`sd-${key}`}
        type={type}
        value={f[key]}
        onChange={(e) => setF((x) => ({ ...x, [key]: e.target.value }))}
      />
    </div>
  )
  return (
    <Dialog open={!!source} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t(isNew ? 'sources.dialogAdd' : 'sources.dialogUpdate')}</DialogTitle>
          <DialogDescription>{t('sources.dialogBody')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">{field('name', t('sources.name'))}</div>
          {field('org', t('sources.org'))}
          {field('emirate', t('sources.emirate'))}
          <div className="sm:col-span-2">{field('url', t('sources.url'), 'url')}</div>
          {field('checkedOn', t('sources.checked'), 'date')}
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('sources.cancel')}
          </Button>
          <Button onClick={save} className="rounded-full">
            {t('sources.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
