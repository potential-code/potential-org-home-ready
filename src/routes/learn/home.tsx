import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '@/features/learn-core/pages/HomePage'

export const Route = createFileRoute('/learn/home')({ component: HomePage })
