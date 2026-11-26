import type { Role } from '@shared/types'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { KeyRound, Mail, UserRound } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { MotionPage } from '@/components/motion'
import { Button } from '@/components/ui/button'
import { PERSONAS } from '@/data/personas'
import { usePageTitle } from '@/hooks/use-page-title'
import { useLocalized } from '@/i18n'
import { signInAs } from '@/store/actions/session'
import { CheckRow } from '../components/auth/CheckRow'
import { DocLink } from '../components/auth/DocLink'
import { describedBy, Field } from '../components/auth/Field'
import { type LegalDoc, LegalSheet } from '../components/auth/LegalSheet'
import { AUTH_IMAGE } from '../components/auth/options'
import { PasswordInput } from '../components/auth/PasswordInput'
import { checkPassword } from '../components/auth/validate'

const STAFF: Role[] = ['owner', 'reviewer', 'leadership', 'sponsor']

/**
 * Invited staff and partner set-up (C6.2): the account the programme owner created, a new
 * password with confirmation, Terms (and Sponsor guidelines for `?role=sponsor`). Signs in and
 * lands on the role's dashboard. No email is sent in the demo.
 */
export function InvitePage() {
  const { t } = useTranslation('auth')
  usePageTitle(t('pages.invite'))
  const navigate = useNavigate()
  const { l } = useLocalized()
  const { role: raw } = useSearch({ from: '/invite' })
  const role: Role = STAFF.includes(raw as Role) ? (raw as Role) : 'reviewer'
  const persona = PERSONAS.find((p) => p.role === role)
  const sponsor = role === 'sponsor'
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [terms, setTerms] = useState(false)
  const [guidelines, setGuidelines] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [doc, setDoc] = useState<LegalDoc | null>(null)

  const errs = {
    pw: checkPassword(pw),
    confirm: confirm === pw && confirm ? '' : 'confirm',
    terms: terms ? '' : 'terms',
    guidelines: !sponsor || guidelines ? '' : 'guidelines',
  }
  const err = (k: keyof typeof errs) => (submitted && errs[k] ? t(`errors.${errs[k]}`) : undefined)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.values(errs).some(Boolean) || !persona) return
    toast.success(t('invite.toast'))
    signInAs(persona.id)
    void navigate({ to: persona.home })
  }

  return (
    <AuthLayout
      image={AUTH_IMAGE}
      eyebrow={t('panel.eyebrow')}
      title={t('panel.inviteTitle')}
      points={[t('panel.invitePoint1'), t('panel.invitePoint2'), t('panel.invitePoint3')]}
    >
      <MotionPage>
        <h1 className="text-3xl">{t('invite.title')}</h1>
        <p className="mt-1.5 text-ink-soft">
          {t('invite.subtitle', { inviter: t('invite.inviter'), role: t(`invite.role.${role}`) })}
        </p>
        {persona && (
          <section aria-label={t('invite.account')} className="card mt-6 space-y-2 p-5">
            <p className="text-xs font-bold tracking-widest text-brand uppercase">
              {t('invite.account')}
            </p>
            <p className="flex items-center gap-2 font-semibold text-ink">
              <UserRound className="size-4 text-brand" aria-hidden />
              {l(persona.name)}
            </p>
            <p className="flex items-center gap-2 text-sm break-all text-ink-soft">
              <Mail className="size-4 shrink-0 text-brand" aria-hidden />
              {persona.email}
            </p>
          </section>
        )}
        <form onSubmit={submit} noValidate className="card mt-4 space-y-4 p-6">
          <Field
            id="inv-pw"
            label={t('fields.password')}
            hint={t('fields.passwordHint')}
            error={err('pw')}
          >
            <PasswordInput
              id="inv-pw"
              autoComplete="new-password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              {...describedBy('inv-pw', err('pw'), 'hint')}
            />
          </Field>
          <Field id="inv-confirm" label={t('fields.confirmPassword')} error={err('confirm')}>
            <PasswordInput
              id="inv-confirm"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              {...describedBy('inv-confirm', err('confirm'))}
            />
          </Field>
          <CheckRow
            id="inv-terms"
            checked={terms}
            onChange={setTerms}
            error={err('terms')}
            label={
              <Trans
                t={t}
                i18nKey="fields.terms"
                components={{
                  terms: <DocLink onOpen={() => setDoc('terms')} />,
                  privacy: <DocLink onOpen={() => setDoc('privacy')} />,
                }}
              />
            }
          />
          {sponsor && (
            <CheckRow
              id="inv-guidelines"
              checked={guidelines}
              onChange={setGuidelines}
              error={err('guidelines')}
              label={
                <Trans
                  t={t}
                  i18nKey="fields.sponsorGuidelines"
                  components={{ guidelines: <DocLink onOpen={() => setDoc('guidelines')} /> }}
                />
              }
            />
          )}
          <Button
            type="submit"
            className="h-11 w-full rounded-full bg-brand-highlight font-bold text-ink shadow-md hover:bg-brand-highlight/90"
          >
            <KeyRound className="size-4" aria-hidden />
            {t('invite.submit')}
          </Button>
        </form>
        <LegalSheet doc={doc} onClose={() => setDoc(null)} />
      </MotionPage>
    </AuthLayout>
  )
}
