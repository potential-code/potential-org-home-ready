import { createFileRoute } from '@tanstack/react-router'
import { OnboardingStep3Page } from '@/features/public/pages/OnboardingStep3Page'

export const Route = createFileRoute('/onboarding/3')({ component: OnboardingStep3Page })
