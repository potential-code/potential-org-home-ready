import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AXIS_TICK, CHART, ChartTooltipBody } from '@/components/charts'
import type { RentBuyYear } from '@/domain/calculator'
import { useLocalized } from '@/i18n'

interface Row {
  label: string
  rent: number
  buy: number
}
interface HoverPayload {
  payload?: Row
}

/** Two series by year: cumulative rent vs net cost of buying, with a break-even marker. */
export function RentBuyChart({
  years,
  breakEven,
  labels,
  money,
}: {
  years: RentBuyYear[]
  breakEven: number | null
  labels: { rent: string; buy: string; year: (y: number) => string; breakEven: string }
  money: (n: number) => string
}) {
  const { dir } = useLocalized()
  const rtl = dir === 'rtl'
  const data: Row[] = years.map((y) => ({
    label: labels.year(y.year),
    rent: y.rentCumulative,
    buy: y.buyNet,
  }))
  const be = breakEven && breakEven <= years.length ? labels.year(breakEven) : null
  const tooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: readonly HoverPayload[]
  }) => {
    const p = active ? payload?.[0]?.payload : undefined
    if (!p) return null
    return (
      <ChartTooltipBody
        title={p.label}
        rows={[
          { key: 'rent', label: labels.rent, value: money(p.rent), color: CHART.deep },
          { key: 'buy', label: labels.buy, value: money(p.buy), color: CHART.primary },
        ]}
      />
    )
  }
  const dot = (color: string) => ({
    r: 3,
    fill: color,
    stroke: 'var(--brand-white)',
    strokeWidth: 2,
  })
  return (
    <div style={{ height: 260 }} className="w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={CHART.grid} />
          <XAxis
            dataKey="label"
            reversed={rtl}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={{ stroke: CHART.grid }}
          />
          <YAxis
            orientation={rtl ? 'right' : 'left'}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            width={44}
            tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
          />
          <Tooltip cursor={{ stroke: CHART.axis, strokeWidth: 1 }} content={tooltip} />
          {be && (
            <ReferenceLine
              x={be}
              stroke={CHART.accent}
              strokeDasharray="4 4"
              label={{
                value: labels.breakEven,
                position: 'top',
                fill: 'var(--brand-ink)',
                fontSize: 12,
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="rent"
            stroke={CHART.deep}
            strokeWidth={2}
            isAnimationActive={false}
            dot={dot(CHART.deep)}
          />
          <Line
            type="monotone"
            dataKey="buy"
            stroke={CHART.primary}
            strokeWidth={2}
            isAnimationActive={false}
            dot={dot(CHART.primary)}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
