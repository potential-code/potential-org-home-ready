import { createFileRoute } from '@tanstack/react-router'
import { QueuePage } from '@/features/review/pages/QueuePage'

export const Route = createFileRoute('/review/queue')({ component: QueuePage })
