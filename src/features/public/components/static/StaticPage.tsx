import type { ReactNode } from 'react'
import { MotionPage } from '@/components/motion'

/** Frame for the static public pages: below the sticky header, banner then content. */
export function StaticPage({ children }: { children: ReactNode }) {
  return (
    <MotionPage className="container-page space-y-8 pt-8 pb-16 sm:space-y-10 sm:pt-10 sm:pb-24">
      {children}
    </MotionPage>
  )
}
