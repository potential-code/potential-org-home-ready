/**
 * The placement label minus its leading "Sponsored · " word, which the SponsoredLabel pill
 * already shows next to it.
 */
export function labelText(label: string) {
  const i = label.indexOf(' · ')
  return i >= 0 ? label.slice(i + 3) : label
}
