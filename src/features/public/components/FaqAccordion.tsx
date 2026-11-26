import { Plus } from 'lucide-react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { FAQ_COUNT } from '../config'

/**
 * The eight C5.12 questions as an accordion (one open at a time, first open by default). Used on
 * the landing FAQ band and the /faq page. Items carry `data-reveal` for the landing scroll reveal.
 */
export function FaqAccordion({ className }: { className?: string }) {
  const { t } = useTranslation('public')
  const [open, setOpen] = useState<number | null>(0)
  const base = useId()
  return (
    <ul className={cn('space-y-3', className)}>
      {Array.from({ length: FAQ_COUNT }, (_, i) => {
        const isOpen = open === i
        const btn = `${base}-q${i}`
        const panel = `${base}-a${i}`
        return (
          <li
            data-reveal
            key={btn}
            className={cn(
              'card overflow-hidden transition-shadow',
              isOpen && 'border-brand/30 shadow-lg',
            )}
          >
            <h3>
              <button
                id={btn}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-14 w-full items-center gap-4 px-5 py-3 text-start text-base font-bold text-ink sm:text-lg"
              >
                <span className="flex-1">{t(`faq.items.${i}.q`)}</span>
                <Plus
                  className={cn(
                    'size-5 shrink-0 text-brand transition-transform duration-300',
                    isOpen && 'rotate-45',
                  )}
                  aria-hidden
                />
              </button>
            </h3>
            <section
              id={panel}
              aria-labelledby={btn}
              className={cn(
                'grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-ink-soft">{t(`faq.items.${i}.a`)}</p>
              </div>
            </section>
          </li>
        )
      })}
    </ul>
  )
}
