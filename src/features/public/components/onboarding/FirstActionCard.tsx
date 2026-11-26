import { ArrowRight, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Motif } from '@/components/brand'
import { SmartImage } from '@/components/shared/SmartImage'
import { Button } from '@/components/ui/button'

export type FirstAction = 'journey' | 'calculator'

const IMAGE: Record<FirstAction, string> = {
  journey: 'images/generated/journey-renew.jpg',
  calculator: 'images/generated/journey-buy.jpg',
}

/** The suggested first useful action (C6.1 step 4) as a photo card with one amber CTA. */
export function FirstActionCard({ action, onStart }: { action: FirstAction; onStart: () => void }) {
  const { t } = useTranslation('auth')
  const k = `onboarding.s4.${action}`
  return (
    <article className="on-dark relative flex h-full flex-col overflow-hidden rounded-2xl bg-brand-deep text-white shadow-lg">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <SmartImage src={IMAGE[action]} alt="" className="size-full object-cover" />
      </div>
      <div className="relative flex flex-1 flex-col gap-3 p-6">
        <Motif variant="card" className="text-white/[0.08]" />
        <p className="relative text-xs font-bold tracking-widest text-brand-highlight uppercase">
          {t('onboarding.s4.firstAction')}
        </p>
        <h2 className="relative text-2xl text-white">{t(`${k}.title`)}</h2>
        <p className="relative text-white/85">{t(`${k}.body`)}</p>
        <p className="relative flex items-center gap-1.5 text-sm font-semibold text-white/85">
          <Clock className="size-4" aria-hidden />
          {t('onboarding.s4.time')}
        </p>
        <div className="relative mt-auto pt-2">
          <Button
            onClick={onStart}
            className="h-10 rounded-full bg-brand-highlight px-6 font-bold text-ink shadow-md hover:bg-white"
          >
            {t('onboarding.s4.start')}
            <ArrowRight className="size-4 rtl-mirror" aria-hidden />
          </Button>
        </div>
      </div>
    </article>
  )
}
