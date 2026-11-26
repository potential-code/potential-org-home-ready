import type { Emirate, Lang, SignupSource, Situation } from '@shared/types'
import { useNavigate } from '@tanstack/react-router'
import { ArrowRight, Loader2 } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLocalized } from '@/i18n'
import { registerLearner } from '@/store/actions/auth'
import { getDb } from '@/store/db'
import { CheckRow } from './CheckRow'
import { DocLink } from './DocLink'
import { describedBy, Field } from './Field'
import { LanguageChoice } from './LanguageChoice'
import { type LegalDoc, LegalSheet } from './LegalSheet'
import { OptionSelect } from './OptionSelect'
import { EMIRATES, SITUATIONS, SOURCES } from './options'
import { PasswordInput } from './PasswordInput'
import { checkEmail, checkMobile, checkName, checkPassword } from './validate'

interface Values {
  name: string
  email: string
  password: string
  mobile: string
  emirate: Emirate | ''
  situation: Situation | ''
  language: Lang
  source: SignupSource | ''
  terms: boolean
  marketing: boolean
  age: boolean
}
type Key = keyof Values

function validate(v: Values): Partial<Record<Key, string>> {
  const taken = getDb().registered.some(
    (r) => r.email.toLowerCase() === v.email.trim().toLowerCase(),
  )
  const e: Partial<Record<Key, string>> = {
    name: checkName(v.name),
    email: checkEmail(v.email) || (taken ? 'emailTaken' : ''),
    password: checkPassword(v.password),
    mobile: checkMobile(v.mobile),
    emirate: v.emirate ? '' : 'emirate',
    situation: v.situation ? '' : 'situation',
    terms: v.terms ? '' : 'terms',
    age: v.age ? '' : 'age',
  }
  return Object.fromEntries(Object.entries(e).filter(([, m]) => m)) as Partial<Record<Key, string>>
}

/**
 * Learner sign-up (C6.1): every field from the brief with inline validation on blur and on submit.
 * Terms, marketing and 18+ start unticked; Terms and Privacy open in a side panel. "What brings
 * you here?" is preselected from the landing card (`?path=`). Creates the account, signs in and
 * goes to onboarding step 1.
 */
export function RegisterForm({ preset }: { preset?: Situation }) {
  const { t } = useTranslation('auth')
  const { lang } = useLocalized()
  const navigate = useNavigate()
  const [v, setV] = useState<Values>({
    name: '',
    email: '',
    password: '',
    mobile: '',
    emirate: '',
    situation: preset ?? '',
    language: lang,
    source: '',
    terms: false,
    marketing: false,
    age: false,
  })
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [doc, setDoc] = useState<LegalDoc | null>(null)
  const errors = validate(v)
  const err = (k: Key) =>
    (submitted || touched[k]) && errors[k] ? t(`errors.${errors[k]}`) : undefined
  const set = <K extends Key>(k: K, val: Values[K]) => setV((s) => ({ ...s, [k]: val }))
  const blur = (k: Key) => () => setTouched((s) => ({ ...s, [k]: true }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length) {
      toast.error(t('register.fixErrors'))
      const first = Object.keys(errors)[0]
      document.getElementById(`reg-${first}`)?.focus()
      return
    }
    setBusy(true)
    const name = v.name.trim()
    registerLearner({
      name,
      email: v.email.trim(),
      password: v.password,
      mobile: v.mobile.trim() || undefined,
      emirate: v.emirate as Emirate,
      situation: v.situation as Situation,
      language: v.language,
      source: v.source || undefined,
      marketing: v.marketing,
    })
    toast.success(t('register.success', { name: name.split(' ')[0] }), {
      description: t('register.verify'),
    })
    void navigate({ to: '/onboarding/1' })
  }

  const section = 'text-xs font-bold tracking-widest text-brand uppercase'
  return (
    <form onSubmit={submit} noValidate className="space-y-8">
      <fieldset className="space-y-4">
        <legend className={section}>{t('register.account')}</legend>
        <Field id="reg-name" label={t('fields.name')} error={err('name')}>
          <Input
            id="reg-name"
            autoComplete="name"
            maxLength={60}
            value={v.name}
            onChange={(e) => set('name', e.target.value)}
            onBlur={blur('name')}
            {...describedBy('reg-name', err('name'))}
          />
        </Field>
        <Field id="reg-email" label={t('fields.email')} error={err('email')}>
          <Input
            id="reg-email"
            type="email"
            autoComplete="email"
            value={v.email}
            onChange={(e) => set('email', e.target.value)}
            onBlur={blur('email')}
            {...describedBy('reg-email', err('email'))}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="reg-password"
            label={t('fields.password')}
            hint={t('fields.passwordHint')}
            error={err('password')}
          >
            <PasswordInput
              id="reg-password"
              autoComplete="new-password"
              value={v.password}
              onChange={(e) => set('password', e.target.value)}
              onBlur={blur('password')}
              {...describedBy('reg-password', err('password'), 'hint')}
            />
          </Field>
          <Field
            id="reg-mobile"
            label={t('fields.mobile')}
            hint={t('fields.mobileHint')}
            error={err('mobile')}
            optional
          >
            <Input
              id="reg-mobile"
              type="tel"
              inputMode="tel"
              dir="ltr"
              autoComplete="tel"
              placeholder="+971 50 123 4567"
              value={v.mobile}
              onChange={(e) => set('mobile', e.target.value)}
              onBlur={blur('mobile')}
              className="text-start"
              {...describedBy('reg-mobile', err('mobile'), 'hint')}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className={section}>{t('register.about')}</legend>
        <Field id="reg-emirate" label={t('fields.emirate')} error={err('emirate')}>
          <OptionSelect
            id="reg-emirate"
            group="emirate"
            options={EMIRATES}
            value={v.emirate}
            onChange={(x) => {
              set('emirate', x)
              setTouched((s) => ({ ...s, emirate: true }))
            }}
            error={err('emirate')}
          />
        </Field>
        <Field
          id="reg-situation"
          label={t('fields.situation')}
          hint={preset && v.situation === preset ? t('register.preselected') : undefined}
          error={err('situation')}
        >
          <OptionSelect
            id="reg-situation"
            group="situation"
            options={SITUATIONS}
            value={v.situation}
            onChange={(x) => set('situation', x)}
            error={err('situation')}
          />
        </Field>
        <LanguageChoice value={v.language} onChange={(x) => set('language', x)} />
        <Field id="reg-source" label={t('fields.source')} optional>
          <OptionSelect
            id="reg-source"
            group="source"
            options={SOURCES}
            value={v.source}
            onChange={(x) => set('source', x)}
          />
        </Field>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className={section}>{t('register.consent')}</legend>
        <CheckRow
          id="reg-terms"
          checked={v.terms}
          onChange={(x) => set('terms', x)}
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
        <CheckRow
          id="reg-age"
          checked={v.age}
          onChange={(x) => set('age', x)}
          error={err('age')}
          label={t('fields.age')}
        />
        <CheckRow
          id="reg-marketing"
          checked={v.marketing}
          onChange={(x) => set('marketing', x)}
          label={t('fields.marketing')}
          hint={t('fields.marketingHint')}
        />
      </fieldset>

      <Button
        type="submit"
        disabled={busy}
        className="h-11 w-full rounded-full bg-brand-highlight font-bold text-ink shadow-md hover:bg-brand-highlight/90"
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <ArrowRight className="size-4 rtl-mirror" aria-hidden />
        )}
        {busy ? t('register.submitting') : t('register.submit')}
      </Button>
      <LegalSheet doc={doc} onClose={() => setDoc(null)} />
    </form>
  )
}
