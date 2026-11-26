import { useTranslation } from 'react-i18next'
import { Motif } from '@/components/brand'
import { usePageTitle } from '@/hooks/use-page-title'
import { DalilChat } from '../components/dalil/DalilChat'

/** Ask Dalil, full page (brief C10): scripted guide with sources, check dates and hand-off. */
export function AssistantPage() {
  const { t } = useTranslation('dalil')
  usePageTitle(t('pages.title'))
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <header className="relative overflow-hidden rounded-3xl bg-grad-brand p-6 text-white shadow-lg sm:p-8">
        <Motif variant="banner" className="text-white/[0.12]" />
        <div className="relative max-w-xl space-y-2">
          <h1 className="text-2xl text-white sm:text-3xl">{t('chat.bannerTitle')}</h1>
          <p className="text-white/85">{t('chat.bannerBody')}</p>
        </div>
      </header>
      <div className="card flex flex-col p-3 sm:p-5">
        <DalilChat />
      </div>
    </div>
  )
}
