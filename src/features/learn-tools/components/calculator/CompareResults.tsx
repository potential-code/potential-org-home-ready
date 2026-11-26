import type { CalcResult } from '@shared/types'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useLocalized } from '@/i18n'
import { metricsOf } from './compare-metrics'
import { useMoney } from './use-money'

/** Two saved results side by side, with their headline numbers. */
export function CompareResults({ items, onClose }: { items: CalcResult[]; onClose: () => void }) {
  const { t } = useTranslation('calculator')
  const { l } = useLocalized()
  const { aed, num } = useMoney()
  return (
    <section className="card p-5" aria-labelledby="calc-compare">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 id="calc-compare" className="text-base">
          {t('saved.compareTitle')}
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="size-4" aria-hidden />
          {t('saved.closeCompare')}
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((r) => (
          <div key={r.id} className="rounded-xl bg-tint-50 p-4 ring-1 ring-brand/10">
            <p className="text-xs font-semibold text-brand">{t(`tabs.${r.tab}.title`)}</p>
            <p className="mt-1 font-semibold text-ink">{l(r.name)}</p>
            <dl className="mt-3 space-y-2">
              {metricsOf(r).map((m) => (
                <div key={m.key} className="flex items-baseline justify-between gap-3 text-sm">
                  <dt className="text-ink-soft">{t(`metrics.${m.key}`)}</dt>
                  <dd className="font-semibold tabular-nums text-ink">
                    {m.value === null
                      ? t('rentBuy.none')
                      : m.kind === 'year'
                        ? t('rentBuy.yearLong', { year: num(m.value) })
                        : aed(m.value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  )
}
