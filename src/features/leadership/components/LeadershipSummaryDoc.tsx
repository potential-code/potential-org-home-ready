import { useTranslation } from 'react-i18next'
import { MIX } from '@/data/figures'
import { formatNumber, useLocalized } from '@/i18n'
import { useKpis } from '@/store/hooks'
import { useFunnel } from '../hooks/use-funnel'
import { scorecardRows, statusRows } from '../lib/scorecard'
import { DocList, DocSection, ReportDoc } from './ReportDoc'

/** "Leadership summary" (C13 reports): story, KPIs, funnel, mix and status on one page. */
export function LeadershipSummaryDoc() {
  const { t } = useTranslation('leadership')
  const { l, lang } = useLocalized()
  const k = useKpis()
  const { steps } = useFunnel()
  const n = (v: number) => formatNumber(v, lang)
  return (
    <ReportDoc title={t('reports.summary.title')}>
      <DocSection title={t('reports.sections.story')}>
        <p className="leading-relaxed">
          {t('banner.story', {
            useful: k.k3Pct,
            returned: k.k4Pct,
            pre: k.confidencePre,
            post: k.confidencePost,
          })}
        </p>
      </DocSection>
      <DocSection title={t('reports.sections.kpis')}>
        <ul className="grid gap-2 sm:grid-cols-2">
          {scorecardRows(k, t, n).map((r) => (
            <li key={r.id} className="rounded-xl p-3 ring-1 ring-border/70">
              <p className="font-semibold">{r.label}</p>
              <p className="mt-1 text-ink-soft">{r.value}</p>
              <p className="mt-1 text-xs text-ink-soft">
                {t('kpi.target', { value: r.target })} · {r.trend}
              </p>
            </li>
          ))}
        </ul>
      </DocSection>
      <DocSection title={t('reports.sections.funnel')}>
        <DocList
          rows={steps.map((s) => ({
            id: s.id,
            label: l(s.label),
            value: `${n(s.value)} (${s.ofJoined}%)`,
          }))}
        />
      </DocSection>
      <DocSection title={t('reports.sections.mix')}>
        <ul className="grid gap-1 text-ink-soft">
          <li>{t('reports.mix.track', { a: MIX.track.A, b: MIX.track.B })}</li>
          <li>
            {t('reports.mix.emirate', {
              dubai: MIX.emirate.dubai,
              sharjah: MIX.emirate.sharjah,
              abu: MIX.emirate['abu-dhabi'],
              other: MIX.emirate.other,
            })}
          </li>
          <li>{t('reports.mix.language', { en: MIX.language.en, ar: MIX.language.ar })}</li>
          <li>{t('reports.mix.source', MIX.source)}</li>
        </ul>
      </DocSection>
      <DocSection title={t('reports.sections.status')}>
        <DocList rows={statusRows(k, t).map((r) => ({ ...r, value: n(r.value) }))} />
      </DocSection>
    </ReportDoc>
  )
}
