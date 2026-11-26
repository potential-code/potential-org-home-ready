import { createFileRoute } from '@tanstack/react-router'
import { ShortlistPage } from '@/features/learn-tools/pages/ShortlistPage'

export const Route = createFileRoute('/learn/shortlist')({ component: ShortlistPage })
