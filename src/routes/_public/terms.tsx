import { createFileRoute } from '@tanstack/react-router'
import { TermsPage } from '@/features/public/pages/TermsPage'

export const Route = createFileRoute('/_public/terms')({ component: TermsPage })
