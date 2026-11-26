import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '@/components/layout/AppShell'
import { requireRole } from '@/lib/guard'

export const Route = createFileRoute('/review')({
  beforeLoad: requireRole('reviewer'),
  component: () => <AppShell area="reviewer" />,
})
