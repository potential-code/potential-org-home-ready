import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { GeoFrames } from '@/components/brand'
import { cn } from '@/lib/utils'

/** Empty states explain the next step instead of showing a blank panel . */
export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
  className,
}: {
  icon: LucideIcon
  title: string
  body?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center gap-2.5 overflow-hidden rounded-2xl border border-dashed border-brand/30 bg-tint-50/70 px-6 py-10 text-center',
        className,
      )}
    >
      <span className="relative flex size-16 items-center justify-center">
        <GeoFrames className="absolute inset-0 size-full text-brand/20" count={2} />
        <Icon className="relative -mt-1 size-6 text-brand" aria-hidden />
      </span>
      <h3 className="text-lg">{title}</h3>
      {body && <p className="max-w-md text-sm text-ink-soft">{body}</p>}
      {action}
    </div>
  )
}
