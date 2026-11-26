import { createFileRoute } from '@tanstack/react-router'
import { RemindersPage } from '@/features/learn-tools/pages/RemindersPage'

export const Route = createFileRoute('/learn/reminders')({ component: RemindersPage })
