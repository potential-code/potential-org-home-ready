import { createFileRoute } from '@tanstack/react-router'
import { PerformancePage } from '@/features/sponsor/pages/PerformancePage'

export const Route = createFileRoute('/sponsor/performance')({ component: PerformancePage })
