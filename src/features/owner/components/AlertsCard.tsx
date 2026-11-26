import { Link } from '@tanstack/react-router'
import { AlertTriangle, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { KPI } from '@/data/figures'
import { useApprovals, useSettings } from '@/store/hooks'

/** Overview alerts: fee check dates expiring, approved items waiting to publish. */
export function AlertsCard() {
  const { t } = useTranslation('owner')
  const settings = useSettings()
  const waiting = useApprovals().filter((a) => a.outcome === 'approved' && !a.published).length
  return (
    <section className="card h-full p-5">
      <h2 className="text-lg">{t('overview.alertsTitle')}</h2>
      <ul className="mt-4 space-y-3">
        <li className="rounded-xl border border-notice/25 bg-notice-soft p-4">
          <p className="flex items-start gap-2 font-semibold text-notice">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
            {t('overview.feeAlert', { count: KPI.feesExpiringSoon })}
          </p>
          <p className="mt-1 ps-6 text-sm text-ink-soft">
            {t('overview.feeAlertBody', { days: settings.checkExpiryDays })}
          </p>
        </li>
        {waiting > 0 && (
          <li className="rounded-xl border border-brand/20 bg-tint-50 p-4">
            <p className="flex items-start gap-2 font-semibold text-brand-deep">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
              <Link to="/admin/approvals" className="hover:underline">
                {t('overview.approvalsAlert', { count: waiting })}
              </Link>
            </p>
            <p className="mt-1 ps-6 text-sm text-ink-soft">{t('overview.approvalsAlertBody')}</p>
          </li>
        )}
      </ul>
    </section>
  )
}
