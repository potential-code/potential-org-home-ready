import { createFileRoute } from '@tanstack/react-router'
import { GuidelinesPage } from '@/features/sponsor/pages/GuidelinesPage'

export const Route = createFileRoute('/sponsor/guidelines')({ component: GuidelinesPage })
