import type { BadgeId } from '@shared/types'
import {
  Award,
  FileCheck2,
  Footprints,
  GraduationCap,
  House,
  type LucideIcon,
  Scale,
  Search,
  Wallet,
} from 'lucide-react'
import type { MedalTone } from '@/components/shared/BadgeMedal'

/** Badge medal icon and tone per badge id (Home strip and Achievements, C11.5). */
export const BADGE_LOOK: Record<BadgeId, { icon: LucideIcon; tone: MedalTone }> = {
  'first-step': { icon: Footprints, tone: 'primary' },
  'budget-builder': { icon: Wallet, tone: 'highlight' },
  'viewing-pro': { icon: Search, tone: 'accent' },
  'contract-ready': { icon: FileCheck2, tone: 'deep' },
  'decision-maker': { icon: Scale, tone: 'warm' },
  'smart-buyer': { icon: House, tone: 'primary' },
  'due-diligence': { icon: Award, tone: 'accent' },
  graduate: { icon: GraduationCap, tone: 'highlight' },
}

/** Track milestones on Achievements (C11.5): percent of lesson units done. */
export const MILESTONES = [20, 60, 100] as const

/** Placement id of the SwiftMove card on the renter Home (C8.1). */
export const SWIFT_HOME_PLACEMENT = 'PL-SWIFT-HOME'
