import { createFileRoute } from '@tanstack/react-router'
import { ReviewItemPage } from '@/features/review/pages/ReviewItemPage'

export const Route = createFileRoute('/review/item/$itemId')({ component: ReviewItemPage })
