import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { askDalil } from '@/store/actions'
import { useChat, useMe } from '@/store/hooks'
import { TYPING_MS, TYPING_MS_REDUCED } from './config'

/**
 * Chat state for Ask Dalil: the stored conversation plus a short typing pause. The answer is
 * stored at once; the newest Dalil message stays hidden while `typing` is true.
 */
export function useDalilChat() {
  const me = useMe()
  const messages = useChat()
  const reduced = useReducedMotion()
  const [typing, setTyping] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const ask = useCallback(
    (text: string) => {
      const q = text.trim()
      if (!q || typing) return false
      askDalil(me.id, q)
      setTyping(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setTyping(false), reduced ? TYPING_MS_REDUCED : TYPING_MS)
      return true
    },
    [me.id, reduced, typing],
  )

  const visible = typing ? messages.slice(0, -1) : messages
  return { me, messages: visible, typing, ask }
}
