import config from '@config'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { LangSwitch } from '@/features/public/components/LangSwitch'
import { SECTIONS } from '@/features/public/config'
import { scrollToId } from '@/features/public/scroll-to'
import { cn } from '@/lib/utils'
import { usePrefs } from '@/store/actions/session'
import { DemoControls } from './DemoControls'

/**
 * Public header band (C5.1, h-16), always dark because only a white Potential.org logo exists:
 * transparent over the dark hero, solid deep brand once the page scrolls (or on pages without a
 * hero). Logo + "Home Ready", section nav, EN | عربي, "Log in" (outline) and "Join free" (amber).
 */
export function PublicHeader({ overHero = false }: { overHero?: boolean }) {
  const { t } = useTranslation('public')
  const { lang } = usePrefs()
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const solid = !overHero || scrolled
  const go = async (id: string) => {
    setOpen(false)
    if (pathname !== '/') {
      await navigate({ to: '/' })
      window.setTimeout(() => scrollToId(id), 120)
    } else scrollToId(id)
  }
  return (
    <header
      className={cn(
        'on-dark inset-x-0 top-0 z-40 text-white transition-[background-color,box-shadow] duration-300',
        overHero ? 'fixed' : 'sticky',
        solid ? 'bg-brand-deep shadow-lg' : 'bg-transparent',
      )}
    >
      <div className="container-page flex h-16 items-center gap-2 sm:gap-3">
        <Link to="/" className="shrink-0" aria-label={t('header.brand')}>
          <Logo variant="white" className="h-7" />
        </Link>
        <nav aria-label={t('common:menu')} className="ms-6 hidden items-center gap-0.5 xl:flex">
          {SECTIONS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => void go(id)}
              className="h-11 rounded-full px-3 text-[13px] font-semibold text-white/90 transition-colors hover:bg-white/15 hover:text-white"
            >
              {t(`nav.${id}`)}
            </button>
          ))}
        </nav>
        <div className="ms-auto flex min-w-0 items-center gap-1.5 sm:gap-2">
          <LangSwitch className="hidden md:inline-flex" />
          <DemoControls onDark className="hidden md:inline-flex" />
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden h-9 rounded-full border-white/70 bg-transparent px-4 text-white hover:bg-white/15 hover:text-white md:inline-flex"
          >
            <Link to={config.signInRoute}>{t('header.login')}</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="hidden h-9 rounded-full bg-brand-highlight px-4 font-bold text-ink shadow-md hover:bg-white sm:inline-flex"
          >
            <Link to="/register">{t('header.join')}</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/15 hover:text-white xl:hidden"
            aria-label={t('common:menu')}
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" aria-hidden />
          </Button>
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side={lang === 'ar' ? 'left' : 'right'}
          className="on-dark w-72 border-0 bg-brand-deep text-white"
        >
          <SheetTitle className="px-1 pt-1">
            <Logo variant="white" stacked />
          </SheetTitle>
          <nav className="mt-4 flex flex-col gap-1">
            {SECTIONS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => void go(id)}
                className="h-11 rounded-xl px-3 text-start text-sm font-semibold text-white/90 hover:bg-white/10 hover:text-white"
              >
                {t(`nav.${id}`)}
              </button>
            ))}
            <div className="flex flex-wrap items-center gap-2 px-3 pt-3">
              <LangSwitch />
              <DemoControls onDark />
            </div>
            <div className="flex flex-col gap-2 px-3 pt-4">
              <Button
                asChild
                className="h-10 rounded-full bg-brand-highlight font-bold text-ink hover:bg-white"
              >
                <Link to="/register">{t('header.join')}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-full border-white/70 bg-transparent text-white hover:bg-white/15 hover:text-white"
              >
                <Link to={config.signInRoute}>{t('header.login')}</Link>
              </Button>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
