import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '@/components/layout/AppShell'
import { DalilButton } from '@/features/learn-tools/components/DalilButton'
import { requireRole } from '@/lib/guard'

export const Route = createFileRoute('/learn')({
  beforeLoad: requireRole('learner'),
  component: () => <AppShell area="learner" floating={<DalilButton />} />,
})
