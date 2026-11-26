import { createFileRoute } from '@tanstack/react-router'
import { PrivacyPage } from '@/features/public/pages/PrivacyPage'

export const Route = createFileRoute('/_public/privacy')({ component: PrivacyPage })
