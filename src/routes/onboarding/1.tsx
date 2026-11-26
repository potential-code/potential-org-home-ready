import { createFileRoute } from '@tanstack/react-router'
import { OnboardingStep1Page } from '@/features/public/pages/OnboardingStep1Page'

export const Route = createFileRoute('/onboarding/1')({ component: OnboardingStep1Page })
