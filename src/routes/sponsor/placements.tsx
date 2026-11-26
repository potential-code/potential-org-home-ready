import { createFileRoute } from '@tanstack/react-router'
import { PlacementsPage } from '@/features/sponsor/pages/PlacementsPage'

export const Route = createFileRoute('/sponsor/placements')({ component: PlacementsPage })
