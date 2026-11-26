import { createFileRoute, Outlet } from '@tanstack/react-router'
import { requireRole } from '@/lib/guard'

/** Learner onboarding (C6.1 steps 1-4): signed-in learners only; pages bring their own layout. */
export const Route = createFileRoute('/onboarding')({
  beforeLoad: requireRole('learner'),
  component: Outlet,
})
