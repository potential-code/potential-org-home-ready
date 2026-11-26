import { ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { OFFERS, SPONSORS } from '@/data/catalogue'
import { formatDate, useLocalized } from '@/i18n'
import { setMarketingConsent, withdrawPartnerConsent } from '@/store/actions'
import { useConsents, useMe, usePartnerConsents } from '@/store/hooks'

/** Consents (C8.1, C14): terms, marketing toggle and withdrawable partner requests. */
export function ConsentsCard() {
  const { t } = useTranslation('learn')
  const { l, lang } = useLocalized()
  const me = useMe()
  const consents = useConsents()
  const partners = usePartnerConsents()
  return (
    <section aria-labelledby="consents-title" className="card grid gap-4 p-5 sm:p-6">
      <h2 id="consents-title" className="flex items-center gap-2 text-lg">
        <ShieldCheck className="size-5 text-brand" aria-hidden /> {t('profile.consents.title')}
      </h2>
      <div className="rounded-xl bg-tint-50 px-4 py-3">
        <p className="font-semibold text-ink">{t('profile.consents.terms')}</p>
        <p className="text-sm text-ink-soft">
          {consents
            ? t('profile.consents.termsOn', { date: formatDate(consents.termsAcceptedAt, lang) })
            : t('profile.consents.termsNone')}
        </p>
      </div>
      <div className="flex items-center justify-between gap-4 rounded-xl bg-tint-50 px-4 py-3">
        <div className="min-w-0">
          <label htmlFor="marketing" className="font-semibold text-ink">
            {t('profile.consents.marketing')}
          </label>
          <p className="text-sm text-ink-soft">
            {consents?.marketing
              ? t('profile.consents.marketingOn')
              : t('profile.consents.marketingOff')}
          </p>
        </div>
        <Switch
          id="marketing"
          checked={!!consents?.marketing}
          onCheckedChange={(on) => {
            setMarketingConsent(me.id, on)
            toast.success(
              on ? t('profile.consents.marketingSaved') : t('profile.consents.marketingStopped'),
            )
          }}
        />
      </div>
      <div className="grid gap-2">
        <h3 className="text-base">{t('profile.consents.partners')}</h3>
        <p className="text-sm text-ink-soft">{t('profile.consents.partnersBody')}</p>
        {partners.length ? (
          <ul className="grid gap-2">
            {partners.map((c) => {
              const sponsor = SPONSORS.find((s) => s.id === c.sponsorId)
              const offer = OFFERS.find((o) => o.id === c.offerId)
              return (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{l(offer?.title) || l(sponsor?.name)}</p>
                    <p className="text-sm text-ink-soft">
                      {c.withdrawnAt
                        ? t('profile.consents.withdrawnOn', {
                            date: formatDate(c.withdrawnAt, lang),
                          })
                        : t('profile.consents.givenOn', { date: formatDate(c.givenAt, lang) })}
                    </p>
                  </div>
                  {!c.withdrawnAt && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        withdrawPartnerConsent(c.id)
                        toast.success(t('profile.consents.withdrawn', { name: l(sponsor?.name) }))
                      }}
                    >
                      {t('profile.consents.withdraw')}
                    </Button>
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="rounded-xl border border-dashed border-brand/30 px-4 py-3 text-sm text-ink-soft">
            {t('profile.consents.partnersNone')}
          </p>
        )}
      </div>
    </section>
  )
}
