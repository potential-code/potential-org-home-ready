import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

/** Amber pill primary action at the end of an onboarding step. */
export function NextButton({ onClick, children }: { onClick: () => void; children?: ReactNode }) {
  const { t } = useTranslation('auth')
  return (
    <Button
      onClick={onClick}
      className="h-10 rounded-full bg-brand-highlight px-6 font-bold text-ink shadow-md hover:bg-brand-highlight/90"
    >
      {children ?? t('onboarding.next')}
      <ArrowRight className="size-4 rtl-mirror" aria-hidden />
    </Button>
  )
}
