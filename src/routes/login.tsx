import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '@/features/public/pages/LoginPage'

export const Route = createFileRoute('/login')({ component: LoginPage })
