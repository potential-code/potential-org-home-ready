import type { LucideIcon } from 'lucide-react'
import { Download } from 'lucide-react'
import { Motif } from '@/components/brand'
import { Button } from '@/components/ui/button'

interface ReportCardProps {
  icon: LucideIcon
  title: string
  body: string
  format: string
  action: string
  onAction: () => void
}

/** One downloadable report: watermark icon, title, what is inside, format and the action. */
export function ReportCard({ icon: Icon, title, body, format, action, onAction }: ReportCardProps) {
  return (
    <article className="card card-hover relative flex flex-col gap-3 overflow-hidden p-5">
      <Motif variant="corner" className="text-brand/10" />
      <Icon className="absolute end-5 top-5 size-12 text-brand/15" aria-hidden />
      <h2 className="pe-14 text-lg leading-snug font-bold text-brand-deep">{title}</h2>
      <p className="pe-14 text-sm text-ink-soft">{body}</p>
      <p className="text-xs font-semibold tracking-wide text-brand uppercase">{format}</p>
      <Button className="mt-auto w-fit rounded-full" onClick={onAction}>
        <Download aria-hidden />
        {action}
      </Button>
    </article>
  )
}
