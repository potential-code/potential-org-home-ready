import { CheckCircle2, CircleDashed } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { KEY_DATES } from '../../config'
import { Section } from '../Section'

/** C5.9 Key dates: a horizontal timeline on wide screens, vertical on phones. Nav target "events". */
export function DatesSection() {
  const { t } = useTranslation('public')
  return (
    <Section id="events" tone="page" eyebrow={t('dates.eyebrow')} title={t('dates.title')}>
      <ol className="relative grid gap-0 lg:grid-cols-5 lg:gap-5">
        <span
          aria-hidden
          className="absolute start-[0.6875rem] top-3 bottom-3 w-0.5 bg-brand/20 lg:start-0 lg:end-0 lg:top-[0.6875rem] lg:bottom-auto lg:h-0.5 lg:w-auto"
        />
        {KEY_DATES.map((d) => {
          const Icon = d.done ? CheckCircle2 : CircleDashed
          return (
            <li data-reveal key={d.key} className="relative ps-10 pb-6 lg:ps-0 lg:pb-0">
              <Icon
                className={cn(
                  'absolute start-0 top-0 size-6 bg-white lg:static',
                  d.done ? 'text-brand' : 'text-ink-soft',
                )}
                aria-hidden
              />
              <div
                className={cn(
                  'card mt-0 p-4 lg:mt-4',
                  d.done && 'border-brand/40 ring-1 ring-brand/20',
                )}
              >
                <p className={cn('text-sm font-bold', d.done ? 'text-brand' : 'text-ink-soft')}>
                  {t(`dates.${d.key}.when`)}
                  <span className="sr-only"> ({d.done ? t('dates.done') : t('dates.next')})</span>
                </p>
                <h3 className="mt-1 text-base leading-snug">{t(`dates.${d.key}.title`)}</h3>
              </div>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}
