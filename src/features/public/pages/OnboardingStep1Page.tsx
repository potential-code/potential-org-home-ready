import type { BudgetBand, Household } from '@shared/types'
import { useNavigate } from '@tanstack/react-router'
import { Briefcase, Users, Wallet } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { saveOnboarding } from '@/store/actions/auth'
import { Field } from '../components/auth/Field'
import { OptionSelect } from '../components/auth/OptionSelect'
import { BUDGETS, HOUSEHOLDS, WORK_AREAS } from '../components/auth/options'
import { ChoiceGroup } from '../components/onboarding/ChoiceGroup'
import { NextButton } from '../components/onboarding/NextButton'
import { OnboardingShell } from '../components/onboarding/OnboardingShell'
import { useOnboardingLearner } from '../components/onboarding/use-onboarding-learner'

type AreaKey = (typeof WORK_AREAS)[number]['key']
const AREA_KEYS = WORK_AREAS.map((a) => a.key)

/** Onboarding step 1 "Your situation" (C6.1): household, monthly budget band and work area. */
export function OnboardingStep1Page() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { id, onboarding } = useOnboardingLearner()
  const [household, setHousehold] = useState<Household | undefined>(onboarding?.household)
  const [budget, setBudget] = useState<BudgetBand | undefined>(onboarding?.budget)
  const [area, setArea] = useState<AreaKey | ''>(
    WORK_AREAS.find((a) => a.value === onboarding?.workArea)?.key ?? '',
  )
  const [submitted, setSubmitted] = useState(false)
  const e = (ok: boolean, key: string) => (submitted && !ok ? t(`errors.${key}`) : undefined)

  const next = () => {
    setSubmitted(true)
    if (!household || !budget || !area) return
    const workArea = WORK_AREAS.find((a) => a.key === area)?.value
    saveOnboarding(id, { household, budget, workArea }, 2)
    toast.success(t('onboarding.s1.saved'))
    void navigate({ to: '/onboarding/2' })
  }

  return (
    <OnboardingShell
      step={1}
      body={t('onboarding.s1.body')}
      actions={
        <>
          <span />
          <NextButton onClick={next} />
        </>
      }
    >
      <div className="card space-y-8 p-5 sm:p-7">
        <ChoiceGroup
          id="ob-household"
          icon={<Users className="size-5 text-brand" aria-hidden />}
          label={t('onboarding.s1.household')}
          group="household"
          options={HOUSEHOLDS}
          value={household}
          onChange={setHousehold}
          error={e(!!household, 'household')}
          className="sm:grid-cols-3"
        />
        <ChoiceGroup
          id="ob-budget"
          icon={<Wallet className="size-5 text-brand" aria-hidden />}
          label={t('onboarding.s1.budget')}
          group="budget"
          options={BUDGETS}
          value={budget}
          onChange={setBudget}
          error={e(!!budget, 'budget')}
          className="sm:grid-cols-2 lg:grid-cols-3"
        />
        <Field
          id="ob-area"
          label={
            <span className="flex items-center gap-2 text-lg font-bold">
              <Briefcase className="size-5 text-brand" aria-hidden />
              {t('onboarding.s1.workArea')}
            </span>
          }
          error={e(!!area, 'workArea')}
          className="max-w-md"
        >
          <OptionSelect
            id="ob-area"
            group="area"
            options={AREA_KEYS}
            value={area}
            onChange={setArea}
            error={e(!!area, 'workArea')}
          />
        </Field>
      </div>
    </OnboardingShell>
  )
}
