import type { BlockKind, CourseLevel, CourseStatus, Localized, UnitKind } from '@shared/types'
import {
  BookOpen,
  ClipboardCheck,
  Lightbulb,
  type LucideIcon,
  MessageCircleQuestion,
  PencilLine,
  PlayCircle,
} from 'lucide-react'
import type { Tone } from '@/components/shared/StatusBadge'
import type { CourseState } from '@/domain/learning'

export const BLOCK_KINDS: BlockKind[] = ['video', 'read', 'summary', 'question', 'practice']
export const LEVELS: CourseLevel[] = ['beginner', 'intermediate', 'advanced']

export const BLOCK_ICON: Record<BlockKind, LucideIcon> = {
  video: PlayCircle,
  read: BookOpen,
  summary: Lightbulb,
  question: MessageCircleQuestion,
  practice: PencilLine,
}
export const UNIT_ICON: Record<UnitKind, LucideIcon> = { lesson: BookOpen, quiz: ClipboardCheck }

export const STATE_TONE: Record<CourseState, Tone> = {
  notStarted: 'neutral',
  inProgress: 'info',
  completed: 'success',
}
export const STATUS_TONE: Record<CourseStatus, Tone> = { draft: 'neutral', published: 'success' }

/** Cover gradients cycled by course position (token variables only). */
export const COVER_TONES = [
  'bg-grad-brand',
  'bg-[linear-gradient(140deg,var(--brand-deep),var(--brand-deep-900))]',
  'bg-[linear-gradient(140deg,var(--brand-warm),var(--brand-warm-800))]',
]

/** Write the edited text into the active language, keeping the other one. */
export function putLocalized(orig: Localized | undefined, lang: 'en' | 'ar', value: string) {
  if (!orig) return { en: value, ar: lang === 'ar' ? value : '' }
  return { ...orig, [lang]: value }
}
