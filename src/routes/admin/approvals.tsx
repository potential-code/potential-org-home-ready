import { createFileRoute } from '@tanstack/react-router'
import { ApprovalsPage } from '@/features/owner/pages/ApprovalsPage'

export const Route = createFileRoute('/admin/approvals')({ component: ApprovalsPage })
