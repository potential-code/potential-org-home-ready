import type { ContentItem } from '@shared/types'
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
import { saveContentTitle } from '../hooks/use-content-edits'

/** Edit an item's EN and AR titles. */
export function ContentEditDialog({
  item,
  title,
  onClose,
}: {
  item: ContentItem | null
  title: { en: string; ar?: string }
  onClose: () => void
}) {
  const { t } = useTranslation('owner')
  const [en, setEn] = useState('')
  const [ar, setAr] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    setEn(title.en)
    setAr(title.ar ?? '')
    setError('')
  }, [title.en, title.ar])
  const save = () => {
    if (!item) return
    if (!en.trim()) {
      setError(t('content.titleRequired'))
      return
    }
    saveContentTitle(item.id, { en: en.trim(), ar: ar.trim() })
    toast.success(t('content.edited', { title: en.trim() }))
    onClose()
  }
  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('content.editTitle')}</DialogTitle>
          <DialogDescription>{t('content.editDescription')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ce-en">{t('content.titleEn')}</Label>
            <Input
              id="ce-en"
              value={en}
              aria-invalid={!!error}
              aria-describedby={error ? 'ce-err' : undefined}
              onChange={(e) => setEn(e.target.value)}
            />
            {error && (
              <p id="ce-err" className="text-sm text-danger">
                {error}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ce-ar">{t('content.titleAr')}</Label>
            <Input
              id="ce-ar"
              dir="rtl"
              lang="ar"
              value={ar}
              onChange={(e) => setAr(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={save} className="rounded-full">
            {t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
