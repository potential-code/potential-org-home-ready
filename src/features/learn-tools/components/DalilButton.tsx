import { useRouterState } from '@tanstack/react-router'
import { MessageCircleQuestion, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { DalilChat } from './dalil/DalilChat'

/**
 * Floating "Ask Dalil" button on every learner page (C10), bottom-end. Opens a compact chat panel
 * with a link to the full page. Hidden on the assistant page itself.
 */
export function DalilButton() {
  const { t } = useTranslation('dalil')
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [open, setOpen] = useState(false)

  // Close the panel when the route changes (e.g. "Open full chat" or an answer link).
  // biome-ignore lint/correctness/useExhaustiveDependencies: react to route changes only
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (pathname.startsWith('/learn/assistant')) return null
  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-labelledby="dalil-panel-title"
          className="fixed inset-x-3 bottom-20 z-50 flex max-h-[calc(100dvh-7rem)] flex-col gap-3 overflow-hidden rounded-2xl border border-border/70 bg-white p-4 shadow-2xl sm:inset-x-auto sm:end-6 sm:bottom-24 sm:w-[26rem]"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 id="dalil-panel-title" className="text-lg">
              {t('floating.panelTitle')}
            </h2>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label={t('floating.close')}
              onClick={() => setOpen(false)}
            >
              <X aria-hidden />
            </Button>
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <DalilChat compact />
          </div>
        </div>
      )}
      <button
        type="button"
        aria-label={t('floating.label')}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="fixed end-4 bottom-4 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-brand-highlight px-5 font-semibold text-ink shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-brand/40 focus-visible:outline-none sm:end-6 sm:bottom-6"
      >
        {open ? (
          <X className="size-5" aria-hidden />
        ) : (
          <MessageCircleQuestion className="size-5" aria-hidden />
        )}
        <span className="hidden sm:inline">{t('floating.text')}</span>
      </button>
    </>
  )
}
