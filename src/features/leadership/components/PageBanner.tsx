import type { ReactNode } from 'react'
import { Motif } from '@/components/brand'
import { usePageTitle } from '@/hooks/use-page-title'

interface PageBannerProps {
  eyebrow?: ReactNode
  title: string
  children?: ReactNode
  actions?: ReactNode
}

/** Page banner for leadership and sponsor screens: brand gradient, white text, line-art motif. */
export function PageBanner({ eyebrow, title, children, actions }: PageBannerProps) {
  usePageTitle(title)
  return (
    <section className="relative mb-6 overflow-hidden rounded-3xl bg-grad-brand p-5 text-white shadow-lg sm:mb-8 sm:p-7">
      <Motif variant="banner" className="text-white/[0.12]" />
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 max-w-3xl space-y-2">
          {eyebrow && (
            <p className="text-xs font-bold tracking-widest text-white/85 uppercase">{eyebrow}</p>
          )}
          <h1 className="text-2xl leading-tight text-white sm:text-3xl">{title}</h1>
          {children && <div className="text-sm text-white/85 sm:text-base">{children}</div>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </section>
  )
}
