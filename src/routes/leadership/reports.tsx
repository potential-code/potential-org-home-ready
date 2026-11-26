import { createFileRoute } from '@tanstack/react-router'
import { LeadershipReportsPage } from '@/features/leadership/pages/LeadershipReportsPage'

export const Route = createFileRoute('/leadership/reports')({ component: LeadershipReportsPage })
