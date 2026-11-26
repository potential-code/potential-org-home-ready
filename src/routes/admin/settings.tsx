import { createFileRoute } from '@tanstack/react-router'
import { SettingsPage } from '@/features/owner/pages/SettingsPage'

export const Route = createFileRoute('/admin/settings')({ component: SettingsPage })
