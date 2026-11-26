import { createFileRoute } from '@tanstack/react-router'
import { SponsorsPage } from '@/features/owner/pages/SponsorsPage'

export const Route = createFileRoute('/admin/sponsors')({ component: SponsorsPage })
