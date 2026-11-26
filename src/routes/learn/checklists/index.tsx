import { createFileRoute } from '@tanstack/react-router'
import { ChecklistsPage } from '@/features/learn-tools/pages/ChecklistsPage'

export const Route = createFileRoute('/learn/checklists/')({ component: ChecklistsPage })
