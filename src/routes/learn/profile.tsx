import { createFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '@/features/learn-core/pages/ProfilePage'

export const Route = createFileRoute('/learn/profile')({ component: ProfilePage })
