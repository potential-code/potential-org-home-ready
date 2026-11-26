import type { Localized } from '@shared/types'

/** Build a Localized value. Leave `ar` empty for long sample text: the UI shows the English
 * text with an "Arabic content placeholder" label. */
export function L(en: string, ar = ''): Localized {
  return { en, ar }
}
