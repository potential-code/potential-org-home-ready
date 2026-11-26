import { useTranslation } from 'react-i18next'
import { usePageTitle } from '@/hooks/use-page-title'
import { PolicyArticle } from '../components/static/PolicyArticle'

const SECTIONS = [
  'collect',
  'use',
  'marketing',
  'partners',
  'never',
  'retention',
  'rights',
] as const

/** Privacy notice (static, C4): what Home Ready collects (C6.1) and the consent rules (C11). */
export function PrivacyPage() {
  const { t } = useTranslation('public')
  usePageTitle(t('pages.privacy'))
  return <PolicyArticle page="privacy" sections={SECTIONS} />
}
