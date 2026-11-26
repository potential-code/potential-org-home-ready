import { createFileRoute } from '@tanstack/react-router'
import { InvitePage } from '@/features/public/pages/InvitePage'

export const Route = createFileRoute('/invite')({
  validateSearch: (s: Record<string, unknown>): { role?: string } =>
    typeof s.role === 'string' ? { role: s.role } : {},
  component: InvitePage,
})
