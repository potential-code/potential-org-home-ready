import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Stagger, StaggerItem } from '@/components/motion'
import { Button } from '@/components/ui/button'
import { AlertsCard } from '../components/AlertsCard'
import { ContentStatusCard } from '../components/ContentStatusCard'
import { KpiRow } from '../components/KpiRow'
import { OwnerBanner } from '../components/OwnerBanner'
import { RecentActivity } from '../components/RecentActivity'

/** Maya's Overview (C8.2). */
export function OverviewPage() {
  const { t } = useTranslation('owner')
  return (
    <div>
      <OwnerBanner
        eyebrow={t('overview.eyebrow')}
        title={t('overview.greeting')}
        body={t('overview.intro')}
        action={
          <Button
            asChild
            className="rounded-full bg-brand-highlight text-ink hover:bg-brand-highlight/90"
          >
            <Link to="/admin/approvals">
              {t('overview.goApprovals')}
              <ArrowRight className="rtl-mirror" aria-hidden />
            </Link>
          </Button>
        }
      />
      <KpiRow />
      <Stagger className="mt-6 grid gap-6 lg:grid-cols-2">
        <StaggerItem>
          <ContentStatusCard />
        </StaggerItem>
        <StaggerItem>
          <AlertsCard />
        </StaggerItem>
        <StaggerItem className="lg:col-span-2">
          <RecentActivity />
        </StaggerItem>
      </Stagger>
    </div>
  )
}
