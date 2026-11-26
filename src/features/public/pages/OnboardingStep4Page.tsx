import { useNavigate } from '@tanstack/react-router'
import { MessageCircleQuestion } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DALIL_ANSWERS, DALIL_GREETING } from '@/data/dalil'
import { useLocalized } from '@/i18n'
import { finishOnboarding } from '@/store/actions/auth'
import { BackButton } from '../components/onboarding/BackButton'
import { DalilMark } from '../components/onboarding/DalilMark'
import { type FirstAction, FirstActionCard } from '../components/onboarding/FirstActionCard'
import { OnboardingShell } from '../components/onboarding/OnboardingShell'
import { useOnboardingLearner } from '../components/onboarding/use-onboarding-learner'

/**
 * Onboarding step 4 "Meet Dalil" (C6.1, C10): Dalil's greeting with the learner's first name, the
 * pre-quiz starting point, and the suggested first useful action. Both buttons finish onboarding.
 */
export function OnboardingStep4Page() {
  const { t } = useTranslation('auth')
  const { l } = useLocalized()
  const navigate = useNavigate()
  const { id, me, onboarding } = useOnboardingLearner()
  const first = l(me?.name).split(' ')[0] ?? ''
  const greeting = l(DALIL_GREETING).replace('{{name}}', first)
  const action: FirstAction = onboarding?.track === 'B' ? 'calculator' : 'journey'
  const score = onboarding?.preQuizScore

  const finish = (to: 'start' | 'home') => {
    finishOnboarding(id)
    toast.success(t('onboarding.s4.done'))
    if (to === 'home') return void navigate({ to: '/learn/home' })
    if (action === 'journey') return void navigate({ to: '/learn/journeys/renew-or-move' })
    void navigate({ to: '/learn/calculator', search: { tab: 'rent-vs-buy' } })
  }

  return (
    <OnboardingShell
      step={4}
      body={t('onboarding.s4.body')}
      actions={
        <>
          <BackButton to="/onboarding/3" />
          <Button
            variant="outline"
            className="h-10 rounded-full px-5"
            onClick={() => finish('home')}
          >
            {t('onboarding.s4.home')}
          </Button>
        </>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section aria-labelledby="dalil-title" className="card flex flex-col gap-4 p-5 sm:p-6">
          <h2 id="dalil-title" className="flex items-center gap-3 text-lg">
            <DalilMark className="size-11" />
            {t('onboarding.s4.dalil')}
          </h2>
          <blockquote className="relative rounded-2xl rounded-ss-sm bg-tint-50 p-4 leading-relaxed text-ink shadow-sm ring-1 ring-tint-200">
            {greeting}
          </blockquote>
          <div>
            <h3 className="text-sm font-bold text-ink">{t('onboarding.s4.tryAsking')}</h3>
            <ul className="mt-2 space-y-2">
              {DALIL_ANSWERS.slice(0, 3).map((a) => (
                <li key={a.id} className="flex items-start gap-2 text-sm text-ink">
                  <MessageCircleQuestion
                    className="mt-0.5 size-4 shrink-0 text-brand"
                    aria-hidden
                  />
                  <span>{l(a.prompt)}</span>
                </li>
              ))}
            </ul>
          </div>
          {score !== undefined && (
            <p className="text-sm font-semibold text-brand">
              {t('onboarding.s4.score', { score })}
            </p>
          )}
          <p className="mt-auto text-xs text-ink-soft">{t('onboarding.s4.disclaimer')}</p>
        </section>
        <FirstActionCard action={action} onStart={() => finish('start')} />
      </div>
    </OnboardingShell>
  )
}
