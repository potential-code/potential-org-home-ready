import { type RefObject, useLayoutEffect } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { gsap } from '@/lib/gsap'

/**
 * Landing scroll reveal (playbook C1): when the section scrolls into view, every `[data-reveal]`
 * inside it (eyebrow, title, text, then items, in document order) rises in one by one. Runs in a
 * layout effect so the hidden start state is set before the first paint (no flicker). Reduced
 * motion leaves everything visible.
 */
export function useSectionReveal(ref: RefObject<HTMLElement | null>) {
  const reduce = useReducedMotion()
  useLayoutEffect(() => {
    const el = ref.current
    if (reduce || !el) return
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', el)
      if (!items.length) return
      gsap.set(items, { autoAlpha: 0, y: 28 })
      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        duration: 0.75,
        ease: 'power3.out',
        stagger: 0.09,
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [ref, reduce])
}
