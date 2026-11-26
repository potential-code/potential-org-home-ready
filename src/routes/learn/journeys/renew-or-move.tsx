import { createFileRoute } from '@tanstack/react-router'
import { JourneyPlayerPage } from '@/features/learn-tools/pages/JourneyPlayerPage'

export const Route = createFileRoute('/learn/journeys/renew-or-move')({
  component: () => <JourneyPlayerPage journeyId="renew-or-move" />,
})
