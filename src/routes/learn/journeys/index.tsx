import { createFileRoute } from '@tanstack/react-router'
import { JourneysPage } from '@/features/learn-tools/pages/JourneysPage'

export const Route = createFileRoute('/learn/journeys/')({ component: JourneysPage })
