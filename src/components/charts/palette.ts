/**
 * Chart colour tokens, all from the brand roles in src/styles/tokens.css. Categorical order is
 * fixed and never cycled; colour follows the entity, never its rank. With the placeholder palette
 * primary, deep and warm pass 3:1 on white; accent and highlight do not, so any chart that uses
 * them must also show direct labels and a table view (ChartCard has the toggle). Re-validate when
 * the client palette replaces the placeholder.
 */
export const SERIES = [
  'var(--brand-primary)',
  'var(--brand-accent)',
  'var(--brand-warm)',
  'var(--brand-highlight)',
  'var(--brand-deep)',
] as const

export const CHART = {
  primary: 'var(--brand-primary)',
  secondary: 'var(--brand-accent)',
  accent: 'var(--brand-warm)',
  highlight: 'var(--brand-highlight)',
  deep: 'var(--brand-deep)',
  /** Neutral for "unknown" and "not disclosed" segments. */
  neutral: 'var(--brand-line)',
  grid: 'var(--brand-tint-100)',
  axis: 'var(--brand-grey)',
  surface: 'var(--brand-white)',
  /** Sequential ramp, light to dark, one hue. */
  ramp: [
    'var(--brand-tint-200)',
    'var(--brand-accent)',
    'var(--brand-primary)',
    'var(--brand-deep)',
  ],
} as const

/** Ink colour for a label set inside a filled mark. */
export function inkOn(fill: string): string {
  return fill === CHART.secondary ||
    fill === CHART.highlight ||
    fill === CHART.neutral ||
    fill === CHART.ramp[0]
    ? 'var(--brand-ink)'
    : 'var(--brand-white)'
}

export const AXIS_TICK = { fill: 'var(--brand-grey)', fontSize: 12 } as const
