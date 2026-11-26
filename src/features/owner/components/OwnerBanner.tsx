import type { ReactNode } from 'react'
import { Motif } from '@/components/brand'
import { usePageTitle } from '@/hooks/use-page-title'

/** Page banner: brand gradient, white text, line-art motif. */
export function OwnerBanner({
  eyebrow,
  title,
  body,
  action,
}: {
  eyebrow: string
  title: string
  body: string
  action?: ReactNode
}) {
  usePageTitle(title)
  return (
    <section className="on-dark relative mb-6 overflow-hidden rounded-3xl bg-grad-brand p-6 text-white shadow-lg sm:p-8">
      <Motif variant="banner" className="hidden text-white/[0.14] sm:block" />
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl space-y-2">
          <p className="text-sm font-semibold text-white/85">{eyebrow}</p>
          <h1 className="text-2xl text-white sm:text-3xl">{title}</h1>
          <p className="text-white/85">{body}</p>
        </div>
        {action}
      </div>
    </section>
  )
}
