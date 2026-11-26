import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AXIS_TICK, CHART, ChartCard, ChartTooltipBody } from '@/components/charts'
import type { WEEKLY_SIGNUPS } from '@/data/figures'
import { formatDate, formatNumber, useLocalized } from '@/i18n'
import type { SignupSeries } from '../config'

type Week = (typeof WEEKLY_SIGNUPS)[number]

interface SignupsChartProps {
  weeks: Week[]
  series: SignupSeries[]
  total: number
}

interface Row {
  x: string
  label: string
  [k: string]: number | string
}

/** Weekly sign-ups stacked by source (C13). 2px surface gap between segments, rounded top only. */
export function SignupsChart({ weeks, series, total }: SignupsChartProps) {
  const { t } = useTranslation('leadership')
  const { lang, dir } = useLocalized()
  const name = (k: string) => t(`filters.sources.${k}`)
  const data: Row[] = weeks.map((w) => {
    const row: Row = {
      x: w.week,
      label: formatDate(w.week, lang, { day: 'numeric', month: 'short' }),
    }
    for (const s of series) row[s.key] = s.parts.reduce((sum, p) => sum + w[p], 0)
    return row
  })
  const sum = (r: Row) => series.reduce((s, x) => s + Number(r[x.key]), 0)
  const last = series.length - 1
  return (
    <ChartCard
      className="lg:col-span-2"
      title={t('charts.signups')}
      subtitle={t('charts.signupsSub', { total: formatNumber(total, lang) })}
      legend={series.map((s) => ({ key: s.key, label: name(s.key), color: s.color }))}
      table={{
        columns: [t('charts.week'), ...series.map((s) => name(s.key)), t('charts.total')],
        rows: data.map((r) => [r.label, ...series.map((s) => Number(r[s.key])), sum(r)]),
      }}
    >
      <div className="h-64 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            barCategoryGap="22%"
          >
            <CartesianGrid vertical={false} stroke={CHART.grid} />
            <XAxis
              dataKey="label"
              reversed={dir === 'rtl'}
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ stroke: CHART.grid }}
              minTickGap={8}
            />
            <YAxis
              orientation={dir === 'rtl' ? 'right' : 'left'}
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              width={32}
            />
            <Tooltip
              cursor={{ fill: 'var(--brand-tint-50)' }}
              content={({ active, payload }) => {
                const r = active ? (payload?.[0]?.payload as Row | undefined) : undefined
                if (!r) return null
                return (
                  <ChartTooltipBody
                    title={`${r.label} · ${sum(r)}`}
                    rows={[...series].reverse().map((s) => ({
                      key: s.key,
                      label: name(s.key),
                      value: Number(r[s.key]),
                      color: s.color,
                    }))}
                  />
                )
              }}
            />
            {series.map((s, i) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={name(s.key)}
                stackId="signups"
                fill={s.color}
                stroke={CHART.surface}
                strokeWidth={1}
                maxBarSize={28}
                radius={i === last ? [4, 4, 0, 0] : 0}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
