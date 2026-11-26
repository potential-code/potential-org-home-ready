import { useTranslation } from 'react-i18next'
import { usePageTitle } from '@/hooks/use-page-title'
import { PolicyArticle } from '../components/static/PolicyArticle'

const SECTIONS = [
  'about',
  'advice',
  'accounts',
  'use',
  'sponsors',
  'content',
  'changes',
  'law',
] as const

/** Terms of use (static, C4): short plain-language terms for a free education programme. */
export function TermsPage() {
  const { t } = useTranslation('public')
  usePageTitle(t('pages.terms'))
  return <PolicyArticle page="terms" sections={SECTIONS} />
}
