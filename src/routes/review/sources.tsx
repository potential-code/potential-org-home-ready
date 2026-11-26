import { createFileRoute } from '@tanstack/react-router'
import { SourcesPage } from '@/features/review/pages/SourcesPage'

export const Route = createFileRoute('/review/sources')({ component: SourcesPage })
