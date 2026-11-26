import config from '@config'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, MailCheck, Send } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { MotionPage } from '@/components/motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePageTitle } from '@/hooks/use-page-title'
import { describedBy, Field } from '../components/auth/Field'
import { AUTH_IMAGE } from '../components/auth/options'
import { checkEmail } from '../components/auth/validate'

/** Forgot password: email with inline validation, then a success toast and an inline confirmation (no email is sent). */
export function ForgotPasswordPage() {
  const { t } = useTranslation('auth')
  usePageTitle(t('pages.forgot'))
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState('')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const bad = checkEmail(email)
    if (bad) return setError(t(`errors.${bad}`))
    setError('')
    setSent(email.trim())
    toast.success(t('forgot.toast', { email: email.trim() }))
  }
  return (
    <AuthLayout
      image={AUTH_IMAGE}
      eyebrow={t('panel.eyebrow')}
      title={t('panel.resetTitle')}
      points={[t('panel.point1'), t('panel.point2'), t('panel.point3')]}
    >
      <MotionPage>
        <Link
          to={config.signInRoute}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
        >
          <ArrowLeft className="size-4 rtl-mirror" aria-hidden />
          {t('forgot.back')}
        </Link>
        <h1 className="mt-2 text-3xl">{t('forgot.title')}</h1>
        <p className="mt-1.5 text-ink-soft">{t('forgot.subtitle')}</p>
        <div className="card mt-6 p-6">
          {sent ? (
            <div role="status" className="space-y-3">
              <h2 className="flex items-center gap-2 text-xl">
                <MailCheck className="size-6 text-success" aria-hidden />
                {t('forgot.sentTitle')}
              </h2>
              <p className="text-ink">{t('forgot.sentBody', { email: sent })}</p>
              <p className="text-sm text-ink-soft">{t('forgot.demoNote')}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button asChild className="h-10 rounded-full px-5">
                  <Link to={config.signInRoute}>{t('forgot.back')}</Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-10 rounded-full px-5"
                  onClick={() => {
                    setSent('')
                    setEmail('')
                  }}
                >
                  {t('forgot.again')}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-4">
              <Field id="fp-email" label={t('fields.email')} error={error}>
                <Input
                  id="fp-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  {...describedBy('fp-email', error)}
                />
              </Field>
              <Button
                type="submit"
                className="h-11 w-full rounded-full bg-brand-highlight font-bold text-ink shadow-md hover:bg-brand-highlight/90"
              >
                <Send className="size-4 rtl-mirror" aria-hidden />
                {t('forgot.submit')}
              </Button>
            </form>
          )}
        </div>
      </MotionPage>
    </AuthLayout>
  )
}
