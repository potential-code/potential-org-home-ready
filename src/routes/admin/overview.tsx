import { createFileRoute } from '@tanstack/react-router'
import { OverviewPage } from '@/features/owner/pages/OverviewPage'

export const Route = createFileRoute('/admin/overview')({ component: OverviewPage })
