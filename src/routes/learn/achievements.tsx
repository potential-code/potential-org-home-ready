import { createFileRoute } from '@tanstack/react-router'
import { AchievementsPage } from '@/features/learn-core/pages/AchievementsPage'

export const Route = createFileRoute('/learn/achievements')({ component: AchievementsPage })
