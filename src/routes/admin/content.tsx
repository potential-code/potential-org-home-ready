import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/features/owner/pages/ContentPage'

export const Route = createFileRoute('/admin/content')({ component: ContentPage })
