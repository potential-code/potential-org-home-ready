import { cn } from '@/lib/utils'

/** Dalil's avatar (C10): a rounded house shape with a key, in the brand and highlight colours. */
export function DalilMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={cn('shrink-0', className)}>
      <path
        d="M24 4.5c1.1 0 2.1.4 2.9 1.1l15.2 13.2c.9.8 1.4 1.9 1.4 3.1V39a4.5 4.5 0 0 1-4.5 4.5h-30A4.5 4.5 0 0 1 4.5 39V21.9c0-1.2.5-2.3 1.4-3.1L21.1 5.6c.8-.7 1.8-1.1 2.9-1.1Z"
        className="fill-brand"
      />
      <circle
        cx="19"
        cy="27"
        r="5.5"
        className="fill-none stroke-brand-highlight"
        strokeWidth="3"
      />
      <path
        d="M23.5 29.5 34 36m-4-2.5 2.4-3.6M33 35.4l2-3"
        className="fill-none stroke-brand-highlight"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}
