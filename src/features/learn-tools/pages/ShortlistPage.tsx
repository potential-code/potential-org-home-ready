import { Link } from '@tanstack/react-router'
import { Calculator, Home, Plus, Scale, TrendingDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { Button } from '@/components/ui/button'
import { formatNumber, useLocalized } from '@/i18n'
import { useShortlist } from '@/store/hooks'
import { AddHomeDialog } from '../components/homes/AddHomeDialog'
import { HomeCard } from '../components/homes/HomeCard'
import { homeCost } from '../components/homes/home-cost'

/** My homes (C8.1): shortlisted homes side by side with the true yearly cost from the domain. */
export function ShortlistPage() {
  const { t } = useTranslation('journeys')
  const { l, lang } = useLocalized()
  const homes = useShortlist()
  const [open, setOpen] = useState(false)
  const rows = useMemo(() => homes.map((h) => ({ home: h, cost: homeCost(h) })), [homes])
  const sorted = rows.map((r) => r.cost.firstYear)
  const min = sorted.length ? Math.min(...sorted) : 0
  const max = sorted.length ? Math.max(...sorted) : 0
  const cheapest = rows.find((r) => r.cost.firstYear === min)
  const aed = (n: number) => t('homes.aed', { value: formatNumber(Math.round(n), lang) })

  const add = (
    <Button onClick={() => setOpen(true)} className="rounded-full">
      <Plus className="size-4" aria-hidden />
      {t('homes.add')}
    </Button>
  )

  return (
    <>
      <PageHeader title={t('homes.title')} description={t('homes.description')} actions={add} />
      {rows.length ? (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <StatCard
              tone="primary"
              icon={Home}
              label={t('homes.stats.count')}
              value={rows.length}
              hint={t('homes.stats.countHint')}
            />
            <StatCard
              tone="accent"
              icon={TrendingDown}
              label={t('homes.stats.lowest')}
              value={aed(min)}
              hint={cheapest ? l(cheapest.home.title) : undefined}
            />
            <StatCard
              tone="deep"
              icon={Scale}
              label={t('homes.stats.gap')}
              value={aed(max - min)}
              hint={t('homes.stats.gapHint')}
            />
          </div>
          <section aria-labelledby="compare-h">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div className="max-w-3xl">
                <h2 id="compare-h" className="text-xl">
                  {t('homes.compareTitle')}
                </h2>
                <p className="mt-1 text-sm text-ink-soft">{t('homes.compareBody')}</p>
              </div>
              <Link
                to="/learn/calculator"
                search={{ tab: 'true-cost' }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
              >
                <Calculator className="size-4" aria-hidden />
                {t('homes.calculatorLink')}
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {rows.map((r) => (
                <HomeCard
                  key={r.home.id}
                  home={r.home}
                  cost={r.cost}
                  lowest={rows.length > 1 && r.cost.firstYear === min}
                />
              ))}
            </div>
            <p className="mt-4 text-xs text-ink-soft">{t('homes.estimateNote')}</p>
          </section>
        </>
      ) : (
        <EmptyState
          icon={Home}
          title={t('homes.emptyTitle')}
          body={t('homes.emptyBody')}
          action={add}
        />
      )}
      <AddHomeDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
