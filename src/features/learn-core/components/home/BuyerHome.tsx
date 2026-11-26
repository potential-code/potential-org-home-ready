import { BookOpenCheck, ListChecks, Scale, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Stagger, StaggerItem } from '@/components/motion'
import { NextAction } from '@/components/shared/NextAction'
import { trackProgress } from '@/domain/tracks'
import { useLocalized } from '@/i18n'
import {
  useCalcResults,
  useChecklists,
  useCourse,
  useEnrollment,
  useJourneyRuns,
  usePoints,
  useReminders,
} from '@/store/hooks'
import { BadgesStrip } from '../BadgesStrip'
import { ReminderCard } from '../ReminderCard'
import { HomeStats } from './HomeStats'
import { SavedResultCard } from './SavedResultCard'

/** Buyer Home (C8.1, Rohan): journey next action, pre-approval reminder, stats, saved result. */
export function BuyerHome() {
  const { t } = useTranslation('learn')
  const { l } = useLocalized()
  const course = useCourse('buying')
  const enr = useEnrollment('buying')
  const p = course ? trackProgress(course, enr) : { done: 0, total: 0, pct: 0 }
  const checklists = useChecklists()
  const points = usePoints()
  const reminder = useReminders().find((r) => r.status === 'active')
  const run = useJourneyRuns().find((r) => r.journeyId === 'rent-or-buy' && r.finishedAt)
  const result = useCalcResults().find((r) => r.tab === 'rent-vs-buy')
  const checklistId =
    run?.savedChecklistId ?? checklists.find((c) => c.templateId === 'due-diligence')?.id
  return (
    <>
      <Stagger className="grid gap-5 lg:grid-cols-3">
        <StaggerItem className="lg:col-span-2">
          <NextAction
            className="h-full"
            label={t('home.next.label')}
            title={run?.nextAction ? l(run.nextAction) : t('home.buyer.nextFallback')}
            body={t('home.buyer.nextBody')}
            cta={t('home.next.cta')}
            to={checklistId ? `/learn/checklists/${checklistId}` : '/learn/checklists'}
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
            label: t('home.stats.buying'),
            value: `${p.pct}%`,
            hint: t('home.stats.trackHint', { done: p.done, total: p.total, track: 'B' }),
            tone: 'primary',
            to: '/learn/tracks/buying',
          },
          {
            icon: Scale,
            label: t('home.stats.journey'),
            value: run?.score ?? 0,
            hint: t('home.stats.journeyHint'),
            tone: 'highlight',
            to: '/learn/journeys/rent-or-buy',
          },
          {
            icon: ListChecks,
            label: t('home.stats.checklists'),
            value: checklists.length,
            hint: t('home.stats.savedHint'),
            tone: 'deep',
            to: '/learn/checklists',
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
        <StaggerItem className="lg:col-span-2">
          <SavedResultCard result={result} />
        </StaggerItem>
        <StaggerItem>
          <BadgesStrip />
        </StaggerItem>
      </Stagger>
    </>
  )
}
