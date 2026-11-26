import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/shared/PageHeader'
import { JOURNEYS } from '@/data/journeys'
import { JourneyCard } from '../components/journeys/JourneyCard'

/** Decision journeys list (brief C11.1): two journeys with status and score. */
export function JourneysPage() {
  const { t } = useTranslation('journeys')
  return (
    <>
      <PageHeader title={t('list.title')} description={t('list.description')} />
      <div className="grid gap-6 md:grid-cols-2">
        {JOURNEYS.map((j) => (
          <JourneyCard key={j.id} journey={j} />
        ))}
      </div>
    </>
  )
}
