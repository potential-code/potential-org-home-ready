import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { OnboardingStep } from './steps'

const STEPS: OnboardingStep[] = [1, 2, 3, 4]

/** Four-step indicator on the dark onboarding banner: done steps show a check, the current step is highlighted. */
export function StepProgress({ step }: { step: OnboardingStep }) {
  const { t } = useTranslation('auth')
  return (
    <ol aria-label={t('onboarding.steps')} className="grid grid-cols-4 gap-2 sm:gap-3">
      {STEPS.map((s) => {
        const done = s < step
        const current = s === step
        return (
          <li key={s} aria-current={current ? 'step' : undefined} className="min-w-0">
            <span
              className={cn(
                'block h-1.5 rounded-full',
                done || current ? 'bg-brand-highlight' : 'bg-white/25',
              )}
              aria-hidden
            />
            <span
              className={cn(
                'mt-2 flex items-center gap-1 text-xs font-semibold',
                current ? 'text-white' : 'text-white/80',
              )}
            >
              {done && <Check className="size-3.5 shrink-0 text-brand-highlight" aria-hidden />}
              <span className="tabular-nums">{s}.</span>
              <span className="hidden truncate sm:inline">{t(`pages.onboarding${s}`)}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}
