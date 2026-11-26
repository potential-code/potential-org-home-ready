import type { Lang } from '@shared/types'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

const LANGS: Lang[] = ['en', 'ar']

/** "Preferred language" radio (C6.1) as two compact selectable cards. */
export function LanguageChoice({ value, onChange }: { value: Lang; onChange: (v: Lang) => void }) {
  const { t } = useTranslation('auth')
  return (
    <div className="space-y-1.5">
      <p id="reg-language-label" className="text-sm font-semibold text-ink">
        {t('fields.language')}
      </p>
      <RadioGroup
        aria-labelledby="reg-language-label"
        value={value}
        onValueChange={(x) => onChange(x as Lang)}
        className="grid grid-cols-2 gap-3"
      >
        {LANGS.map((l) => {
          const on = value === l
          return (
            <Label
              key={l}
              htmlFor={`reg-lang-${l}`}
              lang={l}
              className={cn(
                'flex h-10 cursor-pointer items-center gap-2.5 rounded-xl border px-3 text-sm font-semibold shadow-xs transition-colors has-focus-visible:ring-[3px] has-focus-visible:ring-ring/40',
                on
                  ? 'border-brand bg-brand text-white'
                  : 'border-border bg-white text-ink hover:border-brand/50',
              )}
            >
              <RadioGroupItem id={`reg-lang-${l}`} value={l} className="sr-only" />
              {on && <Check className="size-4" aria-hidden />}
              {t(`options.language.${l}`)}
            </Label>
          )
        })}
      </RadioGroup>
    </div>
  )
}
