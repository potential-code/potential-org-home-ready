import type { CalcResult } from '@shared/types'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Scale } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Motif } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { RENT_BUY_DEFAULTS, type RentBuyInputs } from '@/data/figures'
import { breakEvenYear } from '@/domain/calculator'
import { formatDate, useLocalized } from '@/i18n'

/** Rohan's saved rent-vs-buy result on Home (C8.1); break-even year computed by the formula. */
export function SavedResultCard({ result }: { result?: CalcResult }) {
  const { t } = useTranslation('learn')
  const { l, lang } = useLocalized()
  const year = breakEvenYear({
    ...RENT_BUY_DEFAULTS,
    ...(result?.inputs as Partial<RentBuyInputs> | undefined),
  })
  return (
    <section
      aria-labelledby="saved-result-title"
      className="card relative flex h-full flex-col gap-3 overflow-hidden p-6"
    >
      <Motif variant="corner" className="text-brand/15" />
      <h2 id="saved-result-title" className="flex items-center gap-2 text-base">
        <Scale className="size-5 text-brand" aria-hidden />
        {t('home.result.title')}
      </h2>
      {result ? (
        <>
          <p className="text-sm text-ink-soft">
            {l(result.name)} · {t('home.result.saved', { date: formatDate(result.savedAt, lang) })}
          </p>
          <p className="text-xl leading-snug font-bold text-ink">
            {year ? t('home.result.breakEven', { year }) : t('home.result.rentCheaper')}
          </p>
          <p className="text-sm text-ink-soft">{l(result.summary)}</p>
        </>
      ) : (
        <p className="text-sm text-ink-soft">{t('home.result.none')}</p>
      )}
      <Button asChild variant="outline" className="relative mt-auto self-start rounded-full">
        <Link to="/learn/calculator" search={{ tab: 'rent-vs-buy' }}>
          {t('home.result.open')} <ArrowRight className="rtl-mirror" aria-hidden />
        </Link>
      </Button>
    </section>
  )
}
