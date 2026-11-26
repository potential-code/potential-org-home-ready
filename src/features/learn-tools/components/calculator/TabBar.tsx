import type { CalcTab } from '@shared/types'
import { Check, Home, Scale, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { CALC_TABS } from './config'

const ICON = { 'true-cost': Wallet, 'rent-vs-buy': Scale, afford: Home } as const

/** Three choice cards acting as tabs; selected = primary background, white text, check. */
export function TabBar({ value, onChange }: { value: CalcTab; onChange: (t: CalcTab) => void }) {
  const { t } = useTranslation('calculator')
  return (
    <div role="tablist" aria-label={t('tabs.label')} className="mb-6 grid gap-3 sm:grid-cols-3">
      {CALC_TABS.map((tab) => {
        const Icon = ICON[tab]
        const on = tab === value
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            id={`calc-tab-${tab}`}
            aria-selected={on}
            aria-controls="calc-panel"
            onClick={() => onChange(tab)}
            className={cn(
              'flex items-start gap-3 rounded-2xl p-4 text-start shadow-md transition focus-visible:ring-4 focus-visible:ring-brand-highlight/70',
              on ? 'bg-brand text-white' : 'card card-hover text-ink',
            )}
          >
            <Icon className={cn('mt-0.5 size-5 shrink-0', on ? 'text-white' : 'text-brand')} />
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{t(`tabs.${tab}.title`)}</span>
              <span className={cn('block text-sm', on ? 'text-white/85' : 'text-ink-soft')}>
                {t(`tabs.${tab}.body`)}
              </span>
            </span>
            {on && <Check className="size-5 shrink-0" aria-hidden />}
          </button>
        )
      })}
    </div>
  )
}
