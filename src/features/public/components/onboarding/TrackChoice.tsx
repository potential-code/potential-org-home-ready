import type { TrackKey } from '@shared/types'
import { Check, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SmartImage } from '@/components/shared/SmartImage'
import { cn } from '@/lib/utils'

const IMAGE: Record<TrackKey, string> = {
  A: 'images/generated/track-renting.jpg',
  B: 'images/generated/track-buying.jpg',
}

/** Whole selectable track card with its photo (onboarding step 2). Selected = primary fill + check. */
export function TrackChoice({
  track,
  selected,
  suggested,
  onSelect,
}: {
  track: TrackKey
  selected: boolean
  suggested: boolean
  onSelect: () => void
}) {
  const { t } = useTranslation('auth')
  const k = `onboarding.s2.${track.toLowerCase()}`
  return (
    // biome-ignore lint/a11y/useSemanticElements: whole selectable card acting as a radio (design system v2 choice card)
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border text-start shadow-md transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:outline-none',
        selected ? 'border-brand bg-brand text-white' : 'border-border/70 bg-white text-ink',
      )}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <SmartImage
          src={IMAGE[track]}
          alt=""
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {suggested && (
          <span className="absolute start-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand-highlight px-2.5 py-1 text-xs font-bold text-ink shadow-md">
            <Sparkles className="size-3.5" aria-hidden />
            {t('onboarding.s2.suggested')}
          </span>
        )}
        {selected && (
          <span className="absolute end-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-brand-deep shadow-md">
            <Check className="size-3.5" aria-hidden />
            {t('onboarding.s2.selected')}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h2 className={cn('text-xl', selected && 'text-white')}>{t(`${k}.title`)}</h2>
        <p className={cn('text-xs font-semibold', selected ? 'text-white/85' : 'text-brand')}>
          {t(`${k}.meta`)}
        </p>
        <p className={cn('text-sm', selected ? 'text-white/90' : 'text-ink-soft')}>
          {t(`${k}.body`)}
        </p>
      </div>
    </button>
  )
}
