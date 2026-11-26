import { createFileRoute } from '@tanstack/react-router'
import { CommunicationsPage } from '@/features/owner/pages/CommunicationsPage'

export const Route = createFileRoute('/admin/communications')({ component: CommunicationsPage })
