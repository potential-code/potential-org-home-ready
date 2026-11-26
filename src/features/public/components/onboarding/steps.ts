/** Onboarding routes in order (C6.1 steps 1 to 4). */
export const ONBOARDING_ROUTES = [
  '/onboarding/1',
  '/onboarding/2',
  '/onboarding/3',
  '/onboarding/4',
] as const
export type OnboardingStep = 1 | 2 | 3 | 4

export const onboardingRoute = (step: number) =>
  ONBOARDING_ROUTES[Math.min(Math.max(step, 1), 4) - 1] ?? ONBOARDING_ROUTES[0]
