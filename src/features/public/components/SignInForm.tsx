import { LogIn } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PERSONAS } from '@/data/personas'
import { signInWithCredentials } from '@/store/actions/session'

/**
 * Simulated sign-in (no real authentication): username or email (brief C16) and the demo
 * password, through `signInWithCredentials`. Unknown accounts point to the profile cards.
 */
export function SignInForm({ onPersona }: { onPersona: (id: string) => void }) {
  const { t } = useTranslation()
  const first = PERSONAS[0]
  const [email, setEmail] = useState(first?.username ?? '')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const res = signInWithCredentials(email, password)
    if ('error' in res) {
      const key = { required: 'required', unknown: 'unknown', password: 'badPassword' }[res.error]
      return setError(t(`signInPage.${key}`))
    }
    onPersona(res.persona.id)
  }
  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">{t('signInPage.email')}</Label>
        <Input
          id="email"
          type="text"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? 'signin-error' : undefined}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">{t('signInPage.password')}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && (
        <p id="signin-error" role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
      <Button
        type="submit"
        className="h-11 w-full rounded-full bg-brand-highlight text-ink shadow-md hover:bg-brand-highlight/90"
      >
        <LogIn className="size-4 rtl-mirror" aria-hidden />
        {t('signIn')}
      </Button>
    </form>
  )
}
