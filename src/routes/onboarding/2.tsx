import { createFileRoute } from '@tanstack/react-router'
import { OnboardingStep2Page } from '@/features/public/pages/OnboardingStep2Page'

export const Route = createFileRoute('/onboarding/2')({ component: OnboardingStep2Page })
