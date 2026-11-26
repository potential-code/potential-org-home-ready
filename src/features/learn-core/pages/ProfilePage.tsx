import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/shared/PageHeader'
import { useLocalized } from '@/i18n'
import { updateLearnerProfile } from '@/store/actions'
import { useDb } from '@/store/db'
import { useMe } from '@/store/hooks'
import { ConsentsCard } from '../components/profile/ConsentsCard'
import { DataCard } from '../components/profile/DataCard'
import { DetailsCard, type ProfileDetails } from '../components/profile/DetailsCard'
import { LanguageCard } from '../components/profile/LanguageCard'

/** Profile and privacy (C8.1, C14): details, language, consents, my data, delete account. */
export function ProfilePage() {
  const { t } = useTranslation('learn')
  const { l } = useLocalized()
  const me = useMe()
  const record = useDb((db) => db.learners.find((x) => x.personaId === me.id))
  const [details, setDetails] = useState<ProfileDetails>({
    emirate: record?.emirate ?? 'dubai',
    situation: record?.situation ?? 'moving',
  })
  return (
    <>
      <PageHeader title={t('pages.profile')} description={t('profile.subtitle')} />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div className="grid gap-6">
          <DetailsCard
            name={l(me.name)}
            record={record}
            details={details}
            onSave={(d) => {
              setDetails(d)
              updateLearnerProfile(me.id, d)
            }}
          />
          <LanguageCard />
          <DataCard />
        </div>
        <ConsentsCard />
      </div>
    </>
  )
}
