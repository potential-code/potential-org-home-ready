/** Percent of a whole, rounded; 0 when the denominator is 0. */
export function pct(part: number, whole: number): number {
  return whole > 0 ? Math.round((part / whole) * 100) : 0
}
