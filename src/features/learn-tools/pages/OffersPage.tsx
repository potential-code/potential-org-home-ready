import { Gift } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { usePartnerConsents, useVisibleOffers } from '@/store/hooks'
import { OfferCard } from '../components/offers/OfferCard'

/** Offers (brief C11.3): sponsored partner offers; sharing only after an explicit tick. */
export function OffersPage() {
  const { t } = useTranslation('dalil')
  const offers = useVisibleOffers()
  const consents = usePartnerConsents()
  const requested = (offerId: string) =>
    consents.some((c) => c.offerId === offerId && !c.withdrawnAt)
  return (
    <>
      <PageHeader title={t('offers.title')} description={t('offers.description')} />
      {offers.length === 0 ? (
        <EmptyState icon={Gift} title={t('offers.emptyTitle')} body={t('offers.emptyBody')} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {offers.map((o, i) => (
            <OfferCard key={o.id} offer={o} index={i} requested={requested(o.id)} />
          ))}
        </div>
      )}
    </>
  )
}
