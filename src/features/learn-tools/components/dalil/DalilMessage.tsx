import type { ChatMessage, Source } from '@shared/types'
import { Link } from '@tanstack/react-router'
import { ArrowRight, BookmarkPlus, CheckCircle2, ExternalLink, Headset } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { DALIL_ANSWERS, DALIL_DISCLAIMER } from '@/data/dalil'
import { SOURCE_BY_ID } from '@/data/sources'
import { formatDate, useLocalized } from '@/i18n'
import { cn } from '@/lib/utils'

interface DalilMessageProps {
  message: ChatMessage
  compact?: boolean
  /** Title of the checklist this answer is already saved in, if any. */
  savedIn?: string
  onSave: () => void
  onTalk: () => void
  talkSent: boolean
}

/** One chat bubble. Dalil answers carry sources with check dates, the education note and actions. */
export function DalilMessage({
  message,
  compact,
  savedIn,
  onSave,
  onTalk,
  talkSent,
}: DalilMessageProps) {
  const { t } = useTranslation('dalil')
  const { l, lang } = useLocalized()
  if (message.from === 'user') {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-se-sm bg-brand px-4 py-2.5 text-white shadow-sm">
          <span className="sr-only">{t('chat.you')}: </span>
          {l(message.text)}
        </p>
      </div>
    )
  }
  const answer = DALIL_ANSWERS.find((a) => a.id === message.answerId)
  const sources = (answer?.sourceIds ?? [])
    .map((id) => SOURCE_BY_ID[id])
    .filter((s): s is Source => !!s)
  return (
    <div className="flex">
      <div
        className={cn(
          'max-w-[92%] min-w-0 space-y-3 rounded-2xl rounded-ss-sm bg-white p-4 shadow-md ring-1 ring-border/70',
          compact && 'max-w-full p-3 text-sm',
        )}
      >
        <p className="text-xs font-bold tracking-wide text-brand uppercase">{t('chat.dalil')}</p>
        <p className="leading-relaxed text-ink">{l(message.text)}</p>
        {sources.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-ink-soft">{t('chat.sources')}</p>
            <ul className="space-y-1 text-sm">
              {sources.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-start gap-1 font-medium text-brand hover:underline"
                  >
                    <ExternalLink className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                    <span>
                      {l(s.org)}: {l(s.name)}{' '}
                      <span className="font-normal text-ink-soft">
                        · {t('chat.checked', { date: formatDate(s.checkedOn, lang) })}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {answer && <p className="text-xs text-ink-soft italic">{l(DALIL_DISCLAIMER)}</p>}
        <div className="flex flex-wrap gap-2 [&_a]:h-auto [&_a]:max-w-full [&_button]:max-w-full [&_a]:min-h-9 [&_a]:py-1.5 [&_a]:whitespace-normal [&_a]:text-start [&_button]:h-auto [&_button]:min-h-9 [&_button]:py-1.5 [&_button]:whitespace-normal [&_button]:text-start">
          {answer?.link && (
            <Button asChild size="sm" variant="outline">
              <Link to={answer.link.to}>
                {l(answer.link.label)}
                <ArrowRight className="rtl-mirror" aria-hidden />
              </Link>
            </Button>
          )}
          {answer &&
            (savedIn ? (
              <Button asChild size="sm" variant="outline">
                <Link to="/learn/checklists">
                  <CheckCircle2 className="text-success" aria-hidden />
                  {t('chat.inChecklist')}
                </Link>
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={onSave}>
                <BookmarkPlus aria-hidden />
                {t('chat.saveToChecklist')}
              </Button>
            ))}
          <Button size="sm" variant="outline" onClick={onTalk} disabled={talkSent}>
            <Headset aria-hidden />
            {talkSent ? t('chat.person.requested') : t('chat.talkToPerson')}
          </Button>
        </div>
      </div>
    </div>
  )
}
