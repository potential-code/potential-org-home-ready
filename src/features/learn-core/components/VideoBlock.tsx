import type { Block } from '@shared/types'
import { CheckCircle2, Clock, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SmartImage } from '@/components/shared/SmartImage'
import { Button } from '@/components/ui/button'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useLocalized } from '@/i18n'

/**
 * Simulated video: 16:9 poster frame (track image + dark scrim, play icon, title, duration), a short
 * fill to "watched" and the "Video coming soon" caption. No media files.
 */
export function VideoBlock({
  block,
  cover,
  onWatched,
}: {
  block: Block
  cover?: string
  onWatched: () => void
}) {
  const { t } = useTranslation('learning')
  const { l } = useLocalized()
  const reduce = useReducedMotion()
  const [state, setState] = useState<'idle' | 'playing' | 'watched'>('idle')
  const watched = useRef(onWatched)
  watched.current = onWatched
  useEffect(() => {
    if (state !== 'playing') return
    const id = window.setTimeout(
      () => {
        setState('watched')
        watched.current()
      },
      reduce ? 0 : 2500,
    )
    return () => window.clearTimeout(id)
  }, [state, reduce])
  return (
    <figure className="grid gap-3">
      <section
        aria-label={t('player.videoLabel', { title: l(block.title) })}
        className="relative grid aspect-video place-items-center overflow-hidden rounded-2xl bg-brand-deep text-white shadow-md"
      >
        <SmartImage src={cover} alt="" className="absolute inset-0 size-full" />
        <div className="absolute inset-0 bg-ink/65" aria-hidden />
        <div className="absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-2 p-4 sm:p-5">
          <p className="hidden max-w-[75%] text-lg leading-snug font-bold text-white sm:block">
            {l(block.title)}
          </p>
          {block.duration && (
            <span className="ms-auto inline-flex items-center gap-1 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-semibold text-white">
              <Clock className="size-3.5" aria-hidden /> {block.duration}
            </span>
          )}
        </div>
        {state === 'idle' ? (
          <Button
            onClick={() => setState('playing')}
            className="relative rounded-full bg-white px-6 text-brand-deep hover:bg-tint-50"
          >
            <Play className="fill-current" aria-hidden /> {t('player.play')}
          </Button>
        ) : (
          <p className="relative flex items-center gap-2 font-semibold" aria-live="polite">
            {state === 'watched' ? (
              <>
                <CheckCircle2 className="size-5" aria-hidden /> {t('player.watched')}
              </>
            ) : (
              t('player.playing')
            )}
          </p>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-white/20" aria-hidden>
          <div
            className="h-full bg-brand-highlight transition-[width] ease-linear motion-reduce:transition-none"
            style={{
              width: state === 'idle' ? '0%' : '100%',
              transitionDuration: state === 'playing' && !reduce ? '2500ms' : '0ms',
            }}
          />
        </div>
      </section>
      <figcaption dir="auto" className="text-sm font-semibold text-ink-soft">
        {l(block.body)}
      </figcaption>
    </figure>
  )
}
