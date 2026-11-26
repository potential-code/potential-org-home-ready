import type { ChecklistTemplateId } from '@shared/types'

/** Checklist template that "Save answer to a checklist" adds for each scripted Dalil answer. */
export const ANSWER_TEMPLATE: Record<string, ChecklistTemplateId> = {
  'rent-increase': 'renewal',
  'upfront-cost': 'move-in',
  'rent-or-buy': 'due-diligence',
  'title-check': 'due-diligence',
  recommend: 'viewing',
}
export const FALLBACK_TEMPLATE: ChecklistTemplateId = 'viewing'

/** Delay before Dalil's answer shows (typing indicator); shorter with reduced motion. */
export const TYPING_MS = 900
export const TYPING_MS_REDUCED = 250
