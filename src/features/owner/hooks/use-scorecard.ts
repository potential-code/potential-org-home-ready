import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { KPI, MIX } from '@/data/figures'
import { formatNumber, useLocalized } from '@/i18n'
import { useKpis } from '@/store/hooks'
import { SOURCE_OPTIONS } from '../config'

export interface ScoreRow {
  label: string
  value: string
  muted?: boolean
}
export interface ScoreSection {
  id: string
  title: string
  body?: string
  rows: ScoreRow[]
}

/** Scorecard (C8.2 Reports). Counts derive from useKpis and the C15 mix, never retyped. */
export function useScorecard(): ScoreSection[] {
  const { t } = useTranslation('owner')
  const { lang } = useLocalized()
  const k = useKpis()
  return useMemo(() => {
    const n = (x: number) => formatNumber(x, lang)
    const share = (pct: number) => ({
      value: n(Math.round((k.joined * pct) / 100)),
      hint: t('reports.ofTotal', { pct, total: n(k.joined) }),
    })
    const pre = t('reports.preLaunch')
    const na = t('reports.notYet')
    return [
      {
        id: 'source',
        title: t('reports.signupsBySource'),
        rows: SOURCE_OPTIONS.map((s) => {
          const x = share(MIX.source[s as keyof typeof MIX.source])
          return { label: t(`source.${s}`), value: `${x.value} (${x.hint})` }
        }),
      },
      {
        id: 'track',
        title: t('reports.signupsByTrack'),
        rows: (['A', 'B'] as const).map((tr) => {
          const x = share(MIX.track[tr])
          return { label: t(`track.${tr}`), value: `${x.value} (${x.hint})` }
        }),
      },
      {
        id: 'engagement',
        title: t('reports.engagement'),
        rows: [
          {
            label: t('reports.usefulRate'),
            value: `${k.k3Pct}% (${n(k.firstUsefulAction)} of ${n(k.joined)})`,
          },
          {
            label: t('reports.return30'),
            value: `${k.k4Pct}% (${n(k.returned30)} of ${n(k.returnedEligible)})`,
          },
          { label: t('reports.return90'), value: t('reports.notYet90'), muted: true },
          { label: t('reports.reminderOptIns'), value: n(k.reminderOptIns) },
          {
            label: t('reports.trackCompletion'),
            value: t('reports.trackCompletionValue', {
              a: KPI.trackACompletionPct,
              b: KPI.trackBCompletionPct,
            }),
          },
          { label: t('reports.certificates'), value: n(k.certificates) },
          { label: t('reports.offerUse'), value: n(KPI.sponsor.offerViews) },
          { label: t('reports.consented'), value: n(k.consentedRequests) },
        ],
      },
      {
        id: 'money',
        title: t('reports.money'),
        body: t('reports.moneyBody'),
        rows: [
          { label: t('reports.pipeline'), value: pre, muted: true },
          { label: t('reports.agreements'), value: pre, muted: true },
          { label: t('reports.received'), value: pre, muted: true },
        ],
      },
      {
        id: 'unit',
        title: t('reports.unitEconomics'),
        rows: [
          { label: t('reports.costPerUser'), value: na, muted: true },
          { label: t('reports.revenuePerUser'), value: na, muted: true },
        ],
      },
    ]
  }, [k, t, lang])
}
