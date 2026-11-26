import { Award, Medal, Star, Trophy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Stagger, StaggerItem } from '@/components/motion'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { certificateEarned, trackProgress } from '@/domain/tracks'
import { useBadges, useCourses, useEnrollments, useMe, usePoints } from '@/store/hooks'
import { BadgeGrid } from '../components/achievements/BadgeGrid'
import { CertificateCard } from '../components/achievements/CertificateCard'
import { PointsLedger } from '../components/achievements/PointsLedger'
import { TrackMilestones } from '../components/achievements/TrackMilestones'

/** Achievements (C8.1, C11.5): points, eight badges, track milestones and certificates. No leaderboard. */
export function AchievementsPage() {
  const { t } = useTranslation('learn')
  const me = useMe()
  const points = usePoints()
  const badges = useBadges()
  const courses = useCourses().filter((c) => c.track && c.status === 'published')
  const mine = useEnrollments().filter((e) => e.learnerId === me.id)
  const enr = (id: string) => mine.find((e) => e.courseId === id)
  const certs = courses.filter((c) => certificateEarned(c, enr(c.id))).length
  const milestones = courses.reduce((n, c) => {
    const pct = trackProgress(c, enr(c.id)).pct
    return n + [20, 60, 100].filter((m) => pct >= m).length
  }, 0)
  return (
    <>
      <PageHeader title={t('pages.achievements')} description={t('ach.subtitle')} />
      <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            icon: Star,
            label: t('ach.stats.points'),
            value: points,
            hint: t('ach.stats.pointsHint'),
            tone: 'primary' as const,
          },
          {
            icon: Medal,
            label: t('ach.stats.badges'),
            value: `${badges.filter((b) => b.earnedAt).length}/${badges.length}`,
            hint: t('ach.stats.badgesHint'),
            tone: 'highlight' as const,
          },
          {
            icon: Trophy,
            label: t('ach.stats.milestones'),
            value: `${milestones}/${courses.length * 3}`,
            hint: t('ach.stats.milestonesHint'),
            tone: 'deep' as const,
          },
          {
            icon: Award,
            label: t('ach.stats.certs'),
            value: `${certs}/${courses.length}`,
            hint: t('ach.stats.certsHint'),
            tone: 'accent' as const,
          },
        ].map((s) => (
          <StaggerItem key={s.label}>
            <StatCard {...s} className="h-full" />
          </StaggerItem>
        ))}
      </Stagger>
      <div className="mt-6 grid gap-6">
        <BadgeGrid />
        <section aria-labelledby="milestones-title" className="grid gap-4">
          <h2 id="milestones-title" className="text-lg">
            {t('ach.milestones.title')}
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {courses.map((c) => (
              <TrackMilestones key={c.id} course={c} />
            ))}
          </div>
        </section>
        <section aria-labelledby="certs-title" className="grid gap-4">
          <h2 id="certs-title" className="text-lg">
            {t('ach.certs.title')}
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {courses.map((c) => (
              <CertificateCard key={c.id} courseId={c.id} />
            ))}
          </div>
        </section>
        <PointsLedger />
      </div>
    </>
  )
}
