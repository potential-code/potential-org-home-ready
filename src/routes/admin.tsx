import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '@/components/layout/AppShell'
import { requireRole } from '@/lib/guard'

export const Route = createFileRoute('/admin')({
  beforeLoad: requireRole('owner'),
  component: () => <AppShell area="owner" />,
})
