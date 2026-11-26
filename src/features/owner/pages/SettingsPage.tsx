import config from '@config'
import type { Lang, PlatformSettings } from '@shared/types'
import { Globe2, MapPin, Save, ShieldCheck, Timer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { saveSettings } from '@/store/actions'
import { useSettings } from '@/store/hooks'
import { AuditLogCard } from '../components/AuditLogCard'
import { FilterSelect } from '../components/FilterSelect'

const EMIRATES = ['dubai', 'abu-dhabi', 'sharjah'] as const
const LANGS: Lang[] = ['en', 'ar']

/** Maya's Settings (C8.2) with the audit log (C12). */
export function SettingsPage() {
  const { t } = useTranslation('owner')
  const saved = useSettings()
  const [s, setS] = useState<PlatformSettings>(saved)
  const [expiry, setExpiry] = useState(String(saved.checkExpiryDays))
  useEffect(() => {
    setS(saved)
    setExpiry(String(saved.checkExpiryDays))
  }, [saved])
  const days = Number(expiry)
  const bad = !Number.isInteger(days) || days < 30 || days > 365
  const reviewers = config.personas.filter((p) => p.role === 'reviewer')
  const toggleLang = (l: Lang, on: boolean) =>
    setS((x) => ({
      ...x,
      languages: on ? [...new Set([...x.languages, l])] : x.languages.filter((y) => y !== l),
    }))
  const save = () => {
    if (bad) return
    saveSettings({ ...s, checkExpiryDays: days })
    toast.success(t('settings.saved'))
  }
  const card = 'card p-5'
  const h = 'flex items-center gap-2 text-lg'
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.settings')}
        description={t('settings.description')}
        actions={
          <Button onClick={save} disabled={bad} className="rounded-full">
            <Save aria-hidden />
            {t('common.save')}
          </Button>
        }
      />
      <div className="grid gap-5 md:grid-cols-2">
        <section className={card}>
          <h2 className={h}>
            <Globe2 className="size-5 text-brand" aria-hidden />
            {t('settings.languages')}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">{t('settings.languagesBody')}</p>
          <ul className="mt-3 space-y-2">
            {LANGS.map((l) => (
              <li
                key={l}
                className="flex items-center justify-between rounded-xl bg-tint-50 px-3 py-2"
              >
                <Label htmlFor={`lang-${l}`}>{t(`lang.${l}`)}</Label>
                <Switch
                  id={`lang-${l}`}
                  checked={s.languages.includes(l)}
                  disabled={l === 'en'}
                  onCheckedChange={(on) => toggleLang(l, on)}
                />
              </li>
            ))}
          </ul>
        </section>
        <section className={card}>
          <h2 className={h}>
            <MapPin className="size-5 text-brand" aria-hidden />
            {t('settings.emirates')}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">{t('settings.emiratesBody')}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {EMIRATES.map((e) => (
              <FilterSelect
                key={e}
                id={`em-${e}`}
                label={t(`emirate.${e}`)}
                value={s.emirates[e]}
                onChange={(v) =>
                  setS((x) => ({
                    ...x,
                    emirates: { ...x.emirates, [e]: v as 'on' | 'coming-soon' },
                  }))
                }
                options={[
                  { value: 'on', label: t('settings.on') },
                  { value: 'coming-soon', label: t('settings.comingSoon') },
                ]}
              />
            ))}
          </div>
        </section>
        <section className={card}>
          <h2 className={h}>
            <ShieldCheck className="size-5 text-brand" aria-hidden />
            {t('settings.reviewer')}
          </h2>
          <p className="mt-1 mb-3 text-sm text-ink-soft">{t('settings.reviewerBody')}</p>
          <FilterSelect
            id="set-reviewer"
            label={t('settings.reviewer')}
            value={s.reviewerId}
            onChange={(reviewerId) => setS((x) => ({ ...x, reviewerId }))}
            options={reviewers.map((p) => ({ value: p.id, label: p.name.en }))}
          />
        </section>
        <section className={card}>
          <h2 className={h}>
            <Timer className="size-5 text-brand" aria-hidden />
            {t('settings.expiry')}
          </h2>
          <p className="mt-1 mb-3 text-sm text-ink-soft">{t('settings.expiryBody')}</p>
          <Label htmlFor="set-expiry" className="text-xs font-semibold text-ink-soft">
            {t('settings.expiry')}
          </Label>
          <Input
            id="set-expiry"
            type="number"
            min={30}
            max={365}
            value={expiry}
            aria-invalid={bad}
            aria-describedby={bad ? 'exp-err' : undefined}
            onChange={(e) => setExpiry(e.target.value)}
            className="mt-1 max-w-40"
          />
          {bad && (
            <p id="exp-err" className="mt-1 text-sm text-danger">
              {t('settings.expiryError')}
            </p>
          )}
        </section>
      </div>
      <AuditLogCard />
    </div>
  )
}
