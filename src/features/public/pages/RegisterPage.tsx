import config from '@config'
import { Link, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { MotionPage } from '@/components/motion'
import { usePageTitle } from '@/hooks/use-page-title'
import { AUTH_IMAGE, PATH_TO_SITUATION } from '../components/auth/options'
import { RegisterForm } from '../components/auth/RegisterForm'

/** Public learner sign-up (C6.1) on the split auth layout with the auth-panel photo. */
export function RegisterPage() {
  const { t } = useTranslation('auth')
  usePageTitle(t('pages.register'))
  const { path } = useSearch({ from: '/register' })
  const preset = path ? PATH_TO_SITUATION[path] : undefined
  return (
    <AuthLayout
      image={AUTH_IMAGE}
      eyebrow={t('panel.eyebrow')}
      title={t('panel.registerTitle')}
      points={[t('panel.point1'), t('panel.point2'), t('panel.point3')]}
    >
      <MotionPage>
        <h1 className="text-3xl">{t('register.title')}</h1>
        <p className="mt-1.5 text-ink-soft">{t('register.subtitle')}</p>
        <p className="mt-2 text-sm text-ink-soft">
          {t('register.haveAccount')}{' '}
          <Link
            to={config.signInRoute}
            className="font-semibold text-brand underline-offset-2 hover:underline"
          >
            {t('register.signIn')}
          </Link>
        </p>
        <div className="card mt-6 p-5 sm:p-7">
          <RegisterForm preset={preset} />
        </div>
      </MotionPage>
    </AuthLayout>
  )
}
