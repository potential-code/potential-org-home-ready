import { createFileRoute } from '@tanstack/react-router'
import { FunnelPage } from '@/features/leadership/pages/FunnelPage'

export const Route = createFileRoute('/leadership/funnel')({ component: FunnelPage })
