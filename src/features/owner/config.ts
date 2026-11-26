import type {
  ContentKind,
  ContentStatus,
  Emirate,
  PlacementSlot,
  SignupSource,
} from '@shared/types'
import type { Tone } from '@/components/shared/StatusBadge'

/** Owner area static config (filters, tones, schedule). */

export const EMIRATE_OPTIONS: Emirate[] = ['dubai', 'abu-dhabi', 'sharjah', 'moving']
export const SOURCE_OPTIONS: SignupSource[] = [
  'social',
  'search',
  'employer',
  'friend',
  'partner',
  'event',
]
export const KIND_OPTIONS: ContentKind[] = ['unit', 'video', 'journey', 'calc-default', 'checklist']
export const STATUS_OPTIONS: ContentStatus[] = [
  'draft',
  'in-review',
  'changes',
  'approved',
  'published',
]
export const SLOT_OPTIONS: PlacementSlot[] = [
  'track',
  'video',
  'calculator',
  'offers',
  'event',
  'partner-requests',
  'home-card',
]

export const STATUS_TONE: Record<ContentStatus, Tone> = {
  draft: 'neutral',
  'in-review': 'info',
  changes: 'notice',
  approved: 'brand',
  published: 'success',
}

/** C14 automatic message schedule. */
export const REMINDER_SCHEDULE = [
  { id: 'ET-welcome', when: 'On registration' },
  { id: 'ET-nudge', when: '7 days after sign-up with no useful action, 10:00' },
  { id: 'ET-renewal', when: '90 days before contract end (opt-in), 09:00' },
  { id: 'ET-event', when: '24 hours before the event' },
  { id: 'ET-certificate', when: 'When a certificate is issued' },
  { id: 'ET-partner', when: 'When a partner request is passed on (opt-in)' },
] as const

/** Audit actions grouped for the Settings log filter. */
export const PUBLISH_ACTIONS = /publish|approv|changes|submitted|returned/i
export const CONSENT_ACTIONS = /consent/i

export const DAY_MS = 86400000
