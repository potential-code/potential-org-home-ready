import { createFileRoute } from '@tanstack/react-router'
import { FaqPage } from '@/features/public/pages/FaqPage'

export const Route = createFileRoute('/_public/faq')({ component: FaqPage })
