import { createFileRoute } from '@tanstack/react-router'
import { CataloguePage } from '@/features/learn-core/pages/CataloguePage'

export const Route = createFileRoute('/learn/tracks/')({ component: CataloguePage })
