import { createFileRoute } from '@tanstack/react-router'
import { AssistantPage } from '@/features/learn-tools/pages/AssistantPage'

export const Route = createFileRoute('/learn/assistant')({ component: AssistantPage })
