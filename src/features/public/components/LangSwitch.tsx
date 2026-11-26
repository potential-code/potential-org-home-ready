import type { Lang } from '@shared/types'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { setLang, usePrefs } from '@/store/actions/session'

const OPTIONS: { lang: Lang; key: string }[] = [
  { lang: 'en', key: 'header.langEn' },
  { lang: 'ar', key: 'header.langAr' },
]

/** "EN | عربي" switch for the public header band (C5.1). Keeps the current screen. */
export function LangSwitch({ onDark = true, className }: { onDark?: boolean; className?: string }) {
  const { t } = useTranslation('public')
  const { lang } = usePrefs()
  return (
    <fieldset
      aria-label={t('header.langLabel')}
      className={cn(
        'inline-flex h-9 items-center rounded-full p-0.5 text-xs font-bold',
        onDark ? 'bg-white/10 ring-1 ring-white/25' : 'bg-tint-100',
        className,
      )}
    >
      {OPTIONS.map((o) => {
        const active = o.lang === lang
        return (
          <button
            key={o.lang}
            type="button"
            lang={o.lang}
            aria-pressed={active}
            onClick={() => setLang(o.lang)}
            className={cn(
              'h-8 min-w-11 rounded-full px-3 transition-colors',
              active
                ? 'bg-white text-brand-deep shadow-sm'
                : onDark
                  ? 'text-white hover:bg-white/15'
                  : 'text-ink-soft hover:text-ink',
            )}
          >
            {t(o.key)}
          </button>
        )
      })}
    </fieldset>
  )
}
