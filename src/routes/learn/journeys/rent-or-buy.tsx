import { createFileRoute } from '@tanstack/react-router'
import { JourneyPlayerPage } from '@/features/learn-tools/pages/JourneyPlayerPage'

export const Route = createFileRoute('/learn/journeys/rent-or-buy')({
  component: () => <JourneyPlayerPage journeyId="rent-or-buy" />,
})
