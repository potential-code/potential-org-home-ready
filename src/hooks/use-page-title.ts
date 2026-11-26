import config from '@config'
import { useEffect } from 'react'
import { useLocalized } from '@/i18n'

/** Sets the document title: "<page> · <mockup title>" in the active language. */
export function usePageTitle(title: string) {
  const { l } = useLocalized()
  const app = l(config.title)
  useEffect(() => {
    document.title = title ? `${title} · ${app}` : app
  }, [title, app])
}
