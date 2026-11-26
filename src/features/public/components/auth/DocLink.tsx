import type { ReactNode } from 'react'

/** Inline text button inside a consent label that opens a legal panel instead of toggling the box. */
export function DocLink({ onOpen, children }: { onOpen: () => void; children?: ReactNode }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onOpen()
      }}
      className="font-semibold text-brand underline underline-offset-2 hover:text-brand-deep"
    >
      {children}
    </button>
  )
}
