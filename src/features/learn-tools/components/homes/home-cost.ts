import type { ShortlistHome } from '@shared/types'
import { TRUE_COST_DEFAULTS } from '@/data/figures'
import { trueCost } from '@/domain/calculator'

/** True first-year cost of a shortlisted home: calculator defaults plus the home's own terms. */
export function homeCost(h: ShortlistHome) {
  return trueCost({
    ...TRUE_COST_DEFAULTS,
    annualRent: h.annualRent,
    cheques: h.cheques,
    furnished: h.furnished,
  })
}
