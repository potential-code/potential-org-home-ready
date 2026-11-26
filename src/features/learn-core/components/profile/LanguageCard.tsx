import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { setLang, usePrefs } from '@/store/actions/session'

const LANGS = ['en', 'ar'] as const

/** Language choice (C8.1): switches the whole interface and direction. */
export function LanguageCard() {
  const { t } = useTranslation('learn')
  const { lang } = usePrefs()
  return (
    <section aria-labelledby="lang-title" className="card p-5 sm:p-6">
      <h2 id="lang-title" className="flex items-center gap-2 text-lg">
        <Languages className="size-5 text-brand" aria-hidden /> {t('profile.language.title')}
      </h2>
      <p className="mt-1 text-sm text-ink-soft">{t('profile.language.body')}</p>
      <fieldset aria-labelledby="lang-title" className="mt-4 grid grid-cols-2 gap-3">
        {LANGS.map((l) => {
          const on = lang === l
          return (
            <button
              key={l}
              type="button"
              aria-pressed={on}
              lang={l}
              onClick={() => {
                if (on) return
                setLang(l)
                toast.success(t('profile.language.saved'))
              }}
              className={`min-h-11 rounded-xl border px-4 py-2.5 text-start font-semibold transition-colors ${on ? 'border-brand bg-brand text-white' : 'border-border bg-white text-ink hover:bg-tint-50'}`}
            >
              {l === 'en' ? 'English' : 'العربية'}
            </button>
          )
        })}
      </fieldset>
    </section>
  )
}
