import { Link, useNavigate } from '@tanstack/react-router'
import { SendHorizontal, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CHECKLIST_BY_ID } from '@/data/checklists'
import { DALIL_GREETING } from '@/data/dalil'
import { useLocalized } from '@/i18n'
import { cn } from '@/lib/utils'
import { clearDalilChat, createChecklist } from '@/store/actions'
import { useChecklists } from '@/store/hooks'
import { ANSWER_TEMPLATE, FALLBACK_TEMPLATE } from './config'
import { DalilMessage } from './DalilMessage'
import { PromptChips } from './PromptChips'
import { TalkToPersonDialog } from './TalkToPersonDialog'
import { TypingIndicator } from './TypingIndicator'
import { useDalilChat } from './use-dalil-chat'

/** Ask Dalil conversation (C10): greeting, prompt chips, typing pause, answers with sources. */
export function DalilChat({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation('dalil')
  const { l } = useLocalized()
  const { me, messages, typing, ask } = useDalilChat()
  const checklists = useChecklists()
  const navigate = useNavigate()
  const [draft, setDraft] = useState('')
  const [error, setError] = useState(false)
  const [talkOpen, setTalkOpen] = useState(false)
  const [talkSent, setTalkSent] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const lastQuestion = [...messages].reverse().find((m) => m.from === 'user')
  const first = l(me.name).split(' ')[0] ?? ''

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll when the conversation grows
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' })
  }, [messages.length, typing])

  const send = (text: string) => {
    if (!text.trim()) return setError(true)
    if (ask(text)) setDraft('')
  }

  const templateFor = (answerId?: string) =>
    (answerId && ANSWER_TEMPLATE[answerId]) || FALLBACK_TEMPLATE
  const savedIn = (answerId?: string) => {
    const tplId = templateFor(answerId)
    const c = checklists.find((x) => x.templateId === tplId)
    return c ? l(c.title) : undefined
  }
  const save = (answerId?: string) => {
    const tplId = templateFor(answerId)
    const existing = checklists.find((x) => x.templateId === tplId)
    if (existing) {
      toast.info(t('chat.savedExisting', { title: l(existing.title) }))
      return
    }
    const id = createChecklist(me.id, tplId)
    toast.success(t('chat.savedNew', { title: l(CHECKLIST_BY_ID[tplId]?.title) }), {
      action: {
        label: t('chat.openChecklist'),
        onClick: () =>
          navigate({ to: '/learn/checklists/$checklistId', params: { checklistId: id } }),
      },
    })
  }

  return (
    <div className={cn('flex min-h-0 flex-1 flex-col', compact ? 'gap-3' : 'gap-4')}>
      <section
        aria-label={t('chat.logLabel')}
        aria-live="polite"
        className={cn(
          'min-h-0 flex-1 space-y-4 overflow-y-auto rounded-2xl bg-tint-50 p-3 sm:p-5',
          compact ? 'max-h-[50vh]' : 'min-h-[22rem]',
        )}
      >
        <div className="flex">
          <p className="max-w-[92%] rounded-2xl rounded-ss-sm bg-white p-4 leading-relaxed text-ink shadow-md ring-1 ring-border/70">
            <span className="mb-1 block text-xs font-bold tracking-wide text-brand uppercase">
              {t('chat.dalil')}
            </span>
            {l(DALIL_GREETING).replace('{{name}}', first)}
          </p>
        </div>
        {messages.map((m) => (
          <DalilMessage
            key={m.id}
            message={m}
            compact={compact}
            savedIn={m.answerId ? savedIn(m.answerId) : undefined}
            onSave={() => save(m.answerId)}
            onTalk={() => setTalkOpen(true)}
            talkSent={talkSent}
          />
        ))}
        {typing && <TypingIndicator />}
        <div ref={endRef} />
      </section>

      <PromptChips onPick={send} disabled={typing} compact={compact} />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(draft)
        }}
        noValidate
        className="space-y-1.5"
      >
        <label htmlFor={compact ? 'dalil-q-compact' : 'dalil-q'} className="sr-only">
          {t('chat.inputLabel')}
        </label>
        <div className="flex gap-2">
          <Input
            id={compact ? 'dalil-q-compact' : 'dalil-q'}
            value={draft}
            placeholder={t('chat.placeholder')}
            onChange={(e) => {
              setDraft(e.target.value)
              setError(false)
            }}
            aria-invalid={error}
            aria-describedby={error ? 'dalil-q-err' : undefined}
            className="h-10 min-w-0 flex-1 bg-white"
          />
          <Button type="submit" disabled={typing} className="rounded-full">
            <SendHorizontal className="rtl-mirror" aria-hidden />
            <span className={cn(compact && 'sr-only')}>{t('chat.send')}</span>
          </Button>
        </div>
        {error && (
          <p id="dalil-q-err" role="alert" className="text-sm font-medium text-danger">
            {t('chat.sendError')}
          </p>
        )}
      </form>

      {!compact && messages.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearDalilChat(me.id)
              toast.success(t('chat.cleared'))
            }}
          >
            <Trash2 aria-hidden />
            {t('chat.clear')}
          </Button>
        </div>
      )}
      {compact && (
        <Link
          to="/learn/assistant"
          className="text-center text-sm font-semibold text-brand hover:underline"
        >
          {t('floating.openFull')}
        </Link>
      )}

      <TalkToPersonDialog
        open={talkOpen}
        onOpenChange={setTalkOpen}
        question={lastQuestion ? l(lastQuestion.text) : ''}
        onSent={() => setTalkSent(true)}
      />
    </div>
  )
}
