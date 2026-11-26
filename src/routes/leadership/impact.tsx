import { createFileRoute } from '@tanstack/react-router'
import { ImpactPage } from '@/features/leadership/pages/ImpactPage'

export const Route = createFileRoute('/leadership/impact')({ component: ImpactPage })
