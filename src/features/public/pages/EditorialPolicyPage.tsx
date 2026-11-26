import { useTranslation } from 'react-i18next'
import { usePageTitle } from '@/hooks/use-page-title'
import { PolicyArticle } from '../components/static/PolicyArticle'

const SECTIONS = [
  'independence',
  'sources',
  'review',
  'labels',
  'recommendations',
  'corrections',
] as const

/** Editorial policy (static, C5.10 link): sponsor independence, sourcing, review and labels. */
export function EditorialPolicyPage() {
  const { t } = useTranslation('public')
  usePageTitle(t('pages.editorial'))
  return <PolicyArticle page="editorial" sections={SECTIONS} />
}
