import { DemoTag } from '@/components/shared/DemoTag'
import { SiteFooter } from '@/features/public/components/SiteFooter'

/** Public footer: the C5.14 site footer (built in the public feature) with the demo label slot. */
export function PublicFooter() {
  return <SiteFooter demoTag={<DemoTag onDark />} />
}
