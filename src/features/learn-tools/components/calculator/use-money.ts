import { useTranslation } from 'react-i18next'
import { formatNumber, useLocalized } from '@/i18n'

/** AED and number formatting in the active language. */
export function useMoney() {
  const { t } = useTranslation('calculator')
  const { lang } = useLocalized()
  const num = (n: number) => formatNumber(Number.isInteger(n) ? n : Math.round(n * 100) / 100, lang)
  const aed = (n: number) => t('aed', { value: num(n) })
  return { aed, num }
}
