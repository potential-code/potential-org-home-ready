import type { TFunction } from 'i18next'
import type { LiveKpis } from '@/domain/kpi'

/** Scorecard rows (C13 table) built from live KPIs, used by the CSV and the print views. */
export function scorecardRows(k: LiveKpis, t: TFunction, n: (v: number) => string) {
  const row = (id: 'k1' | 'k2' | 'k3' | 'k4', value: string, detail: string, up: boolean) => ({
    id,
    label: t(`kpi.${id}.label`),
    definition: t(`kpi.${id}.definition`),
    target: t(`kpi.${id}.target`),
    value: `${value} (${detail})`,
    trend: up ? t('trend.up') : t('trend.flat'),
  })
  return [
    row(
      'k1',
      t('kpi.k1.value', { working: k.journeysWorking, built: k.journeysBuilt }),
      t('kpi.k1.detail', {
        completed: n(k.journeysCompleted),
        withNext: n(k.journeysWithNextAction),
        pct: k.k1Pct,
      }),
      true,
    ),
    row(
      'k2',
      t('kpi.k2.value', { working: k.calculatorsWorking, pct: k.k2ClaimsPct }),
      t('kpi.k2.detail', { sourced: k.claimsSourced, total: k.claimsTotal }),
      false,
    ),
    row(
      'k3',
      `${k.k3Pct}%`,
      t('kpi.k3.detail', { useful: n(k.firstUsefulAction), joined: n(k.joined) }),
      true,
    ),
    row(
      'k4',
      `${k.k4Pct}%`,
      t('kpi.k4.detail', {
        returned: n(k.returned30),
        eligible: n(k.returnedEligible),
        unconsented: k.unconsentedShares,
        reminders: n(k.reminderOptIns),
        consented: n(k.consentedRequests),
      }),
      true,
    ),
  ]
}

/** Pilot status counts (C15) for the scorecard and the summary. */
export function statusRows(k: LiveKpis, t: TFunction) {
  return [
    { id: 'journeys', label: t('reports.status.journeys'), value: k.journeysCompleted },
    { id: 'checklists', label: t('reports.status.checklists'), value: k.checklistsSaved },
    { id: 'calc', label: t('reports.status.calcSaves'), value: k.calculatorSaves },
    {
      id: 'certs',
      label: t('reports.status.certificates', { a: k.certificatesA, b: k.certificatesB }),
      value: k.certificates,
    },
    { id: 'consented', label: t('reports.status.consented'), value: k.consentedRequests },
    { id: 'unconsented', label: t('reports.status.unconsented'), value: k.unconsentedShares },
  ]
}
