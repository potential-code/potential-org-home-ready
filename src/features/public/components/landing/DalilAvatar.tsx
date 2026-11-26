import { cn } from '@/lib/utils'

/** Dalil's avatar (C10): a rounded house shape with a key, primary with an amber key. */
export function DalilAvatar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn('size-12 shrink-0', className)} aria-hidden>
      <path
        d="M24 4.5 42 18.2c1.3 1 2 2.4 2 4V39a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V22.2c0-1.6.7-3 2-4L24 4.5Z"
        className="fill-brand"
      />
      <circle
        cx="19"
        cy="27"
        r="5.2"
        className="fill-none stroke-brand-highlight"
        strokeWidth="3"
      />
      <path
        d="M23.5 27H35m-4 0v4.5m-4-4.5v3"
        className="fill-none stroke-brand-highlight"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}
