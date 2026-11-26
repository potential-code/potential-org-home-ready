import { BookOpenCheck, Calculator, ListChecks, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Stagger, StaggerItem } from '@/components/motion'
import { NextAction } from '@/components/shared/NextAction'
import { AISHA_RENEWAL } from '@/data/learner-seed'
import { trackProgress } from '@/domain/tracks'
import {
  useCalcResults,
  useChecklists,
  useCourse,
  useEnrollment,
  usePoints,
  useReminders,
  useVisiblePlacements,
} from '@/store/hooks'
import { SWIFT_HOME_PLACEMENT } from '../../home-config'
import { BadgesStrip } from '../BadgesStrip'
import { ReminderCard } from '../ReminderCard'
import { SponsoredOfferCard } from '../SponsoredOfferCard'
import { HomeStats } from './HomeStats'

/** Renter Home (C8.1, Aisha): renewal next action, reminder, stats, badges, SwiftMove card. */
export function RenterHome() {
  const { t } = useTranslation('learn')
  const course = useCourse('renting')
  const enr = useEnrollment('renting')
  const p = course ? trackProgress(course, enr) : { done: 0, total: 0, pct: 0 }
  const checklists = useChecklists()
  const calc = useCalcResults()
  const points = usePoints()
  const reminder = useReminders().find((r) => r.status === 'active')
  const renewal = checklists.find((c) => c.templateId === 'renewal')
  const sponsor = useVisiblePlacements().some((x) => x.id === SWIFT_HOME_PLACEMENT)
  return (
    <>
      <Stagger className="grid gap-5 lg:grid-cols-3">
        <StaggerItem className="lg:col-span-2">
          <NextAction
            className="h-full"
            label={t('home.next.label')}
            title={t('home.next.title', {
              home: t('home.next.area'),
              days: AISHA_RENEWAL.daysToRenewal,
            })}
            body={t('home.next.body')}
            cta={t('home.next.cta')}
            to={renewal ? `/learn/checklists/${renewal.id}` : '/learn/checklists'}
          />
        </StaggerItem>
        <StaggerItem>
          <ReminderCard reminder={reminder} />
        </StaggerItem>
      </Stagger>
      <HomeStats
        stats={[
          {
            icon: BookOpenCheck,
            label: t('home.stats.renting'),
            value: `${p.pct}%`,
            hint: t('home.stats.trackHint', { done: p.done, total: p.total, track: 'A' }),
            tone: 'primary',
            to: '/learn/tracks/renting',
          },
          {
            icon: ListChecks,
            label: t('home.stats.checklists'),
            value: checklists.length,
            hint: t('home.stats.savedHint'),
            tone: 'highlight',
            to: '/learn/checklists',
          },
          {
            icon: Calculator,
            label: t('home.stats.calculator'),
            value: calc.length,
            hint: t('home.stats.savedHint'),
            tone: 'deep',
            to: '/learn/calculator',
          },
          {
            icon: Star,
            label: t('home.stats.points'),
            value: points,
            hint: t('home.stats.pointsHint'),
            tone: 'accent',
            to: '/learn/achievements',
          },
        ]}
      />
      <Stagger className="mt-5 grid gap-5 lg:grid-cols-3">
        <StaggerItem className={sponsor ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <BadgesStrip />
        </StaggerItem>
        {sponsor && (
          <StaggerItem>
            <SponsoredOfferCard />
          </StaggerItem>
        )}
      </Stagger>
    </>
  )
}
