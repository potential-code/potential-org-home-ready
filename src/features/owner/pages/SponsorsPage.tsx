import type { Placement } from '@shared/types'
import { Plus, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Motif } from '@/components/brand'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { PLACEMENT_RULE, SPONSOR_STATUS_LABEL, SPONSORS } from '@/data/catalogue'
import { useLocalized } from '@/i18n'
import { usePlacements } from '@/store/hooks'
import { AddPlacementDialog } from '../components/AddPlacementDialog'
import { PlacementPreviewDialog } from '../components/PlacementPreviewDialog'
import { PlacementRow } from '../components/PlacementRow'
import { SLOT_OPTIONS } from '../config'

/** Maya's Sponsors and placements (C8.2). */
export function SponsorsPage() {
  const { t } = useTranslation('owner')
  const { l } = useLocalized()
  const placements = usePlacements()
  const [add, setAdd] = useState(false)
  const [preview, setPreview] = useState<Placement | null>(null)
  const sponsorName = (id: string) => l(SPONSORS.find((s) => s.id === id)?.name)
  return (
    <div className="space-y-5">
      <PageHeader
        title={t('pages.sponsors')}
        description={t('sponsors.description')}
        actions={
          <Button onClick={() => setAdd(true)} className="rounded-full">
            <Plus aria-hidden />
            {t('sponsors.add')}
          </Button>
        }
      />
      <p className="on-dark relative flex items-start gap-2 overflow-hidden rounded-2xl bg-grad-brand p-4 text-white shadow-md">
        <ShieldCheck className="mt-0.5 size-5 shrink-0" aria-hidden />
        <span>
          <span className="font-semibold">{t('sponsors.rule')}: </span>
          {PLACEMENT_RULE}
        </span>
      </p>
      <section className="card p-5">
        <h2 className="text-lg">{t('sponsors.inventory')}</h2>
        <p className="mt-1 text-sm text-ink-soft">{t('sponsors.inventoryBody')}</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SLOT_OPTIONS.map((s) => {
            const all = placements.filter((p) => p.slot === s)
            return (
              <li key={s} className="rounded-xl bg-tint-50 p-3">
                <p className="text-sm font-semibold">{t(`sponsors.slots.${s}`)}</p>
                <p className="text-xs text-ink-soft">
                  {t('sponsors.slotCount', {
                    live: all.filter((p) => p.status === 'live').length,
                    total: all.length,
                  })}
                </p>
              </li>
            )
          })}
        </ul>
      </section>
      <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        {SPONSORS.map((s) => {
          const mine = placements.filter((p) => p.sponsorId === s.id)
          return (
            <section key={s.id} className="card relative overflow-hidden p-5">
              <Motif variant="corner" className="text-brand/10" />
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg">{l(s.name)}</h2>
                  <p className="text-sm text-ink-soft">{l(s.kind)}</p>
                </div>
                <StatusBadge tone="notice">{SPONSOR_STATUS_LABEL}</StatusBadge>
              </div>
              <p className="mt-2 text-xs font-semibold text-ink-soft">
                {t('sponsors.placements', { count: mine.length })}
              </p>
              <ul className="mt-1 divide-y divide-border/70">
                {mine.map((p) => (
                  <PlacementRow key={p.id} p={p} onPreview={() => setPreview(p)} />
                ))}
              </ul>
            </section>
          )
        })}
      </div>
      <AddPlacementDialog open={add} onOpenChange={setAdd} />
      <PlacementPreviewDialog
        placement={preview ? (placements.find((p) => p.id === preview.id) ?? preview) : null}
        sponsorName={preview ? sponsorName(preview.sponsorId) : ''}
        onClose={() => setPreview(null)}
      />
    </div>
  )
}
