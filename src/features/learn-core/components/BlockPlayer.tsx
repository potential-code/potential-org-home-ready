import type { Block } from '@shared/types'
import { CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocalized } from '@/i18n'
import { PracticeBlock } from './PracticeBlock'
import { QuestionBlock } from './QuestionBlock'
import { VideoBlock } from './VideoBlock'

/** Renders one learning block by kind. `onDone` marks the block complete. */
export function BlockPlayer({
  block,
  cover,
  onDone,
}: {
  block: Block
  cover?: string
  onDone: () => void
}) {
  const { t } = useTranslation('learning')
  const { l, isPlaceholder } = useLocalized()
  const placeholder = isPlaceholder(block.body) ? (
    <p className="text-xs text-ink-soft">{t('common:arabicPlaceholder')}</p>
  ) : null
  return (
    <section aria-labelledby={`block-${block.id}`} className="grid gap-4">
      <h3 id={`block-${block.id}`} className="text-lg">
        {l(block.title)}
      </h3>
      {block.kind === 'video' && <VideoBlock block={block} cover={cover} onWatched={onDone} />}
      {block.kind === 'read' &&
        l(block.body)
          .split('\n')
          .map((p) => (
            <p key={p} dir="auto" className="max-w-prose leading-relaxed text-ink">
              {p}
            </p>
          ))}
      {block.kind === 'summary' && (
        <div className="rounded-2xl bg-tint-50 p-5">
          <p className="mb-2 text-xs font-bold tracking-widest text-brand uppercase">
            {t('player.keyPoints')}
          </p>
          <ul className="grid gap-2">
            {l(block.body)
              .split('\n')
              .map((p) => (
                <li key={p} dir="auto" className="flex items-start gap-2 text-ink">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                  {p}
                </li>
              ))}
          </ul>
        </div>
      )}
      {block.kind === 'question' && block.question && (
        <QuestionBlock question={block.question} onAnswered={onDone} />
      )}
      {block.kind === 'question' && !block.question && <p className="text-ink">{l(block.body)}</p>}
      {block.kind === 'practice' && <PracticeBlock block={block} onSaved={onDone} />}
      {placeholder}
    </section>
  )
}
