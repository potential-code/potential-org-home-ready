import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DemoTag } from '@/components/shared/DemoTag'
import { LangToggle } from '@/components/shared/LangToggle'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/button'
import { DemoControls } from './DemoControls'
import { UserMenu } from './UserMenu'

/**
 * Signed-in top bar (h-16, sticky): mobile menu button and logo, the demo label (the one allowed
 * slot for it inside the portal), language toggle, presenter controls and the user. Add a
 * notification bell or search here when a mockup needs one.
 */
export function TopBar({ onMenu }: { onMenu: () => void }) {
  const { t } = useTranslation()
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-border/70 bg-white/85 px-4 shadow-xs backdrop-blur sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label={t('menu')}
        onClick={onMenu}
      >
        <Menu className="size-5" aria-hidden />
      </Button>
      <Link to="/" className="lg:hidden" aria-label={t('home')}>
        <Logo compact className="h-7" />
      </Link>
      <DemoTag className="hidden md:inline-flex" />
      <div className="ms-auto flex items-center gap-1.5 sm:gap-2">
        <LangToggle />
        <DemoControls />
        <UserMenu />
      </div>
    </header>
  )
}
