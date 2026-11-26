import { Send } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const TOPICS = ['question', 'content', 'account', 'privacy', 'partner'] as const
type Field = 'name' | 'email' | 'topic' | 'message'
type Values = Record<Field, string>
const EMPTY: Values = { name: '', email: '', topic: '', message: '' }

function validate(v: Values): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {}
  if (v.name.trim().length < 2) e.name = 'name'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'email'
  if (!v.topic) e.topic = 'topic'
  if (v.message.trim().length < 10) e.message = 'message'
  return e
}

/** Contact form (demo): inline validation on submit and blur, success toast, then clears. */
export function ContactForm() {
  const { t } = useTranslation('public')
  const [values, setValues] = useState<Values>(EMPTY)
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [sending, setSending] = useState(false)
  const errors = validate(values)
  const show = (f: Field) => (touched[f] && errors[f] ? t(`static.contact.errors.${f}`) : '')
  const set = (f: Field, v: string) => setValues((p) => ({ ...p, [f]: v }))
  const blur = (f: Field) => setTouched((p) => ({ ...p, [f]: true }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, email: true, topic: true, message: true })
    if (Object.keys(errors).length) return
    setSending(true)
    window.setTimeout(() => {
      setSending(false)
      toast.success(t('static.contact.sent', { name: values.name.trim().split(' ')[0] }))
      setValues(EMPTY)
      setTouched({})
    }, 500)
  }

  const err = (f: Field) =>
    show(f) ? (
      <p id={`c-${f}-err`} className="text-sm text-destructive">
        {show(f)}
      </p>
    ) : null
  const aria = (f: Field) => ({
    'aria-invalid': Boolean(show(f)),
    'aria-describedby': show(f) ? `c-${f}-err` : undefined,
  })

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="c-name">{t('static.contact.name')}</Label>
        <Input
          id="c-name"
          autoComplete="name"
          value={values.name}
          onChange={(e) => set('name', e.target.value)}
          onBlur={() => blur('name')}
          {...aria('name')}
        />
        {err('name')}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="c-email">{t('static.contact.email')}</Label>
        <Input
          id="c-email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => set('email', e.target.value)}
          onBlur={() => blur('email')}
          {...aria('email')}
        />
        {err('email')}
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="c-topic">{t('static.contact.topic')}</Label>
        <Select
          value={values.topic}
          onValueChange={(v) => {
            set('topic', v)
            blur('topic')
          }}
        >
          <SelectTrigger id="c-topic" {...aria('topic')}>
            <SelectValue placeholder={t('static.contact.topicPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {TOPICS.map((k) => (
              <SelectItem key={k} value={k}>
                {t(`static.contact.topics.${k}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {err('topic')}
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="c-message">{t('static.contact.message')}</Label>
        <Textarea
          id="c-message"
          rows={5}
          value={values.message}
          onChange={(e) => set('message', e.target.value)}
          onBlur={() => blur('message')}
          {...aria('message')}
        />
        {err('message')}
        <p className="text-xs text-ink-soft">{t('static.contact.privacyNote')}</p>
      </div>
      <div className="sm:col-span-2">
        <Button
          type="submit"
          disabled={sending}
          className="h-10 rounded-full bg-brand-highlight px-6 font-bold text-ink hover:bg-brand-highlight/85"
        >
          <Send className="size-4 rtl-mirror" aria-hidden />
          {sending ? t('static.contact.sending') : t('static.contact.submit')}
        </Button>
      </div>
    </form>
  )
}
