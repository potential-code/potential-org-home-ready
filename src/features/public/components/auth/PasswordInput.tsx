import { Eye, EyeOff } from 'lucide-react'
import { type ComponentProps, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'

/** Password input with a show/hide toggle inside the end edge. */
export function PasswordInput(props: Omit<ComponentProps<typeof Input>, 'type'>) {
  const { t } = useTranslation('auth')
  const [show, setShow] = useState(false)
  const Icon = show ? EyeOff : Eye
  return (
    <div className="relative">
      <Input {...props} type={show ? 'text' : 'password'} className="pe-11" />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? t('fields.hidePassword') : t('fields.showPassword')}
        aria-pressed={show}
        className="absolute inset-y-0 end-0 flex w-11 items-center justify-center rounded-e-xl text-ink-soft hover:text-brand"
      >
        <Icon className="size-4" aria-hidden />
      </button>
    </div>
  )
}
