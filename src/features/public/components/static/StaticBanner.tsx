import type { ReactNode } from 'react'
import { Motif } from '@/components/brand'
import { Reveal } from '@/components/motion'

/** Page banner for the static public pages: brand gradient, white text, line-art motif. */
export function StaticBanner({
  eyebrow,
  title,
  intro,
  meta,
}: {
  eyebrow: string
  title: string
  intro: string
  meta?: ReactNode
}) {
  return (
    <section className="on-dark relative overflow-hidden rounded-3xl bg-grad-brand px-6 py-10 text-white shadow-lg sm:px-10 sm:py-14">
      <Motif variant="banner" className="text-white/[0.12] max-sm:hidden" />
      <Reveal className="relative max-w-2xl">
        <p className="text-xs font-bold tracking-widest text-white/80 uppercase">{eyebrow}</p>
        <h1 className="mt-2 text-3xl text-white sm:text-4xl">{title}</h1>
        <p className="mt-4 text-lg text-white/90">{intro}</p>
        {meta && <div className="mt-5 text-sm font-medium text-white/80">{meta}</div>}
      </Reveal>
    </section>
  )
}
