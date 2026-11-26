import type { Block } from '@shared/types'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLocalized } from '@/i18n'

/** Practice task with a private notes field (kept for this visit only). */
export function PracticeBlock({ block, onSaved }: { block: Block; onSaved: () => void }) {
  const { t } = useTranslation('learning')
  const { l } = useLocalized()
  const id = useId()
  const [notes, setNotes] = useState('')
  return (
    <div className="grid gap-4">
      <p dir="auto" className="rounded-xl bg-tint-50 px-4 py-3 leading-relaxed text-ink">
        {l(block.body)}
      </p>
      <div className="grid gap-1.5">
        <Label htmlFor={id}>{t('player.yourNotes')}</Label>
        <Textarea
          id={id}
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('player.notesPlaceholder')}
        />
      </div>
      <Button
        variant="outline"
        className="justify-self-start"
        disabled={!notes.trim()}
        onClick={() => {
          toast.success(t('player.notesSaved'))
          onSaved()
        }}
      >
        {t('player.saveNotes')}
      </Button>
    </div>
  )
}
