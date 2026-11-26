import { createFileRoute } from '@tanstack/react-router'
import { LearnersPage } from '@/features/owner/pages/LearnersPage'

export const Route = createFileRoute('/admin/learners')({ component: LearnersPage })
