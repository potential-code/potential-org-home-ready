import type { Figure } from '@shared/types'
import { useTranslation } from 'react-i18next'
import { CHECKED_ON } from '@/data/sources'
import { formatDate, useLocalized } from '@/i18n'

/** "Source: X · checked on 25 Nov 2026" under a default. No figure = demo value. */
export function SourceLine({ source, id }: { source?: Figure; id?: string }) {
  const { t } = useTranslation('calculator')
  const { l, lang } = useLocalized()
  const label = source ? l(source.sourceLabel) : t('source.demo')
  const date = formatDate(source?.checkedOn ?? CHECKED_ON, lang)
  return (
    <p id={id} className="text-xs leading-snug text-ink-soft">
      {t('source.prefix')}{' '}
      {source?.sourceUrl ? (
        <a
          href={source.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-brand underline-offset-2 hover:underline"
        >
          {label}
        </a>
      ) : (
        <span className="font-medium text-ink">{label}</span>
      )}{' '}
      · {t('source.checked', { date })}
    </p>
  )
}
