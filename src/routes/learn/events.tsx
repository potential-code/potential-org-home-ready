import { createFileRoute } from '@tanstack/react-router'
import { EventsPage } from '@/features/learn-tools/pages/EventsPage'

export const Route = createFileRoute('/learn/events')({ component: EventsPage })
