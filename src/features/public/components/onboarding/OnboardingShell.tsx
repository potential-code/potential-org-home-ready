import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Motif } from '@/components/brand'
import { DemoControls } from '@/components/layout/DemoControls'
import { MotionPage } from '@/components/motion'
import { LangToggle } from '@/components/shared/LangToggle'
import { Logo } from '@/components/shared/Logo'
import { usePageTitle } from '@/hooks/use-page-title'
import { useLocalized } from '@/i18n'
import { usePersona } from '@/store/actions/session'
import { StepProgress } from './StepProgress'
import type { OnboardingStep } from './steps'

/**
 * Onboarding frame (C6.1): language and presenter controls, a brand banner with the logo, step
 * count, title and the four-step indicator, then the step content and its actions.
 */
export function OnboardingShell({
  step,
  body,
  children,
  actions,
}: {
  step: OnboardingStep
  body: string
  children: ReactNode
  actions: ReactNode
}) {
  const { t } = useTranslation('auth')
  const me = usePersona()
  const { l } = useLocalized()
  const title = t(`pages.onboarding${step}`)
  usePageTitle(title)
  const first = l(me?.name).split(' ')[0] ?? ''
  return (
    <div className="min-h-dvh bg-background">
      <header className="container-page flex h-16 items-center justify-end gap-2">
        <LangToggle />
        <DemoControls />
      </header>
      <main id="main" tabIndex={-1} className="container-page pb-16 outline-none">
        <div className="mx-auto max-w-4xl">
          <section className="on-dark relative overflow-hidden rounded-3xl bg-grad-brand px-5 py-6 text-white shadow-lg sm:px-8 sm:py-8">
            <Motif variant="banner" className="text-white/[0.12]" />
            <div className="relative">
              <Link to="/" aria-label={t('common:home')} className="inline-block w-fit">
                <Logo variant="white" className="h-7" />
              </Link>
              <p className="mt-6 text-xs font-bold tracking-widest text-white/80 uppercase">
                {t('onboarding.stepOf', { step })}
                {first && <> · {t('onboarding.welcome', { name: first })}</>}
              </p>
              <h1 className="mt-1.5 text-3xl text-white sm:text-4xl">{title}</h1>
              <p className="mt-2 max-w-2xl text-white/90">{body}</p>
              <div className="mt-6">
                <StepProgress step={step} />
              </div>
            </div>
          </section>
          <MotionPage className="mt-6">{children}</MotionPage>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">{actions}</div>
        </div>
      </main>
    </div>
  )
}
