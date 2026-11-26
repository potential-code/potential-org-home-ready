import { createFileRoute } from '@tanstack/react-router'
import { RegisterPage } from '@/features/public/pages/RegisterPage'

export const Route = createFileRoute('/register')({
  validateSearch: (s: Record<string, unknown>): { path?: string } =>
    typeof s.path === 'string' ? { path: s.path } : {},
  component: RegisterPage,
})
