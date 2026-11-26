import { createFileRoute } from '@tanstack/react-router'
import { EditorialPolicyPage } from '@/features/public/pages/EditorialPolicyPage'

export const Route = createFileRoute('/_public/editorial-policy')({
  component: EditorialPolicyPage,
})
