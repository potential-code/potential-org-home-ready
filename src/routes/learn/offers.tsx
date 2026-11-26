import { createFileRoute } from '@tanstack/react-router'
import { OffersPage } from '@/features/learn-tools/pages/OffersPage'

export const Route = createFileRoute('/learn/offers')({ component: OffersPage })
