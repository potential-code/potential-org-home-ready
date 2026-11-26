import config from '@config'
import type { Role } from '@shared/types'
import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import { type ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Motif } from '@/components/brand'
import { MotionPage } from '@/components/motion'
import { DemoTag } from '@/components/shared/DemoTag'
import { Logo } from '@/components/shared/Logo'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useLocalized } from '@/i18n'
import { cn } from '@/lib/utils'
import { usePersona, usePrefs } from '@/store/actions/session'
import { SideNav } from './SideNav'
import { TopBar } from './TopBar'

/**
 * Signed-in shell for every role: branded left navigation on desktop, sheet navigation on mobile,
 * `TopBar` above the content. `floating` renders a fixed slot (learner: the Ask Dalil button). Calm by design; learner screens add their own colour inside.
 */
export function AppShell({ area: role, floating }: { area: Role; floating?: ReactNode }) {
  const { t } = useTranslation()
  const { l } = useLocalized()
  const { lang } = usePrefs()
  const [open, setOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const persona = usePersona()
  // While the presenter switches role, the old layout can render once with the new persona.
  if (!persona || persona.role !== role) return null
  return (
    <div className="min-h-dvh bg-background">
      <aside className="on-dark fixed inset-y-0 start-0 z-30 hidden w-64 flex-col overflow-hidden bg-grad-brand-v text-white shadow-lg lg:flex">
        <Motif variant="sidebar" className="text-white/[0.08]" />
        <Link to="/" className="relative flex items-center px-5 pt-5 pb-2" aria-label={t('home')}>
          <Logo variant="white" stacked />
        </Link>
        <p className="relative px-5 pt-3 pb-2 text-[11px] font-bold tracking-widest text-white/75 uppercase">
          {t(`roles.${role}`)}
        </p>
        <div className="relative flex-1 overflow-y-auto px-3 pb-6">
          <SideNav role={role} />
        </div>
        <p className="relative border-t border-white/10 px-5 py-3 text-xs text-white/70">
          {l(config.title)}
        </p>
      </aside>

      <div className="lg:ps-64">
        <TopBar onMenu={() => setOpen(true)} />
        <main
          id="main"
          tabIndex={-1}
          className={cn('container-page py-6 outline-none sm:py-8', floating && 'pb-28 sm:pb-28')}
        >
          <MotionPage key={pathname}>
            <Outlet />
          </MotionPage>
        </main>
        <footer className="container-page pb-8 md:hidden">
          <DemoTag />
        </footer>
      </div>

      {floating}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side={lang === 'ar' ? 'right' : 'left'}
          className="on-dark w-72 overflow-hidden border-0 bg-grad-brand-v p-0 text-white"
        >
          <Motif variant="sidebar" className="text-white/[0.07]" />
          <SheetTitle className="relative flex items-center px-5 pt-5 pb-2">
            <Logo variant="white" stacked />
          </SheetTitle>
          <div className="relative overflow-y-auto p-3">
            <SideNav role={role} onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
