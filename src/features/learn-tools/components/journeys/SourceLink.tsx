import { ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SOURCES } from '@/data/sources'
import { formatDate, useLocalized } from '@/i18n'

/** Link to an official source (public page, new tab) with organisation and check date. */
export function SourceLink({ sourceId }: { sourceId: string }) {
  const { t } = useTranslation('journeys')
  const { l, lang } = useLocalized()
  const s = SOURCES.find((x) => x.id === sourceId)
  if (!s) return null
  return (
    <div className="rounded-xl bg-tint-50 p-3 ring-1 ring-brand/10">
      <a
        href={s.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 font-semibold text-brand underline-offset-4 hover:underline"
      >
        {t('player.openSource', { name: l(s.name) })}
        <ExternalLink className="size-4" aria-hidden />
      </a>
      <p className="mt-1 text-xs text-ink-soft">
        {t('player.sourceChecked', { org: l(s.org), date: formatDate(s.checkedOn, lang) })}
      </p>
    </div>
  )
}
