import { Link, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Stagger, StaggerItem } from '@/components/motion'
import { PERSONAS } from '@/data/personas'
import { usePageTitle } from '@/hooks/use-page-title'
import { personaFrom, signInAs } from '@/store/actions/session'
import { getDb } from '@/store/db'
import { AUTH_IMAGE } from '../components/auth/options'
import { onboardingRoute } from '../components/onboarding/steps'
import { PersonaCard } from '../components/PersonaCard'
import { SignInForm } from '../components/SignInForm'

/** Split sign-in: brand panel on one side; form, then one demo persona card per role. */
export function LoginPage() {
  const { t } = useTranslation()
  const { t: ta } = useTranslation('auth')
  usePageTitle(t('signIn'))
  const navigate = useNavigate()
  const go = (id: string) => {
    const db = getDb()
    const p = personaFrom(db, id)
    if (!p) return
    signInAs(id)
    // A learner who registered live and has not finished onboarding resumes it.
    const ob = db.onboarding[id]
    if (p.role === 'learner' && ob && !ob.done) {
      void navigate({ to: onboardingRoute(ob.step) })
      return
    }
    void navigate({ to: p.home })
  }

  return (
    <AuthLayout
      image={AUTH_IMAGE}
      eyebrow={t('signInPage.panelEyebrow')}
      title={t('signInPage.panelTitle')}
      points={[t('signInPage.point1'), t('signInPage.point2'), t('signInPage.point3')]}
    >
      <h1 className="text-3xl">{t('signInPage.title')}</h1>
      <p className="mt-1.5 text-ink-soft">{t('signInPage.subtitle')}</p>
      <div className="card mt-6 p-6">
        <SignInForm onPersona={go} />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm">
          <Link
            to="/forgot-password"
            className="inline-flex min-h-11 items-center font-semibold text-brand underline-offset-2 hover:underline"
          >
            {ta('login.forgot')}
          </Link>
          <p className="text-ink-soft">
            {ta('login.noAccount')}{' '}
            <Link
              to="/register"
              className="inline-flex min-h-11 items-center font-semibold text-brand underline-offset-2 hover:underline"
            >
              {ta('login.join')}
            </Link>
          </p>
        </div>
      </div>

      <section aria-labelledby="demo-profiles" className="mt-10">
        <div className="mb-2 flex items-center gap-3">
          <h2 id="demo-profiles" className="text-base">
            {t('signInPage.demoTitle')}
          </h2>
          <span className="h-px flex-1 bg-border" aria-hidden />
        </div>
        <p className="mb-4 text-sm text-ink-soft">{t('signInPage.demoBody')}</p>
        <Stagger className="grid grid-cols-[minmax(0,1fr)] gap-2">
          {PERSONAS.map((p) => (
            <StaggerItem key={p.id}>
              <PersonaCard persona={p} onSelect={() => go(p.id)} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </AuthLayout>
  )
}
