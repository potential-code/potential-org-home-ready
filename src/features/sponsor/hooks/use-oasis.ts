import { SPONSOR_STATUS_LABEL, SPONSORS } from '@/data/catalogue'
import { useLocalized } from '@/i18n'

/** The demo sponsor's display name and contract status (static catalogue data). */
export function useOasis() {
  const { l } = useLocalized()
  const sponsor = SPONSORS.find((s) => s.id === 'SP-OASIS')
  return { name: l(sponsor?.name), status: l(SPONSOR_STATUS_LABEL) }
}
