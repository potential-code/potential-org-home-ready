import type { EmailTemplate } from '@shared/types'
import { Clock, Mail, Pencil, Send } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { formatDate, formatNumber, useLocalized } from '@/i18n'
import { useNudges, useTemplates } from '@/store/hooks'
import { AnnouncementsCard } from '../components/AnnouncementsCard'
import { TemplateDialog } from '../components/TemplateDialog'
import { REMINDER_SCHEDULE } from '../config'

/** Maya's Communications (C8.2, C14). */
export function CommunicationsPage() {
  const { t } = useTranslation('owner')
  const { lang } = useLocalized()
  const templates = useTemplates()
  const nudges = useNudges()
  const [editing, setEditing] = useState<EmailTemplate | null>(null)
  const subjectOf = (id: string) => templates.find((x) => x.id === id)?.subject ?? id
  return (
    <div className="space-y-5">
      <PageHeader title={t('pages.communications')} description={t('comms.description')} />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <section className="card p-5">
          <h2 className="flex items-center gap-2 text-lg">
            <Mail className="size-5 text-brand" aria-hidden />
            {t('comms.templates')}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">{t('comms.templatesBody')}</p>
          <ul className="mt-3 divide-y divide-border/70">
            {templates.map((tp) => (
              <li key={tp.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold text-ink-soft">{tp.trigger}</p>
                    <StatusBadge tone="brand">{tp.channel}</StatusBadge>
                  </div>
                  <p className="mt-1 font-semibold">{tp.subject}</p>
                  <p className="mt-0.5 line-clamp-2 text-sm text-ink-soft">{tp.body}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(tp)}
                  className="self-start"
                >
                  <Pencil aria-hidden />
                  {t('comms.edit')}
                </Button>
              </li>
            ))}
          </ul>
        </section>
        <div className="space-y-5">
          <AnnouncementsCard />
          <section className="card p-5">
            <h2 className="flex items-center gap-2 text-lg">
              <Clock className="size-5 text-brand" aria-hidden />
              {t('comms.schedule')}
            </h2>
            <p className="mt-1 text-sm text-ink-soft">{t('comms.scheduleBody')}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {REMINDER_SCHEDULE.map((r) => (
                <li key={r.id} className="rounded-xl bg-tint-50 p-3">
                  <p className="font-semibold">{subjectOf(r.id)}</p>
                  <p className="text-ink-soft">{r.when}</p>
                </li>
              ))}
            </ul>
          </section>
          <section className="card p-5">
            <h2 className="flex items-center gap-2 text-lg">
              <Send className="size-5 text-brand" aria-hidden />
              {t('comms.nudges')}
            </h2>
            {nudges.length ? (
              <ul className="mt-3 space-y-2 text-sm">
                {nudges.map((n) => (
                  <li key={n.id} className="flex flex-wrap justify-between gap-2">
                    <span>
                      {t('comms.nudgeLine', {
                        count: formatNumber(n.count, lang),
                        audience: n.audience,
                      })}
                    </span>
                    <span className="text-ink-soft">{formatDate(n.at, lang)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-ink-soft">{t('comms.nudgesEmpty')}</p>
            )}
          </section>
        </div>
      </div>
      <TemplateDialog tpl={editing} onClose={() => setEditing(null)} />
    </div>
  )
}
