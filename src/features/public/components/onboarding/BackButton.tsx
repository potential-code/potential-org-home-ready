import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

/** "Back" to the previous onboarding step. */
export function BackButton({ to }: { to: '/onboarding/1' | '/onboarding/2' | '/onboarding/3' }) {
  const { t } = useTranslation('auth')
  return (
    <Button asChild variant="outline" className="h-10 rounded-full px-5">
      <Link to={to}>
        <ArrowLeft className="size-4 rtl-mirror" aria-hidden />
        {t('onboarding.back')}
      </Link>
    </Button>
  )
}
