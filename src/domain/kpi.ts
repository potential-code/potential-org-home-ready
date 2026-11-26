import { KPI } from '@/data/figures'
import { pct } from './progress'

/**
 * KPI maths (C13/C15). Landing counters, Maya's Overview and Leadership all call `liveKpis` so
 * they always match. `delta` = live demo actions added on top of the pilot aggregates.
 */
export interface KpiDelta {
  joined: number
  onboarded: number
  firstUsefulAction: number
  journeysCompleted: number
  journeysWithNextAction: number
  checklistsSaved: number
  calculatorSaves: number
  reminderOptIns: number
  consentedRequests: number
  certificates: number
}

export const ZERO_DELTA: KpiDelta = {
  joined: 0,
  onboarded: 0,
  firstUsefulAction: 0,
  journeysCompleted: 0,
  journeysWithNextAction: 0,
  checklistsSaved: 0,
  calculatorSaves: 0,
  reminderOptIns: 0,
  consentedRequests: 0,
  certificates: 0,
}

export function liveKpis(d: KpiDelta = ZERO_DELTA) {
  const joined = KPI.joined + d.joined
  const firstUsefulAction = KPI.firstUsefulAction + d.firstUsefulAction
  const journeysCompleted = KPI.journeysCompleted + d.journeysCompleted
  const journeysWithNextAction = KPI.journeysWithNextAction + d.journeysWithNextAction
  const checklistsSaved = KPI.checklistsSaved + d.checklistsSaved
  const calculatorSaves = KPI.calculatorSaves + d.calculatorSaves
  return {
    joined,
    onboarded: KPI.onboarded + d.onboarded,
    firstUsefulAction,
    /** K3: of all sign-ups (pilot cohort all at least 14 days old). */
    k3Pct: pct(firstUsefulAction, joined),
    returnedEligible: KPI.returnedEligible,
    returned30: KPI.returned30,
    /** K4 return rate. */
    k4Pct: pct(KPI.returned30, KPI.returnedEligible),
    reminderOptIns: KPI.reminderOptIns + d.reminderOptIns,
    journeysCompleted,
    journeysWithNextAction,
    /** K1 detail: journeys with a saved next action. */
    k1Pct: pct(journeysWithNextAction, journeysCompleted),
    journeysBuilt: KPI.journeysBuilt,
    journeysWorking: KPI.journeysWorking,
    calculatorsWorking: KPI.calculatorsWorking,
    claimsSourced: KPI.claimsSourced,
    claimsTotal: KPI.claimsTotal,
    k2ClaimsPct: pct(KPI.claimsSourced, KPI.claimsTotal),
    checklistsSaved,
    calculatorSaves,
    totalSaves: checklistsSaved + calculatorSaves,
    certificates: KPI.certificates + d.certificates,
    certificatesA: KPI.certificatesA,
    certificatesB: KPI.certificatesB,
    consentedRequests: KPI.consentedRequests + d.consentedRequests,
    unconsentedShares: KPI.unconsentedShares,
    confidencePre: KPI.confidencePre,
    confidencePost: KPI.confidencePost,
    signupsLast30: KPI.signupsLast30 + d.joined,
    noUsefulAction7d: KPI.noUsefulAction7d,
  }
}

export type LiveKpis = ReturnType<typeof liveKpis>
