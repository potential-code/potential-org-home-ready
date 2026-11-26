import { Motif } from '@/components/brand'
import { usePageTitle } from '@/hooks/use-page-title'

/** Reviewer page banner: brand gradient, white text, line-art motif. */
export function ReviewBanner({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string
  title: string
  body: string
}) {
  usePageTitle(title)
  return (
    <section className="on-dark relative mb-6 overflow-hidden rounded-3xl bg-grad-brand p-6 text-white shadow-lg sm:p-8">
      <Motif variant="banner" className="hidden text-white/[0.14] sm:block" />
      <div className="relative max-w-2xl space-y-2">
        <p className="text-sm font-semibold text-white/85">{eyebrow}</p>
        <h1 className="text-2xl text-white sm:text-3xl">{title}</h1>
        <p className="text-white/85">{body}</p>
      </div>
    </section>
  )
}
