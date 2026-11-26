import type { Source, Unit } from '@shared/types'
import { ArrowRight, CalendarCheck, ExternalLink, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { SOURCE_BY_ID } from '@/data/sources'
import { formatDate, useLocalized } from '@/i18n'

/**
 * End of every lesson (C9): "Checked on" date and sources for units with fees or rules, the
 * education disclaimer, and the "Your action" button to the related tool.
 */
export function UnitFooter({ unit }: { unit: Unit }) {
  const { t } = useTranslation('learning')
  const { l, lang } = useLocalized()
  const sources = (unit.sourceIds ?? [])
    .map((id) => SOURCE_BY_ID[id])
    .filter((s): s is Source => !!s)
  const action = unit.action
  const external = action?.kind === 'source' || action?.to.startsWith('http')
  return (
    <div className="grid gap-4">
      {action && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-tint-50 p-4">
          <div className="min-w-0">
            <p className="text-xs font-bold tracking-widest text-brand uppercase">
              {t('unit.yourAction')}
            </p>
            <p className="font-semibold text-ink">{l(action.label)}</p>
          </div>
          <Button asChild className="rounded-full">
            {external ? (
              <a href={action.to} target="_blank" rel="noreferrer">
                {t('unit.openSource')} <ExternalLink aria-hidden />
              </a>
            ) : (
              <a href={`#${action.to}`}>
                {t('unit.doIt')} <ArrowRight className="rtl-mirror" aria-hidden />
              </a>
            )}
          </Button>
        </div>
      )}
      <div className="grid gap-1.5 text-sm text-ink-soft">
        {unit.checkedOn && (
          <p className="flex items-center gap-1.5 font-semibold text-ink">
            <CalendarCheck className="size-4 text-brand" aria-hidden />
            {t('unit.checkedOn', { date: formatDate(unit.checkedOn, lang) })}
          </p>
        )}
        {sources.length > 0 && (
          <div>
            <p className="font-semibold text-ink">{t('unit.sources')}</p>
            <ul className="mt-1 grid gap-1 ps-5">
              {sources.map((s) => (
                <li key={s.id} className="list-disc">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand underline underline-offset-2"
                  >
                    {l(s.name)}
                  </a>{' '}
                  <span>({l(s.org)})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="flex items-center gap-1.5">
          <Info className="size-4 text-brand" aria-hidden /> {t('unit.disclaimer')}
        </p>
      </div>
    </div>
  )
}
