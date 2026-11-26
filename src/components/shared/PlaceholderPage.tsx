import { Hammer } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { EmptyState } from './EmptyState'
import { PageHeader } from './PageHeader'

/**
 * Foundation placeholder: page title plus a "being built" empty state. Feature agents replace the
 * page body that renders this; the route and page component names stay.
 */
export function PlaceholderPage({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children?: ReactNode
}) {
  const { t } = useTranslation()
  return (
    <>
      <PageHeader title={title} description={description} />
      <EmptyState icon={Hammer} title={t('placeholder.title')} body={t('placeholder.body')} />
      {children}
    </>
  )
}
